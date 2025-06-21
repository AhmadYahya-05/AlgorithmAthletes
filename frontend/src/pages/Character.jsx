import { useState } from 'react';
import { ArrowLeft, Heart, Zap, Shield, Activity } from 'lucide-react';

const Character = ({ user, onLogout, onNavigateBack }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Character data with stats initialized at 10
  const characters = [
    {
      id: 1,
      name: "Iron Fist",
      type: "Fighting",
      sprite: "/Msprite1.png", // Path to the new sprite
      description: "A powerful warrior with unmatched arm strength",
      stats: {
        health: 10,
        armStrength: 35, // Example value to test sprite change
        legStrength: 10,
        stamina: 10
      },
      color: "from-red-500 to-red-700",
      borderColor: "border-red-800"
    },
    {
      id: 2,
      name: "Swift Runner",
      type: "Speed",
      sprite: "/Fsprite1.png", // Path to the new sprite
      description: "A lightning-fast athlete with incredible stamina",
      stats: {
        health: 10,
        armStrength: 10,
        legStrength: 25, // Example value to test sprite change
        stamina: 10
      },
      color: "from-blue-500 to-blue-700",
      borderColor: "border-blue-800"
    }
  ];

  const getCharacterSprite = (character) => {
    const { armStrength, legStrength } = character.stats;
    if (character.name === "Iron Fist") {
      if (armStrength > 30 || legStrength > 30) {
        return "/Msprite3.png"; // Placeholder for sprite 3
      }
      if (armStrength > 20 || legStrength > 20) {
        return "/Msprite2.png"; // Placeholder for sprite 2
      }
    }

    if (character.name === "Swift Runner") {
      if (armStrength > 30 || legStrength > 30) {
        return "/Fsprite3.png"; // Placeholder for sprite 3
      }
      if (armStrength > 20 || legStrength > 20) {
        return "/Fsprite2.png"; // Placeholder for sprite 2
      }
    }
    return character.sprite;
  };

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
  };

  const handleBack = () => {
    onNavigateBack();
  };

  const StatBar = ({ value, maxValue = 20, color, icon, label }) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {icon}
          <span className="text-white font-bold ml-2" style={{ fontFamily: 'monospace' }}>
            {label}
          </span>
        </div>
        <span className="text-white font-bold text-sm">{value}/{maxValue}</span>
      </div>
      <div className="w-full h-3 bg-gray-800 rounded-full border-2 border-gray-600 overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500 ease-out`}
          style={{ width: `${(value / maxValue) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #87CEEB 0%, #98FB98 50%, #228B22 100%)'
    }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Trees */}
        <div className="absolute left-10 bottom-0 text-6xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '4s' }}>🌲</div>
        <div className="absolute left-32 bottom-0 text-8xl">🌳</div>
        <div className="absolute right-20 bottom-0 text-7xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}>🌲</div>
        <div className="absolute right-40 bottom-0 text-6xl">🌳</div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-1/3 text-2xl animate-bounce" style={{ animationDelay: '1s' }}>🦋</div>
        <div className="absolute top-32 right-1/3 text-xl animate-bounce" style={{ animationDelay: '3s' }}>🌸</div>
        
        {/* Clouds */}
        <div className="absolute top-10 left-1/4 text-4xl animate-pulse opacity-80">☁️</div>
        <div className="absolute top-16 right-1/4 text-3xl animate-pulse opacity-70">☁️</div>
      </div>

      {/* Pixel art style header */}
      <header className="relative z-10 bg-gradient-to-r from-green-800 to-green-600 shadow-lg border-b-4 border-yellow-400" style={{
        fontFamily: 'monospace',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)'
      }}>
        <div className="w-full px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-3xl mr-3 animate-pulse">⚔️</div>
              <h1 className="text-2xl font-bold text-yellow-300 tracking-wider" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                CHARACTER SELECT
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-black bg-opacity-30 px-3 py-1 rounded-lg border border-yellow-400">
                <div className="text-yellow-300">👤</div>
                <span className="text-yellow-100 font-bold text-sm">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-2 border-blue-800 font-bold text-sm transition-all duration-200 transform hover:scale-105"
                style={{ fontFamily: 'monospace', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>BACK</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Party Screen Title */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-b from-purple-400 to-purple-600 rounded-2xl p-6 border-4 border-purple-700 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'monospace', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                🎮 PARTY SCREEN 🎮
              </h2>
              <p className="text-purple-100">Choose your champion!</p>
            </div>
          </div>

          {/* Character Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {characters.map((character) => {
              const sprite = getCharacterSprite(character);
              return (
                <div
                  key={character.id}
                  onClick={() => handleCharacterSelect(character)}
                  className={`bg-gradient-to-b ${character.color} rounded-2xl p-6 border-4 ${character.borderColor} shadow-2xl cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-3xl ${
                    selectedCharacter?.id === character.id ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''
                  }`}
                >
                  <div className="text-center">
                    {/* Character Sprite */}
                    <div className="h-32 flex items-center justify-center mb-4" style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.5))' }}>
                      {sprite.startsWith('/') ? (
                        <img src={sprite} alt={character.name} className="max-h-full" />
                      ) : (
                        <div className="text-8xl">{sprite}</div>
                      )}
                    </div>
                    
                    {/* Character Name */}
                    <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'monospace', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                      {character.name}
                    </h3>
                    
                    {/* Character Type */}
                    <div className="inline-block bg-black bg-opacity-30 px-3 py-1 rounded-lg border-2 border-white mb-3">
                      <span className="text-white font-bold text-sm" style={{ fontFamily: 'monospace' }}>
                        {character.type}
                      </span>
                    </div>
                    
                    {/* Character Description */}
                    <p className="text-white text-sm mb-4 opacity-90">
                      {character.description}
                    </p>
                    
                    {/* Quick Stats Preview */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-black bg-opacity-20 rounded p-2">
                        <div className="text-white font-bold">HP: {character.stats.health}</div>
                      </div>
                      <div className="bg-black bg-opacity-20 rounded p-2">
                        <div className="text-white font-bold">ARM: {character.stats.armStrength}</div>
                      </div>
                      <div className="bg-black bg-opacity-20 rounded p-2">
                        <div className="text-white font-bold">LEG: {character.stats.legStrength}</div>
                      </div>
                      <div className="bg-black bg-opacity-20 rounded p-2">
                        <div className="text-white font-bold">STA: {character.stats.stamina}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Character Stats Panel */}
          {selectedCharacter && (
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl border-4 border-gray-600 shadow-2xl p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'monospace', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                  📊 {selectedCharacter.name}'s STATS 📊
                </h3>
                <p className="text-gray-300">Detailed character information</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Character Info */}
                <div className="text-center">
                  <div className="h-40 flex items-center justify-center mb-4" style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.5))' }}>
                    {getCharacterSprite(selectedCharacter).startsWith('/') ? (
                      <img src={getCharacterSprite(selectedCharacter)} alt={selectedCharacter.name} className="max-h-full" />
                    ) : (
                      <div className="text-9xl">{getCharacterSprite(selectedCharacter)}</div>
                    )}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'monospace' }}>
                    {selectedCharacter.name}
                  </h4>
                  <div className="inline-block bg-yellow-500 text-gray-900 px-3 py-1 rounded-lg font-bold text-sm mb-3">
                    {selectedCharacter.type}
                  </div>
                  <p className="text-gray-300 text-sm">
                    {selectedCharacter.description}
                  </p>
                </div>
                
                {/* Stats Bars */}
                <div>
                  <StatBar 
                    value={selectedCharacter.stats.health}
                    color="bg-gradient-to-r from-red-400 to-red-600"
                    icon={<Heart className="h-5 w-5 text-red-400" />}
                    label="HEALTH"
                  />
                  <StatBar 
                    value={selectedCharacter.stats.armStrength}
                    color="bg-gradient-to-r from-orange-400 to-orange-600"
                    icon={<Zap className="h-5 w-5 text-orange-400" />}
                    label="ARM STRENGTH"
                  />
                  <StatBar 
                    value={selectedCharacter.stats.legStrength}
                    color="bg-gradient-to-r from-green-400 to-green-600"
                    icon={<Shield className="h-5 w-5 text-green-400" />}
                    label="LEG STRENGTH"
                  />
                  <StatBar 
                    value={selectedCharacter.stats.stamina}
                    color="bg-gradient-to-r from-blue-400 to-blue-600"
                    icon={<Activity className="h-5 w-5 text-blue-400" />}
                    label="STAMINA"
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="text-center mt-8">
                <button className="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3 rounded-xl border-2 border-green-800 font-bold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg mr-4">
                  SELECT CHARACTER
                </button>
                <button className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-8 py-3 rounded-xl border-2 border-purple-800 font-bold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                  CUSTOMIZE
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Character; 