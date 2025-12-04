import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { 
  Battery, Bluetooth, Settings, ChevronRight, Camera, Video, Download, 
  HelpCircle, Play, RefreshCw, RotateCcw, Info, Upload, Power, 
  ChevronLeft, Volume2, Zap, Clock, AlertTriangle, Hand, X
} from 'lucide-react';

// Theme-aware accent colors helper
// Dark mode: Purple (#8558F2), Light mode: Rich Sky Blue (#0284c7)
const getAccentColors = (isDark) => ({
  primary: isDark ? '#8558F2' : '#0284c7',
  primaryLight: isDark ? '#a78bfa' : '#0ea5e9',
  bgSubtle: isDark ? 'rgba(133, 88, 242, 0.08)' : 'rgba(2, 132, 199, 0.06)',
  bgLight: isDark ? 'rgba(133, 88, 242, 0.1)' : 'rgba(2, 132, 199, 0.08)',
  bgMedium: isDark ? 'rgba(133, 88, 242, 0.15)' : 'rgba(2, 132, 199, 0.1)',
  bgStrong: isDark ? 'rgba(133, 88, 242, 0.2)' : 'rgba(2, 132, 199, 0.12)',
  border: isDark ? 'rgba(133, 88, 242, 0.2)' : 'rgba(2, 132, 199, 0.15)',
  borderLight: isDark ? 'rgba(133, 88, 242, 0.15)' : 'rgba(2, 132, 199, 0.1)',
  shadow: isDark ? 'rgba(133, 88, 242, 0.3)' : 'rgba(2, 132, 199, 0.2)',
  gradient: isDark 
    ? 'linear-gradient(135deg, #8558F2 0%, #6366f1 100%)'
    : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
});

// Text colors for accessibility (WCAG AA compliant)
const getTextColors = (isDark) => ({
  primary: isDark ? '#f1f5f9' : '#1e293b',
  secondary: isDark ? '#cbd5e1' : '#334155',
  description: isDark ? '#94a3b8' : '#475569',
  muted: isDark ? '#64748b' : '#64748b',
});

// Import the Lottie animation path
const glassAnimationPath = '/assets/smart_glass_transparent_rotation.json';

// Sample unsynced media from glass
const unsyncedMedia = [
  { id: 1, type: 'photo', src: '/assets/figma-assets/598cd013b8500e290215fdc47888787468011a5c.png', timestamp: '2 min ago' },
  { id: 2, type: 'photo', src: '/assets/figma-assets/1468b6e0f8a9e73b9580acf1837dbb20db76c32e.png', timestamp: '5 min ago' },
  { id: 3, type: 'video', src: '/assets/figma-assets/23bbaeb905fb30f0a9481decaf6077e19cc6984e.png', duration: '0:45', timestamp: '8 min ago' },
  { id: 4, type: 'photo', src: '/assets/figma-assets/4c915fdcd5c975eda61c351287eaef3f0e5aa4aa.png', timestamp: '12 min ago' },
  { id: 5, type: 'photo', src: '/assets/figma-assets/5325763621f455fe5b2c718c4ff4d2c76be65ac9.png', timestamp: '15 min ago' },
  { id: 6, type: 'video', src: '/assets/figma-assets/598cd013b8500e290215fdc47888787468011a5c.png', duration: '1:20', timestamp: '20 min ago' },
];

