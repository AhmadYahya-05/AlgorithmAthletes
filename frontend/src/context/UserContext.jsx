import { createContext, useState, useMemo, useCallback } from 'react';

// Create User Context
export const UserContext = createContext();

// User Context Provider Component
export const UserProvider = ({ children }) => {
  const [userStats, setUserStats] = useState({
    level: 5,
    xp: 1250,
    xpToNext: 1500,
    streak: 7,
    workoutsCompleted: 23,
    totalMinutes: 420,
    goals: ['Lose weight', 'Build muscle', 'Improve endurance'],
    preferences: {
      workoutTypes: ['strength', 'cardio'],
      experience: 'intermediate',
      timeAvailable: 45
    }
  });

  const [activeCharacter, setActiveCharacter] = useState('Iron Fist');
  const [characterStats, setCharacterStats] = useState({
    health: 10,
    armStrength: 10,
    legStrength: 10,
    backStrength: 10,
    stamina: 10,
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

  const health = useMemo(() => {
    const { armStrength, backStrength, legStrength } = characterStats;
    return armStrength + backStrength + legStrength;
  }, [characterStats.armStrength, characterStats.backStrength, characterStats.legStrength]);

  const updateUserStats = useCallback((newStats) => {
    setUserStats(prev => ({ ...prev, ...newStats }));
  }, []);

  const updateCharacterStats = useCallback((newStats) => {
    setCharacterStats(prev => ({ ...prev, ...newStats }));
  }, []);

  const updateProfileData = useCallback((newData) => {
    setProfileData(prev => ({ ...prev, ...newData }));
  }, []);

  return (
    <UserContext.Provider value={{ 
      userStats, 
      updateUserStats,
      activeCharacter,
      setActiveCharacter,
      characterStats: { ...characterStats, health },
      updateCharacterStats,
      profileData,
      updateProfileData,
    }}>
      {children}
    </UserContext.Provider>
  );
}; 