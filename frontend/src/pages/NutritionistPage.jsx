import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import NavigationBar from '../components/NavigationBar';
import { motion } from 'framer-motion';
import CharacterToggle from '../components/CharacterToggle';

const NutritionistPage = ({ user, onLogout }) => {
  const { userStats } = useContext(UserContext);
  const [bubbleText, setBubbleText] = useState('');
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);

  const dialogueOptions = [
    "Hello! Ready to make some healthy choices today?",
    "Nutrition is the foundation of energy. Let's see how we can fuel you better!",
    "I analyze diets for a living—mind if I ask you a few questions?"
  ];

  const handleSpriteClick = () => {
    const randomDialogue = dialogueOptions[Math.floor(Math.random() * dialogueOptions.length)];
    setBubbleText(randomDialogue);
    setIsBubbleVisible(true);
  };

  useEffect(() => {
    if (isBubbleVisible) {
      const timer = setTimeout(() => {
        setIsBubbleVisible(false);
      }, 5000); // Hide bubble after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isBubbleVisible]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#2D1B69] to-[#1E3A8A] text-white" style={{ fontFamily: 'monospace' }}>
      {/* Stars in background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <NavigationBar user={user} onLogout={onLogout} />

      {/* Main Content Area */}
      <main className="relative z-10 w-full px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white bg-opacity-90 rounded-2xl border-4 border-green-500 shadow-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              
              {/* Nutritionist Character Image */}
              <div className="md:col-span-1 flex justify-center">
                <div className="bg-gradient-to-b from-green-400 to-green-600 rounded-2xl p-4 border-4 border-green-700 shadow-lg">
                  <div 
                    className="cursor-pointer transform hover:scale-105 transition-transform duration-300 relative"
                    onClick={handleSpriteClick}
                  >
                    <img 
                      src="/nutritionist.png" 
                      alt="Nutritionist Character" 
                      className="w-full max-w-xs mx-auto"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    {isBubbleVisible && (
                      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-64 bg-white border-2 border-gray-300 rounded-lg p-3 shadow-lg animate-fade-in-down">
                        <div className="absolute left-1/2 -translate-x-1/2 -top-[10px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white"></div>
                        <p className="text-center text-gray-800 text-sm">{bubbleText}</p>
                      </div>
                    )}
                  </div>
                  <CharacterToggle activeCharacter="nutritionist" />
                </div>
              </div>

              {/* Coming Soon Content */}
              <div className="md:col-span-2 text-center">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-3xl font-bold text-yellow-300 mb-4">
                  COMING SOON!
                </h3>
                <p className="text-gray-300 text-lg mb-6">
                  Our expert nutritionist is preparing to provide you with:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left max-w-3xl mx-auto">
                  <div className="bg-gray-800 p-4 rounded-lg border-2 border-gray-600 flex items-center">
                    <div className="text-3xl mr-4">📊</div>
                    <div>
                      <h4 className="font-bold text-yellow-200">Personalized Meal Plans</h4>
                      <p className="text-gray-300 text-sm">Based on your fitness goals</p>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg border-2 border-gray-600 flex items-center">
                    <div className="text-3xl mr-4">🍽️</div>
                    <div>
                      <h4 className="font-bold text-yellow-200">Recipe Recommendations</h4>
                      <p className="text-gray-300 text-sm">Healthy and delicious meal ideas</p>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg border-2 border-gray-600 flex items-center">
                    <div className="text-3xl mr-4">📈</div>
                    <div>
                      <h4 className="font-bold text-yellow-200">Macro Tracking</h4>
                      <p className="text-gray-300 text-sm">Monitor your key nutrients</p>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg border-2 border-gray-600 flex items-center">
                    <div className="text-3xl mr-4">💡</div>
                    <div>
                      <h4 className="font-bold text-yellow-200">Expert Nutrition Tips</h4>
                      <p className="text-gray-300 text-sm">Advice for optimal health</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-400 bg-opacity-20 border-2 border-yellow-400 rounded-lg p-4">
                  <p className="text-yellow-200 font-semibold">
                    🌟 Stay tuned! This feature will be available soon to help you fuel your fitness journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default NutritionistPage; 