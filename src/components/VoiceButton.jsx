import { motion } from "framer-motion";

export default function VoiceButton({ 
  isListening, 
  isSpeaking, 
  isSupported, 
  onStart, 
  onStop, 
  onSpeak, 
  onStopSpeaking,
  text = "",
  className = "",
  size = "default",
  type = "input", // 'input' or 'output'
  disabled = false
}) {
  if (!isSupported) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`text-gray-500 text-xs flex items-center gap-2 ${className}`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
        Voice not supported
      </motion.div>
    );
  }

  const buttonSize = size === "small" ? "p-2" : "p-3";
  const iconSize = size === "small" ? "w-4 h-4" : "w-5 h-5";

  // Input Voice Button (Microphone)
  if (type === "input") {
    return (
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onClick={isListening ? onStop : onStart}
        disabled={disabled || isSpeaking}
        className={`
          ${buttonSize} rounded-full transition-all duration-200 border-2
          ${isListening 
            ? 'border-red-500 bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg' 
            : disabled 
              ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'border-blue-500 bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
          }
          relative overflow-hidden
        `}
        title={isListening ? "Stop listening" : "Start voice input"}
      >
        {/* Animated waves when listening */}
        {isListening && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-full h-full bg-red-400 rounded-full opacity-20" />
          </motion.div>
        )}
        
        <svg className={`${iconSize} relative z-10`} fill="currentColor" viewBox="0 0 20 20">
          {isListening ? (
            <rect x="6" y="4" width="8" height="12" rx="1" />
          ) : (
            <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zM5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5a.75.75 0 001.5 0v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 11-9 0v-.357z" />
          )}
        </svg>
      </motion.button>
    );
  }

  // Output Voice Button (Speaker)
  if (type === "output" && text) {
    return (
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onClick={isSpeaking ? onStopSpeaking : () => onSpeak(text)}
        disabled={disabled}
        className={`
          ${buttonSize} rounded-full transition-all duration-200 border-2
          ${isSpeaking 
            ? 'border-green-500 bg-green-500 hover:bg-green-600 text-white animate-pulse shadow-lg' 
            : disabled 
              ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'border-green-500 bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
          }
          relative overflow-hidden
        `}
        title={isSpeaking ? "Stop speaking" : "Read aloud"}
      >
        {/* Animated waves when speaking */}
        {isSpeaking && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-full h-full bg-green-400 rounded-full opacity-20" />
          </motion.div>
        )}
        
        <svg className={`${iconSize} relative z-10`} fill="currentColor" viewBox="0 0 20 20">
          {isSpeaking ? (
            <rect x="4" y="4" width="12" height="12" rx="1" />
          ) : (
            <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-3.243 1 1 0 010-1.414z" />
          )}
        </svg>
      </motion.button>
    );
  }

  return null;
}