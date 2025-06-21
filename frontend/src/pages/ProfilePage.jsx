import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import NavigationBar from '../components/NavigationBar';
import { motion } from 'framer-motion';

const ProfilePage = ({ user, onLogout }) => {
  const { userStats } = useContext(UserContext);
  const [formData, setFormData] = useState({
    chronologicalAge: '',
    height: '',
    weight: '',
    restingHeartRate: '',
    systolicBP: '',
    diastolicBP: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: valueAsNumber || value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    // TODO: Send data to backend
  };

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
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gray-900 bg-opacity-70 rounded-2xl border-2 border-gray-700 shadow-2xl p-8" style={{ backdropFilter: 'blur(10px)' }}>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-yellow-300 mb-4">
                My Profile & Biological Age
              </h2>
              <p className="text-gray-300 text-lg">
                Provide your health metrics to calculate your biological age and receive personalized insights.
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Basic Metrics Section */}
              <div className="mb-12">
                <h3 className="text-xl font-bold text-yellow-300 mb-4 border-b-2 border-yellow-400 pb-2">
                  1. Basic Metrics
                </h3>
                <p className="text-gray-400 text-sm mb-6">Fields marked with * are required.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Chronological Age */}
                  <div>
                    <label htmlFor="chronologicalAge" className="block text-sm font-bold text-gray-300 mb-2">Chronological Age *</label>
                    <input
                      type="number"
                      name="chronologicalAge"
                      id="chronologicalAge"
                      value={formData.chronologicalAge}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    />
                  </div>
                  {/* Height */}
                  <div>
                    <label htmlFor="height" className="block text-sm font-bold text-gray-300 mb-2">Height (cm) *</label>
                    <input
                      type="number"
                      name="height"
                      id="height"
                      value={formData.height}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    />
                  </div>
                  {/* Weight */}
                  <div>
                    <label htmlFor="weight" className="block text-sm font-bold text-gray-300 mb-2">Weight (kg) *</label>
                    <input
                      type="number"
                      name="weight"
                      id="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    />
                  </div>
                  {/* Resting Heart Rate */}
                  <div>
                    <label htmlFor="restingHeartRate" className="block text-sm font-bold text-gray-300 mb-2">Resting Heart Rate (bpm)</label>
                    <input
                      type="number"
                      name="restingHeartRate"
                      id="restingHeartRate"
                      value={formData.restingHeartRate}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    />
                  </div>
                  {/* Blood Pressure */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Blood Pressure (e.g., 120/80)</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        name="systolicBP"
                        placeholder="Systolic"
                        value={formData.systolicBP}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                      />
                      <span className="text-2xl text-gray-400">/</span>
                      <input
                        type="number"
                        name="diastolicBP"
                        placeholder="Diastolic"
                        value={formData.diastolicBP}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="text-center mt-8">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05, y: -2, boxShadow: '0px 8px 20px rgba(252, 211, 77, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-lg shadow-lg"
                >
                  Save & Continue
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProfilePage; 