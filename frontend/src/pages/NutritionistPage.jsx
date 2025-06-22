import { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import NavigationBar from '../components/NavigationBar';
import { motion } from 'framer-motion';
import CharacterToggle from '../components/CharacterToggle';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_ENDPOINTS } from '../config/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../styles/markdown.css';
import { Send, Bot, User, BrainCircuit } from 'lucide-react';

const API_KEY = 'AIzaSyAGmWwzjFAf4_OKorgRgPnpE6AVXeqt2Jw';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest"});

const NutritionistPage = ({ user, onLogout }) => {
  const { profileData, updateProfileData } = useContext(UserContext);
  const [bubbleText, setBubbleText] = useState('');
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome! I'm here to help you with your nutritional goals. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const dialogueOptions = [
    "Hello! Ready to make some healthy choices today?",
    "Nutrition is the foundation of energy. Let's see how we can fuel you better!",
    "Remember to drink plenty of water to stay hydrated and energized!",
    "A balanced plate leads to a balanced life. Let's create one for you."
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
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isBubbleVisible]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(API_ENDPOINTS.PROFILE.GET, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          updateProfileData({
            chronologicalAge: data.basicMetrics.chronologicalAge || '',
            height: data.basicMetrics.height || '',
            weight: data.basicMetrics.weight || '',
            restingHeartRate: data.basicMetrics.restingHeartRate || '',
            systolicBP: data.basicMetrics.bloodPressure?.systolic || '',
            diastolicBP: data.basicMetrics.bloodPressure?.diastolic || '',
            exerciseFrequency: data.lifestyle?.exerciseFrequency || '',
            smokingStatus: data.lifestyle?.smokingStatus || 'never',
            alcoholConsumption: data.lifestyle?.alcoholConsumption || '',
            sleepHours: data.lifestyle?.sleepHours || '',
            stressLevel: data.lifestyle?.stressLevel || 5,
            cardioPerformance: data.fitness?.cardioPerformance || '',
            strengthLevel: data.fitness?.strengthLevel || 'intermediate',
            flexibilityLevel: data.fitness?.flexibilityLevel || 'average',
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile for Nutritionist:', error);
      }
    };
    fetchProfile();
  }, []);

  const getAIResponse = async (userMessage) => {
    const prompt = `
      You are a calm, friendly, and positive woman nutritionist. 
      Your goal is to provide supportive and evidence-based advice on nutrition, healthy eating, and wellness.
      You ONLY talk about topics related to diet, food, hydration, and healthy lifestyle habits.
      You must gently decline any user request that is not related to nutrition.
      Always maintain a positive and encouraging tone. Keep responses clear and easy to understand, and short unless the user asks for more information.
      Never break character.

      Here is the user's profile information. Use it to tailor your recommendations:
      - Age: ${profileData.chronologicalAge || 'Not provided'}
      - Height: ${profileData.height || 'Not provided'} cm
      - Weight: ${profileData.weight || 'Not provided'} kg
      - Exercise Frequency: ${profileData.exerciseFrequency || 'Not provided'} days/week
      - Fitness Goals: General health and wellness
      
      User's message: "${userMessage}"
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "I'm having a little trouble recalling that information right now. Could you ask me again in a moment?";
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
        text: "Sorry, I'm having trouble connecting right now. Please try again later! 😊",
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

      <main className="relative z-10 w-full px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
            {/* Nutritionist Character Display */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 bg-opacity-70 rounded-2xl border-2 border-gray-700 shadow-2xl p-6 relative" style={{ backdropFilter: 'blur(10px)' }}>
                <div 
                  className="cursor-pointer transform hover:scale-105 transition-transform duration-300"
                  onClick={handleSpriteClick}
                >
                  <img 
                    src="/nutritionist2.png" 
                    alt="Nutritionist" 
                    className="w-full rounded-lg"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50 rounded-lg"></div>
                  <h3 className="absolute bottom-4 left-4 text-xl font-bold text-green-300" style={{ textShadow: '2px 2px 4px #000' }}>
                    NUTRITIONIST - Dr. Adams
                  </h3>
                </div>

                {isBubbleVisible && (
                  <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-64 bg-white border-2 border-gray-300 rounded-lg p-3 shadow-lg animate-fade-in-down">
                    <div className="absolute left-1/2 -translate-x-1/2 -top-[10px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white"></div>
                    <p className="text-center text-gray-800 text-sm font-semibold">{bubbleText}</p>
                  </div>
                )}

                <div className="mt-6">
                  <CharacterToggle activeCharacter="nutritionist" />
                </div>
          </div>
        </div>

            {/* Chat Section */}
            <div className="lg:col-span-2 bg-gray-900 bg-opacity-70 rounded-2xl border-2 border-gray-700 shadow-2xl flex flex-col" style={{ backdropFilter: 'blur(10px)', height: '70vh' }}>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <BrainCircuit size={20} className="text-white" />
                      </div>
                    )}
                    <div className={`rounded-lg p-3 max-w-lg ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                      <div className="markdown-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                     {msg.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                        <User size={20} className="text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <BrainCircuit size={20} className="text-white" />
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3">
                      <motion.div className="flex space-x-1">
                        <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} className="w-2 h-2 bg-gray-300 rounded-full" />
                        <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 1, delay: 0.1, repeat: Infinity, ease: "easeInOut" }} className="w-2 h-2 bg-gray-300 rounded-full" />
                        <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 1, delay: 0.2, repeat: Infinity, ease: "easeInOut" }} className="w-2 h-2 bg-gray-300 rounded-full" />
                      </motion.div>
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
                    placeholder="Ask about your diet plan, recipes, or anything nutrition-related..."
                    className="w-full bg-gray-800 text-white rounded-lg p-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={2}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputText.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="text-white" />
                  </button>
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
