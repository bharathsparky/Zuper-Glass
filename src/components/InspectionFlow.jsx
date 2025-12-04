import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Camera, FileText, Clock, Calendar, ChevronRight, ChevronLeft,
  X, Check, Edit3, Trash2, MoreVertical, Share2, Download,
  Building, User, Phone, Mail, Navigation, Loader2, CheckCircle,
  Image, Video, Mic, AlertCircle, Tag, Layers, Plus, Play,
  Eye, Filter, Grid, List, ChevronDown, Star, Bookmark
} from 'lucide-react';

// ============ THEME HELPERS ============

const getAccentColors = (isDark) => ({
  primary: isDark ? '#8558F2' : '#0284c7',
  primaryLight: isDark ? '#a78bfa' : '#0ea5e9',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
});

const getTextColors = (isDark) => ({
  primary: isDark ? '#f8fafc' : '#0f172a',
  secondary: isDark ? '#e2e8f0' : '#1e293b',
  description: isDark ? '#cbd5e1' : '#475569',
  muted: isDark ? '#94a3b8' : '#64748b',
});

// ============ SAMPLE DATA ============

const sampleInspections = [
  {
    id: 'insp-001',
    name: 'Roof Inspection - Oak Street',
    address: '123 Oak Street, Austin, TX 78701',
    coordinates: { lat: 30.2672, lng: -97.7431 },
    status: 'in_progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customer: {
      name: 'John Smith',
      phone: '+1 (512) 555-0123',
      email: 'john.smith@email.com',
    },
    stats: {
      photos: 12,
      videos: 2,
      notes: 5,
      issues: 3,
    },
    tags: ['residential', 'storm-damage', 'insurance'],
  },
  {
    id: 'insp-002',
    name: 'HVAC Assessment - Downtown',
    address: '456 Congress Ave, Austin, TX 78701',
    coordinates: { lat: 30.2650, lng: -97.7467 },
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    customer: {
      name: 'Sarah Johnson',
      phone: '+1 (512) 555-0456',
      email: 'sarah.j@company.com',
    },
    stats: {
      photos: 24,
      videos: 1,
      notes: 8,
      issues: 5,
    },
    tags: ['commercial', 'hvac', 'maintenance'],
  },
];

const samplePhotos = [
  { id: 'p1', thumbnail: '/assets/roof.jpg', timestamp: new Date().toISOString(), hasIssue: true },
  { id: 'p2', thumbnail: '/assets/figma-assets/b1a1c0916bdb66e9db5731c51c4fbb07d1abfb38.png', timestamp: new Date(Date.now() - 300000).toISOString(), hasIssue: false },
  { id: 'p3', thumbnail: '/assets/figma-assets/56df3619d8df85708e8adc185a252e252435c1fc.png', timestamp: new Date(Date.now() - 600000).toISOString(), hasIssue: true },
  { id: 'p4', thumbnail: '/assets/figma-assets/5325763621f455fe5b2c718c4ff4d2c76be65ac9.png', timestamp: new Date(Date.now() - 900000).toISOString(), hasIssue: false },
  { id: 'p5', thumbnail: '/assets/figma-assets/4c915fdcd5c975eda61c351287eaef3f0e5aa4aa.png', timestamp: new Date(Date.now() - 1200000).toISOString(), hasIssue: false },
  { id: 'p6', thumbnail: '/assets/roof.jpg', timestamp: new Date(Date.now() - 1500000).toISOString(), hasIssue: true },
];

const sampleNotes = [
  { id: 'n1', title: 'Roof damage found', content: 'Three cracked shingles near the ridge line, possible wind damage.', severity: 'high', timestamp: new Date().toISOString() },
  { id: 'n2', title: 'Gutter condition', content: 'Gutters are clean but showing signs of rust on north side.', severity: 'medium', timestamp: new Date(Date.now() - 600000).toISOString() },
  { id: 'n3', title: 'Ventilation check', content: 'All roof vents are clear and functioning properly.', severity: 'low', timestamp: new Date(Date.now() - 1200000).toISOString() },
];

