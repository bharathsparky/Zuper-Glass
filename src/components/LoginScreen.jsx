import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, User, Lock, Mail, ChevronRight } from 'lucide-react';

// Use the Zuper glasses 3D image
const imgZuperGlass = "/assets/figma-assets/53e21fb6e222f80de484c9b4b8999bebc76a4c42.png";

// Theme colors helper
const getThemeColors = (isDark) => ({
  // Backgrounds
  pageBg: isDark 
    ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
    : 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
  cardBg: isDark 
    ? 'rgba(30, 41, 59, 0.8)' 
    : 'rgba(255, 255, 255, 0.9)',
  inputBg: isDark 
    ? 'rgba(255, 255, 255, 0.06)' 
    : 'rgba(0, 0, 0, 0.03)',
  inputBorder: isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.08)',
  
  // Text colors - ensuring WCAG AA compliance
  textPrimary: isDark ? '#f8fafc' : '#0f172a',
  textSecondary: isDark ? '#94a3b8' : '#475569',
  textMuted: isDark ? '#64748b' : '#64748b',
  textPlaceholder: isDark ? '#64748b' : '#94a3b8',
  
  // Accent colors
  accentPrimary: '#8558F2',
  accentSecondary: '#6366f1',
  
  // Button backgrounds
  primaryButtonBg: isDark
    ? 'linear-gradient(135deg, rgba(133, 88, 242, 0.9) 0%, rgba(99, 102, 241, 0.9) 100%)'
    : 'linear-gradient(135deg, #8558F2 0%, #6366f1 100%)',
  secondaryButtonBg: isDark 
    ? 'rgba(255, 255, 255, 0.08)' 
    : 'rgba(0, 0, 0, 0.04)',
  secondaryButtonBorder: isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.08)',
  secondaryButtonText: isDark ? '#f8fafc' : '#1f2937',
  
  // Icon backgrounds
  iconBg: (color) => isDark 
    ? `rgba(${color}, 0.2)` 
    : `rgba(${color}, 0.1)`,
  iconBorder: (color) => isDark 
    ? `rgba(${color}, 0.3)` 
    : `rgba(${color}, 0.2)`,
  
  // Shadows
  cardShadow: isDark 
    ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
    : '0 8px 32px rgba(0, 0, 0, 0.08)',
  buttonShadow: isDark 
    ? '0 8px 32px rgba(133, 88, 242, 0.3)' 
    : '0 8px 32px rgba(133, 88, 242, 0.25)',
  
  // Glow effects
  glowPrimary: isDark 
    ? 'rgba(133, 88, 242, 0.15)' 
    : 'rgba(133, 88, 242, 0.1)',
  glowSecondary: isDark 
    ? 'rgba(99, 102, 241, 0.2)' 
    : 'rgba(99, 102, 241, 0.12)',
});