// Smart Glass Guide Content
const guideContent = {
  buttonLocation: {
    title: "Button Location",
    description: "Your Zuper Glass has a multi-function button located on the top of the right temple, near the hinge. This single button controls:",
    features: ["Power on/off", "Taking photos", "Recording videos", "Factory reset"]
  },
  pairing: {
    title: "Pairing Your Zuper Glass",
    steps: [
      { step: 1, title: "Turn on the device", description: "Press and hold the button for 2 seconds until you see the blue LED flashing. This indicates the glasses are in pairing mode." },
      { step: 2, title: "Check the LED indicator", description: "If the blue LED is not flashing after turning on, the battery may be low. Charge the device for a while and try again." },
      { step: 3, title: "Enable Bluetooth and Location", description: "On your phone, turn on Bluetooth and Location services. Keep the glasses powered on with the blue LED flashing." },
      { step: 4, title: "Pair in the app", description: "Open the Glass tab in the Zuper Go app and tap \"Setup now\" to search for and connect to your Zuper Glass." }
    ]
  },
  takingPhotos: {
    title: "Taking Photos",
    items: [
      { icon: "hand", title: "Single Click", description: "Tap the touchpad once to capture a photo instantly. You'll hear a shutter sound confirming the capture." }
    ]
  },
  recordingVideos: {
    title: "Recording Videos",
    items: [
      { icon: "hand", title: "Start Recording", description: "Double-click the button on the right temple to start video recording. A red indicator will appear showing recording is in progress." },
      { icon: "hand", title: "Stop Recording", description: "Press the button once to stop and save the video." },
      { icon: "clock", title: "Recording Limit", description: "Videos are limited to 3 minutes maximum. Recording will automatically stop and save after 3 minutes.", isWarning: true }
    ]
  },
  volumeControls: {
    title: "Volume Controls",
    items: [
      { icon: "right", title: "Increase Volume", description: "Slide forward on the right touchpad to increase the volume." },
      { icon: "left", title: "Decrease Volume", description: "Slide backward on the right touchpad to decrease the volume." },
      { icon: "play", title: "Play / Pause", description: "Double-click the right touchpad to play or pause audio." }
    ]
  },
  powerControls: {
    title: "Power Controls",
    items: [
      { icon: "power", title: "Turn On", description: "Press and hold the button on the right temple for 2 seconds to turn on the device." },
      { icon: "power", title: "Turn Off", description: "Press and hold the button on the right temple for 5 seconds to turn off the device." },
      { icon: "reset", title: "Factory Reset", description: "Short press the button 5 times rapidly to reset the device to factory settings. This will unpair from all devices.", isWarning: true }
    ]
  },
  charging: {
    title: "Charging",
    items: [
      { icon: "port", title: "Charging Port", description: "The charging interface is located on the right temple of the glasses." },
      { icon: "cable", title: "Magnetic Cable", description: "Use the provided magnetic charging cable. Connect the other end to a USB charging adapter or your computer's USB port." },
      { icon: "clock", title: "Charging Time", description: "Full charge takes approximately 25 minutes." },
      { icon: "warning", title: "Important", description: "Use a charging device with output voltage of DC 5V/1A. Using higher voltage chargers may damage the device.", isWarning: true }
    ]
  },
  quickReference: [
    { action: "Take Photo", gesture: "Single click" },
    { action: "Start Video", gesture: "Double click" },
    { action: "Stop Video", gesture: "Single click" },
    { action: "Volume Up", gesture: "Slide forward" },
    { action: "Volume Down", gesture: "Slide backward" },
    { action: "Play/Pause", gesture: "Double click" },
    { action: "Power On", gesture: "Hold 2 seconds" },
    { action: "Power Off", gesture: "Hold 5 seconds" },
    { action: "Factory Reset", gesture: "5 short presses" }
  ]
};

