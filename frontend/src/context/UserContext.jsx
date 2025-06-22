import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { API_ENDPOINTS } from '../config/api';

// Create User Context
export const UserContext = createContext();

// User Context Provider Component
export const UserProvider = ({ children }) => {
  const [userStats, setUserStats] = useState(() => {
    // Load userStats from localStorage on initial state
    const savedStats = localStorage.getItem('userStats');
    return savedStats ? JSON.parse(savedStats) : {
      level: 1,
      xp: 0,
      xpToNext: 100,
      streak: 0,
      workoutsCompleted: 0,
    };
  });

  const [activeCharacter, setActiveCharacter] = useState('Iron Fist');
  const [isLevelingUp, setIsLevelingUp] = useState(false);

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
        
        // Only update if we don't have local XP data or if local XP is 0
        setUserStats(prev => {
          // If we already have XP locally, keep it
          if (prev.xp > 0) {
            return prev;
          }
          
          // Otherwise, use backend data
          return {
            level: user.stats?.level || 1,
            xp: user.stats?.xp || 0,
            xpToNext: ((user.stats?.level || 1) * 100),
            streak: user.stats?.streak || 0,
            workoutsCompleted: user.stats?.workoutsCompleted || 0,
          };
        });
        setActiveCharacter(user.character || 'Iron Fist');
      }
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
    }
  }, []);

  // Function to add XP and handle leveling up
  const addXP = useCallback((amount) => {
    console.log(`Adding ${amount} XP to current XP: ${userStats.xp}`);
    setUserStats(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1; // Level up every 100 XP
      const xpToNext = newLevel * 100;
      
      console.log(`New XP: ${newXP}, New Level: ${newLevel}, XP to Next: ${xpToNext}`);
      
      const newStats = {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNext: xpToNext
      };
      
      // Save to localStorage
      localStorage.setItem('userStats', JSON.stringify(newStats));
      
      // Check if level increased
      if (newLevel > prev.level) {
        setIsLevelingUp(true);
        // Reset level up animation after 3 seconds
        setTimeout(() => setIsLevelingUp(false), 3000);
      }
      
      return newStats;
    });
  }, [userStats.xp]);

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
    
    // Add XP for completing a workout
    addXP(20);
    
    // Update workouts completed count
    setUserStats(prev => {
      const newStats = {
        ...prev,
        workoutsCompleted: prev.workoutsCompleted + 1
      };
      localStorage.setItem('userStats', JSON.stringify(newStats));
      return newStats;
    });
  }, [addXP]);

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
    setProfileData(prev => ({ ...prev, ...newData }));
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
    addXP,
    isLevelingUp,
  }), [userStats, activeCharacter, characterStats, workouts, addWorkout, deleteWorkout, getWorkoutDates, fetchUserStats, profileData, addXP, isLevelingUp]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 