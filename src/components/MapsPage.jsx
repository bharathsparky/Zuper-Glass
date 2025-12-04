import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Camera, FileText, Ruler, CheckCircle, AlertTriangle, 
  AlertCircle, Eye, EyeOff, Filter, Search, X, ChevronRight,
  ChevronDown, ChevronUp, Layers, Grid3X3, Users, Cloud, CloudOff,
  Plus, Minus, Navigation, Target, Maximize2, ZoomIn, ZoomOut,
  Square, Circle, Triangle, Home, Building, Thermometer,
  Download, Share2, Settings, MoreVertical, Edit3, Trash2,
  RefreshCw, Crosshair, Move, Hand, PenTool, Eraser,
  BarChart3, Map, Image, Mic, Video, Clock, Tag, Flag
} from 'lucide-react';

// ============ CONSTANTS & DATA ============

// Theme colors
const getAccentColors = (isDark) => ({
  primary: isDark ? '#8558F2' : '#0284c7',
  primaryLight: isDark ? '#a78bfa' : '#0ea5e9',
  damage: '#FF3B30',
  concern: '#FFCC00', 
  photo: '#007AFF',
  note: '#AF52DE',
  measurement: '#FFFFFF',
  complete: '#34C759',
});

const getTextColors = (isDark) => ({
  primary: isDark ? '#f8fafc' : '#0f172a',
  secondary: isDark ? '#e2e8f0' : '#1e293b',
  description: isDark ? '#cbd5e1' : '#334155',
  muted: isDark ? '#94a3b8' : '#64748b',
});

// Pin types configuration
const pinTypes = {
  damage: { icon: AlertCircle, color: '#FF3B30', label: 'Damage', bgColor: 'rgba(255, 59, 48, 0.15)' },
  concern: { icon: AlertTriangle, color: '#FFCC00', label: 'Concern', bgColor: 'rgba(255, 204, 0, 0.15)' },
  photo: { icon: Camera, color: '#007AFF', label: 'Photo', bgColor: 'rgba(0, 122, 255, 0.15)' },
  note: { icon: FileText, color: '#AF52DE', label: 'Note', bgColor: 'rgba(175, 82, 222, 0.15)' },
  measurement: { icon: Ruler, color: '#94a3b8', label: 'Measurement', bgColor: 'rgba(148, 163, 184, 0.15)' },
  complete: { icon: CheckCircle, color: '#34C759', label: 'Complete', bgColor: 'rgba(52, 199, 89, 0.15)' },
};

// Severity levels
const severityLevels = {
  critical: { color: '#FF3B30', label: 'Critical', priority: 1 },
  high: { color: '#FF9500', label: 'High', priority: 2 },
  medium: { color: '#FFCC00', label: 'Medium', priority: 3 },
  low: { color: '#34C759', label: 'Low', priority: 4 },
};

// Sample roof sections
const sampleSections = [
  { id: 'north-slope', name: 'North Slope', color: '#FF6B6B', area: 312, condition: 'fair', pinCount: 4 },
  { id: 'south-slope', name: 'South Slope', color: '#4ECDC4', area: 285, condition: 'good', pinCount: 2 },
  { id: 'east-gable', name: 'East Gable', color: '#45B7D1', area: 156, condition: 'poor', pinCount: 5 },
  { id: 'west-valley', name: 'West Valley', color: '#96CEB4', area: 98, condition: 'critical', pinCount: 3 },
  { id: 'garage', name: 'Garage', color: '#FFEAA7', area: 420, condition: 'good', pinCount: 1 },
];