// Smart Glass Guide Screen Component - Premium Collapsible Design
const SmartGlassGuide = ({ isOpen, onClose, isDark }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  if (!isOpen) return null;

  const bgColor = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.98)';
  const textColor = isDark ? '#f1f5f9' : '#1f2937';
  const subTextColor = isDark ? '#94a3b8' : '#6b7280';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';

  const sections = [
    { 
      id: 'quick', 
      icon: Zap, 
      title: 'Quick Reference', 
      color: '#8558F2',
      subtitle: 'All gestures at a glance'
    },
    { 
      id: 'pairing', 
      icon: Bluetooth, 
      title: 'Pairing', 
      color: '#6366f1',
      subtitle: '4 steps to connect'
    },
    { 
      id: 'camera', 
      icon: Camera, 
      title: 'Photos & Videos', 
      color: '#ec4899',
      subtitle: 'Capture moments'
    },
    { 
      id: 'controls', 
      icon: Volume2, 
      title: 'Controls', 
      color: '#a78bfa',
      subtitle: 'Volume & Power'
    },
    { 
      id: 'charging', 
      icon: Battery, 
      title: 'Charging', 
      color: '#10b981',
      subtitle: '25 min full charge'
    },
  ];

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  // Section Item Component
  const SectionItem = ({ section }) => {
    const isExpanded = expandedSection === section.id;
    const Icon = section.icon;

    return (
      <motion.div
        className="rounded-[16px] overflow-hidden mb-[12px]"
        style={{
          background: cardBg,
          border: `1px solid ${borderColor}`,
          boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.04)',
        }}
        layout
      >
        {/* Section Header - Clickable */}
        <motion.button
          className="w-full p-[16px] flex items-center gap-[14px]"
          onClick={() => toggleSection(section.id)}
          whileTap={{ scale: 0.99 }}
        >
          <div 
            className="w-[44px] h-[44px] rounded-[12px] flex items-center justify-center shrink-0"
            style={{ 
              background: `linear-gradient(135deg, ${section.color}25 0%, ${section.color}15 100%)`,
              border: `1px solid ${section.color}30`,
            }}
          >
            <Icon className="w-[22px] h-[22px]" style={{ color: section.color }} strokeWidth={1.5} />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-['Inter'] font-semibold text-[15px]" style={{ color: textColor }}>
              {section.title}
            </h3>
            <p className="font-['Inter'] text-[12px] mt-[2px]" style={{ color: subTextColor }}>
              {section.subtitle}
            </p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight 
              className="w-[20px] h-[20px] rotate-90" 
              style={{ color: subTextColor }} 
              strokeWidth={2}
            />
          </motion.div>
        </motion.button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div 
                className="px-[16px] pb-[16px] pt-[4px]"
                style={{ borderTop: `1px solid ${borderColor}` }}
              >
                {section.id === 'quick' && <QuickReferenceContent isDark={isDark} textColor={textColor} subTextColor={subTextColor} borderColor={borderColor} />}
                {section.id === 'pairing' && <PairingContent isDark={isDark} textColor={textColor} subTextColor={subTextColor} borderColor={borderColor} />}
                {section.id === 'camera' && <CameraContent isDark={isDark} textColor={textColor} subTextColor={subTextColor} borderColor={borderColor} />}
                {section.id === 'controls' && <ControlsContent isDark={isDark} textColor={textColor} subTextColor={subTextColor} borderColor={borderColor} />}
                {section.id === 'charging' && <ChargingContent isDark={isDark} textColor={textColor} subTextColor={subTextColor} borderColor={borderColor} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Quick Reference Content
  const QuickReferenceContent = ({ textColor, borderColor }) => (
    <div className="space-y-0 mt-[8px]">
      {guideContent.quickReference.map((item, idx) => (
        <div 
          key={idx} 
          className="flex items-center justify-between py-[10px]"
          style={{ borderBottom: idx < guideContent.quickReference.length - 1 ? `1px solid ${borderColor}` : 'none' }}
        >
          <span className="font-['Inter'] font-medium text-[13px]" style={{ color: textColor }}>
            {item.action}
          </span>
          <span 
            className="font-['Inter'] font-semibold text-[11px] px-[10px] py-[5px] rounded-[6px]"
            style={{ 
              background: isDark ? 'rgba(133, 88, 242, 0.2)' : 'rgba(133, 88, 242, 0.1)',
              color: '#8558F2',
            }}
          >
            {item.gesture}
          </span>
        </div>
      ))}
    </div>
  );

  // Pairing Content
  const PairingContent = ({ textColor, subTextColor, borderColor }) => (
    <div className="space-y-[12px] mt-[8px]">
      {guideContent.pairing.steps.map((step, idx) => (
        <div key={idx} className="flex gap-[12px]">
          <div 
            className="w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0"
            style={{ background: '#8558F2' }}
          >
            <span className="font-['Inter'] font-bold text-[11px] text-white">{step.step}</span>
          </div>
          <div className="flex-1 pt-[2px]">
            <h4 className="font-['Inter'] font-semibold text-[13px]" style={{ color: textColor }}>
              {step.title}
            </h4>
            <p className="font-['Inter'] text-[12px] leading-[1.5] mt-[2px]" style={{ color: subTextColor }}>
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  // Camera Content (Photos & Videos)
  const CameraContent = ({ textColor, subTextColor }) => (
    <div className="space-y-[14px] mt-[8px]">
      <div>
        <h4 className="font-['Inter'] font-semibold text-[13px] mb-[6px]" style={{ color: textColor }}>
          📸 Taking Photos
        </h4>
        <p className="font-['Inter'] text-[12px] leading-[1.5]" style={{ color: subTextColor }}>
          <span className="font-semibold" style={{ color: '#ec4899' }}>Single tap</span> the touchpad to capture a photo instantly. You'll hear a shutter sound.
        </p>
      </div>
      <div>
        <h4 className="font-['Inter'] font-semibold text-[13px] mb-[6px]" style={{ color: textColor }}>
          🎬 Recording Videos
        </h4>
        <p className="font-['Inter'] text-[12px] leading-[1.5]" style={{ color: subTextColor }}>
          <span className="font-semibold" style={{ color: '#ec4899' }}>Double tap</span> to start recording. A red indicator appears. <span className="font-semibold" style={{ color: '#ec4899' }}>Single tap</span> to stop.
        </p>
      </div>
      <div 
        className="p-[10px] rounded-[10px] flex items-start gap-[8px]"
        style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
      >
        <AlertTriangle className="w-[14px] h-[14px] shrink-0 mt-[1px]" style={{ color: '#ef4444' }} strokeWidth={2} />
        <p className="font-['Inter'] text-[11px] leading-[1.4]" style={{ color: '#ef4444' }}>
          Videos are limited to 3 minutes. Recording stops automatically.
        </p>
      </div>
    </div>
  );

  // Controls Content (Volume & Power)
  const ControlsContent = ({ textColor, subTextColor }) => (
    <div className="space-y-[14px] mt-[8px]">
      <div>
        <h4 className="font-['Inter'] font-semibold text-[13px] mb-[6px]" style={{ color: textColor }}>
          🔊 Volume
        </h4>
        <p className="font-['Inter'] text-[12px] leading-[1.5]" style={{ color: subTextColor }}>
          <span className="font-semibold" style={{ color: '#a78bfa' }}>Slide forward</span> to increase, <span className="font-semibold" style={{ color: '#a78bfa' }}>slide backward</span> to decrease. <span className="font-semibold" style={{ color: '#a78bfa' }}>Double tap</span> to play/pause.
        </p>
      </div>
      <div>
        <h4 className="font-['Inter'] font-semibold text-[13px] mb-[6px]" style={{ color: textColor }}>
          ⚡ Power
        </h4>
        <p className="font-['Inter'] text-[12px] leading-[1.5]" style={{ color: subTextColor }}>
          <span className="font-semibold" style={{ color: '#a78bfa' }}>Hold 2 sec</span> to turn on, <span className="font-semibold" style={{ color: '#a78bfa' }}>hold 5 sec</span> to turn off.
        </p>
      </div>
      <div 
        className="p-[10px] rounded-[10px] flex items-start gap-[8px]"
        style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
      >
        <RotateCcw className="w-[14px] h-[14px] shrink-0 mt-[1px]" style={{ color: '#ef4444' }} strokeWidth={2} />
        <p className="font-['Inter'] text-[11px] leading-[1.4]" style={{ color: '#ef4444' }}>
          Factory Reset: Press 5 times rapidly. This unpairs from all devices.
        </p>
      </div>
    </div>
  );

  // Charging Content
  const ChargingContent = ({ textColor, subTextColor }) => (
    <div className="space-y-[14px] mt-[8px]">
      <div className="flex items-start gap-[10px]">
        <div className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center shrink-0" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
          <Zap className="w-[16px] h-[16px]" style={{ color: '#10b981' }} strokeWidth={2} />
        </div>
        <div>
          <h4 className="font-['Inter'] font-semibold text-[13px]" style={{ color: textColor }}>Magnetic Cable</h4>
          <p className="font-['Inter'] text-[12px] mt-[2px]" style={{ color: subTextColor }}>
            Connect to the right temple. Full charge in ~25 minutes.
          </p>
        </div>
      </div>
      <div 
        className="p-[10px] rounded-[10px] flex items-start gap-[8px]"
        style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}
      >
        <AlertTriangle className="w-[14px] h-[14px] shrink-0 mt-[1px]" style={{ color: '#f59e0b' }} strokeWidth={2} />
        <p className="font-['Inter'] text-[11px] leading-[1.4]" style={{ color: '#f59e0b' }}>
          Use DC 5V/1A charger only. Higher voltage may damage the device.
        </p>
      </div>
    </div>
  );

  return (
    <motion.div
      className="absolute inset-0 z-[100] overflow-hidden flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ background: bgColor }}
    >
      {/* Header - Compact */}
      <div 
        className="shrink-0 px-[24px] pt-[16px] pb-[12px] flex items-center gap-[12px]"
        style={{ background: bgColor }}
      >
        <motion.button
          className="w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0"
          style={{ 
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            border: `1px solid ${borderColor}`
          }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
        >
          <X className="w-[18px] h-[18px]" style={{ color: textColor }} strokeWidth={2} />
        </motion.button>
        <div className="flex-1">
          <h1 className="font-['Space_Grotesk'] font-bold text-[18px]" style={{ color: textColor }}>
            Smart Glass Guide
          </h1>
          <p className="font-['Inter'] text-[11px] mt-[1px]" style={{ color: subTextColor }}>
            Tap a section to expand
          </p>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-[24px] pt-[8px] pb-[100px]">
        {sections.map((section) => (
          <SectionItem key={section.id} section={section} />
        ))}

        {/* Bottom Info */}
        <div 
          className="mt-[8px] p-[14px] rounded-[14px] text-center"
          style={{ 
            background: isDark ? 'rgba(133, 88, 242, 0.1)' : 'rgba(133, 88, 242, 0.05)',
            border: '1px solid rgba(133, 88, 242, 0.15)'
          }}
        >
          <p className="font-['Inter'] text-[12px]" style={{ color: subTextColor }}>
            Need more help? Contact <span style={{ color: '#8558F2', fontWeight: 600 }}>support@zuper.co</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Glass Device Card Component - Compact version for Glass page
const GlassDeviceCard = ({ 
  deviceName = "Sparky's Smart Glass",
  deviceId = "W610_CDDB", 
  batteryLevel = 80,
  isConnected = true,
  onSettings,
  onDisconnect,
  onConnect,
  isDark = false
}) => {
  const [animationData, setAnimationData] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const lottieRef = useRef(null);
  const startXRef = useRef(0);

  useEffect(() => {
    fetch(glassAnimationPath)
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error('Failed to load Lottie:', err));
  }, []);

  const handleDragStart = (e) => {
    setIsDragging(true);
    startXRef.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startXRef.current;
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
    setRotation(prev => prev + (currentX - startXRef.current));
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
      className="relative w-full overflow-hidden rounded-[20px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        // Deep dark gradient - matching homepage card
        background: `linear-gradient(135deg, 
          #0c1929 0%, 
          #0f2744 20%,
          #12365a 40%,
          #0d2847 60%,
          #091e3a 80%,
          #061528 100%
        )`,
        boxShadow: `
          0 25px 60px rgba(6, 21, 40, 0.5),
          0 12px 28px rgba(12, 54, 90, 0.35),
          0 4px 12px rgba(0, 0, 0, 0.25),
          inset 0 1px 0 rgba(255, 255, 255, 0.08),
          0 0 40px rgba(6, 182, 212, 0.15)
        `,
      }}
    >
      {/* Tech grid pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '25px 25px',
        }}
      />

      {/* Aurora overlay */}
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

      {/* Floating particles - Minimal */}
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
            animate={{ y: [0, -12, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 5 + (i % 3), repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Energy pulse rings - Slow and subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[0, 1].map((i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute rounded-full"
            style={{
              width: '140px',
              height: '140px',
              left: '50%',
              top: '45%',
              marginLeft: '-70px',
              marginTop: '-70px',
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

      {/* Energy line sweep */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <motion.path
          d="M 0 60 Q 80 40, 172 65 T 345 50"
          fill="none"
          stroke="url(#energyGradGlass)"
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
          <linearGradient id="energyGradGlass" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0)" />
            <stop offset="20%" stopColor="rgba(34, 211, 238, 0.8)" />
            <stop offset="50%" stopColor="rgba(99, 102, 241, 0.9)" />
            <stop offset="80%" stopColor="rgba(167, 139, 250, 0.8)" />
            <stop offset="100%" stopColor="rgba(167, 139, 250, 0)" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10 p-[16px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-[6px]">
          <div 
            className="flex items-center gap-[6px] px-[10px] py-[4px] rounded-full"
            style={{
              background: isConnected ? 'rgba(0, 0, 0, 0.25)' : 'rgba(239, 68, 68, 0.3)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${isConnected ? 'rgba(74, 222, 128, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
            }}
          >
            <motion.div 
              className="w-[6px] h-[6px] rounded-full"
              style={{ background: isConnected ? '#4ade80' : '#f87171' }}
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="font-['Inter'] font-semibold text-[10px] text-white">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <div 
            className="flex items-center gap-[6px] px-[8px] py-[4px] rounded-full"
            style={{ 
              background: 'rgba(0, 0, 0, 0.25)', 
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)' 
            }}
          >
            <div className="relative w-[22px] h-[10px] rounded-[2px] overflow-hidden" style={{ border: '1px solid rgba(255, 255, 255, 0.5)' }}>
              <motion.div 
                className="absolute left-[1px] top-[1px] bottom-[1px] rounded-[1px]"
                style={{ width: `${batteryLevel}%`, maxWidth: 'calc(100% - 2px)', background: getBatteryFillColor() }}
                initial={{ width: 0 }}
                animate={{ width: `${batteryLevel}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <span className="font-['Inter'] font-bold text-[11px]" style={{ color: getBatteryTextColor() }}>{batteryLevel}%</span>
          </div>
        </div>

        {/* Lottie Animation */}
        <div 
          className="relative h-[130px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          <div className="absolute inset-[15px] rounded-full pointer-events-none" style={{ 
            background: isDark 
              ? 'radial-gradient(ellipse at center, rgba(133, 88, 242, 0.15) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.2) 0%, transparent 70%)', 
            filter: 'blur(15px)' 
          }} />
          {animationData ? (
            <Lottie
              lottieRef={lottieRef}
              animationData={animationData}
              loop={false}
              autoplay={false}
              style={{ width: '200px', height: '130px', filter: 'drop-shadow(0 6px 20px rgba(0, 0, 0, 0.25))' }}
              initialSegment={[0, 1]}
            />
          ) : (
            <motion.div className="w-[36px] h-[36px] rounded-full border-2 border-t-transparent" style={{ 
              borderColor: isDark ? 'rgba(133, 88, 242, 0.4)' : 'rgba(255, 255, 255, 0.5)', 
              borderTopColor: 'transparent' 
            }} animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
          )}
        </div>

        {/* Device Info */}
        <div className="text-center mb-[12px]">
          <p className="font-['Inter'] text-[9px] text-white/40 uppercase tracking-wider">{deviceId}</p>
          <h3 className="font-['Space_Grotesk'] font-semibold text-[15px] text-white">{deviceName}</h3>
        </div>

        {/* Action buttons */}
        <div className="flex gap-[8px]">
          {isConnected ? (
            <>
              <motion.button
                className="flex-1 flex items-center justify-center gap-[5px] py-[9px] rounded-[10px]"
                style={{ background: 'rgba(255, 255, 255, 0.12)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                whileTap={{ scale: 0.98 }}
                onClick={onSettings}
              >
                <Settings className="w-[14px] h-[14px] text-white/80" strokeWidth={2} />
                <span className="font-['Inter'] font-medium text-[11px] text-white/80">Settings</span>
              </motion.button>
              <motion.button
                className="flex-1 flex items-center justify-center gap-[5px] py-[9px] rounded-[10px]"
                style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                onClick={onDisconnect}
              >
                <Bluetooth className="w-[14px] h-[14px] text-red-400" strokeWidth={2} />
                <span className="font-['Inter'] font-medium text-[11px] text-red-400">Disconnect</span>
              </motion.button>
            </>
          ) : (
            <motion.button
              className="w-full flex items-center justify-center gap-[6px] py-[11px] rounded-[10px]"
              style={{ 
                background: isDark 
                  ? 'linear-gradient(135deg, #8558F2 0%, #6366f1 100%)'
                  : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                boxShadow: isDark 
                  ? '0 4px 16px rgba(133, 88, 242, 0.4)'
                  : '0 4px 16px rgba(2, 132, 199, 0.3)',
              }}
              whileTap={{ scale: 0.98 }}
              onClick={onConnect}
            >
              <Bluetooth className="w-[16px] h-[16px] text-white" strokeWidth={2} />
              <span className="font-['Inter'] font-semibold text-[12px] text-white">Connect Glass</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Media Item Component
const MediaItem = ({ item, isDark, index }) => (
  <motion.div
    className="relative w-[72px] h-[72px] rounded-[12px] overflow-hidden shrink-0"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05 }}
    style={{
      boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
    }}
  >
    <img src={item.src} alt="" className="w-full h-full object-cover" />
    {item.type === 'video' && (
      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
        <div className="w-[24px] h-[24px] rounded-full flex items-center justify-center bg-white/90">
          <Play className="w-[10px] h-[10px] text-gray-800 ml-[1px]" fill="currentColor" />
        </div>
      </div>
    )}
    {item.type === 'video' && item.duration && (
      <div className="absolute bottom-[4px] right-[4px] px-[4px] py-[1px] rounded-[3px] bg-black/60">
        <span className="font-['Inter'] text-[8px] text-white">{item.duration}</span>
      </div>
    )}
    {/* Unsynced indicator */}
    <div className="absolute top-[4px] right-[4px] w-[8px] h-[8px] rounded-full bg-amber-400 border border-white/50" />
  </motion.div>
);

// Device Management Action Item
const DeviceActionItem = ({ icon: Icon, title, description, onClick, isDark, isDestructive = false }) => (
  <motion.button
    className="w-full flex items-center gap-[12px] p-[12px] rounded-[12px] text-left"
    style={{
      background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
      border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.04)',
    }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
  >
    <div 
      className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center shrink-0"
      style={{
        background: isDestructive 
          ? 'rgba(239, 68, 68, 0.1)'
          : (isDark ? 'rgba(133, 88, 242, 0.15)' : 'rgba(2, 132, 199, 0.08)'),
        border: isDestructive 
          ? '1px solid rgba(239, 68, 68, 0.2)'
          : (isDark ? '1px solid rgba(133, 88, 242, 0.2)' : '1px solid rgba(2, 132, 199, 0.15)'),
      }}
    >
      <Icon 
        className="w-[18px] h-[18px]" 
        style={{ color: isDestructive ? '#ef4444' : (isDark ? '#8558F2' : '#0284c7') }} 
        strokeWidth={2} 
      />
    </div>
    <div className="flex-1 min-w-0">
      <h4 
        className="font-['Inter'] font-medium text-[13px]"
        style={{ color: isDestructive ? '#ef4444' : (isDark ? '#f1f5f9' : '#1f2937') }}
      >
        {title}
      </h4>
      <p className="font-['Inter'] text-[11px]" style={{ color: isDark ? '#64748b' : '#64748b' }}>
        {description}
      </p>
    </div>
    <ChevronRight className="w-[16px] h-[16px] shrink-0" style={{ color: isDark ? '#475569' : '#d1d5db' }} />
  </motion.button>
);

// Export SmartGlassGuide for use in App.jsx
export { SmartGlassGuide };

// Main Glass Page Component
export const GlassPage = ({ isDark = false, isConnected = true, glassInfo = {}, onConnect, onDisconnect, onOpenGuide }) => {
  const photoCount = unsyncedMedia.filter(m => m.type === 'photo').length;
  const videoCount = unsyncedMedia.filter(m => m.type === 'video').length;

  return (
    <>
      <div className="flex flex-col gap-[16px] w-full">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <h1 
            className="font-['Space_Grotesk'] font-bold text-[24px]"
            style={{ color: isDark ? '#f1f5f9' : '#1f2937' }}
          >
            My Glass
          </h1>
        </div>

        {/* Glass Device Card */}
        <GlassDeviceCard
          deviceName={glassInfo.deviceName || "Sparky's Smart Glass"}
          deviceId={glassInfo.deviceId || "W610_CDDB"}
          batteryLevel={glassInfo.batteryLevel || 80}
          isConnected={isConnected}
          isDark={isDark}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
        />

        {/* Glass Gallery Section */}
        <motion.div
          className="rounded-[16px] overflow-hidden"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            background: isDark 
              ? 'rgba(30, 41, 59, 0.8)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: isDark 
              ? '1px solid rgba(255, 255, 255, 0.08)'
              : '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: isDark 
              ? '0 8px 32px rgba(0, 0, 0, 0.2)'
              : '0 8px 32px rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-[16px] pt-[14px] pb-[10px]">
            <div className="flex items-center gap-[8px]">
              <div 
                className="w-[28px] h-[28px] rounded-[8px] flex items-center justify-center"
                style={{
                  background: isDark 
                    ? 'linear-gradient(135deg, #8558F2 0%, #6366f1 100%)'
                    : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  boxShadow: isDark 
                    ? '0 4px 12px rgba(133, 88, 242, 0.3)'
                    : '0 4px 12px rgba(2, 132, 199, 0.25)',
                }}
              >
                <Camera className="w-[14px] h-[14px] text-white" strokeWidth={2} />
              </div>
              <span 
                className="font-['Inter'] font-semibold text-[14px]"
                style={{ color: isDark ? '#f1f5f9' : '#1f2937' }}
              >
                Glass Gallery
              </span>
            </div>
            <motion.button
              className="flex items-center gap-[4px] px-[10px] py-[5px] rounded-[8px]"
              style={{
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="font-['Inter'] font-medium text-[11px]" style={{ color: isDark ? '#8558F2' : '#0284c7' }}>
                See all
              </span>
              <ChevronRight className="w-[12px] h-[12px]" style={{ color: isDark ? '#8558F2' : '#0284c7' }} />
            </motion.button>
          </div>

          {/* Media scroll */}
          <div className="flex gap-[10px] px-[16px] pb-[12px] overflow-x-auto no-scrollbar">
            {unsyncedMedia.map((item, index) => (
              <MediaItem key={item.id} item={item} isDark={isDark} index={index} />
            ))}
          </div>

          {/* Import prompt */}
          <div 
            className="mx-[16px] mb-[14px] p-[12px] rounded-[12px] flex items-center gap-[12px]"
            style={{
              background: isDark 
                ? 'linear-gradient(135deg, rgba(133, 88, 242, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(14, 165, 233, 0.05) 100%)',
              border: isDark 
                ? '1px solid rgba(133, 88, 242, 0.2)'
                : '1px solid rgba(2, 132, 199, 0.12)',
            }}
          >
            <div 
              className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center shrink-0"
              style={{
                background: isDark 
                  ? 'linear-gradient(135deg, #8558F2 0%, #6366f1 100%)'
                  : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                boxShadow: isDark 
                  ? '0 4px 12px rgba(133, 88, 242, 0.3)'
                  : '0 4px 12px rgba(2, 132, 199, 0.25)',
              }}
            >
              <Download className="w-[18px] h-[18px] text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-['Inter'] text-[12px]" style={{ color: isDark ? '#e2e8f0' : '#374151' }}>
                <span className="font-semibold">{photoCount} photos, {videoCount} videos</span>
                <span style={{ color: isDark ? '#94a3b8' : '#475569' }}> ready to import</span>
              </p>
            </div>
            <motion.button
              className="px-[14px] py-[8px] rounded-[8px]"
              style={{
                background: isDark 
                  ? 'linear-gradient(135deg, #8558F2 0%, #6366f1 100%)'
                  : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                boxShadow: isDark 
                  ? '0 4px 12px rgba(133, 88, 242, 0.3)'
                  : '0 4px 12px rgba(2, 132, 199, 0.25)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-['Inter'] font-semibold text-[11px] text-white">Import</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Help & Tips Section */}
        <motion.div
          className="rounded-[16px] overflow-hidden"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            background: isDark 
              ? 'rgba(30, 41, 59, 0.8)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: isDark 
              ? '1px solid rgba(255, 255, 255, 0.08)'
              : '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: isDark 
              ? '0 8px 32px rgba(0, 0, 0, 0.2)'
              : '0 8px 32px rgba(0, 0, 0, 0.06)',
          }}
        >
          <div className="flex items-center justify-between px-[16px] pt-[14px] pb-[10px]">
            <div className="flex items-center gap-[8px]">
              <div 
                className="w-[28px] h-[28px] rounded-[8px] flex items-center justify-center"
                style={{
                  background: isDark 
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <HelpCircle className="w-[14px] h-[14px] text-emerald-500" strokeWidth={2} />
              </div>
              <span 
                className="font-['Inter'] font-semibold text-[14px]"
                style={{ color: isDark ? '#f1f5f9' : '#1f2937' }}
              >
                Help & Tips
              </span>
            </div>
          </div>

          {/* Help article card - Opens Guide */}
          <motion.div 
            className="mx-[16px] mb-[14px] p-[14px] rounded-[14px] flex gap-[14px] cursor-pointer"
            style={{
              background: isDark 
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)',
              border: isDark 
                ? '1px solid rgba(255, 255, 255, 0.08)'
                : '1px solid rgba(0, 0, 0, 0.04)',
            }}
            whileTap={{ scale: 0.99 }}
            onClick={onOpenGuide}
          >
            {/* Illustration */}
            <div 
              className="w-[70px] h-[70px] rounded-[12px] flex items-center justify-center shrink-0 overflow-hidden"
              style={{
                background: isDark 
                  ? `linear-gradient(135deg, rgba(133, 88, 242, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)`
                  : `linear-gradient(135deg, rgba(2, 132, 199, 0.1) 0%, rgba(14, 165, 233, 0.08) 100%)`,
                border: isDark 
                  ? '1px solid rgba(133, 88, 242, 0.2)'
                  : '1px solid rgba(2, 132, 199, 0.15)',
              }}
            >
              {/* Simple glasses illustration */}
              <svg width="50" height="32" viewBox="0 0 50 32" fill="none">
                <path 
                  d="M45 10C45 10 43 9 41 9H35C32 9 30 11 25 11C20 11 18 9 15 9H9C7 9 5 10 5 10C4 10.5 3 12 3 13C3 18 4 22 7 24C10 26 16 26 19 23C21 21 22 17 23 15C23 14.5 24 14 25 14C26 14 27 14.5 27 15C28 17 29 21 31 23C34 26 40 26 43 24C46 22 47 18 47 13C47 12 46 10.5 45 10Z" 
                  stroke={isDark ? '#a78bfa' : '#0284c7'} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  fill="none"
                />
                <circle cx="12" cy="16" r="5" stroke={isDark ? '#a78bfa' : '#0284c7'} strokeWidth="1.5" fill="none" />
                <circle cx="38" cy="16" r="5" stroke={isDark ? '#a78bfa' : '#0284c7'} strokeWidth="1.5" fill="none" />
              </svg>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
              <h4 
                className="font-['Inter'] font-semibold text-[13px] mb-[4px]"
                style={{ color: isDark ? '#f1f5f9' : '#1f2937' }}
              >
                Smart Glass Guide
              </h4>
              <p 
                className="font-['Inter'] text-[11px] leading-[1.4]"
                style={{ color: isDark ? '#94a3b8' : '#6b7280' }}
              >
                Complete guide on using your Zuper Smart Glass
              </p>
              <div className="flex items-center gap-[4px] mt-[6px]">
                <span className="font-['Inter'] font-medium text-[10px]" style={{ color: isDark ? '#8558F2' : '#0284c7' }}>
                  View guide
                </span>
                <ChevronRight className="w-[10px] h-[10px]" style={{ color: isDark ? '#8558F2' : '#0284c7' }} />
              </div>
            </div>
          </motion.div>

          {/* Quick tips */}
          <div className="px-[16px] pb-[14px] flex gap-[8px]">
            {[
              { icon: Camera, label: 'Take Photo', tip: 'Single click' },
              { icon: Video, label: 'Record Video', tip: 'Double click' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="flex-1 p-[10px] rounded-[10px] flex flex-col items-center gap-[6px]"
                style={{
                  background: isDark 
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.02)',
                  border: isDark 
                    ? '1px solid rgba(255, 255, 255, 0.08)'
                    : '1px solid rgba(0, 0, 0, 0.04)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
              >
                <item.icon 
                  className="w-[18px] h-[18px]" 
                  style={{ color: isDark ? '#94a3b8' : '#64748b' }} 
                  strokeWidth={2} 
                />
                <span 
                  className="font-['Inter'] font-medium text-[10px]"
                  style={{ color: isDark ? '#e2e8f0' : '#374151' }}
                >
                  {item.label}
                </span>
                <span 
                  className="font-['Inter'] text-[9px]"
                  style={{ color: isDark ? '#64748b' : '#64748b' }}
                >
                  {item.tip}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Device Management Section - Only show when connected (placed last as less frequently used) */}
        {isConnected && (
          <motion.div
            className="rounded-[16px] overflow-hidden mb-[80px]"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: isDark 
                ? 'rgba(30, 41, 59, 0.8)'
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: isDark 
                ? '1px solid rgba(255, 255, 255, 0.08)'
                : '1px solid rgba(0, 0, 0, 0.05)',
              boxShadow: isDark 
                ? '0 8px 32px rgba(0, 0, 0, 0.2)'
                : '0 8px 32px rgba(0, 0, 0, 0.06)',
            }}
          >
            <div className="flex items-center gap-[8px] px-[16px] pt-[14px] pb-[10px]">
              <div 
                className="w-[28px] h-[28px] rounded-[8px] flex items-center justify-center"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                }}
              >
                <Settings className="w-[14px] h-[14px]" style={{ color: isDark ? '#94a3b8' : '#64748b' }} strokeWidth={2} />
              </div>
              <span 
                className="font-['Inter'] font-semibold text-[14px]"
                style={{ color: isDark ? '#f1f5f9' : '#1f2937' }}
              >
                Device Management
              </span>
            </div>

            <div className="px-[16px] pb-[14px] space-y-[8px]">
              <DeviceActionItem
                icon={Upload}
                title="Firmware Update"
                description="Check for latest firmware"
                isDark={isDark}
                onClick={() => console.log('Firmware update')}
              />
              <DeviceActionItem
                icon={RefreshCw}
                title="Reboot Device"
                description="Restart your smart glass"
                isDark={isDark}
                onClick={() => console.log('Reboot')}
              />
              <DeviceActionItem
                icon={RotateCcw}
                title="Factory Reset"
                description="Restore to default settings"
                isDark={isDark}
                isDestructive={true}
                onClick={() => console.log('Factory reset')}
              />
              <DeviceActionItem
                icon={Info}
                title="About"
                description="Device info & version"
                isDark={isDark}
                onClick={() => console.log('About')}
              />
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default GlassPage;
