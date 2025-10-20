import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddMood from "./pages/AddMood";
import JournalList from "./pages/JournalList";
import { useState, useEffect } from "react";

function App() {
  const [hasError, setHasError] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showWelcome, setShowWelcome] = useState(true);
  const [moodsCount, setMoodsCount] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    const handler = (event) => {
      console.error(event.reason || event.error);
      setHasError(true);
      setTimeout(() => setHasError(false), 3000);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("error", handler);
    window.addEventListener("unhandledrejection", handler);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Hide welcome message after 3 seconds
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    // Simulate moods count - in real app, fetch from API
    setMoodsCount(24);

    return () => {
      window.removeEventListener("error", handler);
      window.removeEventListener("unhandledrejection", handler);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearTimeout(welcomeTimer);
    };
  }, []);

  // AI Chatbot Functions
  const analyzeMoodText = (text) => {
    const positiveWords = ['happy', 'good', 'great', 'excited', 'amazing', 'wonderful', 'joy', 'love', 'calm', 'peaceful', 'better', 'improving'];
    const negativeWords = ['sad', 'bad', 'angry', 'upset', 'stress', 'anxious', 'worried', 'tired', 'hurt', 'pain', 'depressed', 'lonely'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    const lowerText = text.toLowerCase();
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveCount++;
    });
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  };

  const getAIResponse = (userMessage) => {
    const mood = analyzeMoodText(userMessage);
    const lowerMessage = userMessage.toLowerCase();

    // Mood-based responses
    if (mood === "positive") {
      const responses = [
        "That's wonderful to hear! 😊 Would you like to save this positive moment in your journal?",
        "I'm so glad you're feeling good! 🌟 Remember to celebrate these happy moments.",
        "Positive vibes! 🎉 Your good mood is contagious. Want to add this to your mood tracker?",
        "It's great that you're feeling positive! 🌈 These moments are worth remembering."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (mood === "negative") {
      const responses = [
        "I'm here for you. 🤗 Would you like to talk more about what's bothering you?",
        "It's okay to not feel okay sometimes. 💙 Remember, this feeling is temporary.",
        "I understand this is tough. 🫂 Would breathing exercises or journaling help?",
        "Thank you for sharing. 🌧️ Would you like me to suggest some coping strategies?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Intent-based responses
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I'm here to help! 🛟 You can:\n• Track your moods\n• Journal your thoughts\n• Get mental health resources\n• Learn coping strategies\nWhat would you like to explore?";
    }

    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
      return "Anxiety can be challenging. 🧘 Try this: Take 5 deep breaths, focus on the present moment, and remember this will pass. Would you like a guided breathing exercise?";
    }

    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
      return "I'm sorry you're feeling this way. 🌧️ Remember:\n• You're not alone\n• This feeling is temporary\n• Small steps matter\nWould you like to journal about it or try a mood-lifting activity?";
    }

    if (lowerMessage.includes('stress') || lowerMessage.includes('stressed')) {
      return "Stress can be overwhelming. 🌊 Try breaking things down into smaller tasks. Remember to:\n• Take breaks\n• Practice deep breathing\n• Be kind to yourself\nNeed specific stress management tips?";
    }

    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired')) {
      return "Sleep affects mood significantly. 😴 Try:\n• Consistent sleep schedule\n• No screens before bed\n• Relaxing bedtime routine\n• Dark, cool room\nTracking your sleep patterns might help!";
    }

    if (lowerMessage.includes('journal') || lowerMessage.includes('write')) {
      return "Journaling is a powerful tool! 📖 It helps process emotions and track patterns. Would you like to:\n• Start a new journal entry\n• Review past entries\n• Try guided journaling?";
    }

    if (lowerMessage.includes('mood') || lowerMessage.includes('feel')) {
      return "Understanding your moods is the first step to managing them. 🌈 Would you like to:\n• Track your current mood\n• Analyze mood patterns\n• Get mood improvement tips?";
    }

    // Default responses
    const defaultResponses = [
      "I'm here to support your mental health journey. 🌟 How can I assist you today?",
      "As your AI mental health companion, I can help with mood tracking, coping strategies, and emotional support. What's on your mind?",
      "I'm listening. 💭 Tell me more about how you're feeling or what you need help with.",
      "Your mental wellbeing matters. 🫂 How can I support you right now?"
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Add user message
    const newUserMessage = {
      id: Date.now(),
      text: userInput,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newUserMessage]);
    setUserInput("");

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = getAIResponse(userInput);
      const newAiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, newAiMessage]);

      // Speak AI response
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiResponse);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    }, 1000);
  };

  const quickActions = [
    { text: "I'm feeling anxious", emoji: "😰" },
    { text: "I need coping strategies", emoji: "🛟" },
    { text: "Track my current mood", emoji: "📊" },
    { text: "Mental health resources", emoji: "📚" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* AI Welcome Banner */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl">🧠</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to MindCare AI</h2>
            <p className="text-gray-600 mb-6">Your AI-powered mental health companion is ready</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowWelcome(false)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold w-full"
            >
              Start Journey
            </motion.button>
          </motion.div>
        </div>
      )}

      <Navbar />
      
      {/* Status Notifications */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 space-y-2">
        {hasError && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3"
          >
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span>AI Service Temporarily Unavailable</span>
          </motion.div>
        )}
        
        {!isOnline && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3"
          >
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <span>Offline Mode - Basic Features Available</span>
          </motion.div>
        )}
      </div>

      {/* AI Assistant Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center text-white text-xl"
        onClick={() => setShowChat(true)}
      >
        <span className="text-lg">🤖</span>
      </motion.button>

      {/* AI Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowChat(false)}
          />
          
          {/* Chat Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md h-96 sm:h-[500px] flex flex-col"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-t-3xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-lg">🧠</span>
                </div>
                <div>
                  <h3 className="font-bold">MindCare AI Assistant</h3>
                  <p className="text-white/80 text-sm">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 my-8">
                  <div className="text-4xl mb-4">🤖</div>
                  <p className="font-semibold">Hello! I'm your AI mental health companion</p>
                  <p className="text-sm mt-2">How can I support you today?</p>
                  
                  {/* Quick Actions */}
                  <div className="mt-6 space-y-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setUserInput(action.text);
                          setTimeout(handleSendMessage, 100);
                        }}
                        className="w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm flex items-center gap-3"
                      >
                        <span className="text-lg">{action.emoji}</span>
                        <span>{action.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddMood />} />
          <Route path="/journal" element={<JournalList />} />
        </Routes>
      </main>

      {/* AI Powered Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🧠</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">MindCare AI</h3>
                <p className="text-sm text-gray-600">AI-Powered Mental Health Companion</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{moodsCount}</div>
                <div className="text-xs text-gray-600">Moods Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">24/7</div>
                <div className="text-xs text-gray-600">AI Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <div className="text-xs text-gray-600">Private</div>
              </div>
            </div>
          </div>
          
          {/* Emergency Quick Access */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600 text-center sm:text-left">
                If you're in crisis, help is available 24/7
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => window.open('tel:1-800-123-4567')}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  🗣️ Crisis Helpline
                </button>
                <button 
                  onClick={() => window.open('tel:911')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  🚨 Emergency
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;