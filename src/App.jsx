import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useScroll } from "framer-motion";
import { GlassStripes } from "./components/GlassStripes";
import { HomeIcon, PhotoIcon, MapIcon, CameraIcon, NotesIcon, PlusIcon, SignalIcon, WifiIcon, BatteryIcon, GlassTabIcon } from "./components/Icons";
import { WeatherGreeting } from "./components/WeatherGreeting";
import { GalleryPage } from "./components/GalleryPage";
import { NotesPage } from "./components/NotesPage";
import { CameraScreen } from "./components/CameraScreen";
import { GlassConnectedCard } from "./components/GlassConnectedCard";
import { GlassPage, SmartGlassGuide } from "./components/GlassPage";
import { LoginScreen } from "./components/LoginScreen";
import SplashScreen from "./components/SplashScreen";

// Image assets - exact paths from Figma
const imgAvatar = "/assets/avatar-bharath.jpg";
const imgZuperGlass3D = "/assets/figma-assets/53e21fb6e222f80de484c9b4b8999bebc76a4c42.png";
const imgBgGradient11 = "/assets/figma-assets/c981ab361f25b8d4e19fe2d86ab4d2de64ca98b2.png";
const imgImage16 = "/assets/figma-assets/34ec689824bb1f3baf1e3cfed0b521eec69312d1.png";
const imgChatGptImageDec22025031709Pm1 = "/assets/figma-assets/60ac114c3163fd014484a655fafb94ea6b9698b1.png";
const imgBgGradient31 = "/assets/figma-assets/518ea5f540c8b1953ba51d5be087b29824251199.png";
const imgImage17 = "/assets/figma-assets/d12f7e0f6eb460265b9374ea282b555bd03c4674.png";
const imgImage10 = "/assets/figma-assets/64b73b466d548697ffb4d38338a8280adcdb2dd9.png";
const imgArrowIcon = "/assets/figma-assets/f62810957dcec92cab33254f516bcd2e6e8b3eba.svg";
const imgZuperLogo = "/assets/zuper-logo-new.svg";

// Action Button Colors - Theme-aware styles
// Dark mode: Vibrant colors with glow effects
// Light mode: Clean, subtle colors without neon effects
const actionButtonStyles = {
  New: {
    colorDark: '#0ea5e9',
    colorLight: '#0284c7', // Slightly darker for better contrast
    tintLight: 'rgba(14, 165, 233, 0.06)',
    tintDark: 'rgba(14, 165, 233, 0.15)',
  },
  Maps: {
    colorDark: '#10b981',
    colorLight: '#059669', // Slightly darker for better contrast
    tintLight: 'rgba(16, 185, 129, 0.06)',
    tintDark: 'rgba(16, 185, 129, 0.15)',
  },
  Camera: {
    colorDark: '#f43f5e',
    colorLight: '#dc2626', // Slightly darker for better contrast
    tintLight: 'rgba(244, 63, 94, 0.06)',
    tintDark: 'rgba(244, 63, 94, 0.15)',
  },
  Notes: {
    colorDark: '#8b5cf6',
    colorLight: '#7c3aed', // Slightly darker for better contrast
    tintLight: 'rgba(139, 92, 246, 0.06)',
    tintDark: 'rgba(139, 92, 246, 0.15)',
  },
};

