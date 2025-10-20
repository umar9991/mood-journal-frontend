import { useState, useEffect, useRef, useCallback } from 'react';

export const useVoice = (type = 'general') => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const typeRef = useRef(type);

  // Update type reference when type changes
  useEffect(() => {
    typeRef.current = type;
  }, [type]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const SpeechSynthesis = window.speechSynthesis;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false; // Changed to false for better control
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.maxAlternatives = 1;
        
        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setError(null);
          console.log(`${typeRef.current} voice recognition started`);
        };
        
        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          // Only update if we have final results
          if (finalTranscript) {
            setTranscript(prev => prev + finalTranscript + ' ');
          }
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error(`${typeRef.current} voice error:`, event.error);
          setError(`Speech recognition error: ${event.error}`);
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
          console.log(`${typeRef.current} voice recognition ended`);
          setIsListening(false);
        };
        
        setIsSupported(true);
      }
      
      if (SpeechSynthesis) {
        synthesisRef.current = SpeechSynthesis;
      } else {
        console.warn('Speech synthesis not supported');
      }
    }

    return () => {
      // Cleanup
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current && isSpeaking) {
        synthesisRef.current.cancel();
      }
    };
  }, [type, isListening, isSpeaking]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setError(null);
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting voice recognition:', error);
        setError('Failed to start voice recognition');
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping voice recognition:', error);
      }
    }
  }, [isListening]);

  const speak = useCallback((text, options = {}) => {
    if (synthesisRef.current && text) {
      // Cancel any ongoing speech
      synthesisRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        console.log(`${typeRef.current} speech started`);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        console.log(`${typeRef.current} speech ended`);
      };
      
      utterance.onerror = (event) => {
        console.error(`${typeRef.current} speech error:`, event);
        setIsSpeaking(false);
        setError(`Speech synthesis error: ${event.error}`);
      };
      
      synthesisRef.current.speak(utterance);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    isSpeaking,
    isSupported,
    transcript,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    clearTranscript
  };
};