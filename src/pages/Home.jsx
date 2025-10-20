import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useParallax, useScrollReveal } from "../hooks/useParallax";

export default function Home() {
  const { elementRef: heroRef, offset: heroOffset } = useParallax(0.3);
  const { elementRef: cardRef, isVisible: cardVisible } = useScrollReveal();

  // Sample analytics data for demonstration
  const analyticsData = {
    totalEntries: 24,
    positiveDays: 18,
    currentStreak: 7,
    avgMood: 7.2
  };

  const achievements = [
    { id: 1, name: "First Entry", unlocked: true, icon: "🎯" },
    { id: 2, name: "7-Day Streak", unlocked: true, icon: "🔥" },
    { id: 3, name: "Mood Master", unlocked: false, icon: "🏆" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          ref={heroRef}
          style={{ transform: `translateY(${heroOffset}px)` }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl"
        />
        <div 
          style={{ transform: `translateY(${heroOffset * 0.5}px)` }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-20 blur-3xl"
        />
        <div 
          style={{ transform: `translateY(${heroOffset * 0.7}px)` }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full opacity-10 blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center py-12 sm:py-20 px-4 sm:px-6 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-6xl mx-auto w-full"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6 sm:mb-8 flex justify-center"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-3xl rotate-6 opacity-80 blur-sm"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-3xl sm:text-4xl md:text-5xl">🧠</span>
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-gray-800"
          >
            MindCare AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
          >
            Your AI-Powered Mental Health Companion with Voice Intelligence
          </motion.p>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8 sm:mb-12"
          >
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50">
              <div className="text-2xl font-bold text-blue-600">{analyticsData.totalEntries}</div>
              <div className="text-sm text-gray-600">Entries</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50">
              <div className="text-2xl font-bold text-green-600">{analyticsData.positiveDays}</div>
              <div className="text-sm text-gray-600">Positive Days</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50">
              <div className="text-2xl font-bold text-purple-600">{analyticsData.currentStreak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/50">
              <div className="text-2xl font-bold text-pink-600">{analyticsData.avgMood}</div>
              <div className="text-sm text-gray-600">Avg Mood</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4 mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/add"
                className="bg-blue-500 text-white text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 rounded-2xl shadow-lg hover:shadow-2xl font-semibold w-full sm:w-auto text-center inline-block transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Mood
                </span>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/journal"
                className="bg-white text-gray-900 text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 rounded-2xl shadow-lg hover:shadow-2xl font-semibold border-2 border-gray-200 hover:border-purple-300 w-full sm:w-auto text-center inline-block transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 1a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  View Journal
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* AI Features Grid */}
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50 }}
            animate={cardVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full px-4"
          >
            {/* AI Mood Analysis Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={cardVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200"
            >
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">AI Mood Analysis</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Advanced AI analyzes your emotions and provides insights
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Real-time Analysis
              </div>
            </motion.div>

            {/* Emergency Support Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={cardVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-gradient-to-br from-red-50 to-pink-100 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-red-200"
            >
              <div className="text-4xl mb-4">🆘</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Emergency Support</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Immediate access to mental health resources and helplines
              </p>
              <div className="flex items-center gap-2 text-sm text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                24/7 Available
              </div>
            </motion.div>

            {/* Achievements Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={cardVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200"
            >
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Your Achievements</h3>
              <div className="space-y-2">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      achievement.unlocked ? 'bg-white/80' : 'bg-gray-100/50'
                    }`}
                  >
                    <span className="text-lg">{achievement.icon}</span>
                    <span className={`text-sm ${
                      achievement.unlocked ? 'text-gray-800 font-medium' : 'text-gray-400'
                    }`}>
                      {achievement.name}
                    </span>
                    {achievement.unlocked && (
                      <span className="ml-auto text-green-500 text-xs">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Voice Intelligence Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={cardVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-3xl shadow-2xl max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🎙️</div>
                <div>
                  <h3 className="text-xl font-bold">Voice Intelligence Active</h3>
                  <p className="text-purple-100">Speak your emotions naturally with AI-powered voice analysis</p>
                </div>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}