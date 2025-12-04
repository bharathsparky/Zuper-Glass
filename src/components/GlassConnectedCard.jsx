import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { Battery, Bluetooth, Settings } from 'lucide-react';

// Import the Lottie animation
const glassAnimationPath = '/assets/smart_glass_transparent_rotation.json';

export const GlassConnectedCard = ({ 
  deviceName = "Sparky's Smart Glass",
  deviceId = "W610_CDDB",
  batteryLevel = 80,
  onDisconnect,
  onSettings,
  isDark = false
}) => {
  const [animationData, setAnimationData] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const lottieRef = useRef(null);
  const containerRef = useRef(null);
  const startXRef = useRef(0);

  // Load Lottie animation
  useEffect(() => {
    fetch(glassAnimationPath)
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error('Failed to load Lottie animation:', err));
  }, []);

  // Handle touch/mouse drag for rotation
  const handleDragStart = (e) => {
    setIsDragging(true);
    startXRef.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startXRef.current;
    
    // Update Lottie frame based on rotation
    if (lottieRef.current && animationData) {
      const totalFrames = animationData.op || 60;
      const frameChange = (diff / 200) * totalFrames;
      const newFrame = Math.abs((rotation + frameChange) % totalFrames);
      lottieRef.current.goToAndStop(newFrame, true);
    }
  };

  const handleDragEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const currentX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = currentX - startXRef.current;
    setRotation(prev => prev + diff);
  };

  // Battery fill color - visible inside the battery icon
  const getBatteryFillColor = () => {
    if (batteryLevel > 50) return '#4ade80'; // Bright green for good battery
    if (batteryLevel > 20) return '#fbbf24'; // Yellow for medium
    return '#f87171'; // Red for low
  };
  
  // Battery text color - always white for accessibility on teal background
  const getBatteryTextColor = () => '#ffffff';

  return (
    <motion.div 
      className="relative w-[345px] overflow-hidden rounded-[20px] shrink-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(6, 78, 117, 0.95) 0%, 
            rgba(14, 116, 144, 0.9) 25%,
            rgba(21, 128, 156, 0.88) 50%,
            rgba(6, 95, 124, 0.92) 75%,
            rgba(8, 62, 97, 0.95) 100%
          )
        `,
        boxShadow: `
          0 25px 60px rgba(6, 78, 117, 0.35),
          0 12px 28px rgba(14, 116, 144, 0.25),
          0 4px 12px rgba(0, 0, 0, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.15)
        `,
      }}
    >
      {/* Premium gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 20%, rgba(133, 88, 242, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 80% 80%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 60%)
          `,
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              left: `${5 + (i * 6.5)}%`,
              top: `${10 + ((i * 23) % 80)}%`,
              background: i % 2 === 0 
                ? 'rgba(255, 255, 255, 0.4)'
                : 'rgba(133, 88, 242, 0.5)',
              boxShadow: `0 0 ${4 + (i % 3)}px ${i % 2 === 0 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(133, 88, 242, 0.4)'}`,
            }}
            animate={{
              y: [0, -15 - (i % 10), 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Subtle shine effect */}
      <div 
        className="absolute top-0 left-0 right-0 h-[50%] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)',
          borderRadius: '20px 20px 0 0',
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-[20px]">
        {/* Header row */}
        <div className="flex items-center justify-between mb-[8px]">
          {/* Connected badge - Dark glass style for better contrast */}
          <div 
            className="flex items-center gap-[6px] px-[10px] py-[5px] rounded-full"
            style={{
              background: 'rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(74, 222, 128, 0.5)',
            }}
          >
            <motion.div 
              className="w-[6px] h-[6px] rounded-full"
              style={{ background: '#4ade80' }}
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="font-['Inter',sans-serif] font-semibold text-[11px] text-white">
              Connected
            </span>
          </div>

          {/* Battery indicator - Dark glass style for better contrast */}
          <div 
            className="flex items-center gap-[8px] px-[10px] py-[5px] rounded-full"
            style={{
              background: 'rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div 
              className="relative w-[24px] h-[12px] rounded-[3px] overflow-hidden"
              style={{
                border: '1.5px solid rgba(255, 255, 255, 0.5)',
              }}
            >
              <motion.div 
                className="absolute left-[1px] top-[1px] bottom-[1px] rounded-[2px]"
                style={{
                  width: `${batteryLevel}%`,
                  maxWidth: 'calc(100% - 2px)',
                  background: getBatteryFillColor(),
                }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(batteryLevel, 100)}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
              {/* Battery tip */}
              <div 
                className="absolute right-[-4px] top-[2px] w-[2px] h-[6px] rounded-r-[1px]"
                style={{ background: 'rgba(255, 255, 255, 0.5)' }}
              />
            </div>
            <span 
              className="font-['Inter',sans-serif] font-bold text-[12px]"
              style={{ color: getBatteryTextColor() }}
            >
              {batteryLevel}%
            </span>
          </div>
        </div>

        {/* Lottie Animation Area - Interactive */}
        <div 
          ref={containerRef}
          className="relative h-[150px] flex items-center justify-center my-[4px] cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {/* Soft glow behind glass */}
          <div 
            className="absolute inset-[20px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(133, 88, 242, 0.2) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
          
          {/* Lottie Animation */}
          {animationData ? (
            <Lottie
              lottieRef={lottieRef}
              animationData={animationData}
              loop={false}
              autoplay={false}
              style={{ 
                width: '220px', 
                height: '150px',
                filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.3))',
              }}
              initialSegment={[0, 1]}
            />
          ) : (
            // Fallback loading state
            <div className="w-[220px] h-[150px] flex items-center justify-center">
              <motion.div 
                className="w-[40px] h-[40px] rounded-full border-2 border-t-transparent"
                style={{ borderColor: 'rgba(133, 88, 242, 0.4)', borderTopColor: 'transparent' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          )}
        </div>

        {/* Device Info */}
        <div className="text-center mb-[14px]">
          <p className="font-['Inter',sans-serif] text-[10px] mb-[3px] text-white/40 uppercase tracking-wider">
            {deviceId}
          </p>
          <h3 className="font-['Space_Grotesk',sans-serif] font-semibold text-[17px] text-white">
            {deviceName}
          </h3>
        </div>

        {/* Action buttons */}
        <div className="flex gap-[10px]">
          {/* Settings button */}
          <motion.button
            className="flex-1 flex items-center justify-center gap-[6px] py-[11px] rounded-[12px]"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onSettings}
          >
            <Settings className="w-[16px] h-[16px] text-white/80" strokeWidth={2} />
            <span className="font-['Inter',sans-serif] font-medium text-[12px] text-white/80">
              Settings
            </span>
          </motion.button>

          {/* Disconnect button */}
          <motion.button
            className="flex-1 flex items-center justify-center gap-[6px] py-[11px] rounded-[12px]"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onDisconnect}
          >
            <Bluetooth className="w-[16px] h-[16px] text-red-400" strokeWidth={2} />
            <span className="font-['Inter',sans-serif] font-medium text-[12px] text-red-400">
              Disconnect
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default GlassConnectedCard;
