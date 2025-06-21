import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../App';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const NutritionistPage = ({ user, onLogout }) => {
  const { userStats } = useContext(UserContext);
  const navigate = useNavigate();
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
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 50%, #0ea5e9 100%)'
    }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 text-2xl animate-pulse opacity-50">🥗</div>
        <div className="absolute top-32 right-1/3 text-xl animate-bounce opacity-40" style={{ animationDelay: '2s' }}>🍎</div>
        <div className="absolute bottom-32 left-1/3 text-3xl animate-pulse opacity-30" style={{ animationDelay: '1s' }}>🥑</div>
        <div className="absolute bottom-20 right-1/4 text-2xl animate-bounce opacity-50" style={{ animationDelay: '3s' }}>🥕</div>
      </div>

      <Header 
        user={user} 
        onLogout={onLogout} 
        title="NUTRITIONIST" 
        onNavigateBack={() => navigate('/')}
      />

      {/* Main Content Area */}
      <main className="relative z-10 w-full px-8 py-8">
        
        <div className="bg-white bg-opacity-90 rounded-2xl border-4 border-green-500 shadow-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Nutritionist Character Image */}
            <div className="md:col-span-1 flex justify-center relative">
              <div 
                className="bg-gradient-to-b from-green-400 to-green-600 rounded-2xl p-4 border-4 border-green-700 shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300"
                onClick={handleSpriteClick}
              >
                <img 
                  src="/nutritionist.png" 
                  alt="Nutritionist Character" 
                  className="w-full max-w-xs mx-auto"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>

              {/* Speech Bubble */}
              {isBubbleVisible && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 bg-white border-2 border-gray-300 rounded-lg p-3 shadow-lg animate-fade-in-down">
                  <p className="text-center text-gray-800 text-sm">{bubbleText}</p>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white"></div>
                </div>
              )}
            </div>

            {/* Coming Soon Content */}
            <div className="md:col-span-2 text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-3xl font-bold text-green-800 mb-4" style={{ fontFamily: 'monospace' }}>
                COMING SOON!
              </h3>
              <p className="text-green-700 text-lg mb-6">
                Our expert nutritionist is preparing to provide you with:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
                <div className="bg-green-100 p-4 rounded-lg border-2 border-green-300 flex items-center">
                  <div className="text-3xl mr-4">📊</div>
                  <div>
                    <h4 className="font-bold text-green-800">Personalized Meal Plans</h4>
                    <p className="text-green-600 text-sm">Based on your fitness goals</p>
                  </div>
                </div>
                <div className="bg-green-100 p-4 rounded-lg border-2 border-green-300 flex items-center">
                  <div className="text-3xl mr-4">🍽️</div>
                  <div>
                    <h4 className="font-bold text-green-800">Recipe Recommendations</h4>
                    <p className="text-green-600 text-sm">Healthy and delicious meal ideas</p>
                  </div>
                </div>
                <div className="bg-green-100 p-4 rounded-lg border-2 border-green-300 flex items-center">
                  <div className="text-3xl mr-4">📈</div>
                  <div>
                    <h4 className="font-bold text-green-800">Macro Tracking</h4>
                    <p className="text-green-600 text-sm">Monitor your key nutrients</p>
                  </div>
                </div>
                <div className="bg-green-100 p-4 rounded-lg border-2 border-green-300 flex items-center">
                  <div className="text-3xl mr-4">💡</div>
                  <div>
                    <h4 className="font-bold text-green-800">Expert Nutrition Tips</h4>
                    <p className="text-green-600 text-sm">Advice for optimal health</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4">
                <p className="text-yellow-800 font-semibold">
                  🌟 Stay tuned! This feature will be available soon to help you fuel your fitness journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NutritionistPage; 