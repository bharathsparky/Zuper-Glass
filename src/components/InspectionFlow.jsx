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
  { id: 'p1', thumbnail: '/assets/figma-assets/4c915fdcd5c975eda61c351287eaef3f0e5aa4aa.png', timestamp: new Date().toISOString(), hasIssue: true },
  { id: 'p2', thumbnail: '/assets/figma-assets/4c915fdcd5c975eda61c351287eaef3f0e5aa4aa.png', timestamp: new Date(Date.now() - 300000).toISOString(), hasIssue: false },
  { id: 'p3', thumbnail: '/assets/figma-assets/4c915fdcd5c975eda61c351287eaef3f0e5aa4aa.png', timestamp: new Date(Date.now() - 600000).toISOString(), hasIssue: true },
  { id: 'p4', thumbnail: '/assets/figma-assets/4c915fdcd5c975eda61c351287eaef3f0e5aa4aa.png', timestamp: new Date(Date.now() - 900000).toISOString(), hasIssue: false },
  { id: 'p5', thumbnail: '/assets/figma-assets/4c915fdcd5c975eda61c351287eaef3f0e5aa4aa.png', timestamp: new Date(Date.now() - 1200000).toISOString(), hasIssue: false },
  { id: 'p6', thumbnail: '/assets/figma-assets/4c915fdcd5c975eda61c351287eaef3f0e5aa4aa.png', timestamp: new Date(Date.now() - 1500000).toISOString(), hasIssue: true },
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
                <h3 className="font-['Inter'] font-semibold text-[16px] mb-[4px] text-center" style={{ color: textColors.primary }}>
                  Name your inspection
                </h3>
                <p className="font-['Inter'] text-[13px] mb-[20px] text-center" style={{ color: textColors.muted }}>
                  You can edit this later
                </p>
                
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
                
                {/* Location Preview */}
                <div 
                  className="flex items-center gap-[10px] p-[12px] rounded-[12px] mb-[20px]"
                  style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' }}
                >
                  <div 
                    className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center shrink-0"
                    style={{ background: `${accentColors.success}15` }}
                  >
                    <MapPin className="w-[16px] h-[16px]" style={{ color: accentColors.success }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-['Inter'] text-[12px] truncate" style={{ color: textColors.description }}>
                      {address}
                    </p>
                  </div>
                  <CheckCircle className="w-[16px] h-[16px] shrink-0" style={{ color: accentColors.success }} />
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
            {/* Status Badge */}
            <div 
              className="px-[12px] py-[6px] rounded-full"
              style={{ 
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${status.color}50`,
              }}
            >
              <span className="font-['Inter'] font-semibold text-[11px]" style={{ color: status.color }}>
                {status.label}
              </span>
            </div>
            
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
              <MoreVertical className="w-[20px] h-[20px] text-white" />
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
          
          {/* Quick Actions - Navigate, Call, Camera (Figma style) */}
          <div className="flex gap-[12px] mb-[20px]">
            {[
              { icon: Navigation, label: 'Navigate' },
              { icon: Phone, label: 'Call' },
              { icon: Camera, label: 'Camera', onClick: onTakePhoto },
            ].map((item) => (
              <motion.button
                key={item.label}
                className="flex-1 flex flex-col items-center justify-center gap-[6px] p-[14px] rounded-[12px]"
                style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: isDark ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.04)',
                }}
                whileTap={{ scale: 0.96 }}
                onClick={item.onClick}
              >
                <item.icon className="w-[22px] h-[22px]" style={{ color: textColors.primary }} />
                <span className="font-['Inter'] font-medium text-[12px]" style={{ color: textColors.primary }}>
                  {item.label}
                </span>
              </motion.button>
            ))}
          </div>
          
          {/* Job Gallery Card */}
          <div 
            className="rounded-[16px] overflow-hidden mb-[20px]"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#ffffff',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: isDark ? 'none' : '0 2px 12px rgba(0, 0, 0, 0.04)',
            }}
          >
            {/* Gallery Header */}
            <div className="flex items-center justify-between px-[16px] pt-[14px] pb-[12px]">
              <p className="font-['Inter'] font-semibold text-[14px]" style={{ color: textColors.primary }}>
                Job Gallery ({inspection.stats.photos})
              </p>
              <div className="flex items-center gap-[4px]">
                <span className="font-['Inter'] text-[12px]" style={{ color: textColors.secondary }}>
                  See all
                </span>
                <ChevronRight className="w-[14px] h-[14px]" style={{ color: textColors.secondary }} />
              </div>
            </div>
            
            {/* Photo Thumbnails - Horizontal scroll */}
            <div className="px-[16px] pb-[16px] overflow-x-auto no-scrollbar">
              <div className="flex gap-[10px]">
                {samplePhotos.map((photo) => (
                  <div 
                    key={photo.id}
                    className="w-[60px] h-[60px] rounded-[8px] shrink-0 overflow-hidden relative"
                    style={{
                      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                    }}
                  >
                    <img 
                      src={photo.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Import from Glass Notification */}
            <div 
              className="flex items-center gap-[10px] px-[16px] py-[14px]"
              style={{ 
                background: isDark ? 'rgba(255,255,255,0.02)' : '#fef7ed',
                borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
              }}
            >
              <div 
                className="w-[28px] h-[28px] rounded-[6px] flex items-center justify-center shrink-0"
                style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
              >
                <Image className="w-[16px] h-[16px]" style={{ color: isDark ? '#fff' : '#262626' }} />
              </div>
              <p className="flex-1 font-['Inter'] text-[12px] leading-[1.4]" style={{ color: textColors.muted }}>
                <span className="font-medium" style={{ color: textColors.primary }}>4 photos</span>
                {' '}available in glass
              </p>
              <motion.button
                className="px-[12px] py-[4px] rounded-full shrink-0"
                style={{ background: isDark ? '#fff' : '#262626' }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="font-['Inter'] font-medium text-[10px]" style={{ color: isDark ? '#262626' : '#fff' }}>
                  Import
                </span>
              </motion.button>
            </div>
          </div>
          
          {/* Info Card */}
          <div 
            className="rounded-[16px] overflow-hidden mb-[20px]"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.8)',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.04)',
              boxShadow: isDark ? 'none' : '0 2px 12px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div className="p-[16px] flex items-center gap-[14px]">
              <div 
                className="w-[44px] h-[44px] rounded-[12px] flex items-center justify-center shrink-0"
                style={{ background: `${accentColors.primary}15` }}
              >
                <Calendar className="w-[20px] h-[20px]" style={{ color: accentColors.primary }} />
              </div>
              <div className="flex-1">
                <p className="font-['Inter'] text-[11px] uppercase tracking-wide mb-[2px]" style={{ color: textColors.muted }}>
                  Created
                </p>
                <p className="font-['Inter'] font-semibold text-[15px]" style={{ color: textColors.primary }}>
                  {formatDate(inspection.createdAt)}
                </p>
              </div>
              <p className="font-['Inter'] text-[13px]" style={{ color: textColors.muted }}>
                {formatTime(inspection.createdAt)}
              </p>
            </div>
            
            {inspection.customer && (
              <>
                <div 
                  className="h-[1px] mx-[16px]"
                  style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
                />
                <div className="p-[16px] flex items-center gap-[14px]">
                  <div 
                    className="w-[44px] h-[44px] rounded-[12px] flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(16, 185, 129, 0.15)' }}
                  >
                    <User className="w-[20px] h-[20px]" style={{ color: '#10b981' }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-['Inter'] text-[11px] uppercase tracking-wide mb-[2px]" style={{ color: textColors.muted }}>
                      Customer
                    </p>
                    <p className="font-['Inter'] font-semibold text-[15px]" style={{ color: textColors.primary }}>
                      {inspection.customer.name}
                    </p>
                  </div>
                  <ChevronRight className="w-[18px] h-[18px]" style={{ color: textColors.muted }} />
                </div>
              </>
            )}
          </div>
          
          {/* Location Map Preview */}
          <div className="mb-[20px]">
            <h3 className="font-['Inter'] font-semibold text-[13px] mb-[12px]" style={{ color: textColors.primary }}>
              Site Location
            </h3>
            <motion.div 
              className="relative rounded-[16px] overflow-hidden cursor-pointer"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.8)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.04)',
                boxShadow: isDark ? 'none' : '0 2px 12px rgba(0, 0, 0, 0.04)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Map Image */}
              <div className="relative h-[140px] overflow-hidden">
                {/* Simulated Map Background */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: isDark
                      ? `linear-gradient(135deg, #1a2744 0%, #243b55 50%, #1e3a5f 100%)`
                      : `linear-gradient(135deg, #e8f4f8 0%, #d4e8ed 50%, #c5dde5 100%)`,
                  }}
                />
                
                {/* Map Grid Pattern */}
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px),
                      linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                  }}
                />
                
                {/* Simulated Roads */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 140" preserveAspectRatio="none">
                  <path 
                    d="M 0,70 L 200,70" 
                    stroke={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'} 
                    strokeWidth="8" 
                    fill="none"
                  />
                  <path 
                    d="M 100,0 L 100,140" 
                    stroke={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'} 
                    strokeWidth="6" 
                    fill="none"
                  />
                  <path 
                    d="M 0,35 L 60,35 L 60,105 L 140,105 L 140,35 L 200,35" 
                    stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'} 
                    strokeWidth="4" 
                    fill="none"
                  />
                </svg>
                
                {/* Location Pin */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full"
                  style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
                >
                  {/* Pin pulse animation */}
                  <motion.div
                    className="absolute top-[28px] left-1/2 -translate-x-1/2 w-[20px] h-[20px] rounded-full"
                    style={{ background: `${accentColors.primary}40` }}
                    animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  {/* Pin body */}
                  <div 
                    className="relative w-[36px] h-[44px] flex flex-col items-center"
                  >
                    <div 
                      className="w-[36px] h-[36px] rounded-full flex items-center justify-center"
                      style={{ 
                        background: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.primaryLight} 100%)`,
                        boxShadow: `0 4px 12px ${accentColors.primary}50`,
                      }}
                    >
                      <MapPin className="w-[18px] h-[18px] text-white" />
                    </div>
                    <div 
                      className="w-0 h-0 -mt-[2px]"
                      style={{
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderTop: `10px solid ${accentColors.primary}`,
                      }}
                    />
                  </div>
                </div>
                
                {/* Gradient Overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: isDark
                      ? 'linear-gradient(180deg, transparent 50%, rgba(15, 23, 42, 0.5) 100%)'
                      : 'linear-gradient(180deg, transparent 50%, rgba(255, 255, 255, 0.3) 100%)',
                  }}
                />
              </div>
              
              {/* Address Footer */}
              <div className="p-[14px] flex items-center justify-between">
                <div className="flex items-center gap-[10px] flex-1 min-w-0">
                  <div 
                    className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center shrink-0"
                    style={{ background: `${accentColors.primary}15` }}
                  >
                    <Navigation className="w-[14px] h-[14px]" style={{ color: accentColors.primary }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-['Inter'] font-medium text-[13px] truncate" style={{ color: textColors.primary }}>
                      {inspection.address?.split(',')[0] || '123 Oak Street'}
                    </p>
                    <p className="font-['Inter'] text-[11px] truncate" style={{ color: textColors.muted }}>
                      {inspection.address?.split(',').slice(1).join(',').trim() || 'Austin, TX 78701'}
                    </p>
                  </div>
                </div>
                <div 
                  className="px-[12px] py-[6px] rounded-[8px] shrink-0"
                  style={{ 
                    background: `${accentColors.primary}15`,
                    border: `1px solid ${accentColors.primary}30`,
                  }}
                >
                  <span className="font-['Inter'] font-semibold text-[11px]" style={{ color: accentColors.primary }}>
                    Directions
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Recent Activity Placeholder */}
          <div className="mb-[16px]">
            <h3 className="font-['Inter'] font-semibold text-[13px] mb-[12px]" style={{ color: textColors.primary }}>
              Recent Activity
            </h3>
            <div 
              className="p-[20px] rounded-[16px] flex flex-col items-center justify-center"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
                border: isDark ? '1px dashed rgba(255, 255, 255, 0.1)' : '1px dashed rgba(0, 0, 0, 0.08)',
              }}
            >
              <div 
                className="w-[56px] h-[56px] rounded-full flex items-center justify-center mb-[12px]"
                style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}
              >
                <Camera className="w-[24px] h-[24px]" style={{ color: textColors.muted }} />
              </div>
              <p className="font-['Inter'] font-medium text-[14px] mb-[4px]" style={{ color: textColors.primary }}>
                Start documenting
              </p>
              <p className="font-['Inter'] text-[12px] text-center" style={{ color: textColors.muted }}>
                Take photos or record notes to see activity here
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Complete Button */}
      <motion.button
        className="absolute bottom-[80px] right-[20px] px-[20px] py-[14px] rounded-full flex items-center gap-[10px] z-20"
        style={{
          background: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.primaryLight} 100%)`,
          boxShadow: `0 8px 24px ${accentColors.primary}50`,
        }}
        whileTap={{ scale: 0.95 }}
      >
        <CheckCircle className="w-[20px] h-[20px] text-white" />
        <span className="font-['Inter'] font-semibold text-[14px] text-white">
          Complete
        </span>
      </motion.button>
    </div>
  );
};

export default { CreateInspectionModal, InspectionDetailsPage };