// Animated Hero Visual Component
const HeroVisual = ({ isDark }) => {
  const colors = getThemeColors(isDark);
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Ambient glow rings */}
      <motion.div
        className="absolute w-[280px] h-[280px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.glowPrimary} 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-[200px] h-[200px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.glowSecondary} 0%, transparent 70%)`,
          filter: 'blur(30px)',
        }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />
      
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[4px] h-[4px] rounded-full"
          style={{
            background: isDark ? 'rgba(167, 139, 250, 0.4)' : 'rgba(133, 88, 242, 0.3)',
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Central glasses image with glow */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
      >
        {/* Glow behind glasses */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(ellipse at center, ${isDark ? 'rgba(133, 88, 242, 0.3)' : 'rgba(133, 88, 242, 0.15)'} 0%, transparent 60%)`,
            filter: 'blur(20px)',
            transform: 'scale(1.5)',
          }}
        />
        <motion.img 
          src={imgZuperGlass} 
          alt="Zuper Glass" 
          className="w-[180px] h-auto relative z-10"
          style={{ 
            filter: isDark 
              ? 'drop-shadow(0 10px 30px rgba(133, 88, 242, 0.4)) drop-shadow(0 4px 12px rgba(0,0,0,0.3))'
              : 'drop-shadow(0 10px 30px rgba(133, 88, 242, 0.25)) drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
          }}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Orbital ring */}
      <motion.div
        className="absolute w-[220px] h-[220px] rounded-full"
        style={{
          border: `1px solid ${isDark ? 'rgba(133, 88, 242, 0.2)' : 'rgba(133, 88, 242, 0.15)'}`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div 
          className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full"
          style={{ background: isDark ? 'rgba(167, 139, 250, 0.6)' : 'rgba(133, 88, 242, 0.5)' }}
        />
      </motion.div>
    </div>
  );
};

// Smaller version for secondary screens
const MiniHeroVisual = ({ isDark }) => (
  <div className="relative w-full h-full flex items-center justify-center">
    {/* Ambient glow */}
    <motion.div
      className="absolute w-[150px] h-[150px] rounded-full"
      style={{
        background: `radial-gradient(circle, ${isDark ? 'rgba(133, 88, 242, 0.12)' : 'rgba(133, 88, 242, 0.08)'} 0%, transparent 70%)`,
        filter: 'blur(25px)',
      }}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.4, 0.6, 0.4],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />

    {/* Floating particles */}
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-[3px] h-[3px] rounded-full"
        style={{
          background: isDark ? 'rgba(167, 139, 250, 0.3)' : 'rgba(133, 88, 242, 0.25)',
          left: `${25 + Math.random() * 50}%`,
          top: `${25 + Math.random() * 50}%`,
        }}
        animate={{
          y: [0, -10, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 2 + Math.random(),
          repeat: Infinity,
          delay: Math.random(),
          ease: 'easeInOut',
        }}
      />
    ))}

    {/* Central glasses */}
    <motion.img 
      src={imgZuperGlass} 
      alt="Zuper Glass" 
      className="w-[120px] h-auto relative z-10"
      style={{ 
        filter: isDark 
          ? 'drop-shadow(0 8px 20px rgba(133, 88, 242, 0.3)) drop-shadow(0 3px 8px rgba(0,0,0,0.2))'
          : 'drop-shadow(0 8px 20px rgba(133, 88, 242, 0.2)) drop-shadow(0 3px 8px rgba(0,0,0,0.1))',
        opacity: isDark ? 0.8 : 0.9,
      }}
      animate={{
        y: [0, -5, 0],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  </div>
);

// Google Icon
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// Apple Icon
const AppleIcon = ({ isDark }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={isDark ? '#ffffff' : '#000000'}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

// Login Screen Component
export const LoginScreen = ({ onComplete, isDark = true }) => {
  const [currentStep, setCurrentStep] = useState(0); // 0: Welcome, 1: Company, 2: Credentials
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState(null);

  const colors = getThemeColors(isDark);

  const handleSocialLogin = (method) => {
    setLoginMethod(method);
    setTimeout(() => {
      onComplete?.();
    }, 1500);
  };

  const handleEmailLogin = () => {
    setLoginMethod('email');
    setCurrentStep(2);
  };

  const handleCredentialsSubmit = () => {
    if (email && password) {
      onComplete?.();
    }
  };

  const handleCompanySubmit = () => {
    if (companyName) {
      setCurrentStep(0);
    }
  };

  const screenVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div 
      className="absolute inset-0 z-[200] overflow-hidden flex flex-col transition-colors duration-500"
      style={{ background: colors.pageBg }}
    >
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.glowPrimary} 0%, transparent 70%)`,
            top: '-100px',
            right: '-100px',
            filter: 'blur(60px)',
            opacity: isDark ? 0.3 : 0.4,
          }}
        />
        <div 
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.glowSecondary} 0%, transparent 70%)`,
            bottom: '200px',
            left: '-100px',
            filter: 'blur(50px)',
            opacity: isDark ? 0.2 : 0.3,
          }}
        />
      </div>

      {/* Status Bar Area */}
      <div className="h-[50px] shrink-0" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-[28px] relative">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="welcome"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-[60px] h-[60px] rounded-[18px] flex items-center justify-center mb-[20px]"
                style={{
                  background: isDark 
                    ? 'linear-gradient(135deg, rgba(133, 88, 242, 0.3) 0%, rgba(99, 102, 241, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(133, 88, 242, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)',
                  border: `1px solid ${isDark ? 'rgba(133, 88, 242, 0.3)' : 'rgba(133, 88, 242, 0.2)'}`,
                  boxShadow: colors.buttonShadow,
                }}
              >
                <User className="w-[28px] h-[28px]" style={{ color: isDark ? '#a78bfa' : '#8558F2' }} strokeWidth={1.5} />
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-['Space_Grotesk'] font-bold text-[32px] leading-[1.1] mb-[12px]"
                style={{ color: colors.textPrimary }}
              >
                Get Ready to<br />Raise the Roof
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-['Inter'] text-[15px] leading-[1.5] mb-[24px]"
                style={{ color: colors.textSecondary }}
              >
                Quick setup. Faster inspections. Built for the field.
              </motion.p>

              {/* Hero Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="flex-1 flex items-center justify-center mb-[20px] min-h-[200px] max-h-[280px]"
              >
                <HeroVisual isDark={isDark} />
              </motion.div>

              {/* Login Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col gap-[12px] mb-[16px]"
              >
                {/* Google Button */}
                <motion.button
                  className="w-full h-[52px] rounded-[16px] flex items-center justify-center gap-[10px] relative overflow-hidden"
                  style={{
                    background: colors.primaryButtonBg,
                    boxShadow: colors.buttonShadow,
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSocialLogin('google')}
                >
                  <GoogleIcon />
                  <span className="font-['Inter'] font-semibold text-[15px] text-white">
                    Continue with Google
                  </span>
                </motion.button>

                {/* Apple Button */}
                <motion.button
                  className="w-full h-[52px] rounded-[16px] flex items-center justify-center gap-[10px]"
                  style={{
                    background: colors.secondaryButtonBg,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${colors.secondaryButtonBorder}`,
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSocialLogin('apple')}
                >
                  <AppleIcon isDark={isDark} />
                  <span className="font-['Inter'] font-medium text-[15px]" style={{ color: colors.secondaryButtonText }}>
                    Continue with Apple
                  </span>
                </motion.button>

                {/* Email Button */}
                <motion.button
                  className="w-full h-[52px] rounded-[16px] flex items-center justify-center gap-[10px]"
                  style={{
                    background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEmailLogin}
                >
                  <Mail className="w-[18px] h-[18px]" style={{ color: colors.textSecondary }} strokeWidth={2} />
                  <span className="font-['Inter'] font-medium text-[15px]" style={{ color: colors.textSecondary }}>
                    Login with Email
                  </span>
                </motion.button>
              </motion.div>

              {/* Privacy Policy */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center font-['Inter'] text-[11px] mb-[30px]"
                style={{ color: colors.textMuted }}
              >
                By using Zuper you agree to the{' '}
                <span style={{ color: colors.accentPrimary }} className="font-medium">Privacy Policy</span>
              </motion.p>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="company"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {/* Back button */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-[40px] h-[40px] rounded-full flex items-center justify-center mb-[16px] self-start"
                style={{
                  background: colors.secondaryButtonBg,
                  border: `1px solid ${colors.secondaryButtonBorder}`,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep(0)}
              >
                <ChevronRight className="w-[20px] h-[20px] rotate-180" style={{ color: colors.textPrimary }} />
              </motion.button>

              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-[60px] h-[60px] rounded-[18px] flex items-center justify-center mb-[20px]"
                style={{
                  background: isDark 
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(99, 102, 241, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)',
                  border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                  boxShadow: isDark ? '0 8px 32px rgba(59, 130, 246, 0.2)' : '0 8px 32px rgba(59, 130, 246, 0.15)',
                }}
              >
                <Building2 className="w-[28px] h-[28px]" style={{ color: isDark ? '#60a5fa' : '#3b82f6' }} strokeWidth={1.5} />
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-['Space_Grotesk'] font-bold text-[32px] leading-[1.1] mb-[12px]"
                style={{ color: colors.textPrimary }}
              >
                Your company name
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-['Inter'] text-[15px] leading-[1.5] mb-[24px]"
                style={{ color: colors.textSecondary }}
              >
                Start by entering your company name to set up your workspace
              </motion.p>

              {/* Input Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-[16px] overflow-hidden mb-[24px]"
                style={{
                  background: colors.inputBg,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${colors.inputBorder}`,
                }}
              >
                <input
                  type="text"
                  placeholder="Company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full h-[56px] px-[20px] bg-transparent font-['Inter'] text-[16px] outline-none"
                  style={{ 
                    color: colors.textPrimary,
                    '::placeholder': { color: colors.textPlaceholder }
                  }}
                />
              </motion.div>

              {/* Mini Hero Visual */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex-1 flex items-center justify-center mb-[20px] min-h-[120px] max-h-[180px]"
              >
                <MiniHeroVisual isDark={isDark} />
              </motion.div>

              {/* Continue Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="w-full h-[52px] rounded-[16px] flex items-center justify-center gap-[8px] mb-[40px]"
                style={{
                  background: companyName 
                    ? colors.primaryButtonBg
                    : colors.secondaryButtonBg,
                  boxShadow: companyName ? colors.buttonShadow : 'none',
                  opacity: companyName ? 1 : 0.5,
                }}
                whileTap={{ scale: companyName ? 0.98 : 1 }}
                onClick={handleCompanySubmit}
                disabled={!companyName}
              >
                <span className="font-['Inter'] font-semibold text-[15px]" style={{ color: companyName ? '#ffffff' : colors.textMuted }}>
                  Continue
                </span>
                <ChevronRight className="w-[18px] h-[18px]" style={{ color: companyName ? '#ffffff' : colors.textMuted }} />
              </motion.button>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="credentials"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {/* Back button */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-[40px] h-[40px] rounded-full flex items-center justify-center mb-[16px] self-start"
                style={{
                  background: colors.secondaryButtonBg,
                  border: `1px solid ${colors.secondaryButtonBorder}`,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep(0)}
              >
                <ChevronRight className="w-[20px] h-[20px] rotate-180" style={{ color: colors.textPrimary }} />
              </motion.button>

              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-[60px] h-[60px] rounded-[18px] flex items-center justify-center mb-[20px]"
                style={{
                  background: isDark 
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(52, 211, 153, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.1) 100%)',
                  border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
                  boxShadow: isDark ? '0 8px 32px rgba(16, 185, 129, 0.2)' : '0 8px 32px rgba(16, 185, 129, 0.15)',
                }}
              >
                <Lock className="w-[28px] h-[28px]" style={{ color: isDark ? '#34d399' : '#10b981' }} strokeWidth={1.5} />
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-['Space_Grotesk'] font-bold text-[32px] leading-[1.1] mb-[12px]"
                style={{ color: colors.textPrimary }}
              >
                Your credentials
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-['Inter'] text-[15px] leading-[1.5] mb-[24px]"
                style={{ color: colors.textSecondary }}
              >
                Enter your account details to continue.
              </motion.p>

              {/* Input Fields */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-[16px] overflow-hidden mb-[24px]"
                style={{
                  background: colors.inputBg,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${colors.inputBorder}`,
                }}
              >
                <div style={{ borderBottom: `1px solid ${colors.inputBorder}` }}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[56px] px-[20px] bg-transparent font-['Inter'] text-[16px] outline-none"
                    style={{ color: colors.textPrimary }}
                  />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[56px] px-[20px] bg-transparent font-['Inter'] text-[16px] outline-none"
                  style={{ color: colors.textPrimary }}
                />
              </motion.div>

              {/* Forgot Password */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="self-end mb-[20px]"
              >
                <span className="font-['Inter'] text-[13px] font-medium" style={{ color: colors.accentPrimary }}>
                  Forgot password?
                </span>
              </motion.button>

              {/* Mini Hero Visual */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex-1 flex items-center justify-center mb-[20px] min-h-[100px] max-h-[140px]"
              >
                <MiniHeroVisual isDark={isDark} />
              </motion.div>

              {/* Continue Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="w-full h-[52px] rounded-[16px] flex items-center justify-center gap-[8px] mb-[40px]"
                style={{
                  background: (email && password)
                    ? colors.primaryButtonBg
                    : colors.secondaryButtonBg,
                  boxShadow: (email && password) ? colors.buttonShadow : 'none',
                  opacity: (email && password) ? 1 : 0.5,
                }}
                whileTap={{ scale: (email && password) ? 0.98 : 1 }}
                onClick={handleCredentialsSubmit}
                disabled={!email || !password}
              >
                <span className="font-['Inter'] font-semibold text-[15px]" style={{ color: (email && password) ? '#ffffff' : colors.textMuted }}>
                  Continue
                </span>
                <ChevronRight className="w-[18px] h-[18px]" style={{ color: (email && password) ? '#ffffff' : colors.textMuted }} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading Overlay for Social Login */}
      <AnimatePresence>
        {loginMethod && loginMethod !== 'email' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[210] flex items-center justify-center"
            style={{
              background: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-[20px]"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-[48px] h-[48px] rounded-full border-2 border-transparent"
                style={{ borderTopColor: colors.accentPrimary }}
              />
              <p className="font-['Inter'] text-[15px]" style={{ color: colors.textSecondary }}>
                Signing in with {loginMethod === 'google' ? 'Google' : 'Apple'}...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginScreen;
