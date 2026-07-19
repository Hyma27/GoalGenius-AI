import React, { useState, useRef, useEffect } from 'react';
import { useGemini } from '../hooks/useGemini';
import { useLanguage } from '../context/LanguageContext';
import { 
  MessageSquare, X, Send, Mic, Volume2, VolumeX, Sparkles, 
  Trash2, Maximize2, Minimize2, Check, ArrowRight, Trophy
} from 'lucide-react';

// Speech Recognition Browser API Interfaces for strict typing
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  lang: string;
  onstart: () => void;
  onerror: () => void;
  onend: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  start: () => void;
}

interface ExtendedWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const AIChatBot: React.FC = () => {
  const { language } = useLanguage();
  const { askGemini, loading } = useGemini();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('gg_chat_history');
    if (saved) return JSON.parse(saved);
    return [
      { 
        sender: 'ai', 
        text: "Hello! I am your GoalGenius AI Concierge for the FIFA World Cup 2026. I can assist with crowd delays, fastest routes, parking booking, emergency help, seat finders, or stadium weather predictions.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem('gg_chat_history', JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Web Speech API - Text to Speech
  const speakText = (text: string) => {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const localeMap: Record<string, string> = {
      en: 'en-US', es: 'es-ES', fr: 'fr-FR', pt: 'pt-BR', hi: 'hi-IN', te: 'te-IN', ar: 'ar-AE'
    };
    utterance.lang = localeMap[language] || 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  // Web Speech API - Speech to Text
  const startListening = () => {
    const extWindow = window as unknown as ExtendedWindow;
    const SpeechRecognition = extWindow.SpeechRecognition || extWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please try Chrome or Edge.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    const localeMap: Record<string, string> = {
      en: 'en-US', es: 'es-ES', fr: 'fr-FR', pt: 'pt-BR', hi: 'hi-IN', te: 'te-IN', ar: 'ar-AE'
    };
    recognition.lang = localeMap[language] || 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const resultText = event.results[0][0].transcript;
      setInputValue(resultText);
    };
    recognition.start();
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = { sender: 'user', text, time: timestamp };
    
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');

    try {
      const aiResponse = await askGemini(text, 'chat', language);
      const replyMsg: ChatMessage = { 
        sender: 'ai', 
        text: aiResponse.text, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, replyMsg]);
      speakText(aiResponse.text);
    } catch (err) {
      const errorMsg: ChatMessage = { 
        sender: 'ai', 
        text: "I encountered a network sync disruption. Please try again.", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const handleClearChat = () => {
    const defaultMsg: ChatMessage[] = [
      { 
        sender: 'ai', 
        text: "Chat cleared. Ask me anything about stadium logistics or match planner metrics.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(defaultMsg);
    localStorage.removeItem('gg_chat_history');
    window.speechSynthesis.cancel();
  };

  const suggestedQuestions = [
    { label: "Which gate has less crowd?", icon: "🏟️" },
    { label: "Show my fastest route.", icon: "🧭" },
    { label: "Find my seat.", icon: "💺" },
    { label: "Weather update.", icon: "⛅" },
    { label: "Nearest food court.", icon: "🍔" },
    { label: "Parking availability.", icon: "🚗" },
    { label: "Emergency help.", icon: "🚨" },
    { label: "Accessibility support.", icon: "♿" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen ? (
        <div 
          className={`flex flex-col overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl transition-all duration-300 ${
            isFullScreen 
              ? 'fixed inset-4 w-auto h-auto md:inset-10 z-[100]' 
              : 'w-[calc(100vw-32px)] sm:w-[420px] h-[580px] max-h-[calc(100vh-100px)]'
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors duration-300">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">GoalGenius Assistant</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">World Cup AI Concierge</p>
              </div>
            </div>
            
            {/* Header Controls */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`w-7.5 h-7.5 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400`}
                title={voiceEnabled ? "Mute replies" : "Vocalize replies"}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4 text-blue-500" /> : <VolumeX className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={handleClearChat}
                className="w-7.5 h-7.5 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button 
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="w-7.5 h-7.5 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
              >
                {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button 
                onClick={() => {
                  setIsOpen(false);
                  window.speechSynthesis.cancel();
                }}
                className="w-7.5 h-7.5 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages / Suggested grid */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-white dark:bg-slate-900 transition-colors">
            
            {/* If only welcome message is loaded, show spacious layout of suggested questions */}
            {messages.length <= 1 && (
              <div className="my-auto flex flex-col gap-4 text-center max-w-sm mx-auto p-2">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/10">
                  <Trophy className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">GoalGenius AI Console</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                  Welcome to the World Cup Copilot. Click any question below to immediately request tactical advice from our Generative AI engine.
                </p>

                {/* Suggested Questions Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-left">
                  {suggestedQuestions.map(q => (
                    <button
                      key={q.label}
                      type="button"
                      onClick={() => handleSend(q.label)}
                      className="p-3 border border-slate-100 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800/80 rounded-2xl text-[10px] font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="text-xs">{q.icon}</span>
                      <span className="truncate">{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation Feed */}
            {messages.length > 1 && (
              <div className="flex flex-col gap-4">
                {messages.map((msg, idx) => (
                  <div 
                    key={idx}
                    className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/10'
                          : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {msg.text.split('\n').map((line, lIdx) => (
                        <p key={lIdx} className={lIdx > 0 ? 'mt-1' : ''}>{line}</p>
                      ))}
                    </div>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 px-1 font-medium">{msg.time}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Typing Animation dots indicator */}
            {loading && (
              <div className="self-start flex flex-col gap-1 items-start">
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3.5 rounded-2xl rounded-bl-none flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-duration:1s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s] [animation-duration:1s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s] [animation-duration:1s]"></span>
                </div>
                <span className="text-[9px] text-slate-400 px-1 font-bold animate-pulse">Copilot writing...</span>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Suggested shortcuts shown at bottom only when conversation is active */}
          {messages.length > 1 && (
            <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none print:hidden">
              {suggestedQuestions.slice(0, 4).map(q => (
                <button
                  key={q.label}
                  onClick={() => handleSend(q.label)}
                  className="px-3 py-1.5 border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-full text-[9px] font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
                >
                  <span>{q.icon}</span>
                  <span>{q.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Footer Input */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center gap-2 transition-colors duration-300">
            <button 
              type="button"
              onClick={startListening}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800/80 shadow-sm'
              }`}
              title="Voice Input"
            >
              <Mic className="w-4 h-4" />
            </button>
            
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Message World Cup Assistant..."
              className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
            />
            
            <button 
              onClick={() => handleSend()}
              disabled={loading || !inputValue.trim()}
              className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center disabled:opacity-50 transition-colors shadow-md shadow-blue-500/10"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all border border-white/10"
        >
          <MessageSquare className="w-6 h-6 animate-pulse" />
        </button>
      )}
    </div>
  );
};
