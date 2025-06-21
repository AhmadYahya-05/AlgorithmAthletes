// This will be the home page users are directed to after logging in / creating an account 

import { useState, useEffect, useContext } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { LogOut, User, Trophy, Target, BarChart3, Sword, Shield, Heart, Download, Users, Star, Play } from 'lucide-react';
import { UserContext } from '../App';
import CharacterCard from '../components/CharacterCard';
import { getCharacterSprite } from '../data/characters';
import { useNavigate } from 'react-router-dom';

const Home = ({ user, onLogout }) => {
  const { userStats, characterStats, activeCharacter } = useContext(UserContext);
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax transforms for different layers
  const skyY = useTransform(scrollY, [0, 1000], [0, -50]);

  // Parallax Background Component
  const ParallaxBackground = () => (
    <div className="fixed inset-0 z-0 overflow-hidden" style={{ imageRendering: 'pixelated' }}>
      {/* Sky Layer */}
      <motion.div 
        style={{ y: skyY }}
        className="absolute inset-0 bg-gradient-to-b from-[#2D1B69] to-[#1E3A8A]"
      >
        {/* Stars */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 80}%`, // Spread stars out more vertically
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        {/* Moon */}
        <div className="absolute top-12 right-16 text-6xl opacity-90">🌙</div>
      </motion.div>
    </div>
  );

  // Pixel Art Logo Component
  const PixelArtLogo = () => (
    <motion.div 
      animate={{ 
        scale: [1, 1.02, 1],
        rotateY: [0, 2, 0, -2, 0]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className="text-center mb-8"
    >
      <h1 
        className="text-6xl md:text-8xl font-bold text-yellow-300 mb-4"
        style={{ 
          fontFamily: 'monospace',
          textShadow: '4px 4px 0px #d97706, 8px 8px 0px rgba(0,0,0,0.3)',
          imageRendering: 'pixelated',
        }}
      >
        FITNESS QUEST
      </h1>
      <motion.div 
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-4xl mb-4"
      >
        ⚔️
      </motion.div>
      <p className="text-xl text-green-100 font-bold" style={{ fontFamily: 'monospace' }}>
        Begin Your Epic Fitness Journey
      </p>
    </motion.div>
  );

  // Navigation Bar Component
  const NavigationBar = () => (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 bg-gray-900 bg-opacity-80 border-b border-gray-700 shadow-lg"
      style={{ backdropFilter: 'blur(10px)' }}
    >
        <div className="w-full px-8">
          <div className="flex justify-between items-center h-16">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="flex items-center cursor-pointer"
          >
            <div className="text-2xl mr-3 animate-pulse">⚔️</div>
            <span className="text-xl font-bold text-yellow-300" style={{ fontFamily: 'monospace' }}>
                FITNESS QUEST
                </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {['About', 'Features', 'Community'].map((item) => (
              <motion.button
                key={item}
                whileHover={{ scale: 1.1, y: -2, color: '#fcd34d' }} // yellow-300
                whileTap={{ scale: 0.95 }}
                className="text-gray-300 font-semibold transition-colors"
                style={{ fontFamily: 'monospace' }}
              >
                {item}
              </motion.button>
            ))}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 bg-black bg-opacity-30 px-3 py-2 rounded-lg border border-yellow-400"
            >
              <div className="text-yellow-300">👤</div>
              <span className="text-yellow-100 font-bold text-sm">
                {user?.firstName}
              </span>
            </motion.button>
            
            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden"
                >
                  <ul className="py-1">
                    <li className="px-4 py-2 text-sm text-gray-400">
                      Welcome, {user?.firstName}!
                    </li>
                    <li className="border-t border-gray-700"></li>
                    <li>
                      <a href="#" className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-yellow-300">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        My Stats
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={onLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Quit</span>
              </button>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  );

  // Animated Character Component
  const AnimatedCharacter = ({ emoji, delay = 0, position }) => (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: 1, 
        y: [0, -10, 0],
        rotate: [0, 2, -2, 0]
      }}
      transition={{ 
        duration: 3, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay: delay 
      }}
      className={`absolute text-6xl ${position}`}
      style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))' }}
    >
      {emoji}
    </motion.div>
  );

  // Hero Section Component
  const HeroSection = () => (
    <section className="relative min-h-screen flex items-center justify-center pt-16 px-8">
      <div className="text-center max-w-4xl mx-auto relative z-10">
        <PixelArtLogo />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-8"
        >
          <p className="text-lg md:text-xl text-green-100 mb-6 leading-relaxed">
            Welcome to your personal fitness adventure! Level up your health, complete quests, 
            and become the hero of your own story.
          </p>
          
          <motion.button
            whileHover={{ 
              scale: 1.05, 
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              y: -5
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg border-4 border-yellow-600 shadow-lg"
            style={{ fontFamily: 'monospace' }}
          >
            <div className="flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>START YOUR QUEST</span>
            </div>
          </motion.button>
        </motion.div>

        {/* Character Display */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative inline-block bg-gradient-to-b from-purple-600 to-indigo-700 rounded-2xl p-6 border-4 border-white shadow-2xl mb-12"
          style={{
            boxShadow: '0 8px 16px rgba(0,0,0,0.4), inset 0 2px 8px rgba(255,255,255,0.3)'
          }}
          whileHover={{ scale: 1.05, y: -5 }}
          onClick={() => navigate('/character')}
        >
            <div className="mb-4">
              <div className="bg-black bg-opacity-70 px-4 py-2 rounded-lg border-2 border-yellow-400 inline-block">
              <span className="text-yellow-300 font-bold text-lg" style={{ fontFamily: 'monospace' }}>
                  @{user?.username || `${user?.firstName?.toLowerCase()}`}
                </span>
              </div>
            </div>

          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              rotateY: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="text-9xl mb-4 h-32 flex justify-center items-center"
                style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.5))' }}
              >
            <img 
              src={getCharacterSprite(activeCharacter, characterStats)} 
              alt="Selected Character" 
              className="max-h-full"
              style={{ imageRendering: 'pixelated' }}
            />
          </motion.div>

              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full w-12 h-12 flex items-center justify-center border-3 border-yellow-400 font-bold text-lg shadow-lg">
                {userStats.level}
            </div>

            <div className="mt-4">
              <div className="text-xs font-bold text-white mb-1" style={{ fontFamily: 'monospace' }}>
                XP: {userStats.xp} / {userStats.xpToNext}
              </div>
              <div className="w-48 h-4 bg-gray-800 rounded-full border-2 border-gray-600 mx-auto overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(userStats.xp / userStats.xpToNext) * 100}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-green-400 to-green-600"
              ></motion.div>
            </div>
          </div>
        </motion.div>
        </div>

      {/* Floating animated characters */}
      <AnimatedCharacter emoji="🏃‍♀️" delay={0} position="top-1/4 left-10" />
      <AnimatedCharacter emoji="💪" delay={1} position="top-1/3 right-16" />
      <AnimatedCharacter emoji="🥗" delay={2} position="bottom-1/3 left-20" />
      <AnimatedCharacter emoji="🎯" delay={0.5} position="bottom-1/4 right-10" />
    </section>
  );

  // Stats Panel Component
  const StatsPanel = () => (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative z-10 px-8 py-16"
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center text-white mb-12"
          style={{ fontFamily: 'monospace', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
        >
          📊 YOUR ADVENTURE STATS 📊
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { 
              icon: <Heart className="h-8 w-8" />, 
              label: 'STREAK', 
              value: `${userStats.streak} days`, 
              emoji: '🔥',
              color: 'from-red-500 to-red-700',
              border: 'border-red-800'
            },
            { 
              icon: <Sword className="h-8 w-8" />, 
              label: 'WORKOUTS', 
              value: userStats.workoutsCompleted, 
              emoji: '💪',
              color: 'from-orange-500 to-orange-700',
              border: 'border-orange-800'
            },
            { 
              icon: <Shield className="h-8 w-8" />, 
              label: 'MINUTES', 
              value: userStats.totalMinutes, 
              emoji: '⏱️',
              color: 'from-blue-500 to-blue-700',
              border: 'border-blue-800'
            }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`bg-gradient-to-b ${stat.color} rounded-xl p-6 border-4 ${stat.border} shadow-2xl`}
            >
            <div className="flex items-center justify-between">
              <div>
                  <div className="flex items-center mb-2 text-white">
                    {stat.icon}
                    <span className="font-bold ml-2" style={{ fontFamily: 'monospace' }}>
                      {stat.label}
                    </span>
                </div>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                </div>
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="text-4xl"
                >
                  {stat.emoji}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );

  // Quest Board Component
  const QuestBoard = () => (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative z-10 px-8 py-16"
    >
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-900 bg-opacity-70 rounded-2xl border-2 border-gray-700 shadow-2xl p-8" style={{ backdropFilter: 'blur(10px)' }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h3 className="text-3xl font-bold text-yellow-300 mb-2" style={{ fontFamily: 'monospace' }}>
              🗞️ QUEST BOARD 🗞️
            </h3>
            <p className="text-gray-300 text-lg">Choose your next adventure!</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      </div>
    </motion.section>
  );

  return (
    <div className="min-h-screen relative" style={{ imageRendering: 'pixelated' }}>
      <ParallaxBackground />
      <NavigationBar />
      
      <main className="relative z-10">
        <HeroSection />
        <StatsPanel />
        <QuestBoard />

        {/* Achievement Banner */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 px-8 py-16"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 px-8 py-6 rounded-2xl border-4 border-yellow-700 shadow-2xl"
            >
            <div className="flex items-center space-x-4">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="text-4xl"
                >
                  🌟
                </motion.div>
              <div>
                  <h4 className="font-bold text-yellow-900 text-xl mb-1" style={{ fontFamily: 'monospace' }}>
                  Next Achievement: Week Warrior
                </h4>
                  <p className="text-yellow-800">Complete 7 days in a row (7/7)</p>
                </div>
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="text-4xl"
                >
                  🌟
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Home; 