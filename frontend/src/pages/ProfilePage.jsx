import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import NavigationBar from '../components/NavigationBar';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '../config/api';

const ProfilePage = ({ user, onLogout }) => {
  const { profileData, updateProfileData } = useContext(UserContext);
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  useEffect(() => {
    const fetchProfile = async () => {
      setStatus({ loading: true, error: null, success: false });
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(API_ENDPOINTS.PROFILE.GET, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 404) {
          // Profile doesn't exist yet, do nothing
          setStatus({ loading: false, error: null, success: false });
          return;
        }
        
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch profile.');
        }

        // Pre-fill form with existing data
        updateProfileData({
          chronologicalAge: data.basicMetrics.chronologicalAge || '',
          height: data.basicMetrics.height || '',
          weight: data.basicMetrics.weight || '',
          restingHeartRate: data.basicMetrics.restingHeartRate || '',
          systolicBP: data.basicMetrics.bloodPressure?.systolic || '',
          diastolicBP: data.basicMetrics.bloodPressure?.diastolic || '',
          exerciseFrequency: data.lifestyle?.exerciseFrequency || '',
          smokingStatus: data.lifestyle?.smokingStatus || 'never',
          alcoholConsumption: data.lifestyle?.alcoholConsumption || '',
          sleepHours: data.lifestyle?.sleepHours || '',
          stressLevel: data.lifestyle?.stressLevel || 5,
          cardioPerformance: data.fitness?.cardioPerformance || '',
          strengthLevel: data.fitness?.strengthLevel || 'intermediate',
          flexibilityLevel: data.fitness?.flexibilityLevel || 'average',
        });
        setStatus({ loading: false, error: null, success: false });

      } catch (error) {
        setStatus({ loading: false, error: error.message, success: false });
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Use valueAsNumber for number inputs if browser supports it, otherwise parse it
    const parsedValue = e.target.type === 'number' ? e.target.valueAsNumber || parseFloat(e.target.value) : value;
    updateProfileData({ [name]: parsedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.PROFILE.UPDATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile.');
      }

      setStatus({ loading: false, error: null, success: true });
      console.log('Profile updated successfully:', data);

    } catch (error) {
      setStatus({ loading: false, error: error.message, success: false });
      console.error('Error updating profile:', error);
    }
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
                      value={profileData.chronologicalAge}
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
                      value={profileData.height}
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
                      value={profileData.weight}
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
                      value={profileData.restingHeartRate}
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
                        value={profileData.systolicBP}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                      />
                      <span className="text-2xl text-gray-400">/</span>
                      <input
                        type="number"
                        name="diastolicBP"
                        placeholder="Diastolic"
                        value={profileData.diastolicBP}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lifestyle Section */}
              <div className="mb-12">
                <h3 className="text-xl font-bold text-yellow-300 mb-4 border-b-2 border-yellow-400 pb-2">
                  2. Lifestyle
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Exercise Frequency */}
                  <div>
                    <label htmlFor="exerciseFrequency" className="block text-sm font-bold text-gray-300 mb-2">Exercise Frequency (days/week)</label>
                    <input
                      type="number"
                      name="exerciseFrequency"
                      id="exerciseFrequency"
                      value={profileData.exerciseFrequency}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    />
                  </div>
                  {/* Smoking Status */}
                  <div>
                    <label htmlFor="smokingStatus" className="block text-sm font-bold text-gray-300 mb-2">Smoking Status</label>
                    <select
                      name="smokingStatus"
                      id="smokingStatus"
                      value={profileData.smokingStatus}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    >
                      <option value="never">Never</option>
                      <option value="former">Former</option>
                      <option value="current">Current</option>
                    </select>
                  </div>
                  {/* Alcohol Consumption */}
                  <div>
                    <label htmlFor="alcoholConsumption" className="block text-sm font-bold text-gray-300 mb-2">Alcohol Consumption (drinks/week)</label>
                    <input
                      type="number"
                      name="alcoholConsumption"
                      id="alcoholConsumption"
                      value={profileData.alcoholConsumption}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    />
                  </div>
                  {/* Sleep Hours */}
                  <div>
                    <label htmlFor="sleepHours" className="block text-sm font-bold text-gray-300 mb-2">Average Sleep (hours/night)</label>
                    <input
                      type="number"
                      name="sleepHours"
                      id="sleepHours"
                      value={profileData.sleepHours}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    />
                  </div>
                  {/* Stress Level */}
                  <div className="md:col-span-2">
                    <label htmlFor="stressLevel" className="block text-sm font-bold text-gray-300 mb-2">Stress Level (1-10)</label>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg">1</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        name="stressLevel"
                        id="stressLevel"
                        value={profileData.stressLevel}
                        onChange={handleChange}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-lg">10</span>
                      <span className="font-bold text-yellow-300 w-8 text-center">{profileData.stressLevel}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fitness Section */}
              <div className="mb-12">
                <h3 className="text-xl font-bold text-yellow-300 mb-4 border-b-2 border-yellow-400 pb-2">
                  3. Fitness & Performance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cardio Performance */}
                  <div className="md:col-span-2">
                    <label htmlFor="cardioPerformance" className="block text-sm font-bold text-gray-300 mb-2">Describe Your Typical Cardio (e.g., "I run 5k in 30 mins")</label>
                    <input
                      type="text"
                      name="cardioPerformance"
                      id="cardioPerformance"
                      value={profileData.cardioPerformance}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    />
                  </div>
                  {/* Strength Level */}
                  <div>
                    <label htmlFor="strengthLevel" className="block text-sm font-bold text-gray-300 mb-2">Strength Level</label>
                    <select
                      name="strengthLevel"
                      id="strengthLevel"
                      value={profileData.strengthLevel}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  {/* Flexibility Level */}
                  <div>
                    <label htmlFor="flexibilityLevel" className="block text-sm font-bold text-gray-300 mb-2">Flexibility</label>
                    <select
                      name="flexibilityLevel"
                      id="flexibilityLevel"
                      value={profileData.flexibilityLevel}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    >
                      <option value="poor">Poor</option>
                      <option value="average">Average</option>
                      <option value="good">Good</option>
                      <option value="excellent">Excellent</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="text-center mt-8">
                <motion.button
                  type="submit"
                  disabled={status.loading}
                  whileHover={{ scale: status.loading ? 1 : 1.05, y: status.loading ? 0 : -2, boxShadow: '0px 8px 20px rgba(252, 211, 77, 0.3)' }}
                  whileTap={{ scale: status.loading ? 1 : 0.95 }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-lg shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  {status.loading ? 'Saving...' : 'Save & Continue'}
                </motion.button>
              </div>

              {/* Status Messages */}
              {status.success && (
                <p className="text-center mt-4 text-green-400">Profile saved successfully!</p>
              )}
              {status.error && (
                <p className="text-center mt-4 text-red-400">Error: {status.error}</p>
              )}
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProfilePage; 