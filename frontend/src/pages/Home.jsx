// This will be the home page users are directed to after logging in / creating an account 

import { LogOut, User, Trophy, Target, BarChart3, Sword, Shield, Heart } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../App';
import CharacterCard from '../components/CharacterCard';
import { useNavigate } from 'react-router-dom';

const Home = ({ user, onLogout }) => {
  const { userStats } = useContext(UserContext);
  const [characterAnimation, setCharacterAnimation] = useState('idle');
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Simulate character animations
  useEffect(() => {
    const animationInterval = setInterval(() => {
      const animations = ['idle', 'wave', 'jump'];
      setCharacterAnimation(animations[Math.floor(Math.random() * animations.length)]);
    }, 3000);

    return () => clearInterval(animationInterval);
  }, []);

  const handleLogout = () => {
    onLogout();
  };

  const getCharacterSprite = () => {
    const level = userStats.level;
    if (level >= 10) return '🧙‍♂️'; // Wizard (advanced)
    if (level >= 5) return '⚔️'; // Warrior (intermediate)
    return '🏃‍♂️'; // Novice (beginner)
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #87CEEB 0%, #98FB98 50%, #228B22 100%)'
    }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Trees */}
        <div className="absolute left-10 bottom-0 text-6xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '4s' }}>🌲</div>
        <div className="absolute left-32 bottom-0 text-8xl">🌳</div>
        <div className="absolute right-20 bottom-0 text-7xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}>🌲</div>
        <div className="absolute right-40 bottom-0 text-6xl">🌳</div>
        
        {/* Campfire */}
        <div className="absolute left-1/4 bottom-20">
          <div className="text-4xl animate-pulse">🔥</div>
          <div className="text-2xl">🪵</div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-1/3 text-2xl animate-bounce" style={{ animationDelay: '1s' }}>🦋</div>
        <div className="absolute top-32 right-1/3 text-xl animate-bounce" style={{ animationDelay: '3s' }}>🌸</div>
        
        {/* Clouds */}
        <div className="absolute top-10 left-1/4 text-4xl animate-pulse opacity-80">☁️</div>
        <div className="absolute top-16 right-1/4 text-3xl animate-pulse opacity-70">☁️</div>
      </div>

      {/* Pixel art style header */}
      <header className="relative z-10 bg-gradient-to-r from-green-800 to-green-600 shadow-lg border-b-4 border-yellow-400" style={{
        fontFamily: 'monospace',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)'
      }}>
        <div className="w-full px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-3xl mr-3 animate-pulse">⚔️</div>
              <h1 className="text-2xl font-bold text-yellow-300 tracking-wider" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                FITNESS QUEST
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-black bg-opacity-30 px-3 py-1 rounded-lg border border-yellow-400">
                <div className="text-yellow-300">👤</div>
                <span className="text-yellow-100 font-bold text-sm">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg border-2 border-red-800 font-bold text-sm transition-all duration-200 transform hover:scale-105"
                style={{ fontFamily: 'monospace', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
              >
                <LogOut className="h-4 w-4" />
                <span>QUIT</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="relative z-10 w-full px-8 py-8">
        
        {/* Character Display Area */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-b from-blue-400 to-blue-600 rounded-2xl p-6 border-4 border-white shadow-2xl" style={{
            boxShadow: '0 8px 16px rgba(0,0,0,0.4), inset 0 2px 8px rgba(255,255,255,0.3)'
          }}>
            {/* Username above character */}
            <div className="mb-4">
              <div className="bg-black bg-opacity-70 px-4 py-2 rounded-lg border-2 border-yellow-400 inline-block">
                <span className="text-yellow-300 font-bold text-lg" style={{ fontFamily: 'monospace', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                  @{user?.username || `${user?.firstName?.toLowerCase()}`}
                </span>
              </div>
            </div>

            {/* Character Sprite */}
            <div className="relative">
              <div 
                className={`text-9xl transition-all duration-300 ${
                  characterAnimation === 'jump' ? 'transform -translate-y-4' : 
                  characterAnimation === 'wave' ? 'animate-pulse' : ''
                }`}
                style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.5))' }}
              >
                {getCharacterSprite()}
              </div>
              
              {/* Level indicator */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full w-12 h-12 flex items-center justify-center border-3 border-yellow-400 font-bold text-lg shadow-lg">
                {userStats.level}
              </div>
            </div>

            {/* XP Bar */}
            <div className="mt-4">
              <div className="text-xs font-bold text-white mb-1" style={{ fontFamily: 'monospace' }}>
                XP: {userStats.xp} / {userStats.xpToNext}
              </div>
              <div className="w-48 h-4 bg-gray-800 rounded-full border-2 border-gray-600 mx-auto overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000 ease-out"
                  style={{ width: `${(userStats.xp / userStats.xpToNext) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Stats Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 w-full">
          {/* Health/Streak */}
          <div className="bg-gradient-to-b from-red-500 to-red-700 rounded-xl p-6 border-4 border-red-800 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <Heart className="h-6 w-6 text-white mr-2" />
                  <span className="text-white font-bold" style={{ fontFamily: 'monospace' }}>STREAK</span>
                </div>
                <div className="text-3xl font-bold text-white">{userStats.streak} days</div>
              </div>
              <div className="text-4xl">🔥</div>
            </div>
          </div>

          {/* Strength/Workouts */}
          <div className="bg-gradient-to-b from-orange-500 to-orange-700 rounded-xl p-6 border-4 border-orange-800 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <Sword className="h-6 w-6 text-white mr-2" />
                  <span className="text-white font-bold" style={{ fontFamily: 'monospace' }}>WORKOUTS</span>
                </div>
                <div className="text-3xl font-bold text-white">{userStats.workoutsCompleted}</div>
              </div>
              <div className="text-4xl">💪</div>
            </div>
          </div>

          {/* Defense/Minutes */}
          <div className="bg-gradient-to-b from-blue-500 to-blue-700 rounded-xl p-6 border-4 border-blue-800 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <Shield className="h-6 w-6 text-white mr-2" />
                  <span className="text-white font-bold" style={{ fontFamily: 'monospace' }}>MINUTES</span>
                </div>
                <div className="text-3xl font-bold text-white">{userStats.totalMinutes}</div>
              </div>
              <div className="text-4xl">⏱️</div>
            </div>
          </div>
        </div>

        {/* Quest Board */}
        <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-2xl border-4 border-amber-600 shadow-2xl p-8 w-full">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-amber-900 mb-2" style={{ fontFamily: 'monospace', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
              🗞️ QUEST BOARD 🗞️
            </h3>
            <p className="text-amber-800">Choose your next adventure!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {/* Nutritionist Character */}
            <CharacterCard 
              name="NUTRITIONIST"
              emoji="🥗"
              description="Get personalized meal plans"
              xpReward="+25 XP"
              route="/nutritionist"
              bgColor="from-green-400 to-green-600"
              borderColor="border-green-700"
              textColor="text-green-100"
            />

            {/* Personal Trainer Character */}
            <CharacterCard 
              name="PERSONAL TRAINER"
              emoji="💪"
              description="Custom workout plans & form feedback"
              xpReward="+50 XP"
              route="/trainer"
              bgColor="from-orange-400 to-orange-600"
              borderColor="border-orange-700"
              textColor="text-orange-100"
            />

            {/* AI Coach Character */}
            <CharacterCard 
              name="AI COACH"
              emoji="🤖"
              description="Smart recommendations & motivation"
              xpReward="+30 XP"
              route="/ai-coach"
              bgColor="from-cyan-400 to-cyan-600"
              borderColor="border-cyan-700"
              textColor="text-cyan-100"
            />

            {/* Character Page Link */}
            <CharacterCard 
              name="PARTY SCREEN"
              emoji="🎮"
              description="View and manage your characters"
              xpReward="VIEW"
              route="/character"
              bgColor="from-purple-400 to-purple-600"
              borderColor="border-purple-700"
              textColor="text-purple-100"
            />
          </div>
        </div>

        {/* Achievement Banner */}
        <div className="mt-8 text-center w-full">
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 px-8 py-4 rounded-2xl border-4 border-yellow-700 shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="text-3xl animate-spin" style={{ animationDuration: '3s' }}>🌟</div>
              <div>
                <h4 className="font-bold text-yellow-900 text-lg" style={{ fontFamily: 'monospace' }}>
                  Next Achievement: Week Warrior
                </h4>
                <p className="text-yellow-800 text-sm">Complete 7 days in a row (7/7)</p>
              </div>
              <div className="text-3xl animate-spin" style={{ animationDuration: '3s' }}>🌟</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home; 