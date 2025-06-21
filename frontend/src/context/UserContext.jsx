import { createContext, useState } from 'react';

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

  const updateUserStats = (newStats) => {
    setUserStats(prev => ({ ...prev, ...newStats }));
  };

  const updateCharacterStats = (newStats) => {
    setCharacterStats(prev => ({ ...prev, ...newStats }));
  };

  return (
    <UserContext.Provider value={{ 
      userStats, 
      updateUserStats,
      activeCharacter,
      setActiveCharacter,
      characterStats,
      updateCharacterStats
    }}>
      {children}
    </UserContext.Provider>
  );
}; 