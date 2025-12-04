import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Mic, Send, Camera, FileText, Search, 
  Clipboard, HelpCircle, X, CheckCircle, AlertTriangle,
  Scan, Ruler, FileCheck, Tag, Sparkles, Volume2, Pause, Play
} from 'lucide-react';

// ============ DESIGN TOKENS ============
const tokens = {
  colors: {
    bgPrimary: '#0a0f1a',
    bgSecondary: '#141e30',
    bgTertiary: '#1a2540',
    glassLight: 'rgba(255, 255, 255, 0.05)',
    glassMedium: 'rgba(255, 255, 255, 0.08)',
    glassHeavy: 'rgba(255, 255, 255, 0.12)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    accentPrimary: '#00D9C0',
    accentPrimaryGlow: 'rgba(0, 217, 192, 0.4)',
    accentSecondary: '#FF6B6B',
    accentTertiary: '#A78BFA',
    accentSuccess: '#10B981',
    accentWarning: '#F59E0B',
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    textTertiary: 'rgba(255, 255, 255, 0.5)',
    aiBubbleBg: 'rgba(0, 217, 192, 0.08)',
    userBubbleBg: 'rgba(255, 255, 255, 0.1)',
  }
};

// ============ AI ORB COMPONENT ============
const AIOrb = ({ state = 'idle', size = 80 }) => {
  // States: idle, listening, processing, success, error
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer glow rings */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${tokens.colors.accentPrimaryGlow} 0%, transparent 70%)`,
        }}
        animate={state === 'idle' ? {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        } : state === 'listening' ? {
          scale: [1, 1.4, 1],
          opacity: [0.4, 0.7, 0.4],
        } : {
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{ duration: state === 'listening' ? 1 : 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Orbital particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[4px] h-[4px] rounded-full"
          style={{
            background: tokens.colors.accentPrimary,
            left: '50%',
            top: '50%',
            boxShadow: `0 0 8px ${tokens.colors.accentPrimary}`,
          }}
          animate={{
            x: [
              Math.cos((i / 6) * Math.PI * 2) * (size * 0.5),
              Math.cos((i / 6) * Math.PI * 2 + Math.PI) * (size * 0.5),
              Math.cos((i / 6) * Math.PI * 2) * (size * 0.5),
            ],
            y: [
              Math.sin((i / 6) * Math.PI * 2) * (size * 0.5),
              Math.sin((i / 6) * Math.PI * 2 + Math.PI) * (size * 0.5),
              Math.sin((i / 6) * Math.PI * 2) * (size * 0.5),
            ],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ duration: 8 + i, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      
      {/* Middle ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: size * 0.15,
          border: `2px solid ${tokens.colors.accentPrimary}40`,
          boxShadow: `inset 0 0 20px ${tokens.colors.accentPrimary}20`,
        }}
        animate={state === 'processing' ? { rotate: 360 } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Inner orb */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: size * 0.25,
          background: `radial-gradient(circle at 30% 30%, ${tokens.colors.accentPrimary} 0%, #00897B 50%, #004D40 100%)`,
          boxShadow: `
            0 0 30px ${tokens.colors.accentPrimaryGlow},
            inset 0 0 20px rgba(255,255,255,0.2)
          `,
        }}
        animate={{
          scale: state === 'idle' ? [1, 1.05, 1] : state === 'listening' ? [1, 1.1, 1] : [1, 1.02, 1],
        }}
        transition={{ duration: state === 'listening' ? 0.5 : 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Core highlight */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: size * 0.35,
          background: `radial-gradient(circle at 40% 40%, rgba(255,255,255,0.8) 0%, rgba(0,217,192,0.6) 50%, transparent 70%)`,
        }}
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Sparkle icon in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Sparkles className="w-[24px] h-[24px] text-white/80" />
      </div>
    </div>
  );
};

