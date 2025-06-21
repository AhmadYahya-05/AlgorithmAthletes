import { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../App';
import Header from '../components/Header';
import { Send, Bot, User, Zap } from 'lucide-react';

const AIChatbotPage = ({ user, onLogout }) => {
  const { userStats } = useContext(UserContext);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Welcome to your AI Fitness Coach! 🤖💪 I'm here to provide personalized recommendations based on your stats. I see you're level ${userStats.level} with ${userStats.workoutsCompleted} workouts completed. What would you like help with today?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock AI response function (replace with actual Gemini API call)
  const getAIResponse = async (userMessage) => {
    // This is a mock response. You'll replace this with actual Gemini API integration
    const responses = [
      `Based on your level ${userStats.level} and ${userStats.workoutsCompleted} completed workouts, I recommend focusing on progressive overload. Try increasing your weights by 5-10% this week!`,
      `Your ${userStats.streak}-day streak is impressive! To maintain momentum, consider adding a recovery day with light yoga or stretching.`,
      `With ${userStats.totalMinutes} minutes of training logged, you're doing great! For optimal results, aim for 150-300 minutes of moderate exercise weekly.`,
      `Given your goals of ${userStats.goals.join(', ')}, I suggest incorporating both strength training and cardio. Would you like a specific workout plan?`,
      `Your experience level suggests you're ready for intermediate challenges. Try compound movements like deadlifts and squats for maximum efficiency.`
    ];
    
    // Simulate API delay
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
        text: "Sorry, I'm having trouble connecting right now. Please try again later!",
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

  const quickPrompts = [
    "What workout should I do today?",
    "How can I improve my nutrition?",
    "I'm feeling unmotivated, help!",
    "Create a weekly workout plan",
    "How do I avoid injuries?"
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 text-2xl animate-pulse opacity-50">🤖</div>
        <div className="absolute top-32 right-1/3 text-xl animate-bounce opacity-40" style={{ animationDelay: '2s' }}>⚡</div>
        <div className="absolute bottom-32 left-1/3 text-3xl animate-pulse opacity-30" style={{ animationDelay: '1s' }}>🧠</div>
        <div className="absolute bottom-20 right-1/4 text-2xl animate-bounce opacity-50" style={{ animationDelay: '3s' }}>💡</div>
      </div>

      <Header user={user} onLogout={onLogout} title="AI FITNESS COACH" />

      {/* Main Chat Area */}
      <main className="relative z-10 w-full px-8 py-8 flex flex-col h-screen">
        
        {/* Character Display */}
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-b from-purple-600 to-indigo-800 rounded-2xl p-6 border-4 border-cyan-400 shadow-2xl">
            <div className="text-8xl mb-2 animate-pulse">🤖</div>
            <h2 className="text-2xl font-bold text-cyan-300" style={{ fontFamily: 'monospace' }}>
              AI FITNESS COACH
            </h2>
            <p className="text-indigo-200 text-sm">Powered by advanced AI • Personalized for you</p>
          </div>
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 bg-black bg-opacity-30 rounded-2xl border-4 border-cyan-400 p-6 mb-6 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md xl:max-w-lg flex items-start space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-green-500' : 'bg-purple-500'}`}>
                    {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`px-4 py-2 rounded-lg ${message.sender === 'user' ? 'bg-green-600 text-white' : 'bg-purple-600 text-white'}`}>
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
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-purple-600 text-white">
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

          {/* Quick Prompts */}
          <div className="mb-4">
            <p className="text-cyan-300 text-sm mb-2 font-bold">Quick Questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(prompt)}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs rounded-full transition-colors border border-cyan-400"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about fitness, nutrition, or workouts..."
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-cyan-400 focus:outline-none focus:border-cyan-300"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 text-white rounded-lg border border-cyan-400 transition-colors flex items-center space-x-2"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* User Stats Display */}
        <div className="bg-gradient-to-r from-indigo-800 to-purple-800 rounded-xl p-4 border-2 border-cyan-400">
          <h3 className="text-cyan-300 font-bold mb-2 text-sm">Your Current Stats:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{userStats.level}</div>
              <div className="text-xs text-indigo-200">Level</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{userStats.workoutsCompleted}</div>
              <div className="text-xs text-indigo-200">Workouts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{userStats.streak}</div>
              <div className="text-xs text-indigo-200">Day Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{userStats.totalMinutes}</div>
              <div className="text-xs text-indigo-200">Minutes</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIChatbotPage; 