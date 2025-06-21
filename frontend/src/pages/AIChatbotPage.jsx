import { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { Send, ArrowLeft, Activity, Zap, Heart, Shield, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NavigationBar from '../components/NavigationBar';

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
    <div className="mb-2">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          {icon}
          <span className="text-gray-300 font-semibold ml-2 text-sm">
            {label}
          </span>
        </div>
        <span className="text-gray-300 font-bold text-xs">{value}/{maxValue}</span>
      </div>
      <div className="w-full h-3 bg-gray-800 rounded-full border border-gray-600 overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${(value / maxValue) * 100}%` }}
        ></div>
      </div>
    </div>
  );

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

      {/* Main Content */}
      <main className="relative z-10 w-full px-8 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Trainer & Chat Display */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Character Card & Stats */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1 space-y-8"
            >
              {/* Character Card */}
              <div className="bg-gray-900 bg-opacity-70 rounded-2xl border-2 border-gray-700 shadow-2xl p-6" style={{ backdropFilter: 'blur(10px)' }}>
                <div className="text-center">
                  {/* Character Sprite */}
                  <div className="h-32 flex items-center justify-center mb-4" style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.5))' }}>
                    <div 
                      className="text-8xl transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setTrainerAnimation('jump')}
                      onMouseLeave={() => setTrainerAnimation('idle')}
                      onClick={() => setCurrentSprite((prev) => (prev + 1) % trainerCharacter.sprites.length)}
                      title="Click to change trainer!"
                    >
                      {trainerCharacter.sprites[currentSprite]}
                    </div>
                  </div>
                  
                  {/* Character Name */}
                  <h3 className="text-xl font-bold text-yellow-300 mb-2">
                    {trainerCharacter.name}
                  </h3>
                  
                  {/* Character Type */}
                  <div className="inline-block bg-black bg-opacity-30 px-3 py-1 rounded-lg border-2 border-yellow-400 mb-3">
                    <span className="text-yellow-100 font-bold text-xs">
                      {trainerCharacter.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Character Stats */}
              <div className="bg-gray-900 bg-opacity-70 rounded-2xl border-2 border-gray-700 shadow-2xl p-6" style={{ backdropFilter: 'blur(10px)' }}>
                <h4 className="text-lg font-bold text-yellow-300 mb-4 text-center">
                  📊 AI CAPABILITIES 📊
                </h4>
                
                <p className="text-gray-300 text-xs text-center mb-4">
                  {trainerCharacter.description}
                </p>
                
                <div className="space-y-4">
                  <StatBar value={trainerCharacter.stats.intelligence} color="bg-purple-500" icon={<Zap />} label="INTELLIGENCE" />
                  <StatBar value={trainerCharacter.stats.motivation} color="bg-green-500" icon={<Activity />} label="MOTIVATION" />
                  <StatBar value={trainerCharacter.stats.knowledge} color="bg-blue-500" icon={<Shield />} label="KNOWLEDGE" />
                  <StatBar value={trainerCharacter.stats.availability} color="bg-red-500" icon={<Heart />} label="AVAILABILITY" />
                </div>
              </div>
            </motion.div>

            {/* Chat Interface */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 bg-gray-900 bg-opacity-70 rounded-2xl border-2 border-gray-700 shadow-2xl flex flex-col h-[75vh]" 
              style={{ backdropFilter: 'blur(10px)' }}
            >
              {/* Messages Container */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}
                    >
                      {msg.sender === 'ai' && (
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-indigo-400">
                          <Bot className="w-6 h-6 text-white"/>
                        </div>
                      )}
                      <div className={`max-w-md p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
                        <p className="text-sm">{msg.text}</p>
                        <span className="text-xs text-gray-400 mt-1 block text-right">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {msg.sender === 'user' && (
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600">
                          <User className="w-6 h-6 text-white"/>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="flex items-center justify-center"
                   >
                     <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <Bot className="w-5 h-5 animate-pulse"/>
                        <span>AI is typing...</span>
                     </div>
                   </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t-2 border-gray-700">
                <div className="relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask your AI trainer anything..."
                    className="w-full h-12 p-3 pr-20 bg-gray-800 border-2 border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white resize-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-yellow-500 rounded-lg hover:bg-yellow-600 disabled:bg-gray-500 transition-colors"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIChatbotPage; 