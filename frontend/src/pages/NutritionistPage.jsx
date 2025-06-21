import { useContext } from 'react';
import { UserContext } from '../App';
import Header from '../components/Header';

const NutritionistPage = ({ user, onLogout }) => {
  const { userStats } = useContext(UserContext);

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

      <Header user={user} onLogout={onLogout} title="NUTRITIONIST" />

      {/* Main Content Area */}
      <main className="relative z-10 w-full px-8 py-8">
        
        {/* Character Display */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-b from-green-400 to-green-600 rounded-2xl p-6 border-4 border-green-700 shadow-2xl">
            <div className="text-8xl mb-2 animate-bounce">🥗</div>
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'monospace' }}>
              NUTRITION EXPERT
            </h2>
            <p className="text-green-100 text-sm">Your personal meal planning specialist</p>
          </div>
        </div>

        {/* Coming Soon Content */}
        <div className="bg-white bg-opacity-90 rounded-2xl border-4 border-green-500 shadow-2xl p-8 text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h3 className="text-3xl font-bold text-green-800 mb-4" style={{ fontFamily: 'monospace' }}>
            COMING SOON!
          </h3>
          <p className="text-green-700 text-lg mb-6">
            Your personal nutritionist is currently being trained to provide you with:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-100 p-4 rounded-lg border-2 border-green-300">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-bold text-green-800">Personalized Meal Plans</h4>
              <p className="text-green-600 text-sm">Based on your fitness goals and preferences</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg border-2 border-green-300">
              <div className="text-3xl mb-2">🍽️</div>
              <h4 className="font-bold text-green-800">Recipe Recommendations</h4>
              <p className="text-green-600 text-sm">Healthy and delicious meal ideas</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg border-2 border-green-300">
              <div className="text-3xl mb-2">📈</div>
              <h4 className="font-bold text-green-800">Macro Tracking</h4>
              <p className="text-green-600 text-sm">Monitor your protein, carbs, and fats</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg border-2 border-green-300">
              <div className="text-3xl mb-2">💡</div>
              <h4 className="font-bold text-green-800">Nutrition Tips</h4>
              <p className="text-green-600 text-sm">Expert advice for optimal health</p>
            </div>
          </div>

          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4">
            <p className="text-yellow-800 font-semibold">
              🌟 Stay tuned! This feature will be available soon to help you achieve your nutrition goals.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NutritionistPage; 