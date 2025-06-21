import { useContext } from 'react';
import { UserContext } from '../App';
import { ArrowLeft, Heart, Zap, Shield, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const characters = [
  {
    id: 1,
    name: "Iron Fist",
    type: "Fighting",
    description: "A powerful warrior with unmatched arm strength. Focuses on upper body power and resilience.",
    sprites: {
      level1: "/Msprite1.png",
      level2: "/Msprite2.png",
      level3: "/Msprite3.png",
    },
    color: "from-red-500 to-red-700",
    borderColor: "border-red-800"
  },
  {
    id: 2,
    name: "Swift Runner",
    type: "Speed",
    description: "A lightning-fast athlete with incredible stamina. Excels at speed and endurance challenges.",
    sprites: {
      level1: "/Fsprite1.png",
      level2: "/Fsprite2.png",
      level3: "/Fsprite3.png",
    },
    color: "from-blue-500 to-blue-700",
    borderColor: "border-blue-800"
  }
];

const getCharacterSprite = (characterName, stats) => {
  const character = characters.find(c => c.name === characterName);
  if (!character) return '';

  const { armStrength, legStrength } = stats;
  if (armStrength > 30 || legStrength > 30) {
    return character.sprites.level3;
  }
  if (armStrength > 20 || legStrength > 20) {
    return character.sprites.level2;
  }
  return character.sprites.level1;
};

const StatBar = ({ value, maxValue = 40, color, icon, label }) => (
  <div className="mb-4">
    <div className="flex items-center justify-between mb-1 text-white">
      <div className="flex items-center">
        {icon}
        <span className="font-bold ml-2 text-sm" style={{ fontFamily: 'monospace' }}>{label}</span>
      </div>
      <span className="font-bold text-xs">{value} / {maxValue}</span>
    </div>
    <div className="w-full h-4 bg-gray-800 rounded-full border-2 border-gray-600 overflow-hidden">
      <motion.div
        className={`h-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${(value / maxValue) * 100}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  </div>
);

const Character = ({ onNavigateBack }) => {
  const { 
    activeCharacter, 
    setActiveCharacter, 
    characterStats 
  } = useContext(UserContext);

  const selectedCharacter = characters.find(c => c.name === activeCharacter);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #2c3e50 0%, #3498db 100%)'
    }}>
      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-4 bg-black bg-opacity-20">
        <h1 className="text-2xl font-bold text-yellow-300" style={{ fontFamily: 'monospace', textShadow: '2px 2px 2px #000' }}>
          CHOOSE YOUR CLASS
        </h1>
        <motion.button
          onClick={onNavigateBack}
          whileHover={{ scale: 1.1, rotate: -5 }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-2 border-blue-800 font-bold text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>BACK</span>
        </motion.button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Character Selection Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 bg-gray-900 bg-opacity-70 rounded-2xl p-6 border-4 border-gray-700"
          >
            <h2 className="text-xl font-bold text-center text-white mb-6" style={{ fontFamily: 'monospace' }}>SELECT A CLASS</h2>
            <div className="space-y-4">
              {characters.map(char => (
                <motion.div
                  key={char.id}
                  onClick={() => setActiveCharacter(char.name)}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`p-4 rounded-xl border-4 cursor-pointer transition-all duration-300 ${
                    activeCharacter === char.name
                      ? `${char.borderColor} ring-4 ring-yellow-400`
                      : `${char.borderColor} bg-opacity-50`
                  }`}
                  style={{
                    background: `linear-gradient(145deg, rgba(255,255,255,0.1), rgba(0,0,0,0.2)), linear-gradient(to right, ${char.color.split(' ')[0]}, ${char.color.split(' ')[2]})`
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <img src={getCharacterSprite(char.name, characterStats)} alt={char.name} className="w-16 h-16 bg-black bg-opacity-30 rounded-lg p-1"/>
                    <div>
                      <h3 className="text-lg font-bold text-white">{char.name}</h3>
                      <p className="text-xs text-gray-200">{char.type} Class</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Character Display Panel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-gray-900 bg-opacity-70 rounded-2xl p-6 border-4 border-gray-700"
          >
            <AnimatePresence mode="wait">
              {selectedCharacter && (
                <motion.div
                  key={selectedCharacter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                >
                  {/* Sprite and Description */}
                  <div className="text-center">
                    <motion.img 
                      key={getCharacterSprite(selectedCharacter.name, characterStats)}
                      src={getCharacterSprite(selectedCharacter.name, characterStats)} 
                      alt={selectedCharacter.name}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="w-full max-w-xs mx-auto mb-4"
                      style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.2))' }}
                    />
                    <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'monospace' }}>{selectedCharacter.name}</h2>
                    <p className="text-gray-300 text-sm px-4">{selectedCharacter.description}</p>
                  </div>

                  {/* Stats */}
                  <div>
                    <h3 className="text-xl font-bold text-center text-white mb-4" style={{ fontFamily: 'monospace' }}>USER STATS</h3>
                    <StatBar value={characterStats.health} color="bg-red-500" icon={<Heart className="h-4 w-4" />} label="HEALTH" />
                    <StatBar value={characterStats.armStrength} color="bg-orange-500" icon={<Zap className="h-4 w-4" />} label="ARM STRENGTH" />
                    <StatBar value={characterStats.legStrength} color="bg-green-500" icon={<Shield className="h-4 w-4" />} label="LEG STRENGTH" />
                    <StatBar value={characterStats.stamina} color="bg-blue-500" icon={<Activity className="h-4 w-4" />} label="STAMINA" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </main>
    </div>
  );
};

export default Character; 