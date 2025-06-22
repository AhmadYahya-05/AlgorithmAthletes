import { useState, useEffect, memo, useContext } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Clock, Target, Trophy, BarChart3 } from 'lucide-react';
import NavigationBar from '../components/NavigationBar';
import { UserContext } from '../context/UserContext';

// Move AddWorkoutForm outside main component and memoize it
const AddWorkoutForm = memo(({ newWorkout, setNewWorkout, handleAddWorkout, setShowAddForm }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-gray-900 bg-opacity-70 rounded-xl p-6 border-2 border-yellow-400 shadow-lg"
    style={{ backdropFilter: 'blur(10px)' }}
  >
    <h3 className="text-xl font-bold mb-4 text-yellow-300" style={{ fontFamily: 'monospace' }}>
      🏋️ Add New Workout
    </h3>
    <form onSubmit={handleAddWorkout} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2" style={{ fontFamily: 'monospace' }}>
          Workout Name
        </label>
        <input
          type="text"
          value={newWorkout.name}
          onChange={(e) => setNewWorkout({...newWorkout, name: e.target.value})}
          className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
          placeholder="e.g., Upper Body Power"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2" style={{ fontFamily: 'monospace' }}>
            Type
          </label>
          <select
            value={newWorkout.type}
            onChange={(e) => setNewWorkout({...newWorkout, type: e.target.value})}
            className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
          >
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="flexibility">Flexibility</option>
            <option value="sports">Sports</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2" style={{ fontFamily: 'monospace' }}>
            Duration (min)
          </label>
          <input
            type="number"
            value={newWorkout.duration}
            onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})}
            className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
            placeholder="45"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2" style={{ fontFamily: 'monospace' }}>
          Date
        </label>
        <input
          type="date"
          value={newWorkout.date}
          onChange={(e) => setNewWorkout({...newWorkout, date: e.target.value})}
          className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2" style={{ fontFamily: 'monospace' }}>
          Notes
        </label>
        <textarea
          value={newWorkout.notes}
          onChange={(e) => setNewWorkout({...newWorkout, notes: e.target.value})}
          className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
          placeholder="How did this workout feel?"
          rows="3"
        />
      </div>
      
      <div className="flex space-x-3">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 py-3 px-4 rounded-lg font-bold border-2 border-yellow-600 shadow-lg hover:from-yellow-500 hover:to-orange-600 transition duration-200"
          style={{ fontFamily: 'monospace' }}
        >
          Save Workout
        </button>
        <button
          type="button"
          onClick={() => setShowAddForm(false)}
          className="px-4 py-3 border-2 border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  </motion.div>
));

const WorkoutTracker = ({ user, onLogout }) => {
  const { workouts, addWorkout, deleteWorkout } = useContext(UserContext);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    type: 'strength',
    duration: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleAddWorkout = (e) => {
    e.preventDefault();
    addWorkout(newWorkout);
    
    setNewWorkout({
      name: '',
      type: 'strength',
      duration: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteWorkout = (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      deleteWorkout(workoutId);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'strength': return '💪';
      case 'cardio': return '🏃';
      case 'flexibility': return '🧘';
      case 'sports': return '⚽';
      default: return '🏋️';
    }
  };

  const WorkoutCard = ({ workout }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 bg-opacity-70 rounded-xl p-6 border-2 border-gray-600 shadow-lg"
      style={{ backdropFilter: 'blur(10px)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getTypeIcon(workout.type)}</span>
          <div>
            <h3 className="text-lg font-bold text-yellow-300" style={{ fontFamily: 'monospace' }}>
              {workout.name}
            </h3>
            <p className="text-sm text-gray-400 capitalize">{workout.type} Training</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 text-sm text-gray-300">
            <Clock className="h-4 w-4" />
            <span>{workout.duration} min</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-300 mt-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(workout.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      {workout.notes && (
        <p className="text-sm text-gray-300 italic">"{workout.notes}"</p>
      )}
      
      <div className="flex justify-end mt-4">
        <button
          onClick={() => handleDeleteWorkout(workout.id)}
          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition duration-200"
          style={{ fontFamily: 'monospace' }}
        >
          Delete
        </button>
      </div>
    </motion.div>
  );

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
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">🏋️</span>
              <h1 className="text-4xl font-bold text-yellow-300" style={{ fontFamily: 'monospace' }}>
                WORKOUT TRACKER
              </h1>
            </div>
            <p className="text-xl text-cyan-200 font-bold" style={{ fontFamily: 'monospace' }}>
              Track your fitness journey and level up your stats!
            </p>
          </div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            <div className="bg-gray-800 bg-opacity-70 rounded-xl p-4 text-center border-2 border-gray-600" style={{ backdropFilter: 'blur(10px)' }}>
              <Trophy className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{workouts.length}</p>
              <p className="text-sm text-cyan-200" style={{ fontFamily: 'monospace' }}>Total Workouts</p>
            </div>
            <div className="bg-gray-800 bg-opacity-70 rounded-xl p-4 text-center border-2 border-gray-600" style={{ backdropFilter: 'blur(10px)' }}>
              <Clock className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {workouts.reduce((total, w) => total + (parseInt(w.duration) || 0), 0)}
              </p>
              <p className="text-sm text-cyan-200" style={{ fontFamily: 'monospace' }}>Total Minutes</p>
            </div>
            <div className="bg-gray-800 bg-opacity-70 rounded-xl p-4 text-center border-2 border-gray-600" style={{ backdropFilter: 'blur(10px)' }}>
              <Target className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {workouts.filter(w => w.type === 'strength').length}
              </p>
              <p className="text-sm text-cyan-200" style={{ fontFamily: 'monospace' }}>Strength Days</p>
            </div>
            <div className="bg-gray-800 bg-opacity-70 rounded-xl p-4 text-center border-2 border-gray-600" style={{ backdropFilter: 'blur(10px)' }}>
              <BarChart3 className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">
                {workouts.filter(w => w.type === 'cardio').length}
              </p>
              <p className="text-sm text-cyan-200" style={{ fontFamily: 'monospace' }}>Cardio Days</p>
            </div>
          </motion.div>

          {/* Add Workout Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            {!showAddForm ? (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg border-2 border-yellow-600 shadow-lg hover:from-yellow-500 hover:to-orange-600 transition duration-200"
                style={{ fontFamily: 'monospace' }}
              >
                <Plus className="h-6 w-6 inline mr-2" />
                ADD NEW WORKOUT
              </motion.button>
            ) : (
              <AddWorkoutForm newWorkout={newWorkout} setNewWorkout={setNewWorkout} handleAddWorkout={handleAddWorkout} setShowAddForm={setShowAddForm} />
            )}
          </motion.div>

          {/* Workouts List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-yellow-300 mb-4" style={{ fontFamily: 'monospace' }}>
              📊 Your Workout History
            </h2>
            {workouts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏋️</div>
                <p className="text-xl text-cyan-200 mb-2" style={{ fontFamily: 'monospace' }}>
                  No workouts yet!
                </p>
                <p className="text-gray-300">
                  Start your fitness journey by adding your first workout above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workouts.map((workout) => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default WorkoutTracker; 