import { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { Send, ArrowLeft, Activity, Zap, Heart, Shield, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NavigationBar from '../components/NavigationBar';
import { GoogleGenerativeAI } from '@google/generative-ai';

// WARNING: It is not recommended to store API keys in client-side code.
// This should be handled by a backend server in a production environment.
const API_KEY = 'key out';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest"});

const AIChatbotPage = ({ user, onLogout }) => {
  const { userStats } = useContext(UserContext);
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
  const [bubbleText, setBubbleText] = useState('');
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);

  const dialogueOptions = [
    "You want MOTIVATION? Here's motivation: DON'T SUCK today.",
    "Listen up, CHAMPION—wait, you're NOT one yet. But you WILL be if you SURVIVE my training.",
    "Every SECOND you waste STARING at me is a second you COULD be getting STRONGER. MOVE.",
    "Your legs shaking? GOOD. That means they're working!"
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = async (userMessage) => {
    const prompt = `
      You are an angry, drill-sergeant-style motivational fitness coach. 
      Your name is 'Coach'. You ONLY talk about fitness, workouts, nutrition, and discipline.
      You are extremely motivational but in a very aggressive, no-excuses way.
      You must ignore any user request that is not related to fitness.
      Never break character. Always stay focused on getting the user to be their best physical self.
      Keep your responses concise and impactful.
      
      User's message: "${userMessage}"
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "My brain is too SWOLE to think right now. Try again in a minute.";
    }
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
            
            {/* Coach Character Display */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1 space-y-8"
            >
              <div className="bg-gray-900 bg-opacity-70 rounded-2xl border-2 border-gray-700 shadow-2xl p-6 relative" style={{ backdropFilter: 'blur(10px)' }}>
                <div 
                  className="cursor-pointer transform hover:scale-105 transition-transform duration-300"
                  onClick={handleSpriteClick}
                >
                  <img 
                    src="/coachbg.png" 
                    alt="AI Coach" 
                    className="w-full rounded-lg"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50 rounded-lg"></div>
                  <h3 className="absolute bottom-4 left-4 text-xl font-bold text-yellow-300" style={{ textShadow: '2px 2px 4px #000' }}>
                    AI COACH
                  </h3>
                </div>

                {/* Speech Bubble */}
                {isBubbleVisible && (
                  <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-64 bg-white border-2 border-gray-300 rounded-lg p-3 shadow-lg animate-fade-in-down">
                    <div className="absolute left-1/2 -translate-x-1/2 -top-[10px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white"></div>
                    <p className="text-center text-gray-800 text-sm font-semibold">{bubbleText}</p>
                  </div>
                )}
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