// ============ QUICK CREATE INSPECTION ============

export const CreateInspectionModal = ({ isOpen, onClose, onCreated, isDark = false }) => {
  const [step, setStep] = useState(1); // 1: Location, 2: Name, 3: Success
  const [isLocating, setIsLocating] = useState(true);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [inspectionName, setInspectionName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef(null);
  
  const textColors = getTextColors(isDark);
  const accentColors = getAccentColors(isDark);
  
  // Simulate location fetch
  useEffect(() => {
    if (isOpen && step === 1) {
      setIsLocating(true);
      const timer = setTimeout(() => {
        setLocation({ lat: 30.2672, lng: -97.7431 });
        setAddress('123 Oak Street, Austin, TX 78701');
        setIsLocating(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, step]);
  
  // Auto-focus input when step changes
  useEffect(() => {
    if (step === 2 && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [step]);
  
  // Generate default name based on address
  useEffect(() => {
    if (address && !inspectionName) {
      const streetName = address.split(',')[0];
      const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      setInspectionName(`Inspection - ${streetName}`);
    }
  }, [address]);
  
  const handleCreate = async () => {
    setIsCreating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newInspection = {
      id: `insp-${Date.now()}`,
      name: inspectionName,
      address: address,
      coordinates: location,
      status: 'in_progress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customer: null,
      stats: { photos: 0, videos: 0, notes: 0, issues: 0 },
      tags: [],
    };
    
    setIsCreating(false);
    setStep(3);
    
    setTimeout(() => {
      onCreated?.(newInspection);
    }, 1200);
  };
  
  const handleClose = () => {
    setStep(1);
    setLocation(null);
    setAddress('');
    setInspectionName('');
    setIsLocating(true);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      className="absolute inset-0 z-[100] flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <motion.div
        className="relative w-full rounded-t-[28px] overflow-hidden"
        style={{
          background: isDark 
            ? 'linear-gradient(180deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.3)',
          maxHeight: '75vh',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-[12px] pb-[4px]">
          <div 
            className="w-[40px] h-[4px] rounded-full"
            style={{ background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }}
          />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-[20px] py-[12px]">
          <motion.button
            className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center"
            style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClose}
          >
            <X className="w-[18px] h-[18px]" style={{ color: textColors.muted }} />
          </motion.button>
          
          <h2 className="font-['Space_Grotesk'] font-bold text-[18px]" style={{ color: textColors.primary }}>
            {step === 3 ? 'Created!' : 'Quick Create'}
          </h2>
          
          <div className="w-[36px]" /> {/* Spacer */}
        </div>
        
        {/* Progress Indicators */}
        <div className="flex items-center justify-center gap-[8px] px-[20px] pb-[16px]">
          {[1, 2, 3].map((s) => (
            <motion.div
              key={s}
              className="h-[4px] rounded-full"
              style={{
                width: step === s ? '32px' : '8px',
                background: step >= s ? accentColors.primary : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
              }}
              animate={{ width: step === s ? '32px' : '8px' }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
        
        {/* Content */}
        <div className="px-[20px] pb-[32px]">
          <AnimatePresence mode="wait">
            {/* Step 1: Location */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center"
              >
                {/* Location Icon */}
                <motion.div
                  className="w-[80px] h-[80px] rounded-[24px] flex items-center justify-center mb-[20px]"
                  style={{
                    background: `linear-gradient(135deg, ${accentColors.primary}20 0%, ${accentColors.primaryLight}20 100%)`,
                    border: `1px solid ${accentColors.primary}30`,
                  }}
                  animate={isLocating ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 1.5, repeat: isLocating ? Infinity : 0 }}
                >
                  {isLocating ? (
                    <Loader2 className="w-[32px] h-[32px] animate-spin" style={{ color: accentColors.primary }} />
                  ) : (
                    <MapPin className="w-[32px] h-[32px]" style={{ color: accentColors.primary }} />
                  )}
                </motion.div>
                
                <h3 className="font-['Inter'] font-semibold text-[16px] mb-[8px]" style={{ color: textColors.primary }}>
                  {isLocating ? 'Finding your location...' : 'Location found!'}
                </h3>
                
                {!isLocating && address && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <p className="font-['Inter'] text-[14px] mb-[4px]" style={{ color: textColors.description }}>
                      {address}
                    </p>
                    <p className="font-['Inter'] text-[11px]" style={{ color: textColors.muted }}>
                      {location?.lat.toFixed(4)}, {location?.lng.toFixed(4)}
                    </p>
                  </motion.div>
                )}
                
                {/* Continue Button */}
                {!isLocating && (
                  <motion.button
                    className="w-full py-[14px] rounded-[12px] mt-[24px] flex items-center justify-center gap-[8px]"
                    style={{
                      background: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.primaryLight} 100%)`,
                      boxShadow: `0 8px 24px ${accentColors.primary}40`,
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(2)}
                  >
                    <span className="font-['Inter'] font-semibold text-[14px] text-white">Continue</span>
                    <ChevronRight className="w-[18px] h-[18px] text-white" />
                  </motion.button>
                )}
              </motion.div>
            )}
            
            {/* Step 2: Name */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Name Input */}
                <div 
                  className="rounded-[14px] overflow-hidden mb-[16px]"
                  style={{
                    background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.04)',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                  }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inspectionName}
                    onChange={(e) => setInspectionName(e.target.value)}
                    placeholder="Enter inspection name..."
                    className="w-full px-[16px] py-[14px] bg-transparent outline-none font-['Inter'] text-[15px]"
                    style={{ color: textColors.primary }}
                  />
                </div>
                
                {/* Visual Map Location Preview */}
                <div 
                  className="rounded-[14px] overflow-hidden mb-[20px]"
                  style={{
                    background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.8)',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
                  }}
                >
                  {/* Mini Map */}
                  <div className="relative h-[100px] overflow-hidden">
                    {/* Map Background */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: isDark
                          ? 'linear-gradient(135deg, #1a2744 0%, #243b55 50%, #1e3a5f 100%)'
                          : 'linear-gradient(135deg, #e8f4f8 0%, #d4e8ed 50%, #c5dde5 100%)',
                      }}
                    />
                    
                    {/* Grid Pattern */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `
                          linear-gradient(${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 1px, transparent 1px),
                          linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 1px, transparent 1px)
                        `,
                        backgroundSize: '16px 16px',
                      }}
                    />
                    
                    {/* Roads */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
                      <path d="M 0,50 L 200,50" stroke={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'} strokeWidth="6" fill="none"/>
                      <path d="M 100,0 L 100,100" stroke={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'} strokeWidth="4" fill="none"/>
                    </svg>
                    
                    {/* Location Pin - Centered */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Pulse Animation */}
                      <motion.div
                        className="absolute w-[40px] h-[40px] rounded-full"
                        style={{ background: `${accentColors.success}30` }}
                        animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      {/* Pin */}
                      <div 
                        className="relative flex flex-col items-center"
                        style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))' }}
                      >
                        <div 
                          className="w-[32px] h-[32px] rounded-full flex items-center justify-center"
                          style={{ 
                            background: `linear-gradient(135deg, ${accentColors.success} 0%, #34d399 100%)`,
                            boxShadow: `0 4px 12px ${accentColors.success}50`,
                          }}
                        >
                          <MapPin className="w-[16px] h-[16px] text-white" />
                        </div>
                        <div 
                          className="w-0 h-0 -mt-[2px]"
                          style={{
                            borderLeft: '7px solid transparent',
                            borderRight: '7px solid transparent',
                            borderTop: `9px solid ${accentColors.success}`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Address */}
                  <div className="p-[12px] flex items-center gap-[10px]">
                    <div 
                      className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center shrink-0"
                      style={{ background: `${accentColors.success}15` }}
                    >
                      <CheckCircle className="w-[16px] h-[16px]" style={{ color: accentColors.success }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-['Inter'] font-medium text-[12px] truncate" style={{ color: textColors.primary }}>
                        {address.split(',')[0]}
                      </p>
                      <p className="font-['Inter'] text-[11px] truncate" style={{ color: textColors.muted }}>
                        {address.split(',').slice(1).join(',').trim()}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-[10px]">
                  <motion.button
                    className="flex-1 py-[14px] rounded-[12px] flex items-center justify-center"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(1)}
                  >
                    <ChevronLeft className="w-[16px] h-[16px] mr-[4px]" style={{ color: textColors.description }} />
                    <span className="font-['Inter'] font-medium text-[14px]" style={{ color: textColors.primary }}>Back</span>
                  </motion.button>
                  
                  <motion.button
                    className="flex-[2] py-[14px] rounded-[12px] flex items-center justify-center gap-[8px]"
                    style={{
                      background: inspectionName.trim() 
                        ? `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.primaryLight} 100%)`
                        : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                      boxShadow: inspectionName.trim() ? `0 8px 24px ${accentColors.primary}40` : 'none',
                      opacity: inspectionName.trim() ? 1 : 0.5,
                    }}
                    whileTap={inspectionName.trim() ? { scale: 0.98 } : {}}
                    onClick={inspectionName.trim() ? handleCreate : undefined}
                    disabled={!inspectionName.trim() || isCreating}
                  >
                    {isCreating ? (
                      <Loader2 className="w-[18px] h-[18px] animate-spin text-white" />
                    ) : (
                      <>
                        <Check className="w-[18px] h-[18px] text-white" />
                        <span className="font-['Inter'] font-semibold text-[14px] text-white">Create & Start</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
            
            {/* Step 3: Success */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-[20px]"
              >
                {/* Success Animation */}
                <motion.div
                  className="w-[80px] h-[80px] rounded-full flex items-center justify-center mb-[20px]"
                  style={{
                    background: `linear-gradient(135deg, ${accentColors.success}20 0%, ${accentColors.success}10 100%)`,
                    border: `2px solid ${accentColors.success}`,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15, delay: 0.1 }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 15, delay: 0.3 }}
                  >
                    <CheckCircle className="w-[40px] h-[40px]" style={{ color: accentColors.success }} />
                  </motion.div>
                </motion.div>
                
                <motion.h3 
                  className="font-['Space_Grotesk'] font-bold text-[20px] mb-[8px]"
                  style={{ color: textColors.primary }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Inspection Created!
                </motion.h3>
                
                <motion.p 
                  className="font-['Inter'] text-[14px] text-center"
                  style={{ color: textColors.muted }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Ready to capture photos and notes
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============ INSPECTION DETAILS PAGE ============

export const InspectionDetailsPage = ({ 
  inspection = sampleInspections[0], 
  onBack, 
  onTakePhoto,
  onAddNote,
  isDark = false 
}) => {
  const [activeTab, setActiveTab] = useState('photos'); // 'photos' | 'notes'
  const [showNoteMenu, setShowNoteMenu] = useState(false);
  const textColors = getTextColors(isDark);
  const accentColors = getAccentColors(isDark);
  
  const statusConfig = {
    in_progress: { label: 'In Progress', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
    completed: { label: 'Completed', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    draft: { label: 'Draft', color: '#64748b', bg: 'rgba(100, 116, 139, 0.15)' },
  };
  
  const status = statusConfig[inspection.status] || statusConfig.draft;
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {/* Hero Cover with Blended Title */}
      <div className="relative h-[240px] shrink-0">
        {/* Cover Image */}
        <div className="absolute inset-0">
          <img 
            src="/assets/roof.jpg"
            alt="Site cover"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay - Darker at bottom for text */}
          <div 
            className="absolute inset-0"
            style={{
              background: isDark
                ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.4) 40%, rgba(15, 23, 42, 0.85) 70%, rgba(15, 23, 42, 0.98) 100%)'
                : 'linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.2) 40%, rgba(0, 0, 0, 0.6) 70%, rgba(0, 0, 0, 0.85) 100%)',
            }}
          />
        </div>
        
        {/* Top Navigation */}
        <div className="absolute top-[12px] left-[16px] right-[16px] flex items-center justify-between z-10">
          <motion.button
            className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
          >
            <ChevronLeft className="w-[22px] h-[22px] text-white" />
          </motion.button>
          
          <div className="flex items-center gap-[8px]">
            {/* Mark Complete Button */}
            <motion.button
              className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
              whileTap={{ scale: 0.9 }}
            >
              <Check className="w-[20px] h-[20px] text-white" />
            </motion.button>
            
            {/* Edit Button */}
            <motion.button
              className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit3 className="w-[18px] h-[18px] text-white" />
            </motion.button>
          </div>
        </div>
        
        {/* Title & Info - Overlaid on Hero */}
        <div className="absolute bottom-0 left-0 right-0 px-[20px] pb-[20px] z-10">
          {/* Title Row */}
          <div className="flex items-end justify-between gap-[12px] mb-[10px]">
            <h1 className="font-['Space_Grotesk'] font-bold text-[22px] leading-tight text-white flex-1">
              {inspection.name}
            </h1>
            <span className="font-['Inter'] font-medium text-[14px] text-white/60 shrink-0">
              #{inspection.id?.slice(-4) || '2134'}
            </span>
          </div>
          
          {/* Customer & Address */}
          <div className="flex items-start gap-[6px] mb-[8px]">
            <MapPin className="w-[14px] h-[14px] text-white/60 mt-[2px] shrink-0" />
            <p className="font-['Inter'] text-[13px] text-white/80 leading-[1.4]">
              {inspection.customer?.name && (
                <span className="font-semibold text-white">{inspection.customer.name}, </span>
              )}
              {inspection.address}
            </p>
          </div>
          
          {/* Time */}
          <div className="flex items-center gap-[6px]">
            <Clock className="w-[13px] h-[13px] text-white/50" />
            <span className="font-['Inter'] text-[12px] text-white/60">
              {formatDate(inspection.createdAt)}, {formatTime(inspection.createdAt)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Main Content - Scrollable */}
      <div 
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{
          background: isDark
            ? '#0f172a'
            : '#f8fafc',
        }}
      >
        <div className="px-[20px] pt-[20px] pb-[180px]">
          
          {/* Quick Actions - Colorful Design */}
          <div className="grid grid-cols-3 gap-[12px] mb-[20px]">
            {/* Take Photo */}
            <motion.button
              className="flex flex-col items-center justify-center gap-[8px] p-[16px] rounded-[16px]"
              style={{
                background: isDark 
                  ? 'linear-gradient(135deg, rgba(0, 122, 255, 0.15) 0%, rgba(0, 122, 255, 0.08) 100%)'
                  : 'linear-gradient(135deg, rgba(0, 122, 255, 0.12) 0%, rgba(0, 122, 255, 0.06) 100%)',
                border: '1px solid rgba(0, 122, 255, 0.2)',
              }}
              whileTap={{ scale: 0.96 }}
              onClick={onTakePhoto}
            >
              <div 
                className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0, 122, 255, 0.2)' }}
              >
                <Camera className="w-[20px] h-[20px]" style={{ color: '#007AFF' }} />
              </div>
              <span className="font-['Inter'] font-medium text-[11px]" style={{ color: '#007AFF' }}>
                Camera
              </span>
            </motion.button>
            
            {/* Voice Note */}
            <motion.button
              className="flex flex-col items-center justify-center gap-[8px] p-[16px] rounded-[16px]"
              style={{
                background: isDark 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)'
                  : 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.06) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}
              whileTap={{ scale: 0.96 }}
              onClick={onAddNote}
            >
              <div 
                className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
                style={{ background: 'rgba(16, 185, 129, 0.2)' }}
              >
                <Mic className="w-[20px] h-[20px]" style={{ color: '#10b981' }} />
              </div>
              <span className="font-['Inter'] font-medium text-[11px]" style={{ color: '#10b981' }}>
                Notes
              </span>
            </motion.button>
            
            {/* Navigate */}
            <motion.button
              className="flex flex-col items-center justify-center gap-[8px] p-[16px] rounded-[16px]"
              style={{
                background: isDark 
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)'
                  : 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0.06) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
              }}
              whileTap={{ scale: 0.96 }}
            >
              <div 
                className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
                style={{ background: 'rgba(139, 92, 246, 0.2)' }}
              >
                <Navigation className="w-[20px] h-[20px]" style={{ color: '#8b5cf6' }} />
              </div>
              <span className="font-['Inter'] font-medium text-[11px]" style={{ color: '#8b5cf6' }}>
                Navigate
              </span>
            </motion.button>
          </div>
          
          {/* Tabs for Photos & Notes */}
          <div className="mb-[16px]">
            {/* Tab Headers */}
            <div 
              className="flex rounded-[12px] p-[4px] mb-[16px]"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
              }}
            >
              {[
                { id: 'photos', label: 'Photos', count: inspection.stats.photos, icon: Camera },
                { id: 'notes', label: 'Notes', count: inspection.stats.notes, icon: FileText },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  className="flex-1 flex items-center justify-center gap-[6px] py-[10px] rounded-[10px]"
                  style={{
                    background: activeTab === tab.id 
                      ? isDark ? 'rgba(255, 255, 255, 0.1)' : '#ffffff'
                      : 'transparent',
                    boxShadow: activeTab === tab.id 
                      ? isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)'
                      : 'none',
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon 
                    className="w-[16px] h-[16px]" 
                    style={{ 
                      color: activeTab === tab.id ? accentColors.primary : textColors.muted 
                    }} 
                  />
                  <span 
                    className="font-['Inter'] font-medium text-[13px]"
                    style={{ 
                      color: activeTab === tab.id ? textColors.primary : textColors.muted 
                    }}
                  >
                    {tab.label}
                  </span>
                  <span 
                    className="font-['Inter'] font-semibold text-[11px] px-[6px] py-[2px] rounded-full"
                    style={{ 
                      background: activeTab === tab.id ? `${accentColors.primary}20` : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                      color: activeTab === tab.id ? accentColors.primary : textColors.muted,
                    }}
                  >
                    {tab.count}
                  </span>
                </motion.button>
              ))}
            </div>
            
            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'photos' ? (
                <motion.div
                  key="photos"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Photo Grid */}
                  <div className="grid grid-cols-3 gap-[8px]">
                    {samplePhotos.map((photo, i) => (
                      <div 
                        key={photo.id}
                        className="aspect-square rounded-[12px] overflow-hidden relative"
                        style={{
                          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.06)',
                        }}
                      >
                        <img 
                          src={photo.thumbnail}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        {photo.hasIssue && (
                          <div 
                            className="absolute top-[6px] right-[6px] w-[20px] h-[20px] rounded-full flex items-center justify-center"
                            style={{ background: 'rgba(239, 68, 68, 0.9)' }}
                          >
                            <AlertCircle className="w-[12px] h-[12px] text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Add Photo Button */}
                  <motion.button
                    className="w-full mt-[12px] py-[12px] rounded-[12px] flex items-center justify-center gap-[8px]"
                    style={{
                      background: isDark ? 'rgba(0, 122, 255, 0.15)' : 'rgba(0, 122, 255, 0.1)',
                      border: '1px dashed rgba(0, 122, 255, 0.3)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onTakePhoto}
                  >
                    <Plus className="w-[18px] h-[18px]" style={{ color: '#007AFF' }} />
                    <span className="font-['Inter'] font-medium text-[13px]" style={{ color: '#007AFF' }}>
                      Add Photo
                    </span>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="notes"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Notes List */}
                  <div className="space-y-[10px]">
                    {sampleNotes.map((note) => (
                      <div 
                        key={note.id}
                        className="p-[14px] rounded-[14px]"
                        style={{
                          background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.8)',
                          border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.04)',
                        }}
                      >
                        <div className="flex items-start gap-[12px]">
                          <div 
                            className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center shrink-0"
                            style={{ 
                              background: note.severity === 'high' 
                                ? 'rgba(239, 68, 68, 0.15)' 
                                : note.severity === 'medium' 
                                  ? 'rgba(245, 158, 11, 0.15)' 
                                  : 'rgba(16, 185, 129, 0.15)' 
                            }}
                          >
                            <FileText 
                              className="w-[18px] h-[18px]" 
                              style={{ 
                                color: note.severity === 'high' 
                                  ? '#ef4444' 
                                  : note.severity === 'medium' 
                                    ? '#f59e0b' 
                                    : '#10b981' 
                              }} 
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-['Inter'] font-semibold text-[13px] mb-[4px]" style={{ color: textColors.primary }}>
                              {note.title}
                            </p>
                            <p className="font-['Inter'] text-[12px] line-clamp-2" style={{ color: textColors.muted }}>
                              {note.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Add Note Button with Menu */}
                  <div className="relative mt-[12px]">
                    <motion.button
                      className="w-full py-[12px] rounded-[12px] flex items-center justify-center gap-[8px]"
                      style={{
                        background: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
                        border: '1px dashed rgba(16, 185, 129, 0.3)',
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowNoteMenu(!showNoteMenu)}
                    >
                      <Plus className="w-[18px] h-[18px]" style={{ color: '#10b981' }} />
                      <span className="font-['Inter'] font-medium text-[13px]" style={{ color: '#10b981' }}>
                        Add Note
                      </span>
                    </motion.button>
                    
                    {/* Note Creation Menu */}
                    <AnimatePresence>
                      {showNoteMenu && (
                        <motion.div
                          className="absolute bottom-full left-0 right-0 mb-[8px] rounded-[14px] overflow-hidden"
                          style={{
                            background: isDark ? 'rgba(30, 41, 59, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                          }}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        >
                          <motion.button
                            className="w-full p-[14px] flex items-center gap-[12px]"
                            style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setShowNoteMenu(false);
                              onAddNote?.('voice');
                            }}
                          >
                            <div 
                              className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
                              style={{ background: `${accentColors.primary}20` }}
                            >
                              <Mic className="w-[20px] h-[20px]" style={{ color: accentColors.primary }} />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-['Inter'] font-semibold text-[14px]" style={{ color: textColors.primary }}>
                                Voice Note
                              </p>
                              <p className="font-['Inter'] text-[11px]" style={{ color: textColors.muted }}>
                                Record with your voice
                              </p>
                            </div>
                          </motion.button>
                          
                          <motion.button
                            className="w-full p-[14px] flex items-center gap-[12px]"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setShowNoteMenu(false);
                              onAddNote?.('type');
                            }}
                          >
                            <div 
                              className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
                              style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
                            >
                              <FileText className="w-[20px] h-[20px]" style={{ color: textColors.primary }} />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-['Inter'] font-semibold text-[14px]" style={{ color: textColors.primary }}>
                                Type Note
                              </p>
                              <p className="font-['Inter'] text-[11px]" style={{ color: textColors.muted }}>
                                Write manually
                              </p>
                            </div>
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
        </div>
      </div>
      
      {/* Open in Zuper App Button - Centered at bottom */}
      <div className="absolute bottom-[90px] left-0 right-0 flex justify-center z-20 px-[20px]">
        <motion.button
          className="px-[20px] py-[12px] rounded-full flex items-center gap-[8px]"
          style={{
            background: '#262626',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Zuper Logo */}
          <div 
            className="w-[20px] h-[20px] rounded-[4px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)' }}
          >
            <span className="text-white font-bold text-[10px]">Z</span>
          </div>
          <span className="font-['Inter'] font-medium text-[13px] text-white">Open in Zuper App</span>
        </motion.button>
      </div>
    </div>
  );
};

export default { CreateInspectionModal, InspectionDetailsPage };
