import { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../App';
import { Send, ArrowLeft, Activity, Zap, Heart, Shield } from 'lucide-react';

const AIChatbotPage = ({ user, onLogout }) => {
  const { userStats } = useContext(UserContext);
  const [trainerAnimation, setTrainerAnimation] = useState('idle');
  const [currentSprite, setCurrentSprite] = useState(0);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hey there, champion! 💪 I'm your AI Personal Trainer! I see you're level ${userStats.level} with ${userStats.workoutsCompleted} workouts completed. Ready to crush some goals today?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // AI Trainer character data
  const trainerCharacter = {
    name: "AI FITNESS COACH",
    type: "Digital Trainer",
    description: "Your personal AI-powered fitness companion with advanced workout intelligence",
    sprites: [
      '🏃‍♂️', // Running man
      '🧙‍♂️', // Wizard trainer
      '⚔️',   // Warrior
      '🥷',   // Ninja trainer  
      '🦸‍♂️', // Superhero trainer
      '🤖',   // Robot trainer
      '👨‍⚕️', // Professional trainer
      '🧞‍♂️', // Genie trainer
      '🦾',   // Cyborg arm
      '💪',   // Flexing bicep
    ],
    stats: {
      intelligence: 20,
      motivation: 18,
      knowledge: 19,
      availability: 20
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate trainer animations
  useEffect(() => {
    const animationInterval = setInterval(() => {
      const animations = ['idle', 'flex', 'jump'];
      setTrainerAnimation(animations[Math.floor(Math.random() * animations.length)]);
    }, 4000);

    return () => clearInterval(animationInterval);
  }, []);

  // Mock AI response function
  const getAIResponse = async (userMessage) => {
    const responses = [
      `Based on your level ${userStats.level} and ${userStats.workoutsCompleted} completed workouts, I recommend focusing on progressive overload. Try increasing your weights by 5-10% this week! 💪`,
      `Your ${userStats.streak}-day streak is absolutely crushing it! 🔥 To maintain momentum, consider adding a recovery day with light yoga or stretching.`,
      `With ${userStats.totalMinutes} minutes of training logged, you're doing fantastic! For optimal results, aim for 150-300 minutes of moderate exercise weekly. 📈`,
      `Remember, consistency beats perfection! Even a 15-minute workout is better than none. Keep pushing forward! 🚀`,
      `Hydration check! Make sure you're drinking enough water, especially during intense training sessions. 💧`
    ];
    
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(inputText);
      
      const newAIMessage = {
        id: messages.length + 2,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newAIMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting right now. Please try again later! 😅",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const StatBar = ({ value, maxValue = 20, color, icon, label }) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {icon}
          <span className="text-white font-bold ml-2 text-sm" style={{ fontFamily: 'monospace' }}>
            {label}
          </span>
        </div>
        <span className="text-white font-bold text-xs">{value}/{maxValue}</span>
      </div>
      <div className="w-full h-2 bg-gray-800 rounded-full border border-gray-600 overflow-hidden">
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
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-10 bottom-0 text-6xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '4s' }}>🌲</div>
        <div className="absolute left-32 bottom-0 text-8xl">🌳</div>
        <div className="absolute right-20 bottom-0 text-7xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}>🌲</div>
        <div className="absolute right-40 bottom-0 text-6xl">🌳</div>
        <div className="absolute top-10 left-1/4 text-4xl animate-pulse opacity-80">☁️</div>
        <div className="absolute top-16 right-1/4 text-3xl animate-pulse opacity-70">☁️</div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-green-800 to-green-600 shadow-lg border-b-4 border-yellow-400" style={{
        fontFamily: 'monospace',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)'
      }}>
        <div className="w-full px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-3xl mr-3 animate-pulse">🤖</div>
              <h1 className="text-2xl font-bold text-yellow-300 tracking-wider" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                AI PERSONAL TRAINER
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
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg border-2 border-red-800 font-bold text-sm transition-all duration-200 transform hover:scale-105"
                style={{ fontFamily: 'monospace', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>QUIT</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full px-8 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Trainer Character Display */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* Character Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-b from-cyan-500 to-cyan-700 rounded-2xl p-6 border-4 border-cyan-800 shadow-2xl">
                <div className="text-center">
                  {/* Character Sprite */}
                  <div className="h-32 flex items-center justify-center mb-4" style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.5))' }}>
                    <div 
                      className={`text-8xl transition-all duration-300 cursor-pointer ${
                        trainerAnimation === 'jump' ? 'transform -translate-y-4' : 
                        trainerAnimation === 'flex' ? 'animate-pulse transform scale-110' : ''
                      }`}
                      onMouseEnter={() => setTrainerAnimation('jump')}
                      onMouseLeave={() => setTrainerAnimation('idle')}
                      onClick={() => setCurrentSprite((prev) => (prev + 1) % trainerCharacter.sprites.length)}
                      title="Click to change trainer!"
                    >
                      {trainerCharacter.sprites[currentSprite]}
                    </div>
                  </div>
                  
                  {/* Character Name */}
                  <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'monospace', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                    {trainerCharacter.name}
                  </h3>
                  
                  {/* Character Type */}
                  <div className="inline-block bg-black bg-opacity-30 px-3 py-1 rounded-lg border-2 border-white mb-3">
                    <span className="text-white font-bold text-xs" style={{ fontFamily: 'monospace' }}>
                      {trainerCharacter.type}
                    </span>
                  </div>
                  
                  {/* Sprite Counter */}
                  <div className="text-white text-xs mb-3" style={{ fontFamily: 'monospace' }}>
                    SPRITE: {currentSprite + 1}/{trainerCharacter.sprites.length}
                  </div>
                  
                  {/* Character Description */}
                  <p className="text-white text-xs opacity-90">
                    {trainerCharacter.description}
                  </p>
                </div>
              </div>

              {/* Character Stats */}
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl border-4 border-gray-600 shadow-2xl p-6 mt-4">
                <h4 className="text-lg font-bold text-white mb-4 text-center" style={{ fontFamily: 'monospace' }}>
                  📊 AI CAPABILITIES 📊
                </h4>
                
                <StatBar 
                  value={trainerCharacter.stats.intelligence}
                  color="bg-gradient-to-r from-purple-400 to-purple-600"
                  icon={<Zap className="h-4 w-4 text-purple-400" />}
                  label="INTELLIGENCE"
                />
                <StatBar 
                  value={trainerCharacter.stats.motivation}
                  color="bg-gradient-to-r from-orange-400 to-orange-600"
                  icon={<Heart className="h-4 w-4 text-orange-400" />}
                  label="MOTIVATION"
                />
                <StatBar 
                  value={trainerCharacter.stats.knowledge}
                  color="bg-gradient-to-r from-green-400 to-green-600"
                  icon={<Shield className="h-4 w-4 text-green-400" />}
                  label="KNOWLEDGE"
                />
                <StatBar 
                  value={trainerCharacter.stats.availability}
                  color="bg-gradient-to-r from-blue-400 to-blue-600"
                  icon={<Activity className="h-4 w-4 text-blue-400" />}
                  label="AVAILABILITY"
                />
              </div>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-2xl border-4 border-amber-600 shadow-2xl p-6 h-full">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-amber-900 mb-2" style={{ fontFamily: 'monospace', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    💬 TRAINING CHAT 💬
                  </h3>
                  <p className="text-amber-800 text-sm">Get personalized advice and motivation!</p>
                </div>

                {/* Chat Messages Container */}
                <div className="bg-white rounded-xl border-2 border-amber-400 p-4 mb-6 h-96 overflow-hidden flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md flex items-start space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${message.sender === 'user' ? 'bg-green-500' : 'bg-cyan-500'}`}>
                            {message.sender === 'user' ? '👤' : '🤖'}
                          </div>
                          <div className={`px-3 py-2 rounded-lg ${message.sender === 'user' ? 'bg-green-600 text-white' : 'bg-cyan-600 text-white'}`}>
                            <p className="text-sm">{message.text}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-xs flex items-start space-x-2">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-sm">
                            🤖
                          </div>
                          <div className="px-3 py-2 rounded-lg bg-cyan-600 text-white">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about fitness..."
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-800 rounded-lg border border-amber-400 focus:outline-none focus:border-amber-600 text-sm"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputText.trim()}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-400 text-white rounded-lg border border-amber-400 transition-colors flex items-center"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setInputText("What workout should I do today?")}
                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    🏋️ Workout Plan
                  </button>
                  <button 
                    onClick={() => setInputText("How can I improve my nutrition?")}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    🥗 Nutrition Tips
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* User Stats Display */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 border-4 border-yellow-400">
            <h3 className="text-yellow-300 font-bold mb-4 text-center text-lg" style={{ fontFamily: 'monospace' }}>⚡ YOUR CURRENT STATS ⚡</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white">{userStats.level}</div>
                <div className="text-sm text-yellow-200">Level</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{userStats.workoutsCompleted}</div>
                <div className="text-sm text-yellow-200">Workouts</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{userStats.streak}</div>
                <div className="text-sm text-yellow-200">Day Streak</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{userStats.totalMinutes}</div>
                <div className="text-sm text-yellow-200">Minutes</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIChatbotPage; 