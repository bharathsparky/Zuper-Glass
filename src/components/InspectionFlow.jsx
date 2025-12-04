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
  const [activeTab, setActiveTab] = useState('overview'); // overview, photos, notes
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  
  const textColors = getTextColors(isDark);
  const accentColors = getAccentColors(isDark);
  
  const statusConfig = {
    in_progress: { label: 'In Progress', color: accentColors.warning, bg: `${accentColors.warning}15` },
    completed: { label: 'Completed', color: accentColors.success, bg: `${accentColors.success}15` },
    draft: { label: 'Draft', color: textColors.muted, bg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' },
  };
  
  const status = statusConfig[inspection.status] || statusConfig.draft;
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Hero Header */}
      <div 
        className="relative shrink-0 overflow-hidden"
        style={{
          background: isDark
            ? `linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)`
            : `linear-gradient(180deg, rgba(248, 250, 252, 0.98) 0%, rgba(241, 245, 249, 0.98) 100%)`,
        }}
      >
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute -top-[50px] -right-[50px] w-[200px] h-[200px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${accentColors.primary}15 0%, transparent 70%)`,
              filter: 'blur(40px)',
            }}
          />
          <div 
            className="absolute -bottom-[30px] -left-[30px] w-[150px] h-[150px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${accentColors.success}10 0%, transparent 70%)`,
              filter: 'blur(30px)',
            }}
          />
        </div>
        
        {/* Content */}
        <div className="relative px-[20px] pt-[12px] pb-[20px]">
          {/* Top Row */}
          <div className="flex items-center justify-between mb-[16px]">
            <motion.button
              className="w-[40px] h-[40px] rounded-[12px] flex items-center justify-center"
              style={{
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                backdropFilter: 'blur(10px)',
              }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
            >
              <ChevronLeft className="w-[20px] h-[20px]" style={{ color: textColors.primary }} />
            </motion.button>
            
            <div className="flex items-center gap-[8px]">
              <motion.button
                className="w-[40px] h-[40px] rounded-[12px] flex items-center justify-center"
                style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }}
                whileTap={{ scale: 0.9 }}
              >
                <Share2 className="w-[18px] h-[18px]" style={{ color: textColors.description }} />
              </motion.button>
              <motion.button
                className="w-[40px] h-[40px] rounded-[12px] flex items-center justify-center"
                style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }}
                whileTap={{ scale: 0.9 }}
              >
                <MoreVertical className="w-[18px] h-[18px]" style={{ color: textColors.description }} />
              </motion.button>
            </div>
          </div>
          
          {/* Title & Status */}
          <div className="mb-[12px]">
            <div className="flex items-start justify-between gap-[12px]">
              <h1 
                className="font-['Space_Grotesk'] font-bold text-[22px] leading-tight flex-1"
                style={{ color: textColors.primary }}
              >
                {inspection.name}
              </h1>
              <div 
                className="px-[10px] py-[5px] rounded-full shrink-0"
                style={{ background: status.bg, border: `1px solid ${status.color}30` }}
              >
                <span className="font-['Inter'] font-semibold text-[11px]" style={{ color: status.color }}>
                  {status.label}
                </span>
              </div>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-[8px] mb-[16px]">
            <MapPin className="w-[14px] h-[14px] shrink-0" style={{ color: textColors.muted }} />
            <p className="font-['Inter'] text-[13px]" style={{ color: textColors.description }}>
              {inspection.address}
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="flex gap-[10px]">
            {[
              { icon: Image, value: inspection.stats.photos, label: 'Photos', color: '#007AFF' },
              { icon: Video, value: inspection.stats.videos, label: 'Videos', color: '#AF52DE' },
              { icon: FileText, value: inspection.stats.notes, label: 'Notes', color: '#10b981' },
              { icon: AlertCircle, value: inspection.stats.issues, label: 'Issues', color: '#FF3B30' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="flex-1 p-[12px] rounded-[14px] text-center"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
                  boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <stat.icon className="w-[16px] h-[16px] mx-auto mb-[4px]" style={{ color: stat.color }} />
                <p className="font-['Inter'] font-bold text-[18px]" style={{ color: textColors.primary }}>
                  {stat.value}
                </p>
                <p className="font-['Inter'] text-[9px] uppercase tracking-wide" style={{ color: textColors.muted }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="shrink-0 px-[20px] py-[12px]">
        <div 
          className="flex rounded-[12px] p-[4px]"
          style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
        >
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'photos', label: 'Photos' },
            { id: 'notes', label: 'Notes' },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              className="flex-1 py-[10px] rounded-[10px] relative"
              onClick={() => setActiveTab(tab.id)}
            >
              {activeTab === tab.id && (
                <motion.div
                  className="absolute inset-0 rounded-[10px]"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)',
                    boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)',
                  }}
                  layoutId="tab-indicator"
                />
              )}
              <span 
                className="relative font-['Inter'] font-medium text-[13px]"
                style={{ color: activeTab === tab.id ? textColors.primary : textColors.muted }}
              >
                {tab.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-[20px] pb-[100px] no-scrollbar">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Quick Actions */}
              <div className="mb-[20px]">
                <h3 className="font-['Inter'] font-semibold text-[12px] uppercase tracking-wide mb-[10px]" style={{ color: textColors.muted }}>
                  Quick Actions
                </h3>
                <div className="flex gap-[10px]">
                  <motion.button
                    className="flex-1 p-[14px] rounded-[14px] flex flex-col items-center gap-[8px]"
                    style={{
                      background: isDark ? 'rgba(0, 122, 255, 0.1)' : 'rgba(0, 122, 255, 0.08)',
                      border: '1px solid rgba(0, 122, 255, 0.2)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onTakePhoto}
                  >
                    <Camera className="w-[24px] h-[24px]" style={{ color: '#007AFF' }} />
                    <span className="font-['Inter'] font-medium text-[12px]" style={{ color: '#007AFF' }}>
                      Take Photo
                    </span>
                  </motion.button>
                  
                  <motion.button
                    className="flex-1 p-[14px] rounded-[14px] flex flex-col items-center gap-[8px]"
                    style={{
                      background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onAddNote}
                  >
                    <Mic className="w-[24px] h-[24px]" style={{ color: '#10b981' }} />
                    <span className="font-['Inter'] font-medium text-[12px]" style={{ color: '#10b981' }}>
                      Voice Note
                    </span>
                  </motion.button>
                </div>
              </div>
              
              {/* Details Card */}
              <div 
                className="rounded-[16px] p-[16px] mb-[16px]"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
                  border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)',
                }}
              >
                <h3 className="font-['Inter'] font-semibold text-[12px] uppercase tracking-wide mb-[14px]" style={{ color: textColors.muted }}>
                  Details
                </h3>
                
                <div className="space-y-[12px]">
                  <div className="flex items-center gap-[12px]">
                    <div 
                      className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center shrink-0"
                      style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
                    >
                      <Calendar className="w-[16px] h-[16px]" style={{ color: textColors.muted }} />
                    </div>
                    <div>
                      <p className="font-['Inter'] text-[11px]" style={{ color: textColors.muted }}>Created</p>
                      <p className="font-['Inter'] font-medium text-[13px]" style={{ color: textColors.primary }}>
                        {formatDate(inspection.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-[12px]">
                    <div 
                      className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center shrink-0"
                      style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
                    >
                      <Clock className="w-[16px] h-[16px]" style={{ color: textColors.muted }} />
                    </div>
                    <div>
                      <p className="font-['Inter'] text-[11px]" style={{ color: textColors.muted }}>Last Updated</p>
                      <p className="font-['Inter'] font-medium text-[13px]" style={{ color: textColors.primary }}>
                        {formatDate(inspection.updatedAt)}
                      </p>
                    </div>
                  </div>
                  
                  {inspection.customer && (
                    <div className="flex items-center gap-[12px]">
                      <div 
                        className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center shrink-0"
                        style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
                      >
                        <User className="w-[16px] h-[16px]" style={{ color: textColors.muted }} />
                      </div>
                      <div>
                        <p className="font-['Inter'] text-[11px]" style={{ color: textColors.muted }}>Customer</p>
                        <p className="font-['Inter'] font-medium text-[13px]" style={{ color: textColors.primary }}>
                          {inspection.customer.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Tags */}
              {inspection.tags?.length > 0 && (
                <div 
                  className="rounded-[16px] p-[16px]"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
                    border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)',
                  }}
                >
                  <h3 className="font-['Inter'] font-semibold text-[12px] uppercase tracking-wide mb-[12px]" style={{ color: textColors.muted }}>
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-[8px]">
                    {inspection.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-[10px] py-[6px] rounded-[8px] font-['Inter'] text-[12px]"
                        style={{
                          background: `${accentColors.primary}15`,
                          color: accentColors.primary,
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <motion.div
              key="photos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {samplePhotos.length > 0 ? (
                <div className="grid grid-cols-3 gap-[8px]">
                  {samplePhotos.map((photo, i) => (
                    <motion.div
                      key={photo.id}
                      className="relative aspect-square rounded-[12px] overflow-hidden cursor-pointer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <img 
                        src={photo.thumbnail} 
                        alt={`Photo ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {photo.hasIssue && (
                        <div 
                          className="absolute top-[6px] right-[6px] w-[20px] h-[20px] rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(255, 59, 48, 0.9)' }}
                        >
                          <AlertCircle className="w-[12px] h-[12px] text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-[40px]">
                  <div 
                    className="w-[64px] h-[64px] rounded-[16px] flex items-center justify-center mb-[16px]"
                    style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
                  >
                    <Camera className="w-[28px] h-[28px]" style={{ color: textColors.muted }} />
                  </div>
                  <p className="font-['Inter'] font-medium text-[14px] mb-[4px]" style={{ color: textColors.primary }}>
                    No photos yet
                  </p>
                  <p className="font-['Inter'] text-[12px]" style={{ color: textColors.muted }}>
                    Take photos to document the inspection
                  </p>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-[10px]"
            >
              {sampleNotes.length > 0 ? (
                sampleNotes.map((note, i) => {
                  const severityColors = {
                    high: { bg: 'rgba(255, 59, 48, 0.1)', color: '#FF3B30', border: 'rgba(255, 59, 48, 0.2)' },
                    medium: { bg: 'rgba(255, 204, 0, 0.1)', color: '#FFCC00', border: 'rgba(255, 204, 0, 0.2)' },
                    low: { bg: 'rgba(52, 199, 89, 0.1)', color: '#34C759', border: 'rgba(52, 199, 89, 0.2)' },
                  };
                  const sev = severityColors[note.severity] || severityColors.low;
                  
                  return (
                    <motion.div
                      key={note.id}
                      className="p-[14px] rounded-[14px]"
                      style={{
                        background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
                        border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)',
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="flex items-start justify-between gap-[10px] mb-[8px]">
                        <h4 className="font-['Inter'] font-semibold text-[14px]" style={{ color: textColors.primary }}>
                          {note.title}
                        </h4>
                        <span 
                          className="px-[8px] py-[3px] rounded-[6px] font-['Inter'] font-medium text-[10px] uppercase shrink-0"
                          style={{ background: sev.bg, color: sev.color, border: `1px solid ${sev.border}` }}
                        >
                          {note.severity}
                        </span>
                      </div>
                      <p className="font-['Inter'] text-[13px] leading-[1.5] mb-[8px]" style={{ color: textColors.description }}>
                        {note.content}
                      </p>
                      <p className="font-['Inter'] text-[11px]" style={{ color: textColors.muted }}>
                        {formatDate(note.timestamp)}
                      </p>
                    </motion.div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center py-[40px]">
                  <div 
                    className="w-[64px] h-[64px] rounded-[16px] flex items-center justify-center mb-[16px]"
                    style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
                  >
                    <FileText className="w-[28px] h-[28px]" style={{ color: textColors.muted }} />
                  </div>
                  <p className="font-['Inter'] font-medium text-[14px] mb-[4px]" style={{ color: textColors.primary }}>
                    No notes yet
                  </p>
                  <p className="font-['Inter'] text-[12px]" style={{ color: textColors.muted }}>
                    Record voice notes during inspection
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Bottom Action Bar */}
      <div 
        className="absolute bottom-[70px] left-[16px] right-[16px] rounded-[16px] p-[12px] flex gap-[10px]"
        style={{
          background: isDark 
            ? 'rgba(30, 41, 59, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        }}
      >
        <motion.button
          className="flex-1 py-[12px] rounded-[12px] flex items-center justify-center gap-[8px]"
          style={{
            background: 'rgba(0, 122, 255, 0.15)',
            border: '1px solid rgba(0, 122, 255, 0.3)',
          }}
          whileTap={{ scale: 0.98 }}
          onClick={onTakePhoto}
        >
          <Camera className="w-[18px] h-[18px]" style={{ color: '#007AFF' }} />
          <span className="font-['Inter'] font-semibold text-[13px]" style={{ color: '#007AFF' }}>Photo</span>
        </motion.button>
        
        <motion.button
          className="flex-1 py-[12px] rounded-[12px] flex items-center justify-center gap-[8px]"
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddNote}
        >
          <Mic className="w-[18px] h-[18px]" style={{ color: '#10b981' }} />
          <span className="font-['Inter'] font-semibold text-[13px]" style={{ color: '#10b981' }}>Note</span>
        </motion.button>
        
        <motion.button
          className="py-[12px] px-[16px] rounded-[12px] flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.primaryLight} 100%)`,
            boxShadow: `0 4px 16px ${accentColors.primary}40`,
          }}
          whileTap={{ scale: 0.98 }}
        >
          <CheckCircle className="w-[18px] h-[18px] text-white" />
        </motion.button>
      </div>
    </div>
  );
};

export default { CreateInspectionModal, InspectionDetailsPage };
