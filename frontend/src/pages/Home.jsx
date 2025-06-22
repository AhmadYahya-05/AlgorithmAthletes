// This will be the home page users are directed to after logging in / creating an account 

import { useState, useEffect, useContext } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { LogOut, User, Trophy, Target, BarChart3, Sword, Shield, Heart, Download, Users, Star, Play } from 'lucide-react';
import { UserContext } from '../context/UserContext';
import CharacterCard from '../components/CharacterCard';
import NavigationBar from '../components/NavigationBar';
import { getCharacterSprite, characters } from '../data/characters';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Home = ({ user, onLogout }) => {
  const { userStats, characterStats, activeCharacter, workouts, isLevelingUp } = useContext(UserContext);
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax transforms for different layers
  const skyY = useTransform(scrollY, [0, 1000], [0, -50]);

  const xpPercentage = (userStats.xp / userStats.xpToNext) * 100;

  // Find the active character object
  const selectedCharacter = characters.find(c => c.name === activeCharacter);

  // Level Up Animation Component
  const LevelUpAnimation = () => (
    <AnimatePresence>
      {isLevelingUp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          
          {/* Level up content */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ 
              duration: 0.8,
              ease: "easeOut"
            }}
            className="relative z-10 text-center"
          >
            {/* Glowing background */}
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 rounded-full blur-2xl"
            />
            
            {/* Main content */}
            <div className="relative bg-gradient-to-br from-yellow-400 to-orange-600 p-8 rounded-3xl border-4 border-yellow-300 shadow-2xl">
              {/* Sparkles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: [0, (Math.random() - 0.5) * 200],
                    y: [0, (Math.random() - 0.5) * 200]
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="absolute text-2xl"
                  style={{
                    left: `${50 + (Math.random() - 0.5) * 100}%`,
                    top: `${50 + (Math.random() - 0.5) * 100}%`
                  }}
                >
                  ⭐
                </motion.div>
              ))}
              
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-2"
                style={{ fontFamily: 'monospace', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
              >
                LEVEL UP!
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-bold text-yellow-100"
                style={{ fontFamily: 'monospace', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
              >
                You are now Level {userStats.level}!
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-lg text-yellow-200 mt-2"
                style={{ fontFamily: 'monospace' }}
              >
                Keep up the great work! 💪
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Parallax Background Component
  const ParallaxBackground = () => (
    <div className="absolute inset-0 z-0 overflow-hidden" style={{ imageRendering: 'pixelated' }}>
      {/* Sky Layer */}
      <motion.div 
        style={{ y: skyY }}
        className="absolute inset-0 bg-gradient-to-b from-[#2D1B69] to-[#1E3A8A]"
      >
        {/* Stars */}
        {[...Array(350)].map((_, i) => { 
          const size = Math.random() * 3 + 1; 
          const isGlowing = Math.random() > 0.5;

  return (
            <motion.div
              key={`star-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                boxShadow: isGlowing ? "0 0 8px rgba(255, 255, 255, 0.3)" : "none",
              }}
              animate={{
                opacity: [Math.random() * 0.4 + 0.2, 0.9, Math.random() * 0.4 + 0.2],
                scale: isGlowing ? [1, 1.15, 1] : 1,
              }}
              transition={{
                duration: Math.random() * 5 + 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
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
      
      {/* Decorative Gold Lines */}
      <motion.path
        d="M 20,75 C 50,25, 80,125, 120,75"
        fill="none"
        stroke="#fcd34d"
        strokeWidth="14"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.path
        d="M 780,75 C 750,25, 720,125, 680,75"
        fill="none"
        stroke="#fcd34d"
        strokeWidth="14"
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
        FITQUEST
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
        y={10}
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
            onClick={() => {
              document.getElementById('quest-board').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }}
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
              //style={{ marginTop: '204px' }}
            >
              <img 
                src="/pedestal.png" 
                alt="Pedestal" 
                className="w-[441px] h-[293px] object-contain mx-auto"
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
                  src={getCharacterSprite(selectedCharacter, characterStats)} 
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
              
              <div className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'monospace', textShadow: '2px 2px 4px rgba(0,0,0,0.8)', letterSpacing: '2px' }}>
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
        {/* GitHub-style Workout Calendar */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'monospace', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            📅 WORKOUT CALENDAR
          </h3>
          <div className="flex justify-center">
            <div className="grid grid-cols-53 gap-1 p-4 bg-gray-900 bg-opacity-50 rounded-lg border-2 border-gray-700">
              {/* Generate 365 days of calendar squares */}
              {(() => {
                const squares = [];
                const today = new Date();
                
                // Get actual workout dates from context
                const workoutDates = workouts.map(workout => workout.date);
                
                // Create calendar squares for the last 365 days
                for (let i = 364; i >= 0; i--) {
                  const date = new Date(today);
                  date.setDate(date.getDate() - i);
                  const dateString = date.toISOString().split('T')[0];
                  const isWorkoutDay = workoutDates.includes(dateString);
                  
                  squares.push(
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.001, duration: 0.3 }}
                      whileHover={{ scale: 1.5, zIndex: 10 }}
                      className={`w-3 h-3 rounded-sm border border-gray-800 ${
                        isWorkoutDay 
                          ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg' 
                          : 'bg-gray-700'
                      }`}
                      title={`${date.toLocaleDateString()}${isWorkoutDay ? ' - Workout Day!' : ''}`}
                    />
                  );
                }
                return squares;
              })()}
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-2" style={{ fontFamily: 'monospace' }}>
            Each square represents a day. Green squares = workout days!
          </p>
        </motion.div>
        </div>
    </motion.section>
  );

  // Quest Board Component
  const QuestBoard = () => (
    <motion.section 
      id="quest-board"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative z-10 px-8 py-16"
    >
      <div className="max-w-6xl mx-auto">
        <div 
          className="bg-gray-900 bg-opacity-70 rounded-2xl border-2 border-gray-700 shadow-2xl p-8 relative overflow-hidden" 
          style={{ 
            backdropFilter: 'blur(10px)',
            backgroundImage: 'url(/taskboard.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-2xl"></div>
          
          {/* Content */}
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h3 className="text-6xl font-bold mb-4" style={{ 
                fontFamily: 'VT323, monospace', 
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                letterSpacing: '2px',
                color: '#fcd34d'
              }}>
                QUEST BOARD
              </h3>
              <p className="text-gray-300 text-lg">Choose your next adventure!</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <CharacterCard 
                name="YOUR TEAM"
                emoji="👥"
                image="/aiheads.png"
                description="Get personalized advice from your AI coaches"
                route="/ai-coach"
                bgColor="from-green-400 to-green-600"
                borderColor="border-yellow-400"
                textColor="text-green-100"
              />

              <CharacterCard 
                name="AI FORM CHECKER"
                emoji="📹"
                image="/rawbotthumb.png"
                imageSize="w-24 h-20"
                description="Real-time form analysis with AI"
                route="/ai-form-checker"
                bgColor="from-purple-400 to-purple-600"
                borderColor="border-yellow-400"
                textColor="text-purple-100"
              />

              <CharacterCard 
                name="CHARACTER SELECT & STATS"
                emoji="🎮"
                image="/chars.png"
                description="Select your character and view your stats"
                route="/character"
                bgColor="from-indigo-400 to-indigo-600"
                borderColor="border-yellow-400"
                textColor="text-indigo-100"
              />
            </div>
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
        <QuestBoard />
        <StatsPanel />

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
      <Footer />
      <LevelUpAnimation />
    </div>
  );
};

export default Home; 