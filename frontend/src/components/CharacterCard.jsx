import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CharacterCard = ({ 
  name, 
  emoji, 
  description, 
  xpReward, 
  route, 
  bgColor = "from-blue-400 to-blue-600",
  borderColor = "border-blue-700",
  textColor = "text-blue-100"
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
  };

  return (
    <button 
      className={`bg-gradient-to-b ${bgColor} p-6 rounded-xl border-4 ${borderColor} shadow-lg hover:scale-105 transform transition-all duration-200 group w-full`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      <div className="text-center">
        <div 
          className={`text-4xl mb-3 transition-all duration-300 ${
            isHovering ? 'animate-bounce transform scale-110' : ''
          }`}
        >
          {emoji}
        </div>
        <h4 className="font-bold text-white text-lg mb-2" style={{ fontFamily: 'monospace' }}>
          {name}
        </h4>
        <p className={`${textColor} text-sm`}>{description}</p>
        <div className="mt-3 bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">
          {xpReward}
        </div>
        {isHovering && (
          <div className="mt-2 text-xs text-white animate-pulse">
            ✨ Click to visit! ✨
          </div>
        )}
      </div>
    </button>
  );
};

export default CharacterCard; 