import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Camera, Clock, MapPin, Grid3X3, LayoutGrid, Calendar, Image, Video, ChevronDown, X, Check, SlidersHorizontal, Plus } from 'lucide-react';

// Theme-aware accent colors helper
// Dark mode: Purple (#8558F2), Light mode: Rich Sky Blue (#0284c7)
const getAccentColors = (isDark) => ({
  primary: isDark ? '#8558F2' : '#0284c7',
  primaryLight: isDark ? '#a78bfa' : '#0ea5e9',
  bgSubtle: isDark ? 'rgba(133, 88, 242, 0.08)' : 'rgba(2, 132, 199, 0.06)',
  bgLight: isDark ? 'rgba(133, 88, 242, 0.12)' : 'rgba(2, 132, 199, 0.08)',
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
  primary: isDark ? '#f1f5f9' : '#1e293b',       // High contrast
  secondary: isDark ? '#cbd5e1' : '#334155',     // Readable secondary (slate-700)
  description: isDark ? '#94a3b8' : '#475569',   // Description text (slate-600)
  muted: isDark ? '#64748b' : '#64748b',         // Muted but still readable (slate-500)
});

// Camera Plus Icon - Tabler Icons (clean, modern)
const CameraPlusIcon = ({ className, style }) => (
  <svg 
    className={className} 
    style={style} 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 20h-7a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v3.5" />
    <path d="M16 19h6" />
    <path d="M19 16v6" />
    <path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
  </svg>
);


// Sample gallery data - organized by inspection sessions
const inspectionSessions = [
  {
    id: 1,
    title: "Roof Inspection",
    client: "Henry Wilson",
    location: "213 Maple Ave, Seattle",
    date: "2024-12-04",
    dateLabel: "Today",
    time: "2:30 PM",
    photoCount: 24,
    videoCount: 3,
    featured: '/assets/figma-assets/598cd013b8500e290215fdc47888787468011a5c.png',
    media: [
      { id: 1, type: 'photo', src: '/assets/figma-assets/598cd013b8500e290215fdc47888787468011a5c.png', timestamp: '2:32 PM', date: '2024-12-04' },
      { id: 2, type: 'photo', src: '/assets/figma-assets/23bbaeb905fb30f0a9481decaf6077e19cc6984e.png', timestamp: '2:35 PM', date: '2024-12-04' },
      { id: 3, type: 'video', src: '/assets/figma-assets/79abc85ffd68b8e09af2e6076afabb6366d5b54a.png', duration: '0:45', timestamp: '2:38 PM', date: '2024-12-04' },
      { id: 4, type: 'photo', src: '/assets/figma-assets/6c27989d9f52e3e454106297e31e621672e08858.png', timestamp: '2:42 PM', date: '2024-12-04' },
      { id: 5, type: 'photo', src: '/assets/figma-assets/4c915fdcd5c975eda61c351287eaef3f0e5aa4aa.png', timestamp: '2:45 PM', date: '2024-12-04' },
      { id: 6, type: 'video', src: '/assets/figma-assets/5325763621f455fe5b2c718c4ff4d2c76be65ac9.png', duration: '1:12', timestamp: '2:48 PM', date: '2024-12-04' },
    ]
  },
  {
    id: 2,
    title: "HVAC System Check",
    client: "Mia Thompson",
    location: "789 Pine Rd, San Francisco",
    date: "2024-12-03",
    dateLabel: "Yesterday",
    time: "10:15 AM",
    photoCount: 18,
    videoCount: 2,
    featured: '/assets/figma-assets/1468b6e0f8a9e73b9580acf1837dbb20db76c32e.png',
    media: [
      { id: 7, type: 'photo', src: '/assets/figma-assets/1468b6e0f8a9e73b9580acf1837dbb20db76c32e.png', timestamp: '10:18 AM', date: '2024-12-03' },
      { id: 8, type: 'video', src: '/assets/figma-assets/b610e0b9d4589e5cb086983eb96b99a6ee077bd3.png', duration: '1:23', timestamp: '10:22 AM', date: '2024-12-03' },
      { id: 9, type: 'photo', src: '/assets/figma-assets/5963eb19ebf647e825f6054066a89aabf02b66eb.png', timestamp: '10:28 AM', date: '2024-12-03' },
      { id: 10, type: 'photo', src: '/assets/figma-assets/ea4bed235756d6f5312a841be641c294f61d21b8.png', timestamp: '10:32 AM', date: '2024-12-03' },
      { id: 11, type: 'photo', src: '/assets/figma-assets/c95272cb79dce89aa954094c1d43edc1134f5e7c.png', timestamp: '10:35 AM', date: '2024-12-03' },
    ]
  },
  {
    id: 3,
    title: "Electrical Panel",
    client: "James Rodriguez",
    location: "456 Oak St, Portland",
    date: "2024-12-02",
    dateLabel: "Dec 2",
    time: "3:45 PM",
    photoCount: 12,
    videoCount: 1,
    featured: '/assets/figma-assets/598cd013b8500e290215fdc47888787468011a5c.png',
    media: [
      { id: 12, type: 'photo', src: '/assets/figma-assets/23bbaeb905fb30f0a9481decaf6077e19cc6984e.png', timestamp: '3:48 PM', date: '2024-12-02' },
      { id: 13, type: 'photo', src: '/assets/figma-assets/79abc85ffd68b8e09af2e6076afabb6366d5b54a.png', timestamp: '3:52 PM', date: '2024-12-02' },
      { id: 14, type: 'video', src: '/assets/figma-assets/6c27989d9f52e3e454106297e31e621672e08858.png', duration: '0:32', timestamp: '3:55 PM', date: '2024-12-02' },
    ]
  },
  {
    id: 4,
    title: "Plumbing Assessment",
    client: "Sarah Chen",
    location: "321 Elm St, Portland",
    date: "2024-11-30",
    dateLabel: "Nov 30",
    time: "9:00 AM",
    photoCount: 8,
    videoCount: 2,
    featured: '/assets/figma-assets/4c915fdcd5c975eda61c351287eaef3f0e5aa4aa.png',
    media: [
      { id: 15, type: 'photo', src: '/assets/figma-assets/4c915fdcd5c975eda61c351287eaef3f0e5aa4aa.png', timestamp: '9:05 AM', date: '2024-11-30' },
      { id: 16, type: 'video', src: '/assets/figma-assets/5325763621f455fe5b2c718c4ff4d2c76be65ac9.png', duration: '0:55', timestamp: '9:12 AM', date: '2024-11-30' },
      { id: 17, type: 'photo', src: '/assets/figma-assets/598cd013b8500e290215fdc47888787468011a5c.png', timestamp: '9:20 AM', date: '2024-11-30' },
    ]
  }
];