// Sample pins data (simulating auto-pinned content from glass)
const samplePins = [
  {
    id: 'pin-001',
    type: 'damage',
    position: { x: 35, y: 25 },
    severity: 'high',
    section: 'north-slope',
    title: 'Cracked shingles',
    description: 'Three cracked shingles near ridge, wind damage suspected',
    linkedPhotos: 2,
    linkedNotes: 1,
    timestamp: new Date().toISOString(),
    status: 'open',
    source: 'glass',
  },
  {
    id: 'pin-002',
    type: 'damage',
    position: { x: 42, y: 30 },
    severity: 'critical',
    section: 'north-slope',
    title: 'Soft decking',
    description: 'Roof deck feels soft - possible water damage underneath',
    linkedPhotos: 3,
    linkedNotes: 2,
    timestamp: new Date(Date.now() - 600000).toISOString(),
    status: 'open',
    source: 'glass',
  },
  {
    id: 'pin-003',
    type: 'concern',
    position: { x: 65, y: 45 },
    severity: 'medium',
    section: 'east-gable',
    title: 'Flashing gap',
    description: 'Gap visible in chimney flashing, needs resealing',
    linkedPhotos: 1,
    linkedNotes: 1,
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    status: 'open',
    source: 'glass',
  },
  {
    id: 'pin-004',
    type: 'photo',
    position: { x: 25, y: 55 },
    severity: 'low',
    section: 'south-slope',
    title: 'Overall condition',
    description: 'General photo of south slope - good condition',
    linkedPhotos: 1,
    linkedNotes: 0,
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    status: 'complete',
    source: 'glass',
  },
  {
    id: 'pin-005',
    type: 'note',
    position: { x: 78, y: 35 },
    severity: 'medium',
    section: 'east-gable',
    title: 'Ventilation issue',
    description: 'Soffit vents 80% blocked with debris',
    linkedPhotos: 0,
    linkedNotes: 1,
    timestamp: new Date(Date.now() - 2400000).toISOString(),
    status: 'open',
    source: 'glass',
  },
  {
    id: 'pin-006',
    type: 'measurement',
    position: { x: 50, y: 65 },
    severity: 'low',
    section: 'garage',
    title: 'Area measurement',
    description: 'Garage roof: 420 sq ft',
    linkedPhotos: 0,
    linkedNotes: 0,
    timestamp: new Date(Date.now() - 3000000).toISOString(),
    status: 'complete',
    source: 'app',
  },
  {
    id: 'pin-007',
    type: 'damage',
    position: { x: 15, y: 40 },
    severity: 'high',
    section: 'west-valley',
    title: 'Valley damage',
    description: 'Debris accumulation causing water pooling in valley',
    linkedPhotos: 2,
    linkedNotes: 1,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'open',
    source: 'glass',
  },
];

// Roof structures (chimneys, vents, etc.)
const roofStructures = [
  { id: 'chimney-1', type: 'chimney', position: { x: 60, y: 40 }, label: 'Brick Chimney' },
  { id: 'vent-1', type: 'vent', position: { x: 30, y: 35 }, label: 'Plumbing Vent' },
  { id: 'vent-2', type: 'vent', position: { x: 70, y: 55 }, label: 'Exhaust Vent' },
  { id: 'skylight-1', type: 'skylight', position: { x: 45, y: 48 }, label: 'Skylight' },
];

// ============ SUB-COMPONENTS ============

