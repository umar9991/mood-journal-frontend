import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getMoods, deleteMood, updateMood } from "../api";
import { useVoice } from "../hooks/useVoice";
import VoiceButton from "../components/VoiceButton";

// Enhanced sample data with AI features
const sampleMoods = [
  {
    id: 1,
    mood: "Happy",
    moodScore: 8,
    emotions: ["Excited", "Grateful"],
    aiAnalysis: "Very Positive",
    note: "Had a wonderful day with friends. We went to the park and had a picnic. The weather was perfect!",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    mood: "Calm",
    moodScore: 7,
    emotions: ["Peaceful", "Relaxed"],
    aiAnalysis: "Positive",
    note: "Meditated for 20 minutes this morning. Feeling peaceful and centered. Need to make this a daily habit.",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    mood: "Energetic",
    moodScore: 9,
    emotions: ["Motivated", "Focused"],
    aiAnalysis: "Very Positive",
    note: "Completed my workout routine and feeling full of energy. Ready to tackle the day!",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    mood: "Thoughtful",
    moodScore: 6,
    emotions: ["Reflective", "Contemplative"],
    aiAnalysis: "Neutral",
    note: "Spent time reflecting on personal goals and future plans. Need to focus more on self-care.",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 5,
    mood: "Grateful",
    moodScore: 8,
    emotions: ["Thankful", "Blessed"],
    aiAnalysis: "Positive",
    note: "Thankful for the small blessings in life. Good health, loving family, and beautiful sunset today.",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 6,
    mood: "Focused",
    moodScore: 7,
    emotions: ["Productive", "Determined"],
    aiAnalysis: "Positive",
    note: "Productive work session. Managed to complete all planned tasks ahead of schedule. Feeling accomplished!",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default function JournalList() {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ mood: "", note: "", moodScore: 5, emotions: [] });
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  
  // Separate voice instances for editing
  const {
    isListening: isEditMoodListening,
    isSpeaking: isEditMoodSpeaking,
    isSupported: isEditMoodSupported,
    transcript: editMoodTranscript,
    error: editMoodVoiceError,
    startListening: startEditMoodListening,
    stopListening: stopEditMoodListening,
    speak: speakEditMood,
    stopSpeaking: stopEditMoodSpeaking,
    clearTranscript: clearEditMoodTranscript
  } = useVoice('edit-mood');

  const {
    isListening: isEditNoteListening,
    isSpeaking: isEditNoteSpeaking,
    isSupported: isEditNoteSupported,
    transcript: editNoteTranscript,
    error: editNoteVoiceError,
    startListening: startEditNoteListening,
    stopListening: stopEditNoteListening,
    speak: speakEditNote,
    stopSpeaking: stopEditNoteSpeaking,
    clearTranscript: clearEditNoteTranscript
  } = useVoice('edit-note');

  // Voice instance for reading entries
  const {
    isSpeaking: isReading,
    isSupported: isReadSupported,
    speak: speakEntry,
    stopSpeaking: stopReading
  } = useVoice('read');

  // AI Analysis for insights
  const [insights, setInsights] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMoods();
      if (Array.isArray(data) && data.length > 0) {
        setMoods(data);
        calculateInsights(data);
      } else {
        setMoods(sampleMoods);
        calculateInsights(sampleMoods);
      }
    } catch (err) {
      setError("Failed to load journal entries. Showing sample data.");
      setMoods(sampleMoods);
      calculateInsights(sampleMoods);
    }
    setLoading(false);
  };

  const calculateInsights = (moodData) => {
    const totalEntries = moodData.length;
    const positiveEntries = moodData.filter(m => m.moodScore >= 7).length;
    const avgMoodScore = (moodData.reduce((acc, m) => acc + (m.moodScore || 5), 0) / totalEntries).toFixed(1);
    const mostCommonMood = getMostCommonMood(moodData);
    
    setInsights({
      totalEntries,
      positiveEntries,
      positivePercentage: Math.round((positiveEntries / totalEntries) * 100),
      avgMoodScore,
      mostCommonMood,
      streak: calculateCurrentStreak(moodData)
    });
  };

  const getMostCommonMood = (moodData) => {
    const moodCounts = {};
    moodData.forEach(mood => {
      moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
    });
    return Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b);
  };

  const calculateCurrentStreak = (moodData) => {
    // Simple streak calculation - in real app, check consecutive days
    return moodData.length > 0 ? Math.min(7, moodData.length) : 0;
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    const res = await deleteMood(id);
    if (res?.deleted) {
      setMoods((prev) => prev.filter((m) => m.id !== id));
      calculateInsights(moods.filter((m) => m.id !== id));
    }
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setEditForm({ 
      mood: entry.mood || "", 
      note: entry.note || "", 
      moodScore: entry.moodScore || 5,
      emotions: entry.emotions || []
    });
    setSelectedEmotions(entry.emotions || []);
    clearEditMoodTranscript();
    clearEditNoteTranscript();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ mood: "", note: "", moodScore: 5, emotions: [] });
    setSelectedEmotions([]);
    clearEditMoodTranscript();
    clearEditNoteTranscript();
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const updatedData = {
      ...editForm,
      emotions: selectedEmotions,
      aiAnalysis: analyzeMoodWithAI(editForm.mood + " " + editForm.note)
    };
    const updated = await updateMood(editingId, updatedData);
    if (updated?.id) {
      setMoods((prev) => prev.map((m) => (m.id === editingId ? updated : m)));
      calculateInsights(moods.map((m) => (m.id === editingId ? updated : m)));
      cancelEdit();
    }
  };

  const analyzeMoodWithAI = (text) => {
    const positiveWords = ['happy', 'good', 'great', 'excited', 'amazing', 'wonderful', 'joy', 'love', 'calm', 'peaceful'];
    const negativeWords = ['sad', 'bad', 'angry', 'upset', 'stress', 'anxious', 'worried', 'tired', 'hurt', 'pain'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (text.toLowerCase().includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (text.toLowerCase().includes(word)) negativeCount++;
    });
    
    const score = positiveCount - negativeCount;
    
    if (score > 2) return "Very Positive";
    if (score > 0) return "Positive";
    if (score < -2) return "Very Negative";
    if (score < 0) return "Negative";
    return "Neutral";
  };

  const emotions = ["Happy", "Sad", "Angry", "Excited", "Calm", "Anxious", "Grateful", "Tired", "Energetic", "Peaceful"];

  const toggleEmotion = (emotion) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleEditMoodVoiceInput = () => {
    if (editMoodTranscript) {
      setEditForm(prev => ({ ...prev, mood: editMoodTranscript }));
      clearEditMoodTranscript();
    }
  };

  const handleEditNoteVoiceInput = () => {
    if (editNoteTranscript) {
      setEditForm(prev => ({ ...prev, note: editNoteTranscript }));
      clearEditNoteTranscript();
    }
  };

  const getMoodColor = (mood) => {
    const moodColors = {
      'Happy': 'from-yellow-400 to-orange-400',
      'Calm': 'from-blue-400 to-teal-400',
      'Energetic': 'from-green-400 to-emerald-400',
      'Thoughtful': 'from-purple-400 to-indigo-400',
      'Grateful': 'from-pink-400 to-rose-400',
      'Focused': 'from-indigo-400 to-blue-400',
      'Sad': 'from-gray-400 to-slate-400',
      'Excited': 'from-red-400 to-pink-400',
      'Peaceful': 'from-teal-400 to-cyan-400'
    };
    return moodColors[mood] || 'from-gray-400 to-slate-400';
  };

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      'Happy': '😊',
      'Calm': '😌',
      'Energetic': '💪',
      'Thoughtful': '🤔',
      'Grateful': '🙏',
      'Focused': '🎯',
      'Sad': '😔',
      'Excited': '🎉',
      'Peaceful': '☮️'
    };
    return moodEmojis[mood] || '📝';
  };

  const getAnalysisColor = (analysis) => {
    const colors = {
      'Very Positive': 'from-green-500 to-emerald-500',
      'Positive': 'from-blue-500 to-cyan-500',
      'Neutral': 'from-gray-500 to-slate-500',
      'Negative': 'from-orange-500 to-amber-500',
      'Very Negative': 'from-red-500 to-pink-500'
    };
    return colors[analysis] || 'from-gray-500 to-slate-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">AI is analyzing your mood journal...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">🧠</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800">
              AI Mood Insights
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced AI analysis of your emotional patterns and mental health journey
          </p>
        </motion.div>

        {/* AI Insights Dashboard */}
        {insights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="glass-card rounded-3xl p-6 text-center bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
              <div className="text-3xl font-bold text-purple-600">{insights.totalEntries}</div>
              <div className="text-sm text-gray-600">Total Entries</div>
              <div className="mt-2 text-xs text-purple-500">AI Tracked</div>
            </div>
            <div className="glass-card rounded-3xl p-6 text-center bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <div className="text-3xl font-bold text-green-600">{insights.positivePercentage}%</div>
              <div className="text-sm text-gray-600">Positive Moods</div>
              <div className="mt-2 text-xs text-green-500">AI Analyzed</div>
            </div>
            <div className="glass-card rounded-3xl p-6 text-center bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">{insights.avgMoodScore}</div>
              <div className="text-sm text-gray-600">Avg Mood Score</div>
              <div className="mt-2 text-xs text-blue-500">AI Calculated</div>
            </div>
            <div className="glass-card rounded-3xl p-6 text-center bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200">
              <div className="text-3xl font-bold text-orange-600">{insights.streak} days</div>
              <div className="text-sm text-gray-600">Current Streak</div>
              <div className="mt-2 text-xs text-orange-500">AI Monitored</div>
            </div>
          </motion.div>
        )}

        {/* Error Messages */}
        {(error || editMoodVoiceError || editNoteVoiceError) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-100 text-red-700 px-4 py-3 rounded-xl mb-6 border-l-4 border-red-500"
          >
            {error || editMoodVoiceError || editNoteVoiceError}
          </motion.div>
        )}

        {/* Journal Entries */}
        {moods.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">🤖</div>
            <h3 className="text-3xl font-bold text-gray-700 mb-4">Your AI Journal is Ready</h3>
            <p className="text-gray-500 text-lg mb-8">Start your AI-powered mood tracking journey!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl"
              onClick={() => window.location.href = '/add'}
            >
              Start AI Analysis
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {moods.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card rounded-3xl p-6 card-hover transform-3d border border-white/50 shadow-lg hover:shadow-2xl"
              >
                {editingId === entry.id ? (
                  // Edit Mode with AI Features
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">AI Edit Mode</h3>
                      <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        AI Active
                      </div>
                    </div>
                    
                    {/* Mood Score Editor */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Mood Score: {editForm.moodScore}/10</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                          <button
                            key={star}
                            onClick={() => setEditForm(prev => ({ ...prev, moodScore: star }))}
                            className={`w-6 h-6 rounded-full transition-all duration-300 ${
                              star <= editForm.moodScore 
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg' 
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Emotions Editor */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Emotions</label>
                      <div className="flex flex-wrap gap-2">
                        {emotions.map((emotion) => (
                          <button
                            key={emotion}
                            onClick={() => toggleEmotion(emotion)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                              selectedEmotions.includes(emotion)
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {emotion}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <label className="text-sm font-medium text-gray-700">Mood</label>
                          <VoiceButton
                            type="input"
                            isListening={isEditMoodListening}
                            isSpeaking={isEditMoodSpeaking}
                            isSupported={isEditMoodSupported}
                            onStart={startEditMoodListening}
                            onStop={() => {
                              stopEditMoodListening();
                              handleEditMoodVoiceInput();
                            }}
                            onSpeak={() => speakEditMood(editForm.mood)}
                            onStopSpeaking={stopEditMoodSpeaking}
                            text={editForm.mood}
                            size="small"
                          />
                        </div>
                        <input
                          className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                          value={editForm.mood}
                          onChange={(e) => setEditForm({ ...editForm, mood: e.target.value })}
                          placeholder="How are you feeling?"
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <label className="text-sm font-medium text-gray-700">Note</label>
                          <VoiceButton
                            type="input"
                            isListening={isEditNoteListening}
                            isSpeaking={isEditNoteSpeaking}
                            isSupported={isEditNoteSupported}
                            onStart={startEditNoteListening}
                            onStop={() => {
                              stopEditNoteListening();
                              handleEditNoteVoiceInput();
                            }}
                            onSpeak={() => speakEditNote(editForm.note)}
                            onStopSpeaking={stopEditNoteSpeaking}
                            text={editForm.note}
                            size="small"
                          />
                        </div>
                        <textarea
                          className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 h-24 resize-none"
                          value={editForm.note}
                          onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                          placeholder="Share your thoughts..."
                        />
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={saveEdit} 
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg"
                        >
                          Save with AI
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={cancelEdit} 
                          className="flex-1 bg-gradient-to-r from-gray-400 to-slate-400 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode with AI Features
                  <div className="space-y-4">
                    {/* Header with AI Analysis */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 font-medium">
                          {new Date(entry.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${getMoodColor(entry.mood)} text-white`}>
                            <span className="text-base">{getMoodEmoji(entry.mood)}</span>
                            {entry.mood}
                          </span>
                          {entry.aiAnalysis && (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getAnalysisColor(entry.aiAnalysis)} text-white`}>
                              <span className="text-xs">AI:</span>
                              {entry.aiAnalysis}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <VoiceButton
                          type="output"
                          isSpeaking={isReading}
                          isSupported={isReadSupported}
                          onSpeak={() => speakEntry(`${entry.mood}. ${entry.note || ''}`)}
                          onStopSpeaking={stopReading}
                          text={`${entry.mood}. ${entry.note || ''}`}
                          size="small"
                        />
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startEdit(entry)} 
                          className="p-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg shadow-md hover:shadow-lg"
                          title="Edit with AI"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                          </svg>
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDelete(entry.id)} 
                          className="p-2 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-lg shadow-md hover:shadow-lg"
                          title="Delete entry"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                          </svg>
                        </motion.button>
                      </div>
                    </div>

                    {/* Mood Score & Emotions */}
                    <div className="flex items-center justify-between">
                      {entry.moodScore && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Score:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                              <div
                                key={star}
                                className={`w-2 h-2 rounded-full ${
                                  star <= entry.moodScore 
                                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400' 
                                    : 'bg-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{entry.moodScore}/10</span>
                        </div>
                      )}
                    </div>

                    {/* Emotions Tags */}
                    {entry.emotions && entry.emotions.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.emotions.map((emotion, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {emotion}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Note Content */}
                    {entry.note && (
                      <div className="pt-2">
                        <p className="text-gray-700 leading-relaxed bg-white/50 p-4 rounded-xl border border-white/80">
                          {entry.note}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Emergency Support Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-br from-red-50 to-pink-100 p-6 rounded-3xl border border-red-200 shadow-lg"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">🆘</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Immediate AI Support</h3>
              <p className="text-gray-600">If you need immediate mental health assistance</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => window.open('tel:1166')}
              className="bg-white border border-red-300 p-4 rounded-xl text-red-700 font-semibold hover:bg-red-50 transition-all duration-300 text-left flex items-center gap-3"
            >
              <span className="text-2xl">🗣️</span>
              <div>
                <div className="font-bold">Mental Health Helpline</div>
                <div className="text-sm text-red-600">1166</div>
              </div>
            </button>
            <button 
              onClick={() => window.open('tel:1122')}
              className="bg-white border border-red-300 p-4 rounded-xl text-red-700 font-semibold hover:bg-red-50 transition-all duration-300 text-left flex items-center gap-3"
            >
              <span className="text-2xl">🚨</span>
              <div>
                <div className="font-bold">Emergency Services</div>
                <div className="text-sm text-red-600">1122</div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}