// ============ WAVEFORM VISUALIZER ============
const WaveformVisualizer = ({ isActive }) => {
  const bars = 24;
  
  return (
    <div className="flex items-center justify-center gap-[3px] h-[60px]">
      {[...Array(bars)].map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full"
          style={{
            background: `linear-gradient(to top, ${tokens.colors.accentPrimary}, ${tokens.colors.accentPrimary}80)`,
            boxShadow: `0 0 8px ${tokens.colors.accentPrimary}60`,
          }}
          animate={isActive ? {
            height: [
              10 + Math.random() * 20,
              20 + Math.random() * 40,
              10 + Math.random() * 20,
            ],
          } : { height: 4 }}
          transition={{
            duration: 0.3 + Math.random() * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// ============ TYPEWRITER TEXT ============
const TypewriterText = ({ text, speed = 30, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    if (!text) return;
    setDisplayedText('');
    setIsComplete(false);
    
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [text, speed]);
  
  return (
    <span>
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-[2px] h-[1em] bg-current ml-[2px]"
        />
      )}
    </span>
  );
};

// ============ QUICK ACTION PILL ============
const QuickActionPill = ({ icon: Icon, label, color, onClick }) => (
  <motion.button
    className="flex flex-col items-center gap-[8px] p-[16px] rounded-[16px] min-w-[80px]"
    style={{
      background: tokens.colors.glassMedium,
      backdropFilter: 'blur(20px)',
      border: `1px solid ${tokens.colors.glassBorder}`,
    }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    <div 
      className="w-[44px] h-[44px] rounded-full flex items-center justify-center"
      style={{ 
        background: `${color}20`,
        boxShadow: `0 0 20px ${color}30`,
      }}
    >
      <Icon className="w-[22px] h-[22px]" style={{ color }} />
    </div>
    <span className="font-['Inter'] font-medium text-[11px] text-white/70">
      {label}
    </span>
  </motion.button>
);

// ============ SUGGESTED PROMPT CHIP ============
const SuggestedPromptChip = ({ text, delay, onClick }) => (
  <motion.button
    className="px-[16px] py-[10px] rounded-full text-left"
    style={{
      background: tokens.colors.glassLight,
      backdropFilter: 'blur(12px)',
      border: `1px solid ${tokens.colors.glassBorder}`,
    }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1, duration: 0.3 }}
    whileTap={{ scale: 0.98, boxShadow: `0 0 20px ${tokens.colors.accentPrimaryGlow}` }}
    onClick={onClick}
  >
    <span className="font-['Inter'] text-[13px] text-white/80">"{text}"</span>
  </motion.button>
);

// ============ MESSAGE BUBBLE ============
const MessageBubble = ({ message, isUser, isTyping }) => (
  <motion.div
    className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-[16px]`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div 
      className={`max-w-[85%] p-[14px] rounded-[16px] ${isUser ? 'rounded-br-[4px]' : 'rounded-bl-[4px]'}`}
      style={{
        background: isUser ? tokens.colors.userBubbleBg : tokens.colors.aiBubbleBg,
        backdropFilter: 'blur(12px)',
        border: `1px solid ${isUser ? 'rgba(255,255,255,0.1)' : 'rgba(0,217,192,0.2)'}`,
      }}
    >
      {!isUser && (
        <div className="flex items-center gap-[8px] mb-[8px]">
          <div 
            className="w-[20px] h-[20px] rounded-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${tokens.colors.accentPrimary}, #00897B)` }}
          >
            <Sparkles className="w-[12px] h-[12px] text-white" />
          </div>
          <span className="font-['Inter'] font-medium text-[11px]" style={{ color: tokens.colors.accentPrimary }}>
            Zuper AI
          </span>
        </div>
      )}
      <p className="font-['Inter'] text-[14px] leading-[1.6]" style={{ color: tokens.colors.textPrimary }}>
        {isTyping ? <TypewriterText text={message} /> : message}
      </p>
    </div>
  </motion.div>
);

