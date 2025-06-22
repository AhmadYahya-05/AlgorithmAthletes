import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Leaf, Heart } from 'lucide-react';

const characters = [
  { name: 'coach', icon: <Bot />, path: '/ai-coach' },
  { name: 'nutritionist', icon: <Leaf />, path: '/nutritionist' },
  { name: 'doctor', icon: <Heart />, path: '/doctor' },
];

const CharacterToggle = ({ activeCharacter }) => {
  const navigate = useNavigate();

  const handleCharacterClick = (char) => {
    console.log('Navigating to:', char.path, 'for character:', char.name);
    navigate(char.path);
  };

  return (
    <div className="mt-4 bg-gray-800 rounded-full p-1 flex items-center justify-around border-2 border-gray-700">
      {characters.map(char => (
        <button
          key={char.name}
          onClick={() => handleCharacterClick(char)}
          className="relative w-full text-center py-2.5 rounded-full text-gray-400 hover:text-white transition-colors"
        >
          {activeCharacter === char.name && (
            <motion.div
              layoutId="active-char-bubble"
              className="absolute inset-0 bg-yellow-400 rounded-full z-0"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <div className="relative z-10 flex justify-center">
            {char.icon}
          </div>
        </button>
      ))}
    </div>
  );
};

export default CharacterToggle; 