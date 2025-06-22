import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, BarChart3 } from 'lucide-react';

const NavigationBar = ({ user, onLogout }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-20 bg-gray-900 bg-opacity-80 border-b border-gray-700 shadow-lg"
      style={{ backdropFilter: 'blur(10px)', fontFamily: 'monospace' }}
    >
      <div className="w-full px-8">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="flex items-center cursor-pointer">
            <motion.div whileHover={{ scale: 1.05, rotate: 5 }} className="flex items-center">
                <div className="text-2xl mr-3 animate-pulse">⚔️</div>
                <span className="text-xl font-bold text-yellow-300">
                FITNESS QUEST
                </span>
            </motion.div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {['About Us', 'Friends', 'Workout Tracker', 'My Profile'].map((item) => (
              <motion.button
                key={item}
                onClick={() => {
                  if (item === 'My Profile') {
                    window.location.href = '/profile';
                  } else if (item === 'Friends') {
                    window.location.href = '/friends';
                  } else if (item === 'Workout Tracker') {
                    window.location.href = '/tracker';
                  } else if (item === 'About Us') {
                    window.location.href = '/about';
                  }
                }}
                whileHover={{ scale: 1.1, y: -2, color: '#fcd34d' }} // yellow-300
                whileTap={{ scale: 0.95 }}
                className="text-gray-300 font-semibold transition-colors"
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
                  onMouseLeave={() => setIsProfileMenuOpen(false)}
                >
                  <ul className="py-1">
                    <li className="px-4 py-2 text-sm text-gray-400">
                      Welcome, {user?.firstName || user?.username || 'Hero'}!
                    </li>
                    <li className="border-t border-gray-700"></li>
                    <li>
                      <a href="/profile" className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-yellow-300">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        My Stats
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          onLogout();
                          setIsProfileMenuOpen(false);
                        }}
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
};

export default NavigationBar; 