// ============ AI FEATURE CARD ============
const AIFeatureCard = ({ icon: Icon, title, subtitle, color, delay }) => (
  <motion.button
    className="w-full p-[16px] rounded-[16px] flex items-center gap-[14px] text-left"
    style={{
      background: tokens.colors.glassMedium,
      backdropFilter: 'blur(20px)',
      border: `1px solid ${tokens.colors.glassBorder}`,
    }}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: delay * 0.1 }}
    whileTap={{ scale: 0.98 }}
  >
    <div 
      className="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center shrink-0"
      style={{ 
        background: `${color}15`,
        boxShadow: `0 0 20px ${color}20`,
      }}
    >
      <Icon className="w-[24px] h-[24px]" style={{ color }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-['Inter'] font-semibold text-[15px] text-white mb-[2px]">{title}</p>
      <p className="font-['Inter'] text-[12px] text-white/50">{subtitle}</p>
    </div>
    <ChevronLeft className="w-[20px] h-[20px] text-white/30 rotate-180" />
  </motion.button>
);

// ============ VOICE INPUT OVERLAY ============
const VoiceInputOverlay = ({ isOpen, onClose, onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      setIsRecording(true);
      // Simulate transcription
      const phrases = [
        "I see some",
        "I see some cracked shingles",
        "I see some cracked shingles on the north side",
        "I see some cracked shingles on the north side near the chimney...",
      ];
      let i = 0;
      const timer = setInterval(() => {
        if (i < phrases.length) {
          setTranscription(phrases[i]);
          i++;
        }
      }, 1500);
      return () => clearInterval(timer);
    } else {
      setIsRecording(false);
      setTranscription('');
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      className="absolute inset-0 z-[100] flex flex-col"
      style={{
        background: `linear-gradient(180deg, ${tokens.colors.bgPrimary} 0%, ${tokens.colors.bgSecondary} 100%)`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-[20px]">
        <motion.button
          className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
          style={{ background: tokens.colors.glassLight }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
        >
          <X className="w-[20px] h-[20px] text-white/70" />
        </motion.button>
        <span className="font-['Inter'] font-medium text-[15px] text-white">Voice Input</span>
        <div className="w-[40px]" />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-[24px]">
        {/* Expanded Orb / Waveform */}
        <div className="relative mb-[32px]">
          <motion.div
            className="absolute inset-[-40px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${tokens.colors.accentPrimaryGlow} 0%, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <WaveformVisualizer isActive={isRecording} />
        </div>
        
        {/* Status */}
        <motion.p
          className="font-['Inter'] font-medium text-[18px] mb-[24px]"
          style={{ color: tokens.colors.accentPrimary }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {isRecording ? 'Listening...' : 'Tap to start'}
        </motion.p>
        
        {/* Live Transcription */}
        <div 
          className="w-full max-w-[300px] min-h-[80px] p-[16px] rounded-[16px] text-center"
          style={{
            background: tokens.colors.glassLight,
            border: `1px solid ${tokens.colors.glassBorder}`,
          }}
        >
          <p className="font-['Inter'] text-[15px] leading-[1.6] text-white/80">
            {transcription || 'Your words will appear here...'}
          </p>
        </div>
      </div>
      
      {/* Bottom Actions */}
      <div className="p-[24px] pb-[40px] flex flex-col items-center gap-[16px]">
        <motion.button
          className="px-[32px] py-[14px] rounded-full"
          style={{
            background: `linear-gradient(135deg, ${tokens.colors.accentPrimary} 0%, #00897B 100%)`,
            boxShadow: `0 8px 32px ${tokens.colors.accentPrimaryGlow}`,
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            onComplete?.(transcription);
            onClose();
          }}
        >
          <span className="font-['Inter'] font-semibold text-[15px] text-white">Done</span>
        </motion.button>
        
        <button 
          className="font-['Inter'] text-[14px] text-white/50"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};

// ============ MAIN AI ASSISTANT PAGE ============
export const AIAssistantPage = ({ isDark = true, onBack, userName = 'Sparky' }) => {
  const [view, setView] = useState('home'); // home, conversation
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [orbState, setOrbState] = useState('idle');
  const inputRef = useRef(null);
  const audioPlayedRef = useRef(false);
  
  // Play bot.mp3 sound on page open
  useEffect(() => {
    if (!audioPlayedRef.current) {
      const audio = new Audio('/assets/bot.mp3');
      audio.volume = 0.5;
      audio.play().catch(err => console.log('Audio play prevented:', err));
      audioPlayedRef.current = true;
    }
  }, []);
  
  const quickActions = [
    { icon: Scan, label: 'Scan\nDamage', color: tokens.colors.accentPrimary },
    { icon: Mic, label: 'Voice\nNotes', color: tokens.colors.accentSuccess },
    { icon: Clipboard, label: 'Report\nGen', color: tokens.colors.accentTertiary },
    { icon: Camera, label: 'Photo\nAssist', color: tokens.colors.accentSecondary },
  ];
  
  const suggestedPrompts = [
    "Scan this roof for damage",
    "Generate inspection report",
    "What material is this?",
    "Estimate repair cost",
  ];
  
  const aiFeatures = [
    { icon: Scan, title: 'Damage Detection', subtitle: 'Real-time roof analysis', color: tokens.colors.accentPrimary },
    { icon: Ruler, title: 'Smart Measurements', subtitle: 'Pitch, area & dimensions', color: tokens.colors.accentWarning },
    { icon: FileCheck, title: 'Report Generator', subtitle: 'Auto-create inspections', color: tokens.colors.accentTertiary },
    { icon: Tag, title: 'Material Identifier', subtitle: 'Shingle type & warranty', color: tokens.colors.accentSecondary },
  ];
  
  const handleSendMessage = (text) => {
    if (!text.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { text, isUser: true }]);
    setInputText('');
    setView('conversation');
    setIsProcessing(true);
    setOrbState('processing');
    
    // Simulate AI response
    setTimeout(() => {
      setIsProcessing(false);
      setOrbState('idle');
      setMessages(prev => [...prev, {
        text: "I'm analyzing your request. Based on the current inspection data, I can see there are several areas that need attention. Would you like me to generate a detailed report?",
        isUser: false,
        isTyping: true,
      }]);
    }, 2000);
  };
  
  const handleVoiceComplete = (transcription) => {
    if (transcription) {
      handleSendMessage(transcription);
    }
  };
  
  return (
    <div 
      className="flex flex-col w-full h-full overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${tokens.colors.bgPrimary} 0%, ${tokens.colors.bgSecondary} 50%, ${tokens.colors.bgTertiary} 100%)`,
      }}
    >
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Header */}
      <div className="flex items-center justify-between p-[16px] pt-[12px] relative z-10">
        <motion.button
          className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
          style={{
            background: tokens.colors.glassLight,
            backdropFilter: 'blur(12px)',
            border: `1px solid ${tokens.colors.glassBorder}`,
          }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
        >
          <ChevronLeft className="w-[22px] h-[22px] text-white/70" />
        </motion.button>
        
        <span className="font-['Inter'] font-semibold text-[16px] text-white">
          {view === 'home' ? 'AI Assistant' : 'Roof Inspection AI'}
        </span>
        
        <motion.button
          className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
          style={{
            background: tokens.colors.glassLight,
            backdropFilter: 'blur(12px)',
            border: `1px solid ${tokens.colors.glassBorder}`,
          }}
          whileTap={{ scale: 0.9 }}
        >
          <HelpCircle className="w-[20px] h-[20px] text-white/70" />
        </motion.button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-[20px] relative z-10">
        <AnimatePresence mode="wait">
          {view === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center pt-[20px] pb-[120px]"
            >
              {/* AI Orb */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', duration: 0.8 }}
                className="mb-[24px]"
              >
                <AIOrb state={orbState} size={100} />
              </motion.div>
              
              {/* Greeting */}
              <motion.h2
                className="font-['Space_Grotesk'] font-bold text-[22px] text-white text-center mb-[8px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <TypewriterText text={`Hey ${userName}, how can I help?`} speed={40} />
              </motion.h2>
              
              <motion.p
                className="font-['Inter'] text-[14px] text-white/50 text-center mb-[32px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                Your AI-powered inspection assistant
              </motion.p>
              
              {/* Quick Actions */}
              <motion.div
                className="flex gap-[12px] mb-[28px] overflow-x-auto no-scrollbar w-full justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {quickActions.map((action, i) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    <QuickActionPill
                      icon={action.icon}
                      label={action.label}
                      color={action.color}
                      onClick={() => {
                        if (action.label.includes('Voice')) {
                          setShowVoiceInput(true);
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Suggested Prompts */}
              <div className="w-full mb-[28px]">
                <p className="font-['Inter'] text-[12px] text-white/40 uppercase tracking-wider mb-[12px]">
                  Suggested
                </p>
                <div className="flex flex-col gap-[10px]">
                  {suggestedPrompts.map((prompt, i) => (
                    <SuggestedPromptChip
                      key={prompt}
                      text={prompt}
                      delay={i + 8}
                      onClick={() => handleSendMessage(prompt)}
                    />
                  ))}
                </div>
              </div>
              
              {/* AI Features */}
              <div className="w-full">
                <p className="font-['Inter'] text-[12px] text-white/40 uppercase tracking-wider mb-[12px]">
                  AI Capabilities
                </p>
                <div className="flex flex-col gap-[10px]">
                  {aiFeatures.map((feature, i) => (
                    <AIFeatureCard
                      key={feature.title}
                      icon={feature.icon}
                      title={feature.title}
                      subtitle={feature.subtitle}
                      color={feature.color}
                      delay={i + 12}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="conversation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col pt-[10px] pb-[120px]"
            >
              {/* Messages */}
              {messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  message={msg.text}
                  isUser={msg.isUser}
                  isTyping={msg.isTyping}
                />
              ))}
              
              {/* Processing indicator */}
              {isProcessing && (
                <motion.div
                  className="flex items-start gap-[12px] mb-[16px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AIOrb state="processing" size={36} />
                  <div 
                    className="flex-1 p-[14px] rounded-[16px] rounded-bl-[4px]"
                    style={{
                      background: tokens.colors.aiBubbleBg,
                      border: `1px solid rgba(0,217,192,0.2)`,
                    }}
                  >
                    <div className="flex items-center gap-[8px]">
                      <motion.div
                        className="flex gap-[4px]"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="w-[6px] h-[6px] rounded-full"
                            style={{ background: tokens.colors.accentPrimary }}
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </motion.div>
                      <span className="font-['Inter'] text-[13px] text-white/50">
                        Analyzing...
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Input Bar */}
      <div 
        className="absolute bottom-[70px] left-0 right-0 p-[16px] z-20"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${tokens.colors.bgPrimary} 30%)`,
        }}
      >
        <div 
          className="flex items-center gap-[12px] p-[12px] rounded-[24px]"
          style={{
            background: tokens.colors.glassMedium,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${tokens.colors.glassBorder}`,
            boxShadow: inputText ? `0 0 20px ${tokens.colors.accentPrimaryGlow}` : 'none',
          }}
        >
          <motion.button
            className="w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0"
            style={{
              background: `linear-gradient(135deg, ${tokens.colors.accentPrimary}30 0%, ${tokens.colors.accentPrimary}10 100%)`,
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowVoiceInput(true)}
          >
            <Mic className="w-[20px] h-[20px]" style={{ color: tokens.colors.accentPrimary }} />
          </motion.button>
          
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent outline-none font-['Inter'] text-[15px] text-white placeholder:text-white/40"
          />
          
          <AnimatePresence>
            {inputText && (
              <motion.button
                className="w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${tokens.colors.accentPrimary} 0%, #00897B 100%)`,
                  boxShadow: `0 4px 16px ${tokens.colors.accentPrimaryGlow}`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSendMessage(inputText)}
              >
                <Send className="w-[18px] h-[18px] text-white" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Voice Input Overlay */}
      <AnimatePresence>
        {showVoiceInput && (
          <VoiceInputOverlay
            isOpen={showVoiceInput}
            onClose={() => setShowVoiceInput(false)}
            onComplete={handleVoiceComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAssistantPage;

