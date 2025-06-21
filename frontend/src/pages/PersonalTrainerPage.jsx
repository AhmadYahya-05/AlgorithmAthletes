import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import NavigationBar from '../components/NavigationBar';
import { motion } from 'framer-motion';

const PersonalTrainerPage = ({ user, onLogout }) => {
  const { userStats } = useContext(UserContext);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#2D1B69] to-[#1E3A8A] text-white" style={{ fontFamily: 'monospace' }}>
      {/* Stars in background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
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
      </div>

      <NavigationBar user={user} onLogout={onLogout} />

      {/* Main Content Area */}
      <main className="relative z-10 w-full px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Character Display */}
          <div className="text-center mb-12">
            <div className="inline-block bg-gray-900 bg-opacity-70 rounded-2xl p-6 border-2 border-yellow-400 shadow-2xl" style={{ backdropFilter: 'blur(10px)' }}>
              <div className="text-8xl mb-2 animate-bounce">💪</div>
              <h2 className="text-2xl font-bold text-yellow-300">
                PERSONAL TRAINER
              </h2>
              <p className="text-yellow-100 text-sm">Your dedicated fitness coach</p>
            </div>
          </div>

          {/* Coming Soon Content */}
          <div className="bg-gray-900 bg-opacity-70 rounded-2xl border-2 border-gray-700 shadow-2xl p-8 text-center" style={{ backdropFilter: 'blur(10px)' }}>
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-3xl font-bold text-yellow-300 mb-4">
              COMING SOON!
            </h3>
            <p className="text-gray-300 text-lg mb-6">
              Your personal trainer is getting ready to help you with:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
              <div className="bg-gray-800 p-4 rounded-lg border-2 border-gray-600">
                <div className="text-3xl mb-2">📋</div>
                <h4 className="font-bold text-yellow-200">Custom Workout Plans</h4>
                <p className="text-gray-300 text-sm">Tailored to your fitness level and goals</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border-2 border-gray-600">
                <div className="text-3xl mb-2">📹</div>
                <h4 className="font-bold text-yellow-200">Exercise Demonstrations</h4>
                <p className="text-gray-300 text-sm">Learn proper form and technique</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border-2 border-gray-600">
                <div className="text-3xl mb-2">📊</div>
                <h4 className="font-bold text-yellow-200">Progress Tracking</h4>
                <p className="text-gray-300 text-sm">Monitor your strength and endurance gains</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border-2 border-gray-600">
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-bold text-yellow-200">Goal Setting</h4>
                <p className="text-gray-300 text-sm">Set and achieve realistic fitness milestones</p>
              </div>
            </div>

            <div className="bg-yellow-400 bg-opacity-20 border-2 border-yellow-400 rounded-lg p-4">
              <p className="text-yellow-200 font-semibold">
                🔥 Get ready to transform your fitness journey with personalized training plans!
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PersonalTrainerPage; 