// Action Button - Clean glass style, no neon effects in light mode
const ActionButton = ({ icon: IconComponent, label, delay = 0, isDark = false, onClick }) => {
  const style = actionButtonStyles[label] || actionButtonStyles.New;
  const iconColor = isDark ? style.colorDark : style.colorLight;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay * 0.08, duration: 0.5, type: "spring", stiffness: 200 }}
      className="flex flex-col gap-[8px] items-center"
    >
      <motion.button
        className="relative w-[56px] h-[56px] rounded-[16px] flex items-center justify-center cursor-pointer overflow-hidden"
        style={{
          background: isDark 
            ? `linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.7) 100%)`
            : `linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: isDark 
            ? `1px solid ${style.tintDark}`
            : `1px solid rgba(0, 0, 0, 0.06)`,
          // Light mode: Clean subtle shadow, no glow
          // Dark mode: Keep the atmospheric shadows
          boxShadow: isDark 
            ? `0 8px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
            : `0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)`
        }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        aria-label={label}
        onClick={onClick}
      >
        {/* Colored tint overlay - subtle in light mode */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-[16px]"
          style={{
            background: isDark
              ? `radial-gradient(circle at 50% 0%, ${style.tintDark} 0%, transparent 70%)`
              : `radial-gradient(circle at 50% 100%, ${style.tintLight} 0%, transparent 60%)`
          }}
        />
        
        {/* Glass shine - stronger in light mode for depth */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-[16px]"
          style={{
            background: isDark
              ? 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 40%)'
              : 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 50%, transparent 100%)'
          }}
        />
        
        {/* Icon - no drop shadow in light mode for cleaner look */}
        <IconComponent 
          className="relative z-10 w-[24px] h-[24px]" 
          style={{ 
            color: iconColor,
            strokeWidth: 1.75,
            filter: isDark ? `drop-shadow(0 2px 4px ${iconColor}40)` : 'none'
          }} 
        />
      </motion.button>
      
      <span 
        className="text-[11px] font-semibold leading-[1.2] tracking-[0.2px] text-center font-['Inter',sans-serif] transition-colors duration-300"
        style={{ color: isDark ? '#cbd5e1' : '#475569' }}
      >
        {label}
      </span>
    </motion.div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true); // Show splash screen first
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [activePage, setActivePage] = useState('home'); // 'home' | 'gallery' | 'glass' | 'guide' | 'notes'
  const [showCameraScreen, setShowCameraScreen] = useState(false);
  const [isGlassConnected, setIsGlassConnected] = useState(false);
  const [glassInfo, setGlassInfo] = useState({
    deviceName: "Sparky's Smart Glass",
    deviceId: "W610_CDDB",
    batteryLevel: 80,
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleConnectGlass = () => {
    // Play connected sound
    const connectedSound = new Audio('/assets/connected.wav');
    connectedSound.volume = 0.6;
    connectedSound.play().catch(err => console.log('Audio play failed:', err));
    
    // Simulate connection
    setIsGlassConnected(true);
  };

  const handleDisconnectGlass = () => {
    // Play disconnected sound
    const disconnectedSound = new Audio('/assets/disconnected.wav');
    disconnectedSound.volume = 0.6;
    disconnectedSound.play().catch(err => console.log('Audio play failed:', err));
    
    setIsGlassConnected(false);
  };

  const handleCameraCapture = (captureData) => {
    console.log('Photo captured:', captureData);
    // Handle the captured photo here
  };
  
  // Theme colors
  // Light mode accent: Rich Sky Blue (#0284c7) - vibrant and professional
  // Dark mode accent: Purple (#8558F2)
  const lightAccent = '#0284c7';  // sky-600 - rich, vibrant blue
  const lightAccentLight = '#0ea5e9';  // sky-500 - lighter variant
  
  const theme = {
    // Backgrounds - ALWAYS dark outside the phone for better focus
    pageBg: `radial-gradient(ellipse 100% 80% at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
       radial-gradient(ellipse 80% 60% at 80% 50%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
       radial-gradient(ellipse 60% 80% at 20% 80%, rgba(6, 182, 212, 0.12) 0%, transparent 50%),
       linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`,
    // Phone internal background - theme aware
    phoneBg: isDarkMode
      ? 'linear-gradient(180deg, #1e293b 0%, #0f172a 30%, #020617 60%, #0f172a 100%)'
      : 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 30%, #F1F5F9 60%, #F8FAFC 100%)',
    // Phone shadow - enhanced for light mode on dark background
    phoneShadow: isDarkMode
      ? `0 50px 100px -20px rgba(0, 0, 0, 0.5),
         0 30px 60px -15px rgba(0, 0, 0, 0.4),
         0 0 0 1px rgba(255, 255, 255, 0.05),
         inset 0 1px 0 rgba(255, 255, 255, 0.1)`
      : `0 50px 100px -20px rgba(0, 0, 0, 0.4),
         0 30px 60px -15px rgba(0, 0, 0, 0.3),
         0 0 0 1px rgba(255, 255, 255, 0.1),
         0 0 80px rgba(255, 255, 255, 0.1),
         inset 0 1px 0 rgba(255, 255, 255, 0.9)`,
    // Phone border - subtle glow for light mode
    phoneBorder: isDarkMode ? '8px solid rgba(255, 255, 255, 0.05)' : '8px solid rgba(255, 255, 255, 0.15)',
    // Text colors - WCAG AA compliant (4.5:1 contrast ratio minimum)
    textPrimary: isDarkMode ? '#f8fafc' : '#1e293b',      // Main text - high contrast
    textSecondary: isDarkMode ? '#cbd5e1' : '#334155',    // Secondary - still readable (slate-700)
    textMuted: isDarkMode ? '#94a3b8' : '#475569',        // Muted - minimum AA compliant (slate-600)
    textDescription: isDarkMode ? '#94a3b8' : '#475569',  // Description text - accessible
    // Status bar
    statusBarText: isDarkMode ? '#f8fafc' : '#1e293b',
    // Header
    headerBg: isDarkMode 
      ? 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(15,23,42,0.9) 70%, transparent 100%)'
      : 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 70%, transparent 100%)',
    // Tab bar
    tabBarBg: isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)',
    tabBarBorder: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
    tabBarText: isDarkMode ? '#e2e8f0' : '#475569',
    tabBarActiveBg: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(2, 132, 199, 0.1)',
    // Action button labels
    actionLabel: isDarkMode ? '#e2e8f0' : '#374151',
    // Accent colors - Purple for dark, Rich Sky Blue for light
    accent: isDarkMode ? '#8558F2' : lightAccent,
    accentLight: isDarkMode ? '#a78bfa' : lightAccentLight,
    // AI Button
    aiAccent: isDarkMode ? '#8558F2' : lightAccent,
    aiAccentLight: isDarkMode ? 'rgba(133, 88, 242, 0.4)' : 'rgba(2, 132, 199, 0.3)',
    aiAccentGlow: isDarkMode ? 'rgba(133, 88, 242, 0.15)' : 'rgba(2, 132, 199, 0.1)',
  };
  
  return (
    <motion.div 
      className="min-h-screen w-full flex justify-center font-['Inter',sans-serif] overflow-hidden relative"
      animate={{ background: theme.pageBg }}
      transition={{ duration: 0.5 }}
      style={{ background: theme.pageBg }}
    >
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, background: theme.phoneBg }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[393px] h-[852px] sm:rounded-[48px] sm:my-8 overflow-hidden"
        style={{
          background: theme.phoneBg,
          boxShadow: theme.phoneShadow,
          border: theme.phoneBorder
        }}
      >
        {/* Splash Screen - Shows first on app launch */}
        <AnimatePresence>
          {showSplash && (
            <SplashScreen onComplete={handleSplashComplete} />
          )}
        </AnimatePresence>

        {/* Login Screen - Shows after splash, before main app (always dark mode) */}
        <AnimatePresence>
          {!showSplash && !isLoggedIn && (
            <LoginScreen onComplete={() => setIsLoggedIn(true)} isDark={true} />
          )}
        </AnimatePresence>

        {/* Main App Content - Only show when logged in and splash is done */}
        {isLoggedIn && !showSplash && (
          <>
        {/* Status Bar */}
        <div className="absolute z-50 flex gap-[154px] items-center justify-center left-0 top-0 w-[393px] pb-[19px] pt-[21px] px-[16px]">
          <div className="basis-0 grow flex gap-[10px] items-center justify-center h-[22px] pt-[2px]">
            <motion.p 
              className="font-['SF_Pro',-apple-system,sans-serif] font-semibold text-[17px] leading-[22px] text-center transition-colors duration-300" 
              style={{ fontWeight: 590, color: theme.statusBarText }}
            >
              9:41
            </motion.p>
          </div>
          <div className="basis-0 grow flex gap-[7px] items-center justify-center h-[22px] pt-px">
            <SignalIcon className="w-[19.2px] h-[12.226px] transition-colors duration-300" style={{ color: theme.statusBarText }} />
            <WifiIcon className="w-[17.142px] h-[12.328px] transition-colors duration-300" style={{ color: theme.statusBarText }} />
            <BatteryIcon className="w-[27.328px] h-[13px] transition-colors duration-300" style={{ color: theme.statusBarText }} />
          </div>
        </div>

        {/* Header - Integrated with App Theme */}
        <motion.div 
          className="absolute z-40 left-0 top-[59px] w-[393px] px-[24px] pb-[4px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between">
            {/* Left: Logo + App Name */}
            <div className="flex items-center gap-[10px]">
              <motion.div 
                className="w-[36px] h-[36px] shrink-0 rounded-[10px] overflow-hidden"
                whileTap={{ scale: 0.95 }}
              >
                <img 
                  src={imgZuperLogo} 
                  className="w-full h-full object-contain" 
                  alt="Zuper Logo"
                />
              </motion.div>
              
              <div className="flex items-center gap-[6px]">
                <span 
                  className="font-['Space_Grotesk',sans-serif] font-semibold text-[17px] leading-[1] transition-colors duration-300"
                  style={{ color: theme.textPrimary }}
                >
                  Zuper Go
                </span>
                <motion.div 
                  className="w-[6px] h-[6px] rounded-full bg-emerald-500"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>

            {/* Right: Add + Avatar */}
            <div className="flex items-center gap-[10px]">
              {/* Add Button */}
              <motion.button
                className="w-[32px] h-[32px] rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300"
                style={{ background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                aria-label="Add new"
              >
                <PlusIcon className="w-[18px] h-[18px] transition-colors duration-300" style={{ color: isDarkMode ? '#e2e8f0' : '#374151' }} />
              </motion.button>
              
              {/* Avatar */}
              <motion.button
                className="relative w-[32px] h-[32px] rounded-full overflow-hidden cursor-pointer"
                style={{ border: isDarkMode ? '2px solid rgba(255,255,255,0.3)' : '2px solid rgba(255,255,255,0.8)' }}
                whileTap={{ scale: 0.9, rotate: 180 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                aria-label="Toggle theme"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                <img src={imgAvatar} className="w-full h-full object-cover" alt="Avatar" />
                {/* Dark mode indicator */}
                <AnimatePresence>
                  {isDarkMode && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-1 -right-1 w-[14px] h-[14px] bg-indigo-500 rounded-full flex items-center justify-center border-2 border-slate-900"
                    >
                      <span className="text-[8px]">🌙</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Content Area - Swaps between Home and Gallery */}
        <div className="absolute z-10 h-[720px] left-0 top-[108px] w-[393px] overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            {activePage === 'home' ? (
              <motion.div
                key="home-content"
                className="flex flex-col gap-[16px] items-center w-full pb-0 pt-[4px] px-[24px]"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
              >
                {/* Weather-Aware Greeting */}
                <div className="w-full shrink-0">
                  <WeatherGreeting userName="Sparky" isDark={isDarkMode} />
                </div>

          {/* Hero Card + Quick Actions */}
          <div className="flex flex-col gap-[16px] items-center w-full shrink-0">
              
              {/* Hero Card - Conditional: Setup or Connected */}
              <AnimatePresence mode="wait">
                {isGlassConnected ? (
                  <GlassConnectedCard
                    key="connected"
                    deviceName={glassInfo.deviceName}
                    deviceId={glassInfo.deviceId}
                    batteryLevel={glassInfo.batteryLevel}
                    onDisconnect={handleDisconnectGlass}
                    onSettings={() => console.log('Settings')}
                    isDark={isDarkMode}
                  />
                ) : (
              <motion.div 
                key="setup"
                className="relative h-[140px] w-[345px] rounded-[16px] overflow-clip p-[16px] shrink-0 group cursor-pointer"
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{
                  // Deep shadow matching connected card
                  boxShadow: `
                    0 25px 60px rgba(6, 21, 40, 0.5),
                    0 12px 28px rgba(12, 54, 90, 0.35),
                    0 4px 12px rgba(0, 0, 0, 0.25),
                    inset 0 1px 0 rgba(255, 255, 255, 0.08),
                    0 0 40px rgba(6, 182, 212, 0.15)
                  `
                }}
              >
                {/* Deep Dark Gradient Background - Matching Connected Card */}
                <div className="absolute inset-0 rounded-[16px]">
                  {/* Base gradient layer - Deep dark blue matching connected card */}
                  <div 
                    className="absolute inset-0 rounded-[16px]"
                    style={{
                      background: `linear-gradient(135deg, 
                        #0c1929 0%, 
                        #0f2744 20%,
                        #12365a 40%,
                        #0d2847 60%,
                        #091e3a 80%,
                        #061528 100%
                      )`
                    }}
                  />
                  {/* Tech grid pattern */}
                  <div 
                    className="absolute inset-0 rounded-[16px] opacity-[0.12]"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
                      `,
                      backgroundSize: '25px 25px',
                    }}
                  />
                  {/* Aurora overlay */}
                  <div 
                    className="absolute inset-0 rounded-[16px]"
                    style={{
                      background: `
                        radial-gradient(ellipse 100% 80% at 20% 0%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
                        radial-gradient(ellipse 80% 60% at 80% 100%, rgba(133, 88, 242, 0.12) 0%, transparent 50%)
                      `
                    }}
                  />
                  {/* Inner highlight for premium feel */}
                  <div 
                    className="absolute inset-0 rounded-[16px]"
                    style={{
                      boxShadow: "inset 0 1px 2px rgba(255,255,255,0.08), inset 0 -1px 3px rgba(0,0,0,0.2)"
                    }}
                  />
                </div>
                
                {/* Glass Stripes Overlay */}
                <div className="absolute inset-0">
                  <div className="absolute left-0 top-0 flex items-end w-[345px]">
                    <GlassStripes className="opacity-30" />
                  </div>
                </div>

              {/* Minimal Floating Particles - CSS Optimized */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="particle particle-white absolute rounded-full bg-white"
                    style={{
                      width: `${2 + (i % 3)}px`,
                      height: `${2 + (i % 3)}px`,
                      left: `${15 + (i * 10)}%`,
                      top: `${15 + ((i * 13) % 70)}%`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  />
                ))}
              </div>

                    {/* Subtle Light Sweep Effect - CSS Optimized */}
                    <div className="absolute inset-0 rounded-[16px] overflow-hidden pointer-events-none">
                      <div
                        className="light-sweep absolute w-[200%] h-[200%] -left-full -top-full"
                        style={{
                          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 55%, transparent 60%)"
                        }}
                      />
                    </div>

                {/* Content - Clean & Balanced */}
                <div className="relative z-10 flex flex-col items-end justify-center h-full">
                  <div className="w-[165px] flex flex-col gap-[10px] items-start">
                    {/* Status badge */}
                    <div className="flex items-center gap-[5px]">
                      <div className="w-[6px] h-[6px] rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)] animate-pulse" />
                      <span className="font-['Inter',sans-serif] font-medium text-[9px] text-white/70 uppercase tracking-[0.05em]">
                        Ready to pair
                      </span>
                    </div>
                    
                    {/* Title - Single line, natural flow */}
                    <h3 className="font-['Space_Grotesk',sans-serif] font-semibold text-[15px] text-white tracking-[-0.2px] leading-[1.25]">
                      Setup Zuper Glass
                    </h3>
                    
                    {/* Setup Button */}
                    <motion.button 
                      className="flex items-center gap-[6px] px-[10px] py-[7px] rounded-[8px] mt-[2px]"
                      style={{
                        background: "rgba(255,255,255,0.12)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      aria-label="Setup Zuper Glass"
                      onClick={handleConnectGlass}
                    >
                      <span className="font-['Inter',sans-serif] font-medium text-[11px] text-white">
                        Connect
                      </span>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12L10 8L6 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.button>
                  </div>
                </div>

                    {/* Glasses Image with Float Animation - CSS Optimized */}
                    <div className="glasses-float absolute left-[-47px] top-[20.65px] w-[196.244px] h-[140.096px] flex items-center justify-center pointer-events-none">
                  {/* Glasses shadow on card surface */}
                  <div 
                    className="absolute bottom-[10px] left-[20px] w-[140px] h-[20px] rounded-full"
                    style={{
                      background: "radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%)",
                      filter: "blur(8px)"
                    }}
                  />
                  <div className="rotate-[-5.674deg]">
                    <img 
                      src={imgZuperGlass3D} 
                      className="w-[185.049px] h-[122.401px] object-cover drop-shadow-2xl" 
                      alt="Smart Glasses"
                      style={{
                        filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.2))"
                      }}
                    />
                  </div>
                </div>

              </motion.div>
                )}
              </AnimatePresence>

            {/* Quick Actions - Glass-themed */}
            <div className="flex gap-[20px] items-start justify-center w-full shrink-0 px-[8px]">
              <ActionButton icon={PlusIcon} label="New" delay={0} isDark={isDarkMode} />
              <ActionButton icon={MapIcon} label="Maps" delay={1} isDark={isDarkMode} />
              <ActionButton icon={CameraIcon} label="Camera" delay={2} isDark={isDarkMode} onClick={() => setShowCameraScreen(true)} />
              <ActionButton icon={NotesIcon} label="Notes" delay={3} isDark={isDarkMode} onClick={() => setActivePage('notes')} />
            </div>
          </div>

          {/* Create Inspections Card - Dark Theme */}
          <div className="flex flex-col gap-[10px] items-start w-full shrink-0">
            <motion.div 
              className="relative h-[180px] w-[345px] overflow-hidden rounded-[16px] shrink-0 cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              whileTap={{ scale: 0.98 }}
              style={{
                boxShadow: `
                  0 25px 60px rgba(6, 21, 40, 0.5),
                  0 12px 28px rgba(12, 54, 90, 0.35),
                  0 4px 12px rgba(0, 0, 0, 0.25),
                  inset 0 1px 0 rgba(255, 255, 255, 0.08),
                  0 0 40px rgba(16, 185, 129, 0.1)
                `
              }}
            >
              {/* Dark Gradient Background - Green accent */}
              <div className="absolute inset-0 rounded-[16px]">
                <div 
                  className="absolute inset-0 rounded-[16px]"
                  style={{
                    background: `linear-gradient(135deg, 
                      #0c1929 0%, 
                      #0f2744 20%,
                      #0d3a2d 40%,
                      #0d2847 60%,
                      #091e3a 80%,
                      #061528 100%
                    )`
                  }}
                />
                {/* Tech grid pattern */}
                <div 
                  className="absolute inset-0 rounded-[16px] opacity-[0.1]"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '25px 25px',
                  }}
                />
                {/* Aurora overlay - emerald accent */}
                <div 
                  className="absolute inset-0 rounded-[16px]"
                  style={{
                    background: `
                      radial-gradient(ellipse 100% 80% at 20% 0%, rgba(16, 185, 129, 0.2) 0%, transparent 50%),
                      radial-gradient(ellipse 80% 60% at 80% 100%, rgba(52, 211, 153, 0.15) 0%, transparent 50%)
                    `
                  }}
                />
                {/* Inner highlight */}
                <div 
                  className="absolute inset-0 rounded-[16px]"
                  style={{
                    boxShadow: "inset 0 1px 2px rgba(255,255,255,0.08), inset 0 -1px 3px rgba(0,0,0,0.2)"
                  }}
                />
              </div>

              {/* Floating Particles - Emerald */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="particle absolute rounded-full"
                    style={{
                      width: `${2 + (i % 2)}px`,
                      height: `${2 + (i % 2)}px`,
                      left: `${10 + (i * 15)}%`,
                      top: `${15 + ((i * 17) % 70)}%`,
                      background: i % 2 === 0 
                        ? 'rgba(52, 211, 153, 0.5)'
                        : 'rgba(16, 185, 129, 0.4)',
                      boxShadow: `0 0 4px rgba(16, 185, 129, 0.3)`,
                      animation: 'float 5s ease-in-out infinite',
                      animationDelay: `${i * 0.6}s`,
                    }}
                  />
                ))}
              </div>

              {/* Notebook Image */}
              <motion.div 
                className="absolute h-[170px] left-[140px] top-[8px] w-[220px] pointer-events-none"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
                style={{
                  filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))'
                }}
              >
                <img src={imgImage16} className="absolute h-full left-[-15%] top-0 w-[130%] max-w-none object-contain" alt="Notebook" />
              </motion.div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-[16px]">
                <motion.h3 
                  className="font-['Space_Grotesk',sans-serif] font-bold text-[24px] text-white leading-[1.15] tracking-[-0.5px] max-w-[140px]"
                  style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  Create Inspections
                </motion.h3>

                <motion.button 
                  className="relative flex gap-[6px] items-center px-[12px] py-[8px] rounded-[8px] w-fit overflow-hidden"
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                  whileTap={{ scale: 0.97 }}
                  aria-label="Start Creating"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="font-['Inter',sans-serif] font-medium text-[11px] text-emerald-300">
                    Start Creating
                  </span>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="rgb(110, 231, 183)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Glass Gallery Card - Dark Theme */}
          <div className="flex flex-col gap-[10px] items-start justify-end w-full shrink-0 mb-[120px]">
            <motion.div 
              className="relative h-[180px] w-[345px] overflow-hidden rounded-[16px] shrink-0 cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              whileTap={{ scale: 0.98 }}
              style={{
                boxShadow: `
                  0 25px 60px rgba(6, 21, 40, 0.5),
                  0 12px 28px rgba(12, 54, 90, 0.35),
                  0 4px 12px rgba(0, 0, 0, 0.25),
                  inset 0 1px 0 rgba(255, 255, 255, 0.08),
                  0 0 40px rgba(139, 92, 246, 0.1)
                `
              }}
            >
              {/* Dark Gradient Background - Purple accent */}
              <div className="absolute inset-0 rounded-[16px]">
                <div 
                  className="absolute inset-0 rounded-[16px]"
                  style={{
                    background: `linear-gradient(135deg, 
                      #0c1929 0%, 
                      #0f2744 20%,
                      #1e1b4b 40%,
                      #0d2847 60%,
                      #091e3a 80%,
                      #061528 100%
                    )`
                  }}
                />
                {/* Tech grid pattern */}
                <div 
                  className="absolute inset-0 rounded-[16px] opacity-[0.1]"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '25px 25px',
                  }}
                />
                {/* Aurora overlay - purple accent */}
                <div 
                  className="absolute inset-0 rounded-[16px]"
                  style={{
                    background: `
                      radial-gradient(ellipse 100% 80% at 20% 0%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
                      radial-gradient(ellipse 80% 60% at 80% 100%, rgba(167, 139, 250, 0.15) 0%, transparent 50%)
                    `
                  }}
                />
                {/* Inner highlight */}
                <div 
                  className="absolute inset-0 rounded-[16px]"
                  style={{
                    boxShadow: "inset 0 1px 2px rgba(255,255,255,0.08), inset 0 -1px 3px rgba(0,0,0,0.2)"
                  }}
                />
              </div>

              {/* Floating Particles - Purple */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="particle absolute rounded-full"
                    style={{
                      width: `${2 + (i % 2)}px`,
                      height: `${2 + (i % 2)}px`,
                      left: `${10 + (i * 15)}%`,
                      top: `${15 + ((i * 17) % 70)}%`,
                      background: i % 2 === 0 
                        ? 'rgba(167, 139, 250, 0.5)'
                        : 'rgba(139, 92, 246, 0.4)',
                      boxShadow: `0 0 4px rgba(139, 92, 246, 0.3)`,
                      animation: 'float 5s ease-in-out infinite',
                      animationDelay: `${i * 0.6}s`,
                    }}
                  />
                ))}
              </div>

              {/* Gallery Images */}
              <motion.div 
                className="absolute h-[150px] left-[130px] top-[20px] w-[250px] pointer-events-none"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
                style={{
                  filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))'
                }}
              >
                <div className="absolute h-[80px] left-[-10px] top-[60px] w-[220px]">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img src={imgImage17} className="absolute h-[180%] left-[0%] top-[-80%] w-[100%] max-w-none object-cover rounded-lg" alt="" />
                  </div>
                </div>
                <div className="absolute h-[27px] left-[105.22px] top-[35px] w-[84px]">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img src={imgImage17} className="absolute h-[372.34%] left-[-97.06%] top-[-61.7%] w-[197.06%] max-w-none" alt="" />
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-[16px]">
                <motion.h3 
                  className="font-['Space_Grotesk',sans-serif] font-bold text-[24px] text-white leading-[1.15] tracking-[-0.5px] max-w-[140px]"
                  style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  See It. Capture It.
                </motion.h3>

                <motion.button 
                  className="relative flex gap-[6px] items-center px-[12px] py-[8px] rounded-[8px] w-fit overflow-hidden"
                  style={{
                    background: 'rgba(139, 92, 246, 0.2)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                  }}
                  whileTap={{ scale: 0.97 }}
                  aria-label="Get started"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="font-['Inter',sans-serif] font-medium text-[11px] text-violet-300">
                    Get started
                  </span>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="rgb(196, 181, 253)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          </div>

              </motion.div>
            ) : activePage === 'gallery' ? (
              <motion.div
                key="gallery-content"
                className="flex flex-col w-full pb-[100px] pt-[4px] px-[24px]"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
              >
                <GalleryPage isDark={isDarkMode} />
              </motion.div>
            ) : activePage === 'glass' ? (
              <motion.div
                key="glass-content"
                className="flex flex-col w-full pb-[100px] pt-[4px] px-[24px]"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
              >
                <GlassPage 
                  isDark={isDarkMode} 
                  isConnected={isGlassConnected}
                  glassInfo={glassInfo}
                  onConnect={handleConnectGlass}
                  onDisconnect={handleDisconnectGlass}
                  onOpenGuide={() => setActivePage('guide')}
                />
              </motion.div>
            ) : activePage === 'guide' ? (
              <motion.div
                key="guide-content"
                className="absolute inset-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <SmartGlassGuide 
                  isOpen={true}
                  onClose={() => setActivePage('glass')}
                  isDark={isDarkMode}
                />
              </motion.div>
            ) : activePage === 'notes' ? (
              <motion.div
                key="notes-content"
                className="absolute inset-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <NotesPage isDark={isDarkMode} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Tab Bar - iOS-style Professional Glassmorphism */}
        <motion.div 
          className="absolute bottom-0 left-0 z-50 flex gap-[16px] items-center h-[95px] w-[393px] pb-[25px] pt-[16px] px-[25px] transition-all duration-500"
          style={{
            // iOS-style gradient fade from transparent to frosted glass
            background: isDarkMode 
              ? "linear-gradient(180deg, transparent 0%, rgba(22, 28, 45, 0.75) 30%, rgba(17, 24, 39, 0.92) 100%)"
              : "linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.7) 30%, rgba(255, 255, 255, 0.88) 100%)",
            // Heavy blur like iOS - key for authentic feel
            backdropFilter: "blur(50px) saturate(200%)",
            WebkitBackdropFilter: "blur(50px) saturate(200%)",
            // Subtle top border for definition
            borderTop: isDarkMode 
              ? "0.5px solid rgba(255, 255, 255, 0.08)"
              : "0.5px solid rgba(0, 0, 0, 0.04)",
          }}
        >
          <motion.div 
            className="basis-0 grow flex items-center min-h-px min-w-px pr-[10px] relative shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
          >
            {/* iOS-style frosted pill container */}
            <div 
              className="absolute inset-[-4px] rounded-[28px] transition-all duration-500 overflow-hidden" 
              style={{ 
                // Multi-layer glass effect
                background: isDarkMode 
                  ? "linear-gradient(135deg, rgba(45, 55, 72, 0.65) 0%, rgba(30, 41, 59, 0.75) 50%, rgba(26, 32, 44, 0.8) 100%)"
                  : "linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(250, 250, 252, 0.8) 50%, rgba(248, 250, 252, 0.75) 100%)",
                backdropFilter: "blur(25px) saturate(180%)",
                WebkitBackdropFilter: "blur(25px) saturate(180%)",
                // Refined border - subtle top highlight, edge definition
                border: isDarkMode 
                  ? "1px solid rgba(255, 255, 255, 0.08)" 
                  : "1px solid rgba(255, 255, 255, 0.9)",
                // iOS-style shadow layering
                boxShadow: isDarkMode 
                  ? `0 2px 8px rgba(0, 0, 0, 0.25),
                     0 8px 24px rgba(0, 0, 0, 0.2),
                     inset 0 0.5px 0 rgba(255, 255, 255, 0.12),
                     inset 0 -0.5px 0 rgba(0, 0, 0, 0.2)` 
                  : `0 2px 8px rgba(0, 0, 0, 0.04),
                     0 8px 24px rgba(0, 0, 0, 0.06),
                     0 0 0 0.5px rgba(0, 0, 0, 0.03),
                     inset 0 0.5px 0 rgba(255, 255, 255, 1),
                     inset 0 -0.5px 0 rgba(0, 0, 0, 0.02)`
              }} 
            >
              {/* Inner shine/highlight layer */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: isDarkMode
                    ? "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, transparent 40%)"
                    : "linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, transparent 50%)",
                }}
              />
            </div>
            
            <div className="relative flex items-center w-full">
              {/* Home Tab */}
              <motion.div 
                className="basis-0 grow flex flex-col gap-px items-center justify-center pb-[7px] pt-[6px] px-[8px] mr-[-10px] relative cursor-pointer"
                whileTap={{ scale: 0.95 }}
                onClick={() => setActivePage('home')}
              >
                {/* Active indicator - Theme aware */}
                {activePage === 'home' && (
                  <motion.div 
                    className="absolute inset-0 rounded-[20px]"
                    style={{
                      background: isDarkMode 
                        ? "rgba(99, 102, 241, 0.15)" 
                        : "rgba(2, 132, 199, 0.1)",
                      border: isDarkMode 
                        ? "1px solid rgba(99, 102, 241, 0.2)"
                        : "1px solid rgba(2, 132, 199, 0.15)"
                    }}
                    layoutId="activeTab"
                  />
                )}
                <div className="relative w-[28px] h-[28px] flex items-center justify-center">
                  <HomeIcon 
                    className="w-[28px] h-[28px] transition-colors duration-300" 
                    style={{ color: activePage === 'home' ? (isDarkMode ? '#818cf8' : '#0284c7') : (isDarkMode ? '#94a3b8' : '#64748b') }} 
                  />
                </div>
                <span 
                  className="relative font-['SF_Pro',-apple-system,sans-serif] text-[10px] leading-[12px] tracking-[-0.1px] text-center transition-colors duration-300" 
                  style={{ fontWeight: activePage === 'home' ? 600 : 510, color: activePage === 'home' ? (isDarkMode ? '#818cf8' : '#0284c7') : (isDarkMode ? '#94a3b8' : '#64748b') }}
                >
                  Home
                </span>
              </motion.div>
              
              {/* Photos Tab */}
              <motion.div 
                className="basis-0 grow flex flex-col gap-px items-center justify-center pb-[7px] pt-[6px] px-[8px] mr-[-10px] relative cursor-pointer"
                whileTap={{ scale: 0.95 }}
                style={{ borderRadius: "100px" }}
                onClick={() => setActivePage('gallery')}
              >
                {/* Active indicator - Theme aware */}
                {activePage === 'gallery' && (
                  <motion.div 
                    className="absolute inset-0 rounded-[20px]"
                    style={{
                      background: isDarkMode 
                        ? "rgba(99, 102, 241, 0.15)" 
                        : "rgba(2, 132, 199, 0.1)",
                      border: isDarkMode 
                        ? "1px solid rgba(99, 102, 241, 0.2)"
                        : "1px solid rgba(2, 132, 199, 0.15)"
                    }}
                    layoutId="activeTab"
                  />
                )}
                <div className="relative w-[28px] h-[28px] flex items-center justify-center">
                  <PhotoIcon 
                    className="w-[28px] h-[28px] transition-colors duration-300" 
                    style={{ color: activePage === 'gallery' ? (isDarkMode ? '#818cf8' : '#0284c7') : (isDarkMode ? '#94a3b8' : '#64748b') }} 
                  />
                </div>
                <span 
                  className="relative font-['SF_Pro',-apple-system,sans-serif] text-[10px] leading-[12px] text-center transition-colors duration-300" 
                  style={{ fontWeight: activePage === 'gallery' ? 600 : 510, color: activePage === 'gallery' ? (isDarkMode ? '#818cf8' : '#0284c7') : (isDarkMode ? '#94a3b8' : '#64748b') }}
                >
                  Photos
                </span>
              </motion.div>
              
              {/* Glass Tab */}
              <motion.div 
                className="basis-0 grow flex flex-col gap-px items-center justify-center pb-[7px] pt-[6px] px-[8px] mr-[-10px] relative cursor-pointer"
                whileTap={{ scale: 0.95 }}
                style={{ borderRadius: "100px" }}
                onClick={() => setActivePage('glass')}
              >
                {/* Active indicator - Theme aware */}
                {activePage === 'glass' && (
                  <motion.div 
                    className="absolute inset-0 rounded-[20px]"
                    style={{
                      background: isDarkMode 
                        ? "rgba(99, 102, 241, 0.15)" 
                        : "rgba(2, 132, 199, 0.1)",
                      border: isDarkMode 
                        ? "1px solid rgba(99, 102, 241, 0.2)"
                        : "1px solid rgba(2, 132, 199, 0.15)"
                    }}
                    layoutId="activeTab"
                  />
                )}
                <div className="relative w-[32px] h-[28px] flex items-center justify-center">
                  <GlassTabIcon 
                    className="w-[32px] h-[28px] transition-colors duration-300" 
                    style={{ color: activePage === 'glass' ? (isDarkMode ? '#818cf8' : '#0284c7') : (isDarkMode ? '#94a3b8' : '#64748b') }} 
                  />
                </div>
                <span 
                  className="relative font-['SF_Pro',-apple-system,sans-serif] text-[10px] leading-[12px] text-center transition-colors duration-300" 
                  style={{ fontWeight: activePage === 'glass' ? 600 : 510, color: activePage === 'glass' ? (isDarkMode ? '#818cf8' : '#0284c7') : (isDarkMode ? '#94a3b8' : '#64748b') }}
                >
                  Glass
                </span>
              </motion.div>
            </div>
          </motion.div>
          
          {/* AI Button - Purple for dark mode, Teal for light mode */}
          <motion.div 
            className="flex items-center pr-[10px] relative shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
          >
            {/* Scanner Pulse Rings - Theme aware */}
            <div 
              className="ai-scanner-ring absolute left-[-4px] top-[-4px] w-[62px] h-[62px] rounded-full pointer-events-none"
              style={{
                border: `2px solid ${theme.aiAccent}`,
                boxShadow: `0 0 8px ${theme.aiAccent}, 0 0 16px ${theme.aiAccentLight}`,
              }}
            />
            <div 
              className="ai-scanner-ring-delay absolute left-[-4px] top-[-4px] w-[62px] h-[62px] rounded-full pointer-events-none"
              style={{
                border: `1px solid ${theme.aiAccent}`,
                boxShadow: `0 0 4px ${theme.aiAccent}`,
              }}
            />

            {/* Static subtle ring */}
            <div 
              className="absolute left-[-4px] w-[62px] h-[62px] top-[-4px] rounded-full"
              style={{ 
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(133, 88, 242, 0.15) 0%, rgba(133, 88, 242, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(2, 132, 199, 0.08) 100%)',
                padding: '1px',
              }}
            >
              <div 
                className="w-full h-full rounded-full transition-colors duration-300"
                style={{ 
                  background: isDarkMode 
                    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%)"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              />
            </div>

            {/* Subtle ambient glow */}
            <div 
              className="absolute left-[-4px] top-[-4px] w-[62px] h-[62px] rounded-full pointer-events-none"
              style={{
                boxShadow: `0 0 15px ${theme.aiAccentGlow}`
              }}
            />

            {/* Button Content */}
            <motion.div 
              className="relative flex gap-[10px] items-center justify-center p-[8px] w-[54px] h-[54px] mr-[-10px] cursor-pointer z-10"
              whileTap={{ scale: 0.9 }}
            >
              {/* AI Icon with theme-aware color */}
              <div className="w-[24px] h-[19px] relative" style={{ filter: `drop-shadow(0 0 4px ${theme.aiAccentLight})` }}>
                <svg viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path 
                    d="M14.6126 1.41344C14.8607 0.77639 15.7622 0.776392 16.0103 1.41344L17.212 4.49852C17.72 5.80289 18.7722 6.82048 20.0928 7.28472L23.2987 8.41169C23.967 8.64664 23.967 9.59185 23.2987 9.8268L20.0928 10.9538C18.7722 11.418 17.72 12.4356 17.212 13.74L16.0103 16.825C15.7622 17.4621 14.8607 17.4621 14.6126 16.825L13.4109 13.74C12.9029 12.4356 11.8507 11.418 10.5301 10.9538L7.32423 9.8268C6.65587 9.59185 6.65587 8.64664 7.32424 8.41169L10.5301 7.28472C11.8507 6.82048 12.9029 5.80289 13.4109 4.49852L14.6126 1.41344Z" 
                    fill={isDarkMode ? "url(#aiGrad1Dark)" : "url(#aiGrad1Light)"}
                  />
                  <path 
                    opacity="0.4" 
                    d="M4.58193 0.150913C4.6688 -0.0503043 4.95412 -0.0503045 5.04098 0.150913L5.46742 1.13872C5.65121 1.56444 6.01065 1.88949 6.45266 2.02968L7.56012 2.38094C7.79268 2.4547 7.79268 2.78378 7.56012 2.85754L6.45266 3.2088C6.01065 3.34899 5.65121 3.67404 5.46742 4.09977L5.04098 5.08757C4.95412 5.28879 4.6688 5.28879 4.58193 5.08757L4.15549 4.09977C3.9717 3.67404 3.61226 3.34899 3.17026 3.2088L2.06279 2.85754C1.83023 2.78378 1.83023 2.4547 2.06279 2.38094L3.17026 2.02968C3.61226 1.88949 3.9717 1.56444 4.15549 1.13872L4.58193 0.150913Z" 
                    fill={isDarkMode ? "url(#aiGrad2Dark)" : "url(#aiGrad2Light)"}
                  />
                  <path 
                    opacity="0.6" 
                    d="M3.91654 9.79322C4.04384 9.4148 4.57908 9.4148 4.70638 9.79322L5.27211 11.475C5.51959 12.2107 6.07534 12.802 6.79426 13.0947L8.36333 13.7333C8.70944 13.8742 8.70944 14.3643 8.36333 14.5052L6.79426 15.1438C6.07534 15.4365 5.51959 16.0278 5.27211 16.7635L4.70638 18.4453C4.57908 18.8237 4.04384 18.8237 3.91654 18.4453L3.3508 16.7635C3.10332 16.0278 2.54757 15.4365 1.82865 15.1438L0.259582 14.5052C-0.0865281 14.3643 -0.0865276 13.8742 0.259582 13.7333L1.82865 13.0947C2.54758 12.802 3.10332 12.2107 3.3508 11.475L3.91654 9.79322Z" 
                    fill={isDarkMode ? "url(#aiGrad3Dark)" : "url(#aiGrad3Light)"}
                  />
                  <defs>
                    {/* Dark mode gradients - Purple */}
                    <linearGradient id="aiGrad1Dark" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8558F2" />
                      <stop offset="100%" stopColor="#A78BFA" />
                    </linearGradient>
                    <linearGradient id="aiGrad2Dark" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8558F2" />
                      <stop offset="100%" stopColor="#C4B5FD" />
                    </linearGradient>
                    <linearGradient id="aiGrad3Dark" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8558F2" />
                      <stop offset="100%" stopColor="#A78BFA" />
                    </linearGradient>
                    {/* Light mode gradients - Rich Sky Blue */}
                    <linearGradient id="aiGrad1Light" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0284c7" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                    <linearGradient id="aiGrad2Light" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0284c7" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                    <linearGradient id="aiGrad3Light" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0284c7" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Camera Screen - Inside Phone Frame */}
        <CameraScreen 
          isOpen={showCameraScreen}
          onClose={() => setShowCameraScreen(false)}
          inspectionTitle="Roof inspection for Henry"
          onCapture={handleCameraCapture}
        />
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
