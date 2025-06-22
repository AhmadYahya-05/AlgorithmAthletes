import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '../config/api.js';

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

  const LogoSVG = () => (
    <svg viewBox="0 0 800 150" className="w-full max-w-lg mx-auto mb-4">
      <defs>
        <filter id="text-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="2" stdDeviation="0" floodColor="#d97706" />
          <feDropShadow dx="4" dy="4" stdDeviation="0" floodColor="rgba(0,0,0,0.3)" />
        </filter>
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');`}
        </style>
      </defs>
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        fontSize="80"
        fontFamily="VT323, monospace"
        fill="#fcd34d"
        style={{ filter: 'url(#text-shadow)' }}
      >
        FITQUEST
      </text>
    </svg>
  );

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.data.user, data.data.token);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2D1B69] to-[#1E3A8A] flex items-center justify-center p-4 relative overflow-hidden" style={{ fontFamily: 'monospace' }}>
      {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        <AnimatedCharacter emoji="🏃‍♀️" delay={0} position="top-1/4 left-10" />
        <AnimatedCharacter emoji="💪" delay={1} position="top-1/3 right-16" />

      <div className="max-w-md w-full space-y-8 z-10">
        <LogoSVG />
        <div className="bg-gray-900 bg-opacity-70 rounded-2xl shadow-2xl p-8 border-2 border-yellow-400" style={{ backdropFilter: 'blur(10px)' }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-yellow-300 mb-2" style={{ fontFamily: 'VT323, monospace' }}>
              Welcome Back, Adventurer!
            </h2>
            <p className="text-gray-300">
              Sign in to continue your quest.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-yellow-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 h-5 w-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200 placeholder-gray-500"
                  placeholder="your-email@adventure.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-yellow-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400 h-5 w-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200 placeholder-gray-500"
                  placeholder="Your secret password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-3 rounded-xl font-bold text-lg border-2 border-yellow-600 shadow-lg hover:scale-105 transform transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              New to the quest?{' '}
              <Link
                to="/register"
                className="text-yellow-400 hover:text-yellow-300 font-medium transition duration-200"
              >
                Begin your adventure!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 