// Date filter options
const dateFilters = [
  { id: 'all', label: 'All Time' },
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
];

// Media type filter options
const mediaTypeFilters = [
  { id: 'all', label: 'All', icon: Grid3X3 },
  { id: 'photo', label: 'Photos', icon: Image },
  { id: 'video', label: 'Videos', icon: Video },
];

// Group by options
const groupByOptions = [
  { id: 'inspection', label: 'By Inspection' },
  { id: 'date', label: 'By Date' },
];

// Hero Featured Card - OriginOS style large preview
const FeaturedCard = ({ session, isDark, onClick }) => (
  <motion.div
    className="relative w-full h-[180px] rounded-[20px] overflow-hidden cursor-pointer"
    style={{
      boxShadow: isDark 
        ? '0 16px 40px rgba(0,0,0,0.4), 0 6px 16px rgba(0,0,0,0.3)'
        : '0 16px 40px rgba(0,0,0,0.1), 0 6px 16px rgba(0,0,0,0.06)'
    }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
  >
    <img 
      src={session.featured} 
      alt={session.title}
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.75) 100%)' }} />
    
    <div className="absolute bottom-0 left-0 right-0 p-[16px]">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-['Inter'] font-medium text-[10px] text-white/70 uppercase tracking-wider mb-[4px]">
            Latest Inspection
          </p>
          <h2 className="font-['Space_Grotesk'] font-bold text-[20px] text-white leading-[1.1]">
            {session.title}
          </h2>
          <div className="flex items-center gap-[4px] mt-[6px]">
            <Clock className="w-[11px] h-[11px] text-white/60" />
            <span className="font-['Inter'] text-[10px] text-white/70">{session.dateLabel} • {session.time}</span>
          </div>
        </div>
        
        <div 
          className="flex items-center gap-[6px] px-[10px] py-[6px] rounded-[10px]"
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <span className="font-['Inter'] font-semibold text-[12px] text-white">{session.photoCount + session.videoCount}</span>
          <span className="font-['Inter'] text-[10px] text-white/70">items</span>
        </div>
      </div>
    </div>
    
    {session.videoCount > 0 && (
      <div className="absolute top-[12px] right-[12px]">
        <div className="flex items-center gap-[5px] px-[8px] py-[5px] rounded-[16px]" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
          <Play className="w-[10px] h-[10px] text-white" fill="white" />
          <span className="font-['Inter'] font-medium text-[10px] text-white">{session.videoCount}</span>
        </div>
      </div>
    )}
  </motion.div>
);

// Inspection Session Card - Compact horizontal scroll
const SessionCard = ({ session, isDark, onClick, index }) => (
  <motion.div
    className="relative shrink-0 w-[240px] rounded-[16px] overflow-hidden cursor-pointer"
    style={{
      background: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(16px)',
      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
      boxShadow: isDark ? '0 6px 24px rgba(0,0,0,0.25)' : '0 6px 24px rgba(0,0,0,0.06)'
    }}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.08, duration: 0.35 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
  >
    <div className="flex h-[80px] overflow-hidden">
      {session.media.slice(0, 3).map((item, i) => (
        <div key={item.id} className="relative flex-1 overflow-hidden">
          <img src={item.src} alt="" className="absolute inset-0 w-full h-full object-cover" />
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Play className="w-[16px] h-[16px] text-white" fill="white" />
            </div>
          )}
          {i < 2 && <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/20" />}
        </div>
      ))}
    </div>
    
    <div className="p-[10px]">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-['Inter'] font-semibold text-[12px] leading-[1.2] truncate" style={{ color: isDark ? '#f1f5f9' : '#1f2937' }}>
            {session.title}
          </h3>
          <p className="font-['Inter'] text-[10px] mt-[2px] truncate" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
            {session.client}
          </p>
        </div>
        <div className="flex items-center px-[6px] py-[3px] rounded-[6px] ml-[6px]" style={{ background: isDark ? 'rgba(133, 88, 242, 0.15)' : 'rgba(2, 132, 199, 0.1)' }}>
          <span className="font-['Inter'] font-semibold text-[10px]" style={{ color: isDark ? '#8558F2' : '#0284c7' }}>{session.photoCount + session.videoCount}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-[5px] mt-[6px]">
        <MapPin className="w-[9px] h-[9px]" style={{ color: isDark ? '#64748b' : '#64748b' }} />
        <span className="font-['Inter'] text-[9px] truncate max-w-[90px]" style={{ color: isDark ? '#64748b' : '#64748b' }}>
          {session.location.split(',')[0]}
        </span>
        <div className="w-[2px] h-[2px] rounded-full" style={{ background: isDark ? '#475569' : '#d1d5db' }} />
        <span className="font-['Inter'] text-[9px]" style={{ color: isDark ? '#64748b' : '#64748b' }}>{session.dateLabel}</span>
      </div>
    </div>
  </motion.div>
);

