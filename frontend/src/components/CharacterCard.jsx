import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CharacterCard = ({ 
  name, 
  emoji, 
  description, 
  route, 
  bgColor = "from-blue-400 to-blue-600",
  borderColor = "border-yellow-400",
  textColor = "text-blue-100"
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
  };

  return (
    <button 
      className={`bg-gradient-to-b ${bgColor} p-3 rounded-lg border-2 ${borderColor} shadow-lg hover:scale-105 transform transition-all duration-200 group w-full aspect-square`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      <div className="text-center h-full flex flex-col justify-center">
        <div 
          className={`text-2xl mb-2 transition-all duration-300 ${
            isHovering ? 'animate-bounce transform scale-110' : ''
          }`}
        >
          {emoji}
        </div>
        <h4 className="font-bold text-white text-lg mb-1" style={{ fontFamily: 'monospace' }}>
          {name}
        </h4>
        <p className={`${textColor} text-base leading-tight`}>{description}</p>
      </div>
    </button>
  );
};

export default CharacterCard; 