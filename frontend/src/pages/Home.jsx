// This will be the home page users are directed to after logging in / creating an account 

import { useState, useEffect, useContext } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { LogOut, User, Trophy, Target, BarChart3, Sword, Shield, Heart, Download, Users, Star, Play } from 'lucide-react';
import { UserContext } from '../context/UserContext';
import CharacterCard from '../components/CharacterCard';
import NavigationBar from '../components/NavigationBar';
import { getCharacterSprite } from '../data/characters';
import { useNavigate } from 'react-router-dom';

const Home = ({ user, onLogout }) => {
  const { userStats, characterStats, activeCharacter } = useContext(UserContext);
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax transforms for different layers
  const skyY = useTransform(scrollY, [0, 1000], [0, -50]);

  const xpPercentage = (userStats.xp / userStats.xpToNext) * 100;

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

  const LogoSVG = () => (
    <svg viewBox="0 0 800 150" className="w-full max-w-3xl mx-auto">
      <defs>
        <filter id="text-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="4" dy="4" stdDeviation="0" floodColor="#d97706" />
          <feDropShadow dx="8" dy="8" stdDeviation="0" floodColor="rgba(0,0,0,0.3)" />
        </filter>
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');`}
        </style>
      </defs>
      
      {/* Decorative Vines */}
      <motion.path
        d="M 10,80 C 25,50, 45,110, 60,80"
        fill="none"
        stroke="#10B981"
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.path
        d="M 790,80 C 775,50, 755,110, 740,80"
        fill="none"
        stroke="#10B981"
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        fontSize="150"
        fontFamily="VT323, monospace"
        fill="#fcd34d" // yellow-300
        style={{ filter: 'url(#text-shadow)' }}
      >
        FITNESS QUEST
      </text>
    </svg>
  );

  // Pixel Art Logo Component
  const PixelArtLogo = () => (
    <motion.div 
      animate={{ 
        scale: [1, 1.02, 1],
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className="text-center mb-8"
    >
      <LogoSVG />
      <motion.div 
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-4xl mb-4"
      >
        ⚔️
      </motion.div>
      <p className="text-xl text-cyan-200 font-bold" style={{ fontFamily: 'monospace' }}>
        Begin Your Epic Fitness Journey
      </p>
    </motion.div>
  );

  // Floating Character Component
  const AnimatedCharacter = ({ emoji, delay, position }) => (
    <motion.div
      className={`absolute text-4xl ${position}`}
      style={{ filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: [0, 0.7, 0], y: [20, -20, 20] }}
      transition={{ 
        duration: Math.random() * 5 + 5, 
        repeat: Infinity, 
        delay,
        ease: "easeInOut"
      }}
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
          <div className="bg-gray-900 bg-opacity-70 rounded-xl border-2 border-yellow-400 p-6 max-w-2xl mx-auto shadow-lg mb-12" style={{ backdropFilter: 'blur(5px)'}}>
            <p className="text-lg md:text-xl text-yellow-100 leading-relaxed" style={{ fontFamily: 'monospace' }}>
              Welcome to your personal fitness adventure! Level up your health, complete quests, 
              and become the hero of your own story.
            </p>
      </div>

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
          className="relative inline-block mb-12"
          whileHover={{ scale: 1.05, y: -5 }}
          onClick={() => navigate('/character')}
        >
          {/* Pedestal and Character Container */}
          <div className="relative">
            {/* Pedestal Background */}
            <motion.div 
              //animate={{ 
              //  y: [0, -5, 0],
              //}}
              //transition={{ 
              //  duration: 6, 
              //  repeat: Infinity, 
              //  ease: "easeInOut" 
              //}}
              className="relative z-0 mt-36"
            >
              <img 
                src="/pedestal.png" 
                alt="Pedestal" 
                className="w-[576px] h-[384px] object-contain mx-auto"
                style={{ imageRendering: 'pixelated' }}
              />
            </motion.div>

            {/* Character on Pedestal */}
            <motion.div 
              animate={{ 
                y: [0, -15, 0],
                rotateY: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 flex justify-center items-top -mt-36 z-10"
              style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.5))' }}
            >
              {/* Super Saiyan Aura */}
              <div className="relative">
                {/* Outer Glow */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 w-48 h-48 rounded-full bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 blur-xl opacity-30"
                  style={{ filter: 'blur(20px)', marginLeft: '-35px' }}
                />
                
                {/* Character */}
                <img 
                  src={getCharacterSprite(activeCharacter, characterStats)} 
                  alt="Selected Character" 
                  className="h-60 w-auto relative z-10"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </motion.div>
          </div>

          {/* Username Display - Moved below pedestal */}
          <div className="mt-4 text-center">
            <div className="bg-black bg-opacity-70 px-4 py-2 rounded-lg border-2 border-yellow-400 inline-block">
              <span className="text-yellow-300 font-bold text-lg" style={{ fontFamily: 'monospace' }}>
                @{user?.username || `${user?.firstName?.toLowerCase()}`}
              </span>
            </div>
          </div>

            <div className="mt-6">
              <div className="flex items-center justify-center gap-4 mb-2">
                {/* Level Bubble - Enhanced */}
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white rounded-full w-14 h-14 flex items-center justify-center border-3 border-yellow-400 font-bold text-lg shadow-lg relative overflow-hidden">
                    {/* Shimmer Effect */}
                    <motion.div
                      animate={{
                        x: [-20, 20],
                        opacity: [0, 0.5, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12"
                    />
                    {/* Level Number */}
                    <span className="relative z-10 text-xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                      {userStats.level}
                    </span>
                  </div>
                  {/* Glow Effect */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-purple-400 rounded-full blur-md -z-10"
                  />
                </motion.div>
                
                {/* Level Label */}
                <div className="text-xs font-bold text-white" style={{ fontFamily: 'monospace' }}>
                  LEVEL
                </div>
              </div>
              
              <div className="text-xs font-bold text-white mb-1" style={{ fontFamily: 'monospace' }}>
                XP: {userStats.xp} / {userStats.xpToNext}
              </div>
              <div className="w-48 h-4 bg-gray-800 rounded-full border-2 border-gray-600 mx-auto overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
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
              name="AI FORM CHECKER"
              emoji="📹"
              description="Real-time form analysis with AI"
              xpReward="+40 XP"
              route="/ai-form-checker"
              bgColor="from-purple-400 to-purple-600"
              borderColor="border-purple-700"
              textColor="text-purple-100"
            />

            <CharacterCard 
              name="PARTY SCREEN"
              emoji="🎮"
              description="View and manage your characters"
              xpReward="VIEW"
              route="/character"
              bgColor="from-indigo-400 to-indigo-600"
              borderColor="border-indigo-700"
              textColor="text-indigo-100"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );

  return (
    <div className="min-h-screen relative" style={{ imageRendering: 'pixelated' }}>
      <ParallaxBackground />
      <NavigationBar user={user} onLogout={onLogout} />
      
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