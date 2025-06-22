import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Sword, Search, X, UserX } from 'lucide-react';
import { UserContext } from '../context/UserContext';
import NavigationBar from '../components/NavigationBar';
import { getCharacterSprite, characters } from '../data/characters.js';
import { API_ENDPOINTS } from '../config/api';

const FriendsPage = ({ user, onLogout }) => {
  const [friends, setFriends] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [loading, setLoading] = useState(true);

  const { fetchUserStats } = useContext(UserContext);

  // Helper function to safely get character sprite
  const getSafeCharacterSprite = (characterName, stats) => {
    if (!characterName) return characters[0].sprites.level1;
    
    const character = characters.find(c => c.name === characterName);
    if (!character) return characters[0].sprites.level1;
    
    return getCharacterSprite(character, stats);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        
        // Fetch friends and users simultaneously
        const [friendsRes, usersRes] = await Promise.all([
          fetch(API_ENDPOINTS.USERS.FRIENDS, config),
          fetch(`${API_ENDPOINTS.USERS.BASE}?username=${searchTerm}`, config)
        ]);
        
        const friendsData = await friendsRes.json();
        const usersData = await usersRes.json();

        if (friendsRes.ok) setFriends(friendsData);
        if (usersRes.ok) {
          // Filter out users who are already friends
          const friendIds = new Set(friendsData.map(f => f._id));
          setUsers(usersData.filter(u => !friendIds.has(u._id)));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm]);

  const handleAddFriend = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.USERS.ADD_FRIEND(userId), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
        const newFriend = users.find(u => u._id === userId);
        setFriends([...friends, newFriend]);
        setUsers(users.filter(u => u._id !== userId));
        // Refetch user stats to get XP update
        fetchUserStats(); 
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const handleRemoveFriend = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.USERS.REMOVE_FRIEND(userId), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setFriends(friends.filter(f => f._id !== userId));
      } else {
        const data = await response.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };
  
  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCompareModal = ({ friend, onClose }) => {
    // In a real app, user stats would come from UserContext or another API call
    const currentUserStats = { level: 10, xp: 1000, workouts: 15, streak: 5 };

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 rounded-2xl border-2 border-yellow-400 p-8 max-w-2xl w-full"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-yellow-300" style={{ fontFamily: 'VT323, monospace' }}>Stat Comparison</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
          </div>
          <div className="grid grid-cols-2 gap-8 text-center">
            {/* Current User */}
            <div>
              <img 
                src={getSafeCharacterSprite(null, null)} 
                alt="Your Character" 
                className="mx-auto h-24 mb-4"
                style={{ imageRendering: 'pixelated' }}
              />
              <h4 className="text-xl font-bold text-cyan-300">You</h4>
              <p>Level: {currentUserStats.level}</p>
              <p>XP: {currentUserStats.xp}</p>
              <p>Workouts: {currentUserStats.workouts}</p>
              <p>Streak: {currentUserStats.streak} days</p>
            </div>
            {/* Friend */}
            <div>
              <img 
                src={getSafeCharacterSprite(friend.character, friend.stats)} 
                alt={friend.username} 
                className="mx-auto h-24 mb-4"
                style={{ imageRendering: 'pixelated' }}
              />
              <h4 className="text-xl font-bold text-orange-400">{friend.username}</h4>
              <p>Level: {friend.stats.level}</p>
              <p>XP: {friend.stats.xp}</p>
              <p>Workouts: {friend.stats.level * 2}</p>
              <p>Streak: {friend.stats.level - 5} days</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const UserCard = ({ person, isFriend }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-gray-800 bg-opacity-60 rounded-xl p-4 border-2 border-gray-700 text-center shadow-lg"
    >
      <img 
        src={getSafeCharacterSprite(person.character, person.stats)} 
        alt={person.username}
        className="mx-auto h-20 mb-3"
        style={{ imageRendering: 'pixelated' }}
      />
      <h4 className="text-lg font-bold text-yellow-300">{person.username}</h4>
      <p className="text-sm text-gray-300">Level {person.stats?.level || 1}</p>
      <p className="text-sm text-gray-400 mb-4">XP: {person.stats?.xp || 0}</p>
      {isFriend ? (
        <div className="flex items-center justify-center gap-2 mt-4">
          <motion.button
            onClick={() => setSelectedFriend(person)}
            whileHover={{ scale: 1.1 }}
            className="flex-1 bg-cyan-600 text-white px-3 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
          >
            <Sword size={16} /> Compare
          </motion.button>
          <motion.button
            onClick={() => handleRemoveFriend(person._id)}
            whileHover={{ scale: 1.1 }}
            className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
          >
            <UserX size={16} /> Remove
          </motion.button>
        </div>
      ) : (
        <motion.button
          onClick={() => handleAddFriend(person._id)}
          whileHover={{ scale: 1.1 }}
          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
        >
          <UserPlus size={16} /> Add Friend (+50 XP)
        </motion.button>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2D1B69] to-[#1E3A8A] text-white p-4" style={{ fontFamily: 'monospace' }}>
      <NavigationBar user={user} onLogout={onLogout} />
      
      <div className="container mx-auto max-w-7xl pt-20">
        <motion.div initial={{ opacity: 0, y: -30}} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-bold text-yellow-300 text-center mb-12" style={{ fontFamily: 'VT323, monospace', textShadow: '3px 3px 0px #d97706' }}>
            <Users className="inline-block h-12 w-12 mr-4" />
            Social Hub
          </h1>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Friends List */}
          <motion.div initial={{ opacity: 0, x: -50}} animate={{ opacity: 1, x: 0 }} transition={{delay: 0.2}} className="lg:col-span-2">
            <div className="bg-gray-900 bg-opacity-70 rounded-2xl border-2 border-gray-700 shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-cyan-300 mb-6" style={{ fontFamily: 'VT323, monospace' }}>Your Crew</h2>
              <AnimatePresence>
                {loading ? (
                  <p className="text-gray-400 text-center py-8">Loading friends...</p>
                ) : friends.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {friends.filter(friend => friend).map(friend => <UserCard key={friend._id} person={friend} isFriend />)}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">Your friends list is empty. Find new adventurers to team up with!</p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Explore Users */}
          <motion.div initial={{ opacity: 0, x: 50}} animate={{ opacity: 1, x: 0 }} transition={{delay: 0.4}}>
            <div className="bg-gray-900 bg-opacity-70 rounded-2xl border-2 border-gray-700 shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-orange-400 mb-6" style={{ fontFamily: 'VT323, monospace' }}>Explore Adventurers</h2>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search by username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {loading ? (
                  <p className="text-gray-400 text-center py-4">Searching...</p>
                ) : users.map(u => <UserCard key={u._id} person={u} />)}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {selectedFriend && <StatCompareModal friend={selectedFriend} onClose={() => setSelectedFriend(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default FriendsPage; 