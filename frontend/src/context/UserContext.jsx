import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { API_ENDPOINTS } from '../config/api';

// Create User Context
export const UserContext = createContext();

// User Context Provider Component
export const UserProvider = ({ children }) => {
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 0,
    xpToNext: 100, // Default value, can be calculated
  });

  const [activeCharacter, setActiveCharacter] = useState('Iron Fist');

  const [characterStats, setCharacterStats] = useState({
    health: 10,
    armStrength: 10,
    legStrength: 10,
    backStrength: 10,
    stamina: 10,
  });

  const [workouts, setWorkouts] = useState(() => {
    // Load workouts from localStorage on initial state
    const savedWorkouts = localStorage.getItem('workouts');
    return savedWorkouts ? JSON.parse(savedWorkouts) : [];
  });

  const [profileData, setProfileData] = useState({
    chronologicalAge: '',
    height: '',
    weight: '',
    restingHeartRate: '',
    systolicBP: '',
    diastolicBP: '',
    exerciseFrequency: '',
    smokingStatus: 'never',
    alcoholConsumption: '',
    sleepHours: '',
    stressLevel: 5,
    cardioPerformance: '',
    strengthLevel: 'intermediate',
    flexibilityLevel: 'average',
  });

  const fetchUserStats = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.ME, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const user = data.data.user;
        setUserStats({
          level: user.stats.level,
          xp: user.stats.xp,
          xpToNext: (user.stats.level || 1) * 100, // Example calculation
        });
        setActiveCharacter(user.character);
      }
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
    }
  }, []);

  const addWorkout = useCallback((workout) => {
    const newWorkout = {
      id: Date.now(),
      ...workout
    };
    setWorkouts(prev => {
      const updatedWorkouts = [newWorkout, ...prev];
      // Save to localStorage
      localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
      return updatedWorkouts;
    });
  }, []);

  const deleteWorkout = useCallback((workoutId) => {
    setWorkouts(prev => {
      const updatedWorkouts = prev.filter(workout => workout.id !== workoutId);
      // Save to localStorage
      localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
      return updatedWorkouts;
    });
  }, []);

  const getWorkoutDates = useCallback(() => {
    return workouts.map(workout => workout.date);
  }, [workouts]);

  // Update localStorage whenever workouts change
  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  const updateProfileData = useCallback((newData) => {
    setProfileData(prev => ({ ...prev, newData }));
  }, []);

  const value = useMemo(() => ({
    userStats,
    activeCharacter,
    setActiveCharacter,
    characterStats,
    setCharacterStats,
    workouts,
    addWorkout,
    deleteWorkout,
    getWorkoutDates,
    fetchUserStats, // Expose fetch function
    profileData,
    updateProfileData,
  }), [userStats, activeCharacter, characterStats, workouts, addWorkout, deleteWorkout, getWorkoutDates, fetchUserStats, profileData]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 