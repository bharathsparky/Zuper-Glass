import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Simulated weather data (replace with real API later)
const getSimulatedWeather = () => {
  return {
    temp: Math.floor(65 + Math.random() * 20), // 65-85°F
    condition: 'clear',
    description: 'Sunny',
    windSpeed: Math.floor(5 + Math.random() * 10),
  };
};

// Get time-based greeting
const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good morning,', emoji: '☀️' };
  if (hour < 17) return { text: 'Good afternoon,', emoji: '👋' };
  return { text: 'Good evening,', emoji: '🌙' };
};


// Weather icon component
const WeatherIcon = ({ condition }) => {
  if (condition === 'clear') {
    return (
      <motion.div 
        className="relative w-[32px] h-[32px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-lg" 
          style={{ boxShadow: '0 0 12px rgba(251,191,36,0.5)' }}
        />
      </motion.div>
    );
  }
  if (condition === 'clouds') {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-gray-400">
        <path d="M18.5 19H6.5C4.01472 19 2 16.9853 2 14.5C2 12.1564 3.79151 10.2313 6.07974 10.0194C6.54781 7.17213 9.02024 5 12 5C14.9798 5 17.4522 7.17213 17.9203 10.0194C20.2085 10.2313 22 12.1564 22 14.5C22 16.9853 19.9853 19 17.5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  }
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-blue-400">
      <path d="M8 19V21M8 13V15M16 19V21M16 13V15M12 17V19M12 11V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18.5 11H6.5C4.01472 11 2 8.98528 2 6.5C2 4.15643 3.79151 2.23131 6.07974 2.01942C6.54781 -0.827873 9.02024 -3 12 -3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
};

// Compact Weather Greeting - Section Header Style
export const WeatherGreeting = ({ userName = 'Sparky', isDark = false }) => {
  const [weather, setWeather] = useState(null);
  const [greeting, setGreeting] = useState(getTimeGreeting());

  useEffect(() => {
    setWeather(getSimulatedWeather());
    setGreeting(getTimeGreeting());
    
    const interval = setInterval(() => {
      setGreeting(getTimeGreeting());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (!weather) {
    return <div className="w-full h-[60px] animate-pulse" />;
  }

  // Theme colors
  const textPrimary = isDark ? '#f8fafc' : '#1F2937';
  const textSecondary = isDark ? '#94a3b8' : '#6B7280';
  const pillBg = isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255,255,255,0.8)';
  const pillBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
  const pillShadow = isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.04)';

  return (
    <div className="w-full">
      {/* Main Greeting Row */}
      <div className="flex items-start justify-between">
        {/* Left: Greeting Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p 
            className="font-['Inter',sans-serif] font-medium text-[15px] leading-[1.3] transition-colors duration-300"
            style={{ color: textSecondary }}
          >
            {greeting.text}
          </p>
          <h1 
            className="font-['SF_Pro_Display',-apple-system,sans-serif] font-semibold text-[28px] leading-[1.2] tracking-[-0.5px] transition-colors duration-300"
            style={{ color: textPrimary }}
          >
            {userName} {greeting.emoji}
          </h1>
        </motion.div>

        {/* Right: Weather Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
          className="flex items-center gap-[8px] px-[12px] py-[8px] rounded-[14px] mt-[2px] transition-all duration-300"
          style={{
            background: pillBg,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${pillBorder}`,
            boxShadow: pillShadow
          }}
        >
          <WeatherIcon condition={weather.condition} />
          <div className="flex flex-col items-end">
            <span 
              className="font-['Space_Grotesk',sans-serif] font-bold text-[20px] leading-none transition-colors duration-300"
              style={{ color: textPrimary }}
            >
              {weather.temp}°
            </span>
            <span 
              className="font-['Inter',sans-serif] font-medium text-[10px] leading-none mt-[2px] transition-colors duration-300"
              style={{ color: textSecondary }}
            >
              {weather.description}
            </span>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default WeatherGreeting;

