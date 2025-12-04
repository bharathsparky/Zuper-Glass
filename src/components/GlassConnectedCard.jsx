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
      className="relative w-[345px] h-[140px] overflow-hidden rounded-[16px] shrink-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
      style={{
        // Deep dark gradient - makes energy effects pop
        background: `
          linear-gradient(135deg, 
            #0c1929 0%, 
            #0f2744 20%,
            #12365a 40%,
            #0d2847 60%,
            #091e3a 80%,
            #061528 100%
          )
        `,
        boxShadow: `
          0 25px 60px rgba(6, 21, 40, 0.5),
          0 12px 28px rgba(12, 54, 90, 0.35),
          0 4px 12px rgba(0, 0, 0, 0.25),
          inset 0 1px 0 rgba(255, 255, 255, 0.08),
          0 0 40px rgba(6, 182, 212, 0.15)
        `,
      }}
    >
      {/* === HIGH-TECH FUTURISTIC BACKGROUND === */}
      
      {/* Tech grid pattern - visible circuit board effect on dark bg */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '25px 25px',
        }}
      />

      {/* Aurora/energy flow effect - Slow and subtle */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(ellipse 100% 80% at 20% 0%, rgba(6, 182, 212, 0.2) 0%, transparent 50%), radial-gradient(ellipse 80% 60% at 80% 100%, rgba(133, 88, 242, 0.15) 0%, transparent 50%)',
            'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(133, 88, 242, 0.2) 0%, transparent 50%), radial-gradient(ellipse 80% 60% at 20% 100%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
            'radial-gradient(ellipse 100% 80% at 20% 0%, rgba(6, 182, 212, 0.2) 0%, transparent 50%), radial-gradient(ellipse 80% 60% at 80% 100%, rgba(133, 88, 242, 0.15) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Energy pulse rings - Slow and subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[0, 1].map((i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute rounded-full"
            style={{
              width: '160px',
              height: '160px',
              left: '50%',
              top: '45%',
              marginLeft: '-80px',
              marginTop: '-80px',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.15)',
            }}
            animate={{
              scale: [1, 2.2],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 3,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Floating energy particles - Minimal and subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${1.5 + (i % 2)}px`,
              height: `${1.5 + (i % 2)}px`,
              left: `${10 + (i * 12) % 80}%`,
              top: `${15 + (i * 11) % 70}%`,
              background: i % 2 === 0 
                ? 'rgba(34, 211, 238, 0.6)'
                : 'rgba(167, 139, 250, 0.5)',
              boxShadow: i % 2 === 0 
                ? '0 0 4px rgba(34, 211, 238, 0.4)'
                : '0 0 4px rgba(167, 139, 250, 0.3)',
            }}
            animate={{
              y: [0, -12, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5 + (i % 3),
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Electric energy lines - Subtle but visible sweep */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <motion.path
          d="M 0 80 Q 80 50, 172 75 T 345 60"
          fill="none"
          stroke="url(#energyGrad1)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 10,
            ease: "easeInOut",
          }}
        />
        <defs>
          <linearGradient id="energyGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0)" />
            <stop offset="20%" stopColor="rgba(34, 211, 238, 0.8)" />
            <stop offset="50%" stopColor="rgba(99, 102, 241, 0.9)" />
            <stop offset="80%" stopColor="rgba(167, 139, 250, 0.8)" />
            <stop offset="100%" stopColor="rgba(167, 139, 250, 0)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Holographic scanline effect - Very subtle */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(6, 182, 212, 0.02) 50%, transparent 100%)',
          backgroundSize: '100% 6px',
        }}
        animate={{
          backgroundPosition: ['0 0', '0 100%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Top shine/glare effect */}
      <div 
        className="absolute top-0 left-0 right-0 h-[40%] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
          borderRadius: '20px 20px 0 0',
        }}
      />

      {/* Content - Compact layout to match disconnected card height */}
      <div className="relative z-10 p-[16px] h-full flex">
        {/* Left side - Lottie Animation */}
        <div 
          ref={containerRef}
          className="relative w-[120px] h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none shrink-0"
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
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(133, 88, 242, 0.15) 0%, transparent 70%)',
              filter: 'blur(15px)',
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
                width: '140px', 
                height: '90px',
                filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
              }}
              initialSegment={[0, 1]}
            />
          ) : (
            <div className="w-[100px] h-[70px] flex items-center justify-center">
              <motion.div 
                className="w-[24px] h-[24px] rounded-full border-2 border-t-transparent"
                style={{ borderColor: 'rgba(133, 88, 242, 0.4)', borderTopColor: 'transparent' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          )}
        </div>

        {/* Right side - Info and buttons */}
        <div className="flex-1 flex flex-col justify-between ml-[8px]">
          {/* Top row - Status badges */}
          <div className="flex items-center justify-between">
            {/* Connected badge */}
            <div 
              className="flex items-center gap-[4px] px-[8px] py-[3px] rounded-full"
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(74, 222, 128, 0.5)',
              }}
            >
              <motion.div 
                className="w-[5px] h-[5px] rounded-full"
                style={{ background: '#4ade80' }}
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="font-['Inter',sans-serif] font-semibold text-[9px] text-white">
                Connected
              </span>
            </div>

            {/* Battery indicator */}
            <div 
              className="flex items-center gap-[4px] px-[8px] py-[3px] rounded-full"
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div 
                className="relative w-[18px] h-[9px] rounded-[2px] overflow-hidden"
                style={{ border: '1px solid rgba(255, 255, 255, 0.5)' }}
              >
                <motion.div 
                  className="absolute left-[1px] top-[1px] bottom-[1px] rounded-[1px]"
                  style={{
                    width: `${batteryLevel}%`,
                    maxWidth: 'calc(100% - 2px)',
                    background: getBatteryFillColor(),
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(batteryLevel, 100)}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
              <span className="font-['Inter',sans-serif] font-bold text-[10px] text-white">
                {batteryLevel}%
              </span>
            </div>
          </div>

          {/* Device Info */}
          <div>
            <p className="font-['Inter',sans-serif] text-[8px] text-white/40 uppercase tracking-wider">
              {deviceId}
            </p>
            <h3 className="font-['Space_Grotesk',sans-serif] font-semibold text-[14px] text-white leading-tight">
              {deviceName}
            </h3>
          </div>

          {/* Action buttons - Compact */}
          <div className="flex gap-[8px]">
            <motion.button
              className="flex-1 flex items-center justify-center gap-[4px] py-[7px] rounded-[8px]"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
              whileTap={{ scale: 0.98 }}
              onClick={onSettings}
            >
              <Settings className="w-[12px] h-[12px] text-white/80" strokeWidth={2} />
              <span className="font-['Inter',sans-serif] font-medium text-[10px] text-white/80">
                Settings
              </span>
            </motion.button>

            <motion.button
              className="flex-1 flex items-center justify-center gap-[4px] py-[7px] rounded-[8px]"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
              whileTap={{ scale: 0.98 }}
              onClick={onDisconnect}
            >
              <Bluetooth className="w-[12px] h-[12px] text-red-400" strokeWidth={2} />
              <span className="font-['Inter',sans-serif] font-medium text-[10px] text-red-400">
                Disconnect
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GlassConnectedCard;