// Map Pin Component
const MapPin2 = ({ pin, isSelected, onClick, isDark, isCustomerView }) => {
  const config = pinTypes[pin.type];
  const Icon = config.icon;
  const severity = severityLevels[pin.severity];
  
  return (
    <motion.button
      className="absolute flex flex-col items-center"
      style={{
        left: `${pin.position.x}%`,
        top: `${pin.position.y}%`,
        transform: 'translate(-50%, -100%)',
        zIndex: isSelected ? 100 : 10,
      }}
      initial={{ scale: 0, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
    >
      {/* Pin marker */}
      <div 
        className="relative flex items-center justify-center"
        style={{
          width: isSelected ? '44px' : '36px',
          height: isSelected ? '44px' : '36px',
        }}
      >
        {/* Outer ring for selected state */}
        {isSelected && (
          <motion.div
            className="absolute inset-[-4px] rounded-full"
            style={{ border: `2px solid ${config.color}`, opacity: 0.5 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        
        {/* Main pin body */}
        <div 
          className="w-full h-full rounded-full flex items-center justify-center"
          style={{
            background: config.color,
            boxShadow: `0 4px 12px ${config.color}60, 0 2px 4px rgba(0,0,0,0.3)`,
          }}
        >
          <Icon className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
        </div>
        
        {/* Severity indicator */}
        {pin.severity && pin.type === 'damage' && (
          <div 
            className="absolute -top-1 -right-1 w-[14px] h-[14px] rounded-full border-2 border-white flex items-center justify-center"
            style={{ background: severity.color }}
          >
            <span className="text-[8px] font-bold text-white">
              {pin.severity === 'critical' ? '!' : pin.severity === 'high' ? 'H' : pin.severity === 'medium' ? 'M' : 'L'}
            </span>
          </div>
        )}
        
        {/* Linked content badge */}
        {(pin.linkedPhotos > 0 || pin.linkedNotes > 0) && !isCustomerView && (
          <div 
            className="absolute -bottom-1 -right-1 min-w-[16px] h-[16px] rounded-full bg-white flex items-center justify-center px-[3px]"
            style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
          >
            <span className="text-[9px] font-bold" style={{ color: config.color }}>
              {pin.linkedPhotos + pin.linkedNotes}
            </span>
          </div>
        )}
      </div>
      
      {/* Pin stem */}
      <div 
        className="w-0 h-0"
        style={{
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: `8px solid ${config.color}`,
          marginTop: '-2px',
        }}
      />
    </motion.button>
  );
};

// Structure marker (chimney, vent, etc.)
const StructureMarker = ({ structure, isDark }) => {
  const icons = {
    chimney: Building,
    vent: Circle,
    skylight: Square,
    dormer: Triangle,
  };
  const Icon = icons[structure.type] || Circle;
  
  return (
    <div
      className="absolute flex items-center justify-center w-[24px] h-[24px] rounded-[6px]"
      style={{
        left: `${structure.position.x}%`,
        top: `${structure.position.y}%`,
        transform: 'translate(-50%, -50%)',
        background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
        border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.15)',
      }}
    >
      <Icon className="w-[12px] h-[12px]" style={{ color: isDark ? '#94a3b8' : '#64748b' }} />
    </div>
  );
};

// Section overlay
const SectionOverlay = ({ section, isActive, onClick, isDark }) => {
  // Simplified polygon paths for demo
  const sectionPaths = {
    'north-slope': 'M 20,10 L 50,5 L 80,10 L 80,35 L 50,30 L 20,35 Z',
    'south-slope': 'M 20,50 L 50,45 L 80,50 L 80,75 L 50,80 L 20,75 Z',
    'east-gable': 'M 55,25 L 85,30 L 85,60 L 55,55 Z',
    'west-valley': 'M 5,25 L 25,30 L 25,60 L 5,55 Z',
    'garage': 'M 35,60 L 65,60 L 65,90 L 35,90 Z',
  };
  
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path
        d={sectionPaths[section.id] || ''}
        fill={isActive ? `${section.color}30` : 'transparent'}
        stroke={section.color}
        strokeWidth={isActive ? 2 : 1}
        strokeDasharray={isActive ? '0' : '4,4'}
        opacity={isActive ? 1 : 0.5}
        style={{ pointerEvents: 'all', cursor: 'pointer' }}
        onClick={onClick}
      />
    </svg>
  );
};

// Pin Detail Panel
const PinDetailPanel = ({ pin, onClose, onEdit, onDelete, isDark, isCustomerView }) => {
  const textColors = getTextColors(isDark);
  const accentColors = getAccentColors(isDark);
  const config = pinTypes[pin.type];
  const severity = severityLevels[pin.severity];
  const Icon = config.icon;
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 rounded-t-[20px] z-50"
      style={{
        background: isDark 
          ? 'linear-gradient(180deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)'
          : 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.2)',
        maxHeight: '60%',
      }}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      {/* Handle */}
      <div className="flex justify-center pt-[12px] pb-[8px]">
        <div 
          className="w-[40px] h-[4px] rounded-full"
          style={{ background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }}
        />
      </div>
      
      {/* Content */}
      <div className="px-[20px] pb-[24px] overflow-y-auto" style={{ maxHeight: 'calc(60vh - 60px)' }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-[16px]">
          <div className="flex items-center gap-[12px]">
            <div 
              className="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center"
              style={{ background: config.bgColor, border: `1px solid ${config.color}40` }}
            >
              <Icon className="w-[24px] h-[24px]" style={{ color: config.color }} />
            </div>
            <div>
              <h3 className="font-['Inter'] font-semibold text-[16px]" style={{ color: textColors.primary }}>
                {pin.title}
              </h3>
              <div className="flex items-center gap-[8px] mt-[2px]">
                <span 
                  className="px-[8px] py-[2px] rounded-[6px] font-['Inter'] font-medium text-[10px]"
                  style={{ background: config.bgColor, color: config.color }}
                >
                  {config.label}
                </span>
                {pin.severity && (
                  <span 
                    className="px-[8px] py-[2px] rounded-[6px] font-['Inter'] font-medium text-[10px]"
                    style={{ background: `${severity.color}20`, color: severity.color }}
                  >
                    {severity.label}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <motion.button
            className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center"
            style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
          >
            <X className="w-[18px] h-[18px]" style={{ color: textColors.muted }} />
          </motion.button>
        </div>
        
        {/* Description */}
        <p 
          className="font-['Inter'] text-[14px] leading-[1.5] mb-[16px]"
          style={{ color: textColors.description }}
        >
          {pin.description}
        </p>
        
        {/* Metadata */}
        <div className="flex flex-wrap gap-[8px] mb-[16px]">
          <div 
            className="flex items-center gap-[6px] px-[10px] py-[6px] rounded-[8px]"
            style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
          >
            <Clock className="w-[12px] h-[12px]" style={{ color: textColors.muted }} />
            <span className="font-['Inter'] text-[11px]" style={{ color: textColors.description }}>
              {formatTime(pin.timestamp)}
            </span>
          </div>
          
          {pin.linkedPhotos > 0 && (
            <div 
              className="flex items-center gap-[6px] px-[10px] py-[6px] rounded-[8px]"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
            >
              <Camera className="w-[12px] h-[12px]" style={{ color: textColors.muted }} />
              <span className="font-['Inter'] text-[11px]" style={{ color: textColors.description }}>
                {pin.linkedPhotos} photo{pin.linkedPhotos > 1 ? 's' : ''}
              </span>
            </div>
          )}
          
          {pin.linkedNotes > 0 && (
            <div 
              className="flex items-center gap-[6px] px-[10px] py-[6px] rounded-[8px]"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
            >
              <FileText className="w-[12px] h-[12px]" style={{ color: textColors.muted }} />
              <span className="font-['Inter'] text-[11px]" style={{ color: textColors.description }}>
                {pin.linkedNotes} note{pin.linkedNotes > 1 ? 's' : ''}
              </span>
            </div>
          )}
          
          <div 
            className="flex items-center gap-[6px] px-[10px] py-[6px] rounded-[8px]"
            style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
          >
            <MapPin className="w-[12px] h-[12px]" style={{ color: textColors.muted }} />
            <span className="font-['Inter'] text-[11px]" style={{ color: textColors.description }}>
              {sampleSections.find(s => s.id === pin.section)?.name || 'Unknown'}
            </span>
          </div>
        </div>
        
        {/* Linked Photos Preview */}
        {pin.linkedPhotos > 0 && (
          <div className="mb-[16px]">
            <p className="font-['Inter'] font-medium text-[12px] mb-[8px]" style={{ color: textColors.muted }}>
              LINKED PHOTOS
            </p>
            <div className="flex gap-[8px]">
              {[...Array(Math.min(pin.linkedPhotos, 3))].map((_, i) => (
                <div 
                  key={i}
                  className="w-[72px] h-[72px] rounded-[10px] overflow-hidden"
                  style={{ 
                    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                  }}
                >
                  <img 
                    src={`/assets/figma-assets/4c915fdcd5c975eda61c351287eaef3f0e5aa4aa.png`}
                    alt="Linked photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {pin.linkedPhotos > 3 && (
                <div 
                  className="w-[72px] h-[72px] rounded-[10px] flex items-center justify-center"
                  style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
                >
                  <span className="font-['Inter'] font-semibold text-[14px]" style={{ color: textColors.muted }}>
                    +{pin.linkedPhotos - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Actions */}
        {!isCustomerView && (
          <div className="flex gap-[10px]">
            <motion.button
              className="flex-1 py-[12px] rounded-[10px] flex items-center justify-center gap-[8px]"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              }}
              whileTap={{ scale: 0.98 }}
              onClick={onEdit}
            >
              <Edit3 className="w-[16px] h-[16px]" style={{ color: textColors.description }} />
              <span className="font-['Inter'] font-medium text-[13px]" style={{ color: textColors.primary }}>
                Edit
              </span>
            </motion.button>
            
            <motion.button
              className="flex-1 py-[12px] rounded-[10px] flex items-center justify-center gap-[8px]"
              style={{
                background: pin.status === 'complete' 
                  ? 'rgba(52, 199, 89, 0.15)'
                  : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                border: pin.status === 'complete' 
                  ? '1px solid rgba(52, 199, 89, 0.3)'
                  : isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              <CheckCircle 
                className="w-[16px] h-[16px]" 
                style={{ color: pin.status === 'complete' ? '#34C759' : textColors.description }} 
              />
              <span 
                className="font-['Inter'] font-medium text-[13px]" 
                style={{ color: pin.status === 'complete' ? '#34C759' : textColors.primary }}
              >
                {pin.status === 'complete' ? 'Completed' : 'Mark Complete'}
              </span>
            </motion.button>
          </div>
        )}
        
        {/* Customer View Actions */}
        {isCustomerView && (
          <div 
            className="p-[14px] rounded-[12px]"
            style={{ background: isDark ? 'rgba(255, 59, 48, 0.1)' : 'rgba(255, 59, 48, 0.08)' }}
          >
            <p className="font-['Inter'] font-semibold text-[13px] mb-[4px]" style={{ color: '#FF3B30' }}>
              Recommended Action
            </p>
            <p className="font-['Inter'] text-[12px]" style={{ color: textColors.description }}>
              This area requires professional repair. Estimated cost: $450-650
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Section Panel
const SectionPanel = ({ section, pins, onClose, isDark }) => {
  const textColors = getTextColors(isDark);
  const accentColors = getAccentColors(isDark);
  
  const sectionPins = pins.filter(p => p.section === section.id);
  const conditionColors = {
    good: '#34C759',
    fair: '#FFCC00',
    poor: '#FF9500',
    critical: '#FF3B30',
  };
  
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 rounded-t-[20px] z-50"
      style={{
        background: isDark 
          ? 'linear-gradient(180deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)'
          : 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.2)',
      }}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      {/* Handle */}
      <div className="flex justify-center pt-[12px] pb-[8px]">
        <div 
          className="w-[40px] h-[4px] rounded-full"
          style={{ background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }}
        />
      </div>
      
      {/* Content */}
      <div className="px-[20px] pb-[24px]">
        {/* Header */}
        <div className="flex items-start justify-between mb-[16px]">
          <div className="flex items-center gap-[12px]">
            <div 
              className="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center"
              style={{ background: `${section.color}20`, border: `2px solid ${section.color}` }}
            >
              <Layers className="w-[24px] h-[24px]" style={{ color: section.color }} />
            </div>
            <div>
              <h3 className="font-['Inter'] font-semibold text-[16px]" style={{ color: textColors.primary }}>
                {section.name}
              </h3>
              <div className="flex items-center gap-[8px] mt-[2px]">
                <span 
                  className="px-[8px] py-[2px] rounded-[6px] font-['Inter'] font-medium text-[10px] uppercase"
                  style={{ background: `${conditionColors[section.condition]}20`, color: conditionColors[section.condition] }}
                >
                  {section.condition}
                </span>
                <span className="font-['Inter'] text-[11px]" style={{ color: textColors.muted }}>
                  {section.area} sq ft
                </span>
              </div>
            </div>
          </div>
          
          <motion.button
            className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center"
            style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
          >
            <X className="w-[18px] h-[18px]" style={{ color: textColors.muted }} />
          </motion.button>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-[10px] mb-[16px]">
          {[
            { label: 'Issues', value: sectionPins.filter(p => p.type === 'damage').length, color: '#FF3B30' },
            { label: 'Photos', value: sectionPins.filter(p => p.type === 'photo' || p.linkedPhotos > 0).length, color: '#007AFF' },
            { label: 'Notes', value: sectionPins.filter(p => p.type === 'note' || p.linkedNotes > 0).length, color: '#AF52DE' },
          ].map((stat, i) => (
            <div 
              key={i}
              className="p-[12px] rounded-[10px] text-center"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
            >
              <p className="font-['Inter'] font-bold text-[20px]" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="font-['Inter'] text-[10px]" style={{ color: textColors.muted }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
        
        {/* Actions */}
        <div className="flex gap-[10px]">
          <motion.button
            className="flex-1 py-[12px] rounded-[10px] flex items-center justify-center gap-[8px]"
            style={{
              background: `${section.color}20`,
              border: `1px solid ${section.color}40`,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Eye className="w-[16px] h-[16px]" style={{ color: section.color }} />
            <span className="font-['Inter'] font-medium text-[13px]" style={{ color: section.color }}>
              View All Content
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Filter Panel
const FilterPanel = ({ isOpen, onClose, filters, setFilters, isDark }) => {
  const textColors = getTextColors(isDark);
  const accentColors = getAccentColors(isDark);
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      className="absolute top-[60px] left-[16px] right-[16px] z-50 rounded-[16px] overflow-hidden"
      style={{
        background: isDark 
          ? 'rgba(30, 41, 59, 0.98)'
          : 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      }}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
    >
      <div className="p-[16px]">
        <div className="flex items-center justify-between mb-[14px]">
          <h3 className="font-['Inter'] font-semibold text-[14px]" style={{ color: textColors.primary }}>
            Filter Pins
          </h3>
          <motion.button
            className="font-['Inter'] text-[12px]"
            style={{ color: accentColors.primary }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilters({ types: [], severities: [], sections: [] })}
          >
            Clear All
          </motion.button>
        </div>
        
        {/* Pin Types */}
        <div className="mb-[14px]">
          <p className="font-['Inter'] text-[10px] uppercase tracking-wide mb-[8px]" style={{ color: textColors.muted }}>
            Pin Type
          </p>
          <div className="flex flex-wrap gap-[6px]">
            {Object.entries(pinTypes).map(([key, config]) => {
              const isActive = filters.types.includes(key);
              return (
                <motion.button
                  key={key}
                  className="px-[10px] py-[6px] rounded-[8px] flex items-center gap-[4px]"
                  style={{
                    background: isActive ? config.bgColor : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    border: isActive ? `1px solid ${config.color}40` : 'none',
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (isActive) {
                      setFilters({ ...filters, types: filters.types.filter(t => t !== key) });
                    } else {
                      setFilters({ ...filters, types: [...filters.types, key] });
                    }
                  }}
                >
                  <config.icon className="w-[12px] h-[12px]" style={{ color: config.color }} />
                  <span className="font-['Inter'] text-[11px]" style={{ color: isActive ? config.color : textColors.description }}>
                    {config.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
        
        {/* Severity */}
        <div className="mb-[14px]">
          <p className="font-['Inter'] text-[10px] uppercase tracking-wide mb-[8px]" style={{ color: textColors.muted }}>
            Severity
          </p>
          <div className="flex flex-wrap gap-[6px]">
            {Object.entries(severityLevels).map(([key, config]) => {
              const isActive = filters.severities.includes(key);
              return (
                <motion.button
                  key={key}
                  className="px-[10px] py-[6px] rounded-[8px]"
                  style={{
                    background: isActive ? `${config.color}20` : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    border: isActive ? `1px solid ${config.color}40` : 'none',
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (isActive) {
                      setFilters({ ...filters, severities: filters.severities.filter(s => s !== key) });
                    } else {
                      setFilters({ ...filters, severities: [...filters.severities, key] });
                    }
                  }}
                >
                  <span className="font-['Inter'] text-[11px]" style={{ color: isActive ? config.color : textColors.description }}>
                    {config.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
        
        {/* Sections */}
        <div>
          <p className="font-['Inter'] text-[10px] uppercase tracking-wide mb-[8px]" style={{ color: textColors.muted }}>
            Sections
          </p>
          <div className="flex flex-wrap gap-[6px]">
            {sampleSections.map((section) => {
              const isActive = filters.sections.includes(section.id);
              return (
                <motion.button
                  key={section.id}
                  className="px-[10px] py-[6px] rounded-[8px]"
                  style={{
                    background: isActive ? `${section.color}20` : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    border: isActive ? `1px solid ${section.color}40` : 'none',
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (isActive) {
                      setFilters({ ...filters, sections: filters.sections.filter(s => s !== section.id) });
                    } else {
                      setFilters({ ...filters, sections: [...filters.sections, section.id] });
                    }
                  }}
                >
                  <span className="font-['Inter'] text-[11px]" style={{ color: isActive ? section.color : textColors.description }}>
                    {section.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============ MAIN COMPONENT ============

export const MapsPage = ({ isDark = false, isGlassConnected = true }) => {
  // State
  const [pins, setPins] = useState(samplePins);
  const [selectedPin, setSelectedPin] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showSections, setShowSections] = useState(true);
  const [showStructures, setShowStructures] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isCustomerView, setIsCustomerView] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ types: [], severities: [], sections: [] });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isOffline, setIsOffline] = useState(false);
  
  const textColors = getTextColors(isDark);
  const accentColors = getAccentColors(isDark);
  
  // Filter pins
  const filteredPins = useMemo(() => {
    return pins.filter(pin => {
      if (filters.types.length > 0 && !filters.types.includes(pin.type)) return false;
      if (filters.severities.length > 0 && !filters.severities.includes(pin.severity)) return false;
      if (filters.sections.length > 0 && !filters.sections.includes(pin.section)) return false;
      return true;
    });
  }, [pins, filters]);
  
  // Stats
  const stats = useMemo(() => ({
    total: pins.length,
    damage: pins.filter(p => p.type === 'damage').length,
    critical: pins.filter(p => p.severity === 'critical').length,
    complete: pins.filter(p => p.status === 'complete').length,
  }), [pins]);
  
  const hasActiveFilters = filters.types.length > 0 || filters.severities.length > 0 || filters.sections.length > 0;
  
  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden">
      {/* Header Controls */}
      <div className="shrink-0 px-[16px] pt-[8px] pb-[12px]">
        {/* Title Row */}
        <div className="flex items-center justify-between mb-[10px]">
          <div>
            <h1 
              className="font-['Space_Grotesk'] font-bold text-[24px]"
              style={{ color: textColors.primary }}
            >
              Roof Map
            </h1>
            <p className="font-['Inter'] text-[11px]" style={{ color: textColors.muted }}>
              123 Oak Street • {stats.total} pins • {stats.damage} issues
            </p>
          </div>
          
          {/* Customer View Toggle */}
          <motion.button
            className="flex items-center gap-[6px] px-[12px] py-[8px] rounded-[10px]"
            style={{
              background: isCustomerView 
                ? isDark ? 'rgba(133, 88, 242, 0.2)' : 'rgba(2, 132, 199, 0.1)'
                : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              border: isCustomerView ? `1px solid ${accentColors.primary}40` : 'none',
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCustomerView(!isCustomerView)}
          >
            <Users className="w-[14px] h-[14px]" style={{ color: isCustomerView ? accentColors.primary : textColors.muted }} />
            <span 
              className="font-['Inter'] font-medium text-[11px]"
              style={{ color: isCustomerView ? accentColors.primary : textColors.description }}
            >
              Customer View
            </span>
          </motion.button>
        </div>
        
        {/* Toolbar */}
        <div className="flex items-center gap-[8px]">
          {/* Filter Button */}
          <motion.button
            className="flex-1 flex items-center justify-center gap-[6px] py-[10px] rounded-[10px]"
            style={{
              background: hasActiveFilters 
                ? isDark ? 'rgba(133, 88, 242, 0.15)' : 'rgba(2, 132, 199, 0.1)'
                : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              border: hasActiveFilters ? `1px solid ${accentColors.primary}30` : 'none',
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-[14px] h-[14px]" style={{ color: hasActiveFilters ? accentColors.primary : textColors.muted }} />
            <span className="font-['Inter'] font-medium text-[11px]" style={{ color: hasActiveFilters ? accentColors.primary : textColors.description }}>
              Filter {hasActiveFilters ? `(${filters.types.length + filters.severities.length + filters.sections.length})` : ''}
            </span>
          </motion.button>
          
          {/* Layers Button */}
          <motion.button
            className="flex-1 flex items-center justify-center gap-[6px] py-[10px] rounded-[10px]"
            style={{
              background: showSections 
                ? isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)'
                : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSections(!showSections)}
          >
            <Layers className="w-[14px] h-[14px]" style={{ color: showSections ? '#10b981' : textColors.muted }} />
            <span className="font-['Inter'] font-medium text-[11px]" style={{ color: showSections ? '#10b981' : textColors.description }}>
              Sections
            </span>
          </motion.button>
          
          {/* Heatmap Button */}
          <motion.button
            className="flex-1 flex items-center justify-center gap-[6px] py-[10px] rounded-[10px]"
            style={{
              background: showHeatmap 
                ? 'rgba(255, 59, 48, 0.15)'
                : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowHeatmap(!showHeatmap)}
          >
            <BarChart3 className="w-[14px] h-[14px]" style={{ color: showHeatmap ? '#FF3B30' : textColors.muted }} />
            <span className="font-['Inter'] font-medium text-[11px]" style={{ color: showHeatmap ? '#FF3B30' : textColors.description }}>
              Heatmap
            </span>
          </motion.button>
        </div>
      </div>
      
      {/* Map Container */}
      <div 
        className="flex-1 relative mx-[16px] rounded-[16px] overflow-hidden"
        style={{
          background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
          border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        }}
      >
        {/* Satellite/Map Background (Simulated) */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(45deg, 
                ${isDark ? '#1a2332' : '#c7d4c0'} 0%, 
                ${isDark ? '#243447' : '#9fb897'} 25%,
                ${isDark ? '#1e3a3f' : '#b8c9a8'} 50%,
                ${isDark ? '#2d3e4f' : '#a8bd96'} 75%,
                ${isDark ? '#1a2332' : '#c7d4c0'} 100%
              )
            `,
            backgroundSize: '200% 200%',
          }}
        />
        
        {/* Grid overlay to simulate satellite imagery */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px),
              linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
        
        {/* Roof Outline (Simplified) */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Main house outline */}
          <polygon
            points="10,20 50,8 90,20 90,70 50,82 10,70"
            fill="none"
            stroke={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'}
            strokeWidth="0.8"
            strokeDasharray="2,2"
          />
          {/* Ridge line */}
          <line 
            x1="10" y1="45" x2="90" y2="45" 
            stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}
            strokeWidth="0.5"
            strokeDasharray="3,3"
          />
        </svg>
        
        {/* Heatmap Overlay */}
        {showHeatmap && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Hot zones (damage concentration) */}
            <div 
              className="absolute rounded-full"
              style={{
                left: '30%',
                top: '20%',
                width: '100px',
                height: '100px',
                background: 'radial-gradient(circle, rgba(255,59,48,0.4) 0%, rgba(255,59,48,0.1) 50%, transparent 70%)',
                filter: 'blur(15px)',
              }}
            />
            <div 
              className="absolute rounded-full"
              style={{
                left: '60%',
                top: '35%',
                width: '80px',
                height: '80px',
                background: 'radial-gradient(circle, rgba(255,204,0,0.35) 0%, rgba(255,204,0,0.1) 50%, transparent 70%)',
                filter: 'blur(12px)',
              }}
            />
            <div 
              className="absolute rounded-full"
              style={{
                left: '10%',
                top: '35%',
                width: '60px',
                height: '60px',
                background: 'radial-gradient(circle, rgba(255,149,0,0.35) 0%, rgba(255,149,0,0.1) 50%, transparent 70%)',
                filter: 'blur(10px)',
              }}
            />
          </div>
        )}
        
        {/* Section Overlays */}
        {showSections && sampleSections.map(section => (
          <SectionOverlay 
            key={section.id}
            section={section}
            isActive={selectedSection?.id === section.id}
            onClick={() => setSelectedSection(selectedSection?.id === section.id ? null : section)}
            isDark={isDark}
          />
        ))}
        
        {/* Structure Markers */}
        {showStructures && roofStructures.map(structure => (
          <StructureMarker key={structure.id} structure={structure} isDark={isDark} />
        ))}
        
        {/* Map Pins */}
        {filteredPins.map(pin => (
          <MapPin2
            key={pin.id}
            pin={pin}
            isSelected={selectedPin?.id === pin.id}
            onClick={() => setSelectedPin(selectedPin?.id === pin.id ? null : pin)}
            isDark={isDark}
            isCustomerView={isCustomerView}
          />
        ))}
        
        {/* Zoom Controls */}
        <div 
          className="absolute right-[12px] top-[12px] flex flex-col rounded-[10px] overflow-hidden"
          style={{
            background: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255,255,255,0.9)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <motion.button
            className="w-[36px] h-[36px] flex items-center justify-center"
            style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)' }}
            whileTap={{ scale: 0.9, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
            onClick={() => setZoomLevel(Math.min(zoomLevel + 0.25, 2))}
          >
            <Plus className="w-[16px] h-[16px]" style={{ color: textColors.description }} />
          </motion.button>
          <motion.button
            className="w-[36px] h-[36px] flex items-center justify-center"
            whileTap={{ scale: 0.9, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
            onClick={() => setZoomLevel(Math.max(zoomLevel - 0.25, 0.5))}
          >
            <Minus className="w-[16px] h-[16px]" style={{ color: textColors.description }} />
          </motion.button>
        </div>
        
        {/* Recenter Button */}
        <motion.button
          className="absolute left-[12px] top-[12px] w-[36px] h-[36px] rounded-[10px] flex items-center justify-center"
          style={{
            background: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255,255,255,0.9)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
          whileTap={{ scale: 0.9 }}
        >
          <Crosshair className="w-[16px] h-[16px]" style={{ color: textColors.description }} />
        </motion.button>
        
        {/* Offline Indicator */}
        {isOffline && (
          <div 
            className="absolute top-[12px] left-1/2 -translate-x-1/2 px-[12px] py-[6px] rounded-full flex items-center gap-[6px]"
            style={{
              background: 'rgba(255, 149, 0, 0.9)',
              boxShadow: '0 4px 12px rgba(255,149,0,0.3)',
            }}
          >
            <CloudOff className="w-[12px] h-[12px] text-white" />
            <span className="font-['Inter'] font-medium text-[10px] text-white">Offline</span>
          </div>
        )}
        
        {/* Legend */}
        <div 
          className="absolute left-[12px] bottom-[12px] rounded-[10px] p-[10px]"
          style={{
            background: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255,255,255,0.95)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <p className="font-['Inter'] text-[8px] uppercase tracking-wide mb-[6px]" style={{ color: textColors.muted }}>
            Pin Legend
          </p>
          <div className="flex flex-wrap gap-[6px]">
            {Object.entries(pinTypes).slice(0, 4).map(([key, config]) => (
              <div key={key} className="flex items-center gap-[3px]">
                <div className="w-[8px] h-[8px] rounded-full" style={{ background: config.color }} />
                <span className="font-['Inter'] text-[8px]" style={{ color: textColors.description }}>
                  {config.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Stats Bar */}
      <div className="shrink-0 px-[16px] py-[12px]">
        <div 
          className="flex items-center justify-between p-[12px] rounded-[12px]"
          style={{
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
          }}
        >
          {/* Quick Stats */}
          <div className="flex items-center gap-[16px]">
            <div className="flex items-center gap-[6px]">
              <div className="w-[8px] h-[8px] rounded-full bg-red-500" />
              <span className="font-['Inter'] font-semibold text-[12px]" style={{ color: textColors.primary }}>
                {stats.critical}
              </span>
              <span className="font-['Inter'] text-[10px]" style={{ color: textColors.muted }}>
                critical
              </span>
            </div>
            <div className="flex items-center gap-[6px]">
              <div className="w-[8px] h-[8px] rounded-full bg-green-500" />
              <span className="font-['Inter'] font-semibold text-[12px]" style={{ color: textColors.primary }}>
                {stats.complete}
              </span>
              <span className="font-['Inter'] text-[10px]" style={{ color: textColors.muted }}>
                done
              </span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-[8px]">
            <motion.button
              className="px-[12px] py-[8px] rounded-[8px] flex items-center gap-[6px]"
              style={{
                background: accentColors.primary,
                boxShadow: `0 4px 12px ${accentColors.primary}40`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-[12px] h-[12px] text-white" />
              <span className="font-['Inter'] font-semibold text-[11px] text-white">
                Export
              </span>
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <FilterPanel
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            filters={filters}
            setFilters={setFilters}
            isDark={isDark}
          />
        )}
      </AnimatePresence>
      
      {/* Pin Detail Panel */}
      <AnimatePresence>
        {selectedPin && !selectedSection && (
          <PinDetailPanel
            pin={selectedPin}
            onClose={() => setSelectedPin(null)}
            onEdit={() => console.log('Edit pin')}
            onDelete={() => console.log('Delete pin')}
            isDark={isDark}
            isCustomerView={isCustomerView}
          />
        )}
      </AnimatePresence>
      
      {/* Section Panel */}
      <AnimatePresence>
        {selectedSection && (
          <SectionPanel
            section={selectedSection}
            pins={pins}
            onClose={() => setSelectedSection(null)}
            isDark={isDark}
          />
        )}
      </AnimatePresence>
      
      {/* Floating Add Pin Button */}
      {!isCustomerView && !selectedPin && !selectedSection && (
        <motion.button
          className="absolute right-[24px] bottom-[80px] w-[52px] h-[52px] rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.primaryLight} 100%)`,
            boxShadow: `0 8px 24px ${accentColors.primary}50`,
          }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <MapPin className="w-[22px] h-[22px] text-white" />
        </motion.button>
      )}
    </div>
  );
};

export default MapsPage;