// Grid Item
const GridItem = ({ item, index, isDark }) => (
  <motion.div
    className="relative rounded-[12px] overflow-hidden cursor-pointer"
    style={{
      aspectRatio: '1',
      boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.25)' : '0 4px 12px rgba(0,0,0,0.06)'
    }}
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.03, duration: 0.2 }}
    whileTap={{ scale: 0.95 }}
  >
    <img src={item.src} alt="" className="absolute inset-0 w-full h-full object-cover" />
    {item.type === 'video' && (
      <>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
            <Play className="w-[14px] h-[14px] text-gray-800 ml-[2px]" fill="currentColor" />
          </div>
        </div>
        <div className="absolute bottom-[6px] right-[6px] px-[6px] py-[3px] rounded-[4px]" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <span className="font-['Inter'] font-medium text-[9px] text-white">{item.duration}</span>
        </div>
      </>
    )}
  </motion.div>
);

// Camera Picker Modal - Choose between Phone Camera and Zuper Glass
const CameraPickerModal = ({ isOpen, onClose, onSelectCamera, onSelectGlass, isDark, inspectionTitle }) => {
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[101] p-[16px] pb-[32px]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div 
              className="rounded-[20px] overflow-hidden"
              style={{
                background: isDark 
                  ? 'rgba(30, 41, 59, 0.98)' 
                  : 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                boxShadow: '0 -8px 40px rgba(0,0,0,0.3)',
                border: isDark 
                  ? '1px solid rgba(255,255,255,0.1)' 
                  : '1px solid rgba(0,0,0,0.05)',
              }}
            >
              {/* Header */}
              <div className="px-[20px] pt-[20px] pb-[12px] text-center">
                <h3 
                  className="font-['Inter'] font-semibold text-[16px]"
                  style={{ color: isDark ? '#f1f5f9' : '#1f2937' }}
                >
                  Add Photo
                </h3>
                <p 
                  className="font-['Inter'] text-[13px] mt-[4px]"
                  style={{ color: isDark ? '#94a3b8' : '#6b7280' }}
                >
                  {inspectionTitle}
                </p>
              </div>
              
              {/* Camera source toggle - Pill style like Figma */}
              <div className="px-[20px] pb-[20px]">
                <div 
                  className="flex items-center gap-[4px] p-[4px] rounded-[14px] mx-auto w-fit"
                  style={{
                    background: isDark 
                      ? 'rgba(255,255,255,0.08)' 
                      : 'rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Phone Camera Option */}
                  <motion.button
                    className="flex items-center gap-[8px] px-[20px] py-[12px] rounded-[10px]"
                    style={{
                      background: isDark 
                        ? 'linear-gradient(135deg, #8558F2 0%, #6366f1 100%)'
                        : 'linear-gradient(135deg, #0284c7 0%, #0284c7 100%)',
                      boxShadow: isDark 
                        ? '0 4px 12px rgba(133, 88, 242, 0.3)'
                        : '0 4px 12px rgba(2, 132, 199, 0.25)',
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onSelectCamera}
                  >
                    <Camera className="w-[20px] h-[20px] text-white" strokeWidth={2} />
                    <span className="font-['Inter'] font-semibold text-[14px] text-white">
                      Phone
                    </span>
                  </motion.button>
                  
                  {/* Zuper Glass Option */}
                  <motion.button
                    className="flex items-center gap-[8px] px-[20px] py-[12px] rounded-[10px]"
                    style={{
                      background: 'transparent',
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onSelectGlass}
                  >
                    {/* Zuper Glass Icon */}
                    <svg width="24" height="20" viewBox="0 0 43 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        d="M40.2794 7.76959C40.2294 7.71531 38.9987 7.66864 38.8615 7.6496C35.6241 7.19294 32.0929 6.83295 28.6986 7.13818C25.1095 7.46103 22.2821 8.9429 18.5997 8.39244C15.9156 7.99149 13.3231 7.20056 10.5816 7.03914C7.75104 6.87295 4.51584 7.26627 1.8541 7.6496C1.68662 7.67341 0.374827 7.71055 0.320461 7.76959C0.282755 7.81102 0.306869 8.79052 0.316515 8.93385C0.322215 9.02147 0.62868 10.5314 0.671208 10.6062C0.884726 10.9819 1.32974 10.4681 1.70372 11.329C2.65468 13.5214 2.82567 18.1227 4.61449 19.5383C7.77209 22.0364 14.4889 21.3102 16.6995 17.5308C17.6513 15.9037 18.2388 12.9599 19.1657 11.5557C19.185 11.5266 19.5107 11.1681 19.5357 11.1605C19.779 11.0876 20.8098 11.0595 21.0645 11.1605C21.5771 11.3638 23.458 16.9784 24.2471 18.0327C26.6918 21.2997 32.9211 21.963 35.9853 19.5383C37.747 18.1446 37.9991 13.488 38.8965 11.329C39.2477 10.4838 39.7265 10.9543 39.9137 10.6376C40.0641 10.3829 40.1351 9.37955 40.1667 9.07004C40.1711 9.02528 40.2767 9.03909 40.2833 8.93385C40.2929 8.79004 40.3175 7.81102 40.2794 7.76959ZM2.21713 10.4986C1.69276 10.4986 1.26704 10.0367 1.26704 9.46669C1.26704 8.89671 1.69276 8.43482 2.21713 8.43482C2.74149 8.43482 3.16721 8.89671 3.16721 9.46669C3.16721 10.0367 2.74193 10.4986 2.21713 10.4986ZM12.9811 19.3064C8.8822 20.7769 4.44393 20.2483 3.66703 14.8394C2.71431 8.20625 5.47469 7.90673 10.9279 8.29339C11.9188 8.36387 14.3832 8.71243 15.293 9.02718C18.686 10.2 16.1549 18.1674 12.9811 19.3064ZM28.888 19.6831C27.1632 19.3164 25.9404 18.6103 25.0556 16.9037C23.6605 14.2113 22.3719 9.59669 26.2319 8.77671C28.3816 8.32006 31.3607 8.10101 33.5634 8.29339C36.4908 8.54957 36.8885 9.60479 37.0415 12.5714C37.3471 18.5103 34.1465 20.8002 28.888 19.6831ZM38.4221 10.4986C37.8973 10.4986 37.4721 10.0367 37.4721 9.46669C37.4721 8.89671 37.8973 8.43482 38.4221 8.43482C38.947 8.43482 39.3722 8.89671 39.3722 9.46669C39.3722 10.0367 38.947 10.4986 38.4221 10.4986Z" 
                        fill={isDark ? '#94a3b8' : '#6b7280'} 
                        stroke={isDark ? '#94a3b8' : '#6b7280'} 
                        strokeWidth="0.4"
                      />
                    </svg>
                    <span 
                      className="font-['Inter'] font-medium text-[14px]"
                      style={{ color: isDark ? '#94a3b8' : '#6b7280' }}
                    >
                      Glass
                    </span>
                  </motion.button>
                </div>
                
                {/* Tip text */}
                <p 
                  className="font-['Inter'] text-[11px] text-center mt-[16px]"
                  style={{ color: isDark ? '#64748b' : '#64748b' }}
                >
                  Use Phone camera or capture via Zuper Glass
                </p>
              </div>
              
              {/* Cancel button */}
              <div 
                className="px-[20px] py-[14px] border-t"
                style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }}
              >
                <motion.button
                  className="w-full py-[12px] rounded-[12px]"
                  style={{
                    background: isDark 
                      ? 'rgba(255,255,255,0.05)' 
                      : 'rgba(0,0,0,0.03)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                >
                  <span 
                    className="font-['Inter'] font-semibold text-[15px]"
                    style={{ color: isDark ? '#94a3b8' : '#6b7280' }}
                  >
                    Cancel
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Inspection List Item - Gallery-style card with collage preview
const InspectionListItem = ({ session, isDark, index, onClick }) => {
  const totalMedia = session.photoCount + session.videoCount;
  const previewImages = session.media.slice(0, 3);
  const remainingCount = totalMedia - 3;
  const hasVideo = session.media.some(m => m.type === 'video');
  const fileInputRef = useRef(null);
  
  const handleAddPhoto = (e) => {
    e.stopPropagation(); // Prevent card click
    fileInputRef.current?.click(); // Directly open camera
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('New photo captured for:', session.title, file);
      e.target.value = '';
    }
  };
  
  return (
    <motion.div
      className="relative rounded-[16px] overflow-hidden"
      style={{
        boxShadow: isDark 
          ? '0 4px 20px rgba(0,0,0,0.3)' 
          : '0 4px 20px rgba(0,0,0,0.08)',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.25 }}
    >
      {/* Hidden file input for camera */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      {/* Collage Preview - Main + 2 side thumbnails - Clickable for viewing */}
      <div className="relative h-[130px] flex gap-[2px] overflow-hidden cursor-pointer" onClick={onClick}>
        {/* Main large image */}
        <div className="relative flex-1 min-w-0">
          <img 
            src={previewImages[0]?.src} 
            alt={session.title}
            className="w-full h-full object-cover"
          />
          {previewImages[0]?.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center bg-white/90">
                <Play className="w-[14px] h-[14px] text-gray-800 ml-[2px]" fill="currentColor" />
              </div>
            </div>
          )}
        </div>
        
        {/* Side thumbnails column */}
        {previewImages.length > 1 && (
          <div className="w-[85px] flex flex-col gap-[2px] shrink-0">
            {/* Second image */}
            <div className="relative flex-1 overflow-hidden">
              <img 
                src={previewImages[1]?.src} 
                alt=""
                className="w-full h-full object-cover"
              />
              {previewImages[1]?.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="w-[14px] h-[14px] text-white" fill="white" />
                </div>
              )}
            </div>
            
            {/* Third image with +more overlay */}
            {previewImages.length > 2 && (
              <div className="relative flex-1 overflow-hidden">
                <img 
                  src={previewImages[2]?.src} 
                  alt=""
                  className="w-full h-full object-cover"
                />
                {remainingCount > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="font-['Inter'] font-bold text-[14px] text-white">
                      +{remainingCount}
                    </span>
                  </div>
                )}
                {remainingCount <= 0 && previewImages[2]?.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="w-[14px] h-[14px] text-white" fill="white" />
                  </div>
                )}
              </div>
            )}
            
            {/* Placeholder if only 2 images */}
            {previewImages.length === 2 && (
              <div 
                className="flex-1 flex items-center justify-center"
                style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
              >
                {remainingCount > 0 ? (
                  <span className="font-['Inter'] font-bold text-[14px]" style={{ color: isDark ? '#64748b' : '#64748b' }}>
                    +{remainingCount}
                  </span>
                ) : (
                  <Camera className="w-[16px] h-[16px]" style={{ color: isDark ? '#475569' : '#d1d5db' }} />
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Video count badge - only if has videos */}
        {hasVideo && (
          <div 
            className="absolute top-[8px] left-[8px] px-[8px] py-[4px] rounded-[6px] flex items-center gap-[4px]"
            style={{
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <Play className="w-[10px] h-[10px] text-white" fill="white" />
            <span className="font-['Inter'] font-semibold text-[10px] text-white">
              {session.videoCount}
            </span>
          </div>
        )}
      </div>
      
      {/* Info section - Clickable for viewing */}
      <div 
        className="px-[12px] py-[10px] cursor-pointer"
        style={{
          background: isDark 
            ? 'rgba(30, 41, 59, 0.95)' 
            : 'rgba(255,255,255,0.98)',
        }}
        onClick={onClick}
      >
        {/* Title row */}
        <div className="flex items-start justify-between gap-[8px]">
          <div className="flex-1 min-w-0">
            <h3 className="font-['Inter'] font-semibold text-[14px] truncate" style={{ color: isDark ? '#f1f5f9' : '#1f2937' }}>
              {session.title}
            </h3>
            <p className="font-['Inter'] text-[11px] mt-[2px]" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
              {session.client}
            </p>
          </div>
          
          {/* Add Photo Button - Simple camera with plus (like WhatsApp/Instagram) */}
          <motion.button
            className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center shrink-0 relative"
            style={{ 
              background: isDark 
                ? 'rgba(133, 88, 242, 0.15)' 
                : 'rgba(2, 132, 199, 0.08)',
              border: isDark 
                ? '1.5px solid rgba(133, 88, 242, 0.3)' 
                : '1.5px solid rgba(2, 132, 199, 0.2)',
            }}
            whileTap={{ scale: 0.92 }}
            onClick={handleAddPhoto}
            title="Add photo"
          >
            <CameraPlusIcon 
              className="w-[22px] h-[22px]" 
              style={{ color: isDark ? '#a78bfa' : '#0284c7' }} 
            />
          </motion.button>
        </div>
        
        {/* Meta row */}
        <div className="flex items-center gap-[10px] mt-[8px]">
          <div className="flex items-center gap-[4px]">
            <Clock className="w-[11px] h-[11px]" style={{ color: isDark ? '#64748b' : '#64748b' }} />
            <span className="font-['Inter'] text-[10px]" style={{ color: isDark ? '#64748b' : '#64748b' }}>
              {session.dateLabel}
            </span>
          </div>
          <div className="w-[3px] h-[3px] rounded-full" style={{ background: isDark ? '#475569' : '#d1d5db' }} />
          <div className="flex items-center gap-[4px]">
            <MapPin className="w-[11px] h-[11px]" style={{ color: isDark ? '#64748b' : '#64748b' }} />
            <span className="font-['Inter'] text-[10px] truncate" style={{ color: isDark ? '#64748b' : '#64748b' }}>
              {session.location.split(',')[0]}
            </span>
          </div>
          <div className="w-[3px] h-[3px] rounded-full" style={{ background: isDark ? '#475569' : '#d1d5db' }} />
          <div className="flex items-center gap-[4px]">
            <Camera className="w-[10px] h-[10px]" style={{ color: isDark ? '#64748b' : '#64748b' }} />
            <span className="font-['Inter'] text-[10px]" style={{ color: isDark ? '#64748b' : '#64748b' }}>
              {totalMedia} {totalMedia === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
      </div>
      
    </motion.div>
  );
};

// Minimal Filter Bar - Mobile Best Practice
const FilterBar = ({ dateFilter, mediaType, groupBy, onDateChange, onMediaTypeChange, onGroupByChange, isDark }) => {
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = dateFilter !== 'all' || mediaType !== 'all';
  const activeFilterCount = (dateFilter !== 'all' ? 1 : 0) + (mediaType !== 'all' ? 1 : 0);

  return (
    <div className="flex flex-col gap-[10px]">
      {/* Top Row: Group Toggle + Filter Button */}
      <div className="flex items-center justify-between">
        {/* Group Toggle */}
        <div 
          className="flex items-center p-[3px] rounded-[10px]"
          style={{
            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
          }}
        >
          {groupByOptions.map((option) => (
            <motion.button
              key={option.id}
              className="px-[12px] py-[6px] rounded-[7px]"
              style={{
                background: groupBy === option.id 
                  ? (isDark ? 'rgba(133, 88, 242, 0.25)' : 'rgba(2, 132, 199, 0.1)')
                  : 'transparent',
                boxShadow: groupBy === option.id 
                  ? (isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.06)')
                  : 'none',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onGroupByChange(option.id)}
            >
              <span 
                className="font-['Inter'] font-semibold text-[11px]"
                style={{ color: groupBy === option.id ? (isDark ? '#8558F2' : '#0284c7') : (isDark ? '#94a3b8' : '#6b7280') }}
              >
                {option.id === 'inspection' ? 'Jobs' : 'Timeline'}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Filter Toggle Button */}
        <motion.button
          className="flex items-center gap-[6px] px-[12px] py-[7px] rounded-[10px]"
          style={{
            background: showFilters || hasActiveFilters 
              ? (isDark ? 'rgba(133, 88, 242, 0.12)' : 'rgba(2, 132, 199, 0.08)')
              : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
            border: showFilters || hasActiveFilters 
              ? (isDark ? '1px solid rgba(133, 88, 242, 0.2)' : '1px solid rgba(2, 132, 199, 0.15)')
              : (isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)'),
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-[14px] h-[14px]" style={{ color: showFilters || hasActiveFilters ? (isDark ? '#8558F2' : '#0284c7') : (isDark ? '#94a3b8' : '#6b7280') }} />
          <span className="font-['Inter'] font-medium text-[11px]" style={{ color: showFilters || hasActiveFilters ? (isDark ? '#8558F2' : '#0284c7') : (isDark ? '#e2e8f0' : '#374151') }}>
            Filters
          </span>
          {hasActiveFilters && !showFilters && (
            <span 
              className="w-[16px] h-[16px] rounded-full flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: isDark ? '#8558F2' : '#0284c7' }}
            >
              {activeFilterCount}
            </span>
          )}
          <ChevronDown 
            className="w-[12px] h-[12px] transition-transform duration-200" 
            style={{ 
              color: showFilters || hasActiveFilters ? (isDark ? '#8558F2' : '#0284c7') : (isDark ? '#64748b' : '#64748b'),
              transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)'
            }} 
          />
        </motion.button>
      </div>

      {/* Expandable Filter Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="rounded-[12px] overflow-hidden"
            style={{
              background: isDark 
                ? 'rgba(30, 41, 59, 0.6)' 
                : 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: isDark 
                ? '1px solid rgba(255,255,255,0.08)' 
                : '1px solid rgba(0,0,0,0.06)',
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-[12px]">
              {/* Date Range */}
              <div className="mb-[12px]">
                <span className="font-['Inter'] font-medium text-[10px] block mb-[8px]" style={{ color: isDark ? '#64748b' : '#64748b' }}>
                  Date Range
                </span>
                <div className="flex flex-wrap gap-[6px]">
                  {dateFilters.map((filter) => (
                    <motion.button
                      key={filter.id}
                      className="px-[10px] py-[6px] rounded-[8px]"
                      style={{
                        background: dateFilter === filter.id 
                          ? (isDark ? 'rgba(133, 88, 242, 0.15)' : 'rgba(2, 132, 199, 0.1)')
                          : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                        border: dateFilter === filter.id 
                          ? (isDark ? '1px solid rgba(133, 88, 242, 0.3)' : '1px solid rgba(2, 132, 199, 0.2)')
                          : 'transparent',
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onDateChange(filter.id)}
                    >
                      <span 
                        className="font-['Inter'] font-medium text-[11px]"
                        style={{ color: dateFilter === filter.id ? (isDark ? '#8558F2' : '#0284c7') : (isDark ? '#e2e8f0' : '#374151') }}
                      >
                        {filter.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Media Type */}
              <div>
                <span className="font-['Inter'] font-medium text-[10px] block mb-[8px]" style={{ color: isDark ? '#64748b' : '#64748b' }}>
                  Media Type
                </span>
                <div className="flex gap-[6px]">
                  {mediaTypeFilters.map((filter) => (
                    <motion.button
                      key={filter.id}
                      className="flex-1 flex items-center justify-center gap-[6px] px-[10px] py-[8px] rounded-[8px]"
                      style={{
                        background: mediaType === filter.id 
                          ? (isDark ? 'rgba(133, 88, 242, 0.15)' : 'rgba(2, 132, 199, 0.1)')
                          : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'),
                        border: mediaType === filter.id 
                          ? (isDark ? '1px solid rgba(133, 88, 242, 0.3)' : '1px solid rgba(2, 132, 199, 0.2)')
                          : 'transparent',
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onMediaTypeChange(filter.id)}
                    >
                      <filter.icon className="w-[14px] h-[14px]" style={{ color: mediaType === filter.id ? (isDark ? '#8558F2' : '#0284c7') : (isDark ? '#94a3b8' : '#6b7280') }} />
                      <span 
                        className="font-['Inter'] font-medium text-[11px]"
                        style={{ color: mediaType === filter.id ? (isDark ? '#8558F2' : '#0284c7') : (isDark ? '#e2e8f0' : '#374151') }}
                      >
                        {filter.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <motion.button
                  className="w-full mt-[12px] py-[8px] rounded-[8px] flex items-center justify-center gap-[6px]"
                  style={{ background: isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.08)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { onDateChange('all'); onMediaTypeChange('all'); }}
                >
                  <X className="w-[12px] h-[12px]" style={{ color: '#ef4444' }} />
                  <span className="font-['Inter'] font-medium text-[11px]" style={{ color: '#ef4444' }}>
                    Clear all filters
                  </span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Chips - Show when filters closed but active */}
      {!showFilters && hasActiveFilters && (
        <motion.div
          className="flex items-center gap-[6px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {dateFilter !== 'all' && (
            <div 
              className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px]"
              style={{ background: isDark ? 'rgba(133, 88, 242, 0.15)' : 'rgba(2, 132, 199, 0.1)' }}
            >
              <Calendar className="w-[11px] h-[11px]" style={{ color: isDark ? '#8558F2' : '#0284c7' }} />
              <span className="font-['Inter'] font-medium text-[10px]" style={{ color: isDark ? '#8558F2' : '#0284c7' }}>
                {dateFilters.find(d => d.id === dateFilter)?.label}
              </span>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => onDateChange('all')}>
                <X className="w-[10px] h-[10px]" style={{ color: isDark ? '#8558F2' : '#0284c7' }} />
              </motion.button>
            </div>
          )}
          {mediaType !== 'all' && (
            <div 
              className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px]"
              style={{ background: isDark ? 'rgba(133, 88, 242, 0.15)' : 'rgba(2, 132, 199, 0.1)' }}
            >
              {mediaType === 'photo' ? (
                <Image className="w-[11px] h-[11px]" style={{ color: isDark ? '#8558F2' : '#0284c7' }} />
              ) : (
                <Video className="w-[11px] h-[11px]" style={{ color: isDark ? '#8558F2' : '#0284c7' }} />
              )}
              <span className="font-['Inter'] font-medium text-[10px]" style={{ color: isDark ? '#8558F2' : '#0284c7' }}>
                {mediaType === 'photo' ? 'Photos' : 'Videos'}
              </span>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => onMediaTypeChange('all')}>
                <X className="w-[10px] h-[10px]" style={{ color: isDark ? '#8558F2' : '#0284c7' }} />
              </motion.button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};


// Sync Banner - Clean & Modern
const SyncBanner = ({ isDark }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) return null;
  
  // Theme-aware accent colors: Purple for dark, Teal for light
  const accentColor = isDark ? '#8558F2' : '#0284c7';
  const accentBgLight = isDark ? 'rgba(133, 88, 242, 0.08)' : 'rgba(2, 132, 199, 0.06)';
  const accentBgMedium = isDark ? 'rgba(133, 88, 242, 0.15)' : 'rgba(2, 132, 199, 0.1)';
  const accentBorder = isDark ? 'rgba(133, 88, 242, 0.15)' : 'rgba(2, 132, 199, 0.12)';
  const accentShadow = isDark ? 'rgba(133, 88, 242, 0.3)' : 'rgba(2, 132, 199, 0.25)';

  return (
    <motion.div
      className="w-full rounded-[12px] p-[10px] flex items-center gap-[10px]"
      style={{
        background: accentBgLight,
        border: `1px solid ${accentBorder}`,
      }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      {/* Glass Icon - Static */}
      <div 
        className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center shrink-0"
        style={{ background: accentBgMedium }}
      >
        <svg width="18" height="12" viewBox="0 0 43 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40.2794 7.76959C40.2294 7.71531 38.9987 7.66864 38.8615 7.6496C35.6241 7.19294 32.0929 6.83295 28.6986 7.13818C25.1095 7.46103 22.2821 8.9429 18.5997 8.39244C15.9156 7.99149 13.3231 7.20056 10.5816 7.03914C7.75104 6.87295 4.51584 7.26627 1.8541 7.6496C1.68662 7.67341 0.374827 7.71055 0.320461 7.76959C0.282755 7.81102 0.306869 8.79052 0.316515 8.93385C0.322215 9.02147 0.62868 10.5314 0.671208 10.6062C0.884726 10.9819 1.32974 10.4681 1.70372 11.329C2.65468 13.5214 2.82567 18.1227 4.61449 19.5383C7.77209 22.0364 14.4889 21.3102 16.6995 17.5308C17.6513 15.9037 18.2388 12.9599 19.1657 11.5557C19.185 11.5266 19.5107 11.1681 19.5357 11.1605C19.779 11.0876 20.8098 11.0595 21.0645 11.1605C21.5771 11.3638 23.458 16.9784 24.2471 18.0327C26.6918 21.2997 32.9211 21.963 35.9853 19.5383C37.747 18.1446 37.9991 13.488 38.8965 11.329C39.2477 10.4838 39.7265 10.9543 39.9137 10.6376C40.0641 10.3829 40.1351 9.37955 40.1667 9.07004C40.1711 9.02528 40.2767 9.03909 40.2833 8.93385C40.2929 8.79004 40.3175 7.81102 40.2794 7.76959Z" fill={accentColor}/>
        </svg>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-[6px]">
          <span className="font-['Inter'] font-semibold text-[12px]" style={{ color: isDark ? '#f1f5f9' : '#1f2937' }}>
            6 new items
          </span>
          <span 
            className="px-[6px] py-[2px] rounded-[4px] font-['Inter'] font-medium text-[9px]"
            style={{ 
              background: accentBgMedium,
              color: accentColor
            }}
          >
            Glass
          </span>
        </div>
        <p className="font-['Inter'] text-[10px] mt-[1px]" style={{ color: isDark ? '#64748b' : '#64748b' }}>
          Tap to sync to your gallery
        </p>
      </div>
      
      {/* Sync Button */}
      <motion.button 
        className="px-[14px] py-[8px] rounded-[8px] flex items-center gap-[6px]"
        style={{ 
          background: accentColor,
          boxShadow: `0 2px 8px ${accentShadow}`,
        }}
        whileTap={{ scale: 0.95 }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 3C14.5 3 16.5 4 18 5.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M21 3V8H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="font-['Inter'] font-semibold text-[11px] text-white">Sync</span>
      </motion.button>
      
      {/* Dismiss Button */}
      <motion.button 
        className="w-[24px] h-[24px] rounded-full flex items-center justify-center shrink-0"
        style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsVisible(false)}
      >
        <X className="w-[12px] h-[12px]" style={{ color: isDark ? '#64748b' : '#64748b' }} />
      </motion.button>
    </motion.div>
  );
};

// Main Gallery Page - OriginOS 6 Style
export const GalleryPage = ({ isDark = false }) => {
  const [dateFilter, setDateFilter] = useState('all');
  const [mediaType, setMediaType] = useState('all');
  const [groupBy, setGroupBy] = useState('inspection');

  // Filter and group sessions
  const { filteredSessions, groupedByDate, allMedia, stats } = useMemo(() => {
    let sessions = [...inspectionSessions];
    
    // Apply date filter
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

    if (dateFilter !== 'all') {
      sessions = sessions.filter(session => {
        switch (dateFilter) {
          case 'today': return session.date === today;
          case 'yesterday': return session.date === yesterday;
          case 'week': return session.date >= weekAgo;
          case 'month': return session.date >= monthAgo;
          default: return true;
        }
      });
    }

    // Apply media type filter to sessions (filter their media)
    if (mediaType !== 'all') {
      sessions = sessions.map(session => ({
        ...session,
        media: session.media.filter(item => item.type === mediaType),
        photoCount: mediaType === 'photo' ? session.media.filter(m => m.type === 'photo').length : 0,
        videoCount: mediaType === 'video' ? session.media.filter(m => m.type === 'video').length : 0,
      })).filter(session => session.media.length > 0);
    }

    // Flatten all media for grid preview
    const allMediaItems = sessions.flatMap(s => s.media);

    // Group by date if needed
    const groupedByDate = {};
    sessions.forEach(session => {
      if (!groupedByDate[session.date]) {
        groupedByDate[session.date] = [];
      }
      groupedByDate[session.date].push(session);
    });

    // Sort dates descending
    const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

    // Calculate stats
    const photos = allMediaItems.filter(m => m.type === 'photo').length;
    const videos = allMediaItems.filter(m => m.type === 'video').length;

    return {
      filteredSessions: sessions,
      groupedByDate: sortedDates.map(date => ({
        date,
        sessions: groupedByDate[date],
        media: groupedByDate[date].flatMap(s => s.media),
      })),
      allMedia: allMediaItems,
      stats: { photos, videos, total: allMediaItems.length }
    };
  }, [dateFilter, mediaType]);

  return (
    <motion.div 
      className="flex flex-col gap-[14px] w-full"
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.25 }}
    >
      {/* Gallery Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Space_Grotesk'] font-bold text-[24px] leading-[1]" style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>
            Gallery
          </h1>
          <p className="font-['Inter'] text-[11px] mt-[3px]" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>
            {stats.photos} photos • {stats.videos} videos
          </p>
        </div>
      </div>

      {/* Sync Banner */}
      <SyncBanner isDark={isDark} />

      {/* Filter Bar */}
      <FilterBar
        dateFilter={dateFilter}
        mediaType={mediaType}
        groupBy={groupBy}
        onDateChange={setDateFilter}
        onMediaTypeChange={setMediaType}
        onGroupByChange={setGroupBy}
        isDark={isDark}
      />

      {/* Content based on Group By */}
      {groupBy === 'inspection' ? (
        <>
          {/* Simple List of All Inspections */}
          {filteredSessions.length > 0 ? (
            <div className="flex flex-col gap-[10px]">
              {filteredSessions.map((session, index) => (
                <InspectionListItem 
                  key={session.id}
                  session={session}
                  isDark={isDark}
                  index={index}
                  onClick={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-[40px]">
              <div 
                className="w-[56px] h-[56px] rounded-[14px] flex items-center justify-center mb-[12px]"
                style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
              >
                <Camera className="w-[24px] h-[24px]" style={{ color: isDark ? '#475569' : '#64748b' }} />
              </div>
              <p className="font-['Inter'] font-medium text-[13px]" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
                No inspections found
              </p>
              <p className="font-['Inter'] text-[11px] mt-[4px]" style={{ color: isDark ? '#64748b' : '#64748b' }}>
                Adjust filters or sync from Glass
              </p>
            </div>
          )}
        </>
      ) : (
        /* Grouped by Date - Clean Photo Grid Only */
        <>
          {groupedByDate.length > 0 ? (
            <div className="flex flex-col gap-[16px]">
              {groupedByDate.map((dateGroup) => {
                const dateObj = new Date(dateGroup.date);
                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                
                let dateLabel = dateGroup.date;
                if (dateGroup.date === today.toISOString().split('T')[0]) {
                  dateLabel = 'Today';
                } else if (dateGroup.date === yesterday.toISOString().split('T')[0]) {
                  dateLabel = 'Yesterday';
                } else {
                  dateLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                }

                const photoCount = dateGroup.media.filter(m => m.type === 'photo').length;
                const videoCount = dateGroup.media.filter(m => m.type === 'video').length;

                return (
                  <div key={dateGroup.date} className="flex flex-col gap-[8px]">
                    {/* Date Header - Minimal */}
                    <div className="flex items-center justify-between px-[2px]">
                      <span className="font-['Inter'] font-semibold text-[13px]" style={{ color: isDark ? '#e2e8f0' : '#1f2937' }}>
                        {dateLabel}
                      </span>
                      <span className="font-['Inter'] text-[11px]" style={{ color: isDark ? '#64748b' : '#64748b' }}>
                        {photoCount > 0 && `${photoCount} photo${photoCount > 1 ? 's' : ''}`}
                        {photoCount > 0 && videoCount > 0 && ' • '}
                        {videoCount > 0 && `${videoCount} video${videoCount > 1 ? 's' : ''}`}
                      </span>
                    </div>

                    {/* Photo Grid - All media for this date */}
                    <div className="grid grid-cols-3 gap-[3px]">
                      {dateGroup.media.map((item, index) => (
                        <GridItem 
                          key={item.id}
                          item={item}
                          index={index}
                          isDark={isDark}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center py-[60px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div 
                className="w-[64px] h-[64px] rounded-[16px] flex items-center justify-center mb-[16px]"
                style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
              >
                <Image className="w-[28px] h-[28px]" style={{ color: isDark ? '#475569' : '#64748b' }} />
              </div>
              <p className="font-['Inter'] font-medium text-[14px]" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
                No media found
              </p>
              <p className="font-['Inter'] text-[12px] mt-[4px]" style={{ color: isDark ? '#64748b' : '#64748b' }}>
                Try adjusting your filters
              </p>
            </motion.div>
          )}
        </>
      )}

      {/* Empty State for Inspection View */}
      {groupBy === 'inspection' && filteredSessions.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center py-[60px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div 
            className="w-[64px] h-[64px] rounded-[16px] flex items-center justify-center mb-[16px]"
            style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
          >
            <Image className="w-[28px] h-[28px]" style={{ color: isDark ? '#475569' : '#64748b' }} />
          </div>
          <p className="font-['Inter'] font-medium text-[14px]" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
            No media found
          </p>
          <p className="font-['Inter'] text-[12px] mt-[4px]" style={{ color: isDark ? '#64748b' : '#64748b' }}>
            Try adjusting your filters
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GalleryPage;
