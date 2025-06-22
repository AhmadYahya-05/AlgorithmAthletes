import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const CharacterCard = ({ 
  name, 
  emoji, 
  image,
  description, 
  route, 
  bgColor = "from-blue-400 to-blue-600",
  borderColor = "border-yellow-400",
  textColor = "text-blue-100"
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const { addXP } = useContext(UserContext);

  const handleClick = () => {
    // Add XP based on the quest type
    if (name === "YOUR TEAM") {
      addXP(30); // Combined XP for team access
    } else if (name === "AI FORM CHECKER") {
      addXP(40);
    }
    // Character select doesn't give XP
    
    // Navigate to the route
    navigate(route);
  };

  return (
    <button 
      className={`bg-gradient-to-b ${bgColor} p-2 rounded-lg border-2 ${borderColor} shadow-lg hover:scale-105 transform transition-all duration-200 group w-full aspect-square`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      <div className="text-center h-full flex flex-col justify-center">
        <div 
          className={`text-xl mb-1 transition-all duration-300 ${
            isHovering ? 'animate-bounce transform scale-110' : ''
          }`}
        >
          {image ? (
            <img 
              src={image} 
              alt={name}
              className="w-36 h-18 mx-auto"
              style={{ imageRendering: 'pixelated' }}
            />
          ) : (
            emoji
          )}
        </div>
        <h4 className="font-bold text-white text-base mb-1" style={{ fontFamily: 'monospace' }}>
          {name}
        </h4>
        <p className={`${textColor} text-sm leading-tight`}>{description}</p>
      </div>
    </button>
  );
};

export default CharacterCard; 