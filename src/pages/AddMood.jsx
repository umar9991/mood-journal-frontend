import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { addMood } from "../api";
import { useVoice } from "../hooks/useVoice";
import VoiceButton from "../components/VoiceButton";

export default function AddMood() {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [moodScore, setMoodScore] = useState(5);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  
  // Separate voice instances for mood and note
  const {
    isListening: isMoodListening,
    isSpeaking: isMoodSpeaking,
    isSupported: isMoodSupported,
    transcript: moodTranscript,
    error: moodVoiceError,
    startListening: startMoodListening,
    stopListening: stopMoodListening,
    speak: speakMood,
    stopSpeaking: stopMoodSpeaking,
    clearTranscript: clearMoodTranscript
  } = useVoice('mood');

  const {
    isListening: isNoteListening,
    isSpeaking: isNoteSpeaking,
    isSupported: isNoteSupported,
    transcript: noteTranscript,
    error: noteVoiceError,
    startListening: startNoteListening,
    stopListening: stopNoteListening,
    speak: speakNote,
    stopSpeaking: stopNoteSpeaking,
    clearTranscript: clearNoteTranscript
  } = useVoice('note');

  // Real-time update of mood field when speaking
  useEffect(() => {
    if (isMoodListening && moodTranscript) {
      setMood(moodTranscript);
    }
  }, [moodTranscript, isMoodListening]);

  // Real-time update of note field when speaking
  useEffect(() => {
    if (isNoteListening && noteTranscript) {
      setNote(noteTranscript);
    }
  }, [noteTranscript, isNoteListening]);

  // AI Mood Analysis
  useEffect(() => {
    if (mood || note) {
      analyzeMoodWithAI();
    }
  }, [mood, note]);

  const analyzeMoodWithAI = () => {
    const text = `${mood} ${note}`.toLowerCase();
    
    const positiveWords = ['happy', 'good', 'great', 'excited', 'amazing', 'wonderful', 'joy', 'love', 'calm', 'peaceful'];
    const negativeWords = ['sad', 'bad', 'angry', 'upset', 'stress', 'anxious', 'worried', 'tired', 'hurt', 'pain'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (text.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (text.includes(word)) negativeCount++;
    });
    
    const score = positiveCount - negativeCount;
    let analysis = "Neutral";
    let color = "gray";
    
    if (score > 2) {
      analysis = "Very Positive";
      color = "green";
    } else if (score > 0) {
      analysis = "Positive";
      color = "blue";
    } else if (score < -2) {
      analysis = "Very Negative";
      color = "red";
    } else if (score < 0) {
      analysis = "Negative";
      color = "orange";
    }
    
    setAiAnalysis({ analysis, color, score });
  };

  const emotions = ["Happy", "Sad", "Angry", "Excited", "Calm", "Anxious", "Grateful", "Tired", "Energetic", "Peaceful"];

  const toggleEmotion = (emotion) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleSubmit = async () => {
    // Validation
    if (!mood.trim()) {
      setMessage("❌ Mood is required!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setLoading(true);
    setMessage("");
    
    // IMPORTANT: Backend ko sirf mood aur note chahiye
    const backendData = { 
      mood: mood.trim(), 
      note: note.trim()
    };
    
    console.log("📤 Sending to backend:", backendData);
    
    try {
      const res = await addMood(backendData);
      
      console.log("📥 Backend response:", res);
      
      if (res?.id && !res.error) {
        // Success
        setMessage("✅ Mood saved successfully with AI Analysis!");
        
        // Clear form
        setMood("");
        setNote("");
        setMoodScore(5);
        setSelectedEmotions([]);
        setAiAnalysis(null);
        clearMoodTranscript();
        clearNoteTranscript();
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
      } else {
        // Error from backend
        setMessage(`❌ Error: ${res.error || 'Failed to save mood'}`);
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (error) {
      console.error("❌ Submit error:", error);
      setMessage(`❌ Error: ${error.message || 'Something went wrong!'}`);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodVoiceInput = () => {
    if (moodTranscript) {
      setMood(moodTranscript);
      clearMoodTranscript();
    }
  };

  const handleNoteVoiceInput = () => {
    if (noteTranscript) {
      setNote(noteTranscript);
      clearNoteTranscript();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-4 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl mx-auto glass-card p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-xl card-hover mx-4 sm:mx-auto"
      >
        {/* AI Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            AI Mood Analysis
          </motion.h2>
          <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            AI Active
          </div>
        </motion.div>

        {/* AI Analysis Result */}
        {aiAnalysis && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-6 p-4 rounded-2xl border-l-4 bg-gradient-to-r ${
              aiAnalysis.color === 'green' ? 'from-green-50 to-emerald-50 border-green-400' :
              aiAnalysis.color === 'blue' ? 'from-blue-50 to-cyan-50 border-blue-400' :
              aiAnalysis.color === 'red' ? 'from-red-50 to-pink-50 border-red-400' :
              aiAnalysis.color === 'orange' ? 'from-orange-50 to-amber-50 border-orange-400' :
              'from-gray-50 to-slate-50 border-gray-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                aiAnalysis.color === 'green' ? 'bg-green-500' :
                aiAnalysis.color === 'blue' ? 'bg-blue-500' :
                aiAnalysis.color === 'red' ? 'bg-red-500' :
                aiAnalysis.color === 'orange' ? 'bg-orange-500' :
                'bg-gray-500'
              }`}>
                <span className="text-white text-lg">🤖</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">AI Analysis</h3>
                <p className="text-gray-600">Your mood appears to be <span className="font-semibold">{aiAnalysis.analysis}</span></p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Voice Error Display */}
        {(moodVoiceError || noteVoiceError) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-100 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm border-l-4 border-red-500"
          >
            {moodVoiceError || noteVoiceError}
          </motion.div>
        )}

        {/* Mood Score */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <label className="text-lg font-semibold text-gray-800 mb-4 block">
            Mood Score: {moodScore}/10
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
              <motion.button
                key={star}
                type="button"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMoodScore(star)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 ${
                  star <= moodScore 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            💡 Rate your mood from 1 (very low) to 10 (very high)
          </p>
        </motion.div>

        {/* Emotions Selector */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <label className="text-lg font-semibold text-gray-800 mb-4 block">
            Select Emotions {selectedEmotions.length > 0 && `(${selectedEmotions.length} selected)`}
          </label>
          <div className="flex flex-wrap gap-2">
            {emotions.map((emotion) => (
              <motion.button
                key={emotion}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleEmotion(emotion)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedEmotions.includes(emotion)
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {emotion}
                {selectedEmotions.includes(emotion) && ' ✓'}
              </motion.button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            💡 Select emotions that describe your current feeling
          </p>
        </motion.div>

        {/* Mood Input with Voice */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <label className="text-lg font-semibold text-gray-800">Mood Description *</label>
            <div className="flex gap-2">
              <VoiceButton
                type="input"
                isListening={isMoodListening}
                isSpeaking={isMoodSpeaking}
                isSupported={isMoodSupported}
                onStart={startMoodListening}
                onStop={() => {
                  stopMoodListening();
                  handleMoodVoiceInput();
                }}
                onSpeak={() => speakMood(mood)}
                onStopSpeaking={stopMoodSpeaking}
                text={mood}
                size="small"
              />
              {mood && (
                <VoiceButton
                  type="output"
                  isSpeaking={isMoodSpeaking}
                  isSupported={isMoodSupported}
                  onSpeak={() => speakMood(mood)}
                  onStopSpeaking={stopMoodSpeaking}
                  text={mood}
                  size="small"
                />
              )}
            </div>
          </div>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            placeholder="How are you feeling? (e.g., Happy, Sad, Calm)"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="input-enhanced w-full px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            required
          />
          {isMoodListening && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 flex items-center gap-2 text-sm text-blue-600"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              🎤 AI is listening... Speak now
            </motion.div>
          )}
        </motion.div>

        {/* Note Input with Voice */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <label className="text-lg font-semibold text-gray-800">Detailed Notes</label>
            <div className="flex gap-2">
              <VoiceButton
                type="input"
                isListening={isNoteListening}
                isSpeaking={isNoteSpeaking}
                isSupported={isNoteSupported}
                onStart={startNoteListening}
                onStop={() => {
                  stopNoteListening();
                  handleNoteVoiceInput();
                }}
                onSpeak={() => speakNote(note)}
                onStopSpeaking={stopNoteSpeaking}
                text={note}
                size="small"
              />
              {note && (
                <VoiceButton
                  type="output"
                  isSpeaking={isNoteSpeaking}
                  isSupported={isNoteSupported}
                  onSpeak={() => speakNote(note)}
                  onStopSpeaking={stopNoteSpeaking}
                  text={note}
                  size="small"
                />
              )}
            </div>
          </div>
          <motion.textarea
            whileFocus={{ scale: 1.02 }}
            placeholder="Write a detailed note about your feeling..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="input-enhanced w-full px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg h-24 sm:h-32 resize-none border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
          />
          {isNoteListening && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 flex items-center gap-2 text-sm text-purple-600"
            >
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              🎤 AI is listening... Speak now
            </motion.div>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: loading || isMoodListening || isNoteListening ? 1 : 1.02, y: loading || isMoodListening || isNoteListening ? 0 : -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={loading || isMoodListening || isNoteListening || !mood.trim()}
          className={`w-full py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transform-3d bg-gradient-to-r from-indigo-600 to-purple-600 text-white transition-all ${
            loading || isMoodListening || isNoteListening || !mood.trim() ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving with AI...
              </>
            ) : isMoodListening || isNoteListening ? (
              <>
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                AI Listening...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Save with AI Analysis
              </>
            )}
          </span>
        </motion.button>

        {/* Success/Error Message */}
        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mt-6 p-4 rounded-xl text-center font-medium ${
              message.includes('✅') 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
            }`}
          >
            {message}
          </motion.div>
        )}

        {/* Emergency Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-gradient-to-br from-red-50 to-pink-100 p-6 rounded-2xl border border-red-200 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🆘</span>
            </div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Immediate Support
            </h3>
          </div>
          <p className="text-gray-700 mb-4">If you're feeling overwhelmed or in crisis:</p>
          <div className="space-y-2">
            <button 
              type="button"
              onClick={() => window.open('tel:1166')}
              className="w-full bg-white border border-red-300 p-3 rounded-xl text-red-700 font-semibold hover:bg-red-50 transition-all duration-300 text-left"
            >
              🗣️ Mental Health Helpline: 1166
            </button>
            <button 
              type="button"
              onClick={() => window.open('tel:1122')}
              className="w-full bg-white border border-red-300 p-3 rounded-xl text-red-700 font-semibold hover:bg-red-50 transition-all duration-300 text-left"
            >
              🚨 Emergency Services: 1122
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}