import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Plus, Search, Clock, MapPin, Cloud, CloudOff, 
  ChevronRight, MoreVertical, Trash2, Edit3, Share2, 
  CheckCircle, AlertCircle, Loader, FileText, Camera, 
  Tag, Filter, X, Check, Volume2, Pause, Play, 
  Battery, Wifi, WifiOff, Home, Clipboard, Wrench,
  Zap, ThermometerSun, Droplets, Wind, ChevronDown, Archive
} from 'lucide-react';

// Theme-aware accent colors
const getAccentColors = (isDark) => ({
  primary: isDark ? '#8558F2' : '#0284c7',
  primaryLight: isDark ? '#a78bfa' : '#0ea5e9',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  bgSubtle: isDark ? 'rgba(133, 88, 242, 0.08)' : 'rgba(2, 132, 199, 0.06)',
  bgLight: isDark ? 'rgba(133, 88, 242, 0.12)' : 'rgba(2, 132, 199, 0.08)',
  bgMedium: isDark ? 'rgba(133, 88, 242, 0.15)' : 'rgba(2, 132, 199, 0.1)',
});

// Text colors for accessibility (WCAG AA compliant - high contrast for outdoor use)
const getTextColors = (isDark) => ({
  primary: isDark ? '#f8fafc' : '#0f172a',
  secondary: isDark ? '#e2e8f0' : '#1e293b',
  description: isDark ? '#cbd5e1' : '#334155',
  muted: isDark ? '#94a3b8' : '#64748b',
});

// Note templates for different inspection types
const noteTemplates = [
  { 
    id: 'quick', 
    name: 'Quick Note', 
    icon: Zap, 
    color: '#8558F2',
    fields: ['content'],
    description: 'Fast capture, no fields'
  },
  { 
    id: 'damage', 
    name: 'Damage Report', 
    icon: AlertCircle, 
    color: '#ef4444',
    fields: ['severity', 'location', 'description', 'recommendation'],
    description: 'Document roof damage'
  },
  { 
    id: 'measurement', 
    name: 'Measurement', 
    icon: Clipboard, 
    color: '#10b981',
    fields: ['area', 'dimensions', 'notes'],
    description: 'Record dimensions'
  },
  { 
    id: 'material', 
    name: 'Material Note', 
    icon: Wrench, 
    color: '#f59e0b',
    fields: ['material_type', 'condition', 'quantity', 'notes'],
    description: 'Material observations'
  },
  { 
    id: 'safety', 
    name: 'Safety Alert', 
    icon: AlertCircle, 
    color: '#dc2626',
    fields: ['hazard_type', 'severity', 'action_required'],
    description: 'Flag safety concerns',
    priority: 'high'
  },
];

// Sample notes data
const sampleNotes = [
  {
    id: 1,
    template: 'damage',
    title: 'Shingle damage - North slope',
    content: 'Found 3 cracked shingles near the ridge. Wind damage suspected. Flashing around chimney needs inspection.',
    severity: 'medium',
    timestamp: new Date().toISOString(),
    location: 'North slope, near ridge',
    inspection: 'Roof Inspection #1247',
    syncStatus: 'synced',
    hasPhotos: true,
    photoCount: 2,
    tags: ['shingles', 'wind damage', 'flashing'],
    weather: { temp: 72, condition: 'sunny' },
  },
  {
    id: 2,
    template: 'quick',
    title: 'Voice note - Soffit condition',
    content: 'Soffit vents are 80% blocked with debris. Recommend cleaning before winter. Some paint peeling on fascia board.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    location: 'East side, soffit area',
    inspection: 'Roof Inspection #1247',
    syncStatus: 'pending',
    hasPhotos: false,
    tags: ['soffit', 'ventilation'],
    isVoiceNote: true,
  },
  {
    id: 3,
    template: 'safety',
    title: '⚠️ SAFETY: Unstable decking',
    content: 'Section of roof deck feels soft near valley. Do not walk on marked area. Possible water damage underneath.',
    severity: 'high',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    location: 'Main valley intersection',
    inspection: 'Roof Inspection #1247',
    syncStatus: 'synced',
    hasPhotos: true,
    photoCount: 3,
    tags: ['safety', 'deck', 'water damage'],
    priority: 'high',
  },
  {
    id: 4,
    template: 'measurement',
    title: 'Roof area measurements',
    content: 'Total roof area approximately 2,400 sq ft. Main section: 1,800 sq ft. Garage: 600 sq ft.',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    location: 'Full property',
    inspection: 'Roof Inspection #1247',
    syncStatus: 'synced',
    hasPhotos: false,
    tags: ['measurements', 'area'],
  },
];

// Voice Command Reference
const voiceCommands = [
  { command: '"Hey Zuper, new note"', action: 'Start new quick note' },
  { command: '"Hey Zuper, damage report"', action: 'Start damage template' },
  { command: '"Hey Zuper, safety alert"', action: 'Flag safety issue' },
  { command: '"Hey Zuper, take photo"', action: 'Capture and attach photo' },
  { command: '"Hey Zuper, save note"', action: 'Save current note' },
  { command: '"Hey Zuper, read back"', action: 'Read last note aloud' },
];

// ============ COMPONENTS ============

// Sync Status Badge - High contrast for outdoor visibility
const SyncStatusBadge = ({ status, isDark }) => {
  const configs = {
    synced: { icon: CheckCircle, color: '#10b981', label: 'Saved', bg: 'rgba(16, 185, 129, 0.15)' },
    pending: { icon: Cloud, color: '#f59e0b', label: 'Pending', bg: 'rgba(245, 158, 11, 0.15)' },
    syncing: { icon: Loader, color: '#3b82f6', label: 'Syncing', bg: 'rgba(59, 130, 246, 0.15)' },
    offline: { icon: CloudOff, color: '#94a3b8', label: 'Offline', bg: 'rgba(148, 163, 184, 0.15)' },
    error: { icon: AlertCircle, color: '#ef4444', label: 'Error', bg: 'rgba(239, 68, 68, 0.15)' },
  };
  
  const config = configs[status] || configs.offline;
  const Icon = config.icon;
  
  return (
    <div 
      className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px]"
      style={{ background: config.bg }}
    >
      <Icon 
        className={`w-[12px] h-[12px] ${status === 'syncing' ? 'animate-spin' : ''}`} 
        style={{ color: config.color }} 
        strokeWidth={2.5}
      />
      <span 
        className="font-['Inter'] font-semibold text-[10px] uppercase tracking-wide"
        style={{ color: config.color }}
      >
        {config.label}
      </span>
    </div>
  );
};

// Offline Banner - Critical visibility
const OfflineBanner = ({ isDark }) => (
  <motion.div
    className="w-full px-[16px] py-[10px] flex items-center justify-center gap-[8px]"
    style={{
      background: isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.15)',
      borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
    }}
    initial={{ y: -40, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
  >
    <WifiOff className="w-[16px] h-[16px] text-amber-500" strokeWidth={2.5} />
    <span className="font-['Inter'] font-semibold text-[12px] text-amber-600">
      Offline Mode - Notes will sync when connected
    </span>
  </motion.div>
);

// Voice Recording Button - Large touch target (minimum 48x48px as required)
const VoiceRecordButton = ({ isRecording, onToggle, isDark, disabled }) => {
  const accentColors = getAccentColors(isDark);
  
  return (
    <motion.button
      className="relative flex items-center justify-center rounded-full"
      style={{
        width: '64px',
        height: '64px',
        background: isRecording 
          ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
          : `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.primaryLight} 100%)`,
        boxShadow: isRecording
          ? '0 8px 24px rgba(239, 68, 68, 0.4), 0 0 0 4px rgba(239, 68, 68, 0.2)'
          : `0 8px 24px ${isDark ? 'rgba(133, 88, 242, 0.4)' : 'rgba(2, 132, 199, 0.3)'}`,
      }}
      whileTap={{ scale: 0.92 }}
      onClick={onToggle}
      disabled={disabled}
      aria-label={isRecording ? 'Stop recording' : 'Start voice note'}
    >
      {/* Pulse animation when recording */}
      {isRecording && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'rgba(239, 68, 68, 0.3)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'rgba(239, 68, 68, 0.2)' }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
        </>
      )}
      
      {isRecording ? (
        <div className="w-[20px] h-[20px] rounded-[4px] bg-white" />
      ) : (
        <Mic className="w-[28px] h-[28px] text-white" strokeWidth={2} />
      )}
    </motion.button>
  );
};

// Note Card - High contrast, large touch target
const NoteCard = ({ note, isDark, onPress, onDelete, onEdit }) => {
  const textColors = getTextColors(isDark);
  const accentColors = getAccentColors(isDark);
  const [showActions, setShowActions] = useState(false);
  
  const template = noteTemplates.find(t => t.id === note.template) || noteTemplates[0];
  const TemplateIcon = template.icon;
  
  const isPriority = note.priority === 'high';
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      className="relative w-full rounded-[16px] overflow-hidden"
      style={{
        background: isDark 
          ? isPriority ? 'rgba(239, 68, 68, 0.1)' : 'rgba(30, 41, 59, 0.8)'
          : isPriority ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255, 255, 255, 0.95)',
        border: isPriority 
          ? '2px solid rgba(239, 68, 68, 0.4)'
          : isDark 
            ? '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: isDark 
          ? '0 4px 16px rgba(0, 0, 0, 0.2)'
          : '0 4px 16px rgba(0, 0, 0, 0.06)',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onPress}
    >
      {/* Priority indicator stripe */}
      {isPriority && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-[4px]"
          style={{ background: '#ef4444' }}
        />
      )}
      
      <div className="p-[16px]">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-[12px] mb-[10px]">
          <div className="flex items-center gap-[10px] flex-1 min-w-0">
            {/* Template Icon - Large for visibility */}
            <div 
              className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center shrink-0"
              style={{ 
                background: `${template.color}20`,
                border: `1px solid ${template.color}40`,
              }}
            >
              <TemplateIcon 
                className="w-[20px] h-[20px]" 
                style={{ color: template.color }} 
                strokeWidth={2}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 
                className="font-['Inter'] font-semibold text-[14px] leading-tight truncate"
                style={{ color: textColors.primary }}
              >
                {note.title}
              </h3>
              <p 
                className="font-['Inter'] text-[11px] mt-[2px]"
                style={{ color: textColors.muted }}
              >
                {template.name} • {formatTime(note.timestamp)}
              </p>
            </div>
          </div>
          
          {/* Sync Status + Actions */}
          <div className="flex items-center gap-[8px] shrink-0">
            <SyncStatusBadge status={note.syncStatus} isDark={isDark} />
            <motion.button
              className="w-[36px] h-[36px] rounded-[8px] flex items-center justify-center"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
            >
              <MoreVertical className="w-[18px] h-[18px]" style={{ color: textColors.muted }} />
            </motion.button>
          </div>
        </div>
        
        {/* Content Preview */}
        <p 
          className="font-['Inter'] text-[13px] leading-[1.5] mb-[12px] line-clamp-2"
          style={{ color: textColors.description }}
        >
          {note.content}
        </p>
        
        {/* Footer Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[12px]">
            {/* Location */}
            {note.location && (
              <div className="flex items-center gap-[4px]">
                <MapPin className="w-[12px] h-[12px]" style={{ color: textColors.muted }} />
                <span 
                  className="font-['Inter'] text-[10px] truncate max-w-[100px]"
                  style={{ color: textColors.muted }}
                >
                  {note.location.split(',')[0]}
                </span>
              </div>
            )}
            
            {/* Voice note indicator */}
            {note.isVoiceNote && (
              <div className="flex items-center gap-[4px]">
                <Mic className="w-[12px] h-[12px]" style={{ color: accentColors.primary }} />
                <span 
                  className="font-['Inter'] text-[10px]"
                  style={{ color: accentColors.primary }}
                >
                  Voice
                </span>
              </div>
            )}
            
            {/* Photo count */}
            {note.hasPhotos && (
              <div className="flex items-center gap-[4px]">
                <Camera className="w-[12px] h-[12px]" style={{ color: textColors.muted }} />
                <span 
                  className="font-['Inter'] text-[10px]"
                  style={{ color: textColors.muted }}
                >
                  {note.photoCount}
                </span>
              </div>
            )}
          </div>
          
          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex items-center gap-[4px]">
              {note.tags.slice(0, 2).map((tag, idx) => (
                <span 
                  key={idx}
                  className="px-[6px] py-[2px] rounded-[4px] font-['Inter'] text-[9px]"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                    color: textColors.muted,
                  }}
                >
                  {tag}
                </span>
              ))}
              {note.tags.length > 2 && (
                <span 
                  className="font-['Inter'] text-[9px]"
                  style={{ color: textColors.muted }}
                >
                  +{note.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Actions Dropdown */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            className="absolute right-[16px] top-[60px] z-20 rounded-[12px] overflow-hidden"
            style={{
              background: isDark ? '#1e293b' : '#ffffff',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            onClick={(e) => e.stopPropagation()}
          >
            {[
              { icon: Edit3, label: 'Edit', action: onEdit },
              { icon: Share2, label: 'Share', action: () => {} },
              { icon: Archive, label: 'Archive', action: () => {} },
              { icon: Trash2, label: 'Delete', action: onDelete, danger: true },
            ].map((item, idx) => (
              <motion.button
                key={idx}
                className="w-full px-[16px] py-[12px] flex items-center gap-[10px]"
                style={{
                  borderBottom: idx < 3 
                    ? isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)'
                    : 'none',
                }}
                whileTap={{ scale: 0.98, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
                onClick={() => {
                  setShowActions(false);
                  item.action?.();
                }}
              >
                <item.icon 
                  className="w-[16px] h-[16px]" 
                  style={{ color: item.danger ? '#ef4444' : textColors.description }}
                  strokeWidth={2}
                />
                <span 
                  className="font-['Inter'] font-medium text-[13px]"
                  style={{ color: item.danger ? '#ef4444' : textColors.primary }}
                >
                  {item.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Template Selection Card - Large touch target
const TemplateCard = ({ template, isDark, onSelect, isSelected }) => {
  const textColors = getTextColors(isDark);
  const Icon = template.icon;
  
  return (
    <motion.button
      className="flex flex-col items-center gap-[8px] p-[12px] rounded-[14px] min-w-[80px]"
      style={{
        background: isSelected 
          ? `${template.color}20`
          : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        border: isSelected 
          ? `2px solid ${template.color}`
          : isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
    >
      <div 
        className="w-[44px] h-[44px] rounded-[12px] flex items-center justify-center"
        style={{ 
          background: `${template.color}20`,
        }}
      >
        <Icon 
          className="w-[22px] h-[22px]" 
          style={{ color: template.color }} 
          strokeWidth={2}
        />
      </div>
      <span 
        className="font-['Inter'] font-medium text-[11px] text-center leading-tight"
        style={{ color: isSelected ? template.color : textColors.primary }}
      >
        {template.name}
      </span>
    </motion.button>
  );
};

// New Note Modal - Full screen for field use
const NewNoteModal = ({ isOpen, onClose, isDark, isOffline }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('quick');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [showVoiceCommands, setShowVoiceCommands] = useState(false);
  
  const textColors = getTextColors(isDark);
  const accentColors = getAccentColors(isDark);
  
  // Recording timer
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);
  
  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleToggleRecording = () => {
    if (isRecording) {
      // Stop recording - simulate transcription
      setIsRecording(false);
      setTranscription("Detected shingle damage on north-facing slope. Three cracked shingles near ridge cap. Flashing around chimney appears compromised. Recommend full inspection of penetration points.");
      setRecordingTime(0);
    } else {
      setIsRecording(true);
      setTranscription('');
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      className="absolute inset-0 z-[100] flex flex-col"
      style={{
        background: isDark 
          ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
          : 'linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f8fafc 100%)',
      }}
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      {/* Header */}
      <div 
        className="shrink-0 px-[20px] pt-[16px] pb-[12px] flex items-center justify-between"
        style={{
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <motion.button
          className="w-[44px] h-[44px] rounded-[12px] flex items-center justify-center"
          style={{
            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
          }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
        >
          <X className="w-[20px] h-[20px]" style={{ color: textColors.primary }} strokeWidth={2} />
        </motion.button>
        
        <h1 
          className="font-['Space_Grotesk'] font-bold text-[18px]"
          style={{ color: textColors.primary }}
        >
          New Note
        </h1>
        
        <motion.button
          className="px-[16px] py-[10px] rounded-[10px] flex items-center gap-[6px]"
          style={{
            background: accentColors.primary,
            opacity: !transcription && !manualInput ? 0.5 : 1,
          }}
          whileTap={{ scale: 0.95 }}
          disabled={!transcription && !manualInput}
        >
          <Check className="w-[16px] h-[16px] text-white" strokeWidth={2.5} />
          <span className="font-['Inter'] font-semibold text-[13px] text-white">Save</span>
        </motion.button>
      </div>
      
      {/* Offline indicator */}
      {isOffline && <OfflineBanner isDark={isDark} />}
      
      {/* Template Selection - Horizontal scroll */}
      <div className="shrink-0 px-[20px] py-[16px]">
        <p 
          className="font-['Inter'] font-medium text-[12px] mb-[10px]"
          style={{ color: textColors.muted }}
        >
          SELECT TEMPLATE
        </p>
        <div className="flex gap-[10px] overflow-x-auto no-scrollbar pb-[4px]">
          {noteTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isDark={isDark}
              isSelected={selectedTemplate === template.id}
              onSelect={() => setSelectedTemplate(template.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-[20px] pb-[120px]">
        {/* Voice Recording Section */}
        <div 
          className="rounded-[20px] p-[24px] mb-[16px]"
          style={{
            background: isDark 
              ? 'rgba(30, 41, 59, 0.6)'
              : 'rgba(255, 255, 255, 0.8)',
            border: isDark 
              ? '1px solid rgba(255,255,255,0.1)'
              : '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex flex-col items-center">
            {/* Recording Button */}
            <VoiceRecordButton
              isRecording={isRecording}
              onToggle={handleToggleRecording}
              isDark={isDark}
            />
            
            {/* Recording Status */}
            <div className="mt-[16px] text-center">
              {isRecording ? (
                <>
                  <motion.p 
                    className="font-['Inter'] font-bold text-[24px]"
                    style={{ color: '#ef4444' }}
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {formatRecordingTime(recordingTime)}
                  </motion.p>
                  <p 
                    className="font-['Inter'] text-[13px] mt-[4px]"
                    style={{ color: textColors.muted }}
                  >
                    Recording... Tap to stop
                  </p>
                </>
              ) : (
                <>
                  <p 
                    className="font-['Inter'] font-semibold text-[14px]"
                    style={{ color: textColors.primary }}
                  >
                    Tap to start voice note
                  </p>
                  <p 
                    className="font-['Inter'] text-[12px] mt-[4px]"
                    style={{ color: textColors.muted }}
                  >
                    or say "Hey Zuper, new note"
                  </p>
                </>
              )}
            </div>
            
            {/* Voice Commands Help */}
            <motion.button
              className="mt-[16px] flex items-center gap-[6px] px-[12px] py-[8px] rounded-[8px]"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowVoiceCommands(!showVoiceCommands)}
            >
              <Volume2 className="w-[14px] h-[14px]" style={{ color: accentColors.primary }} />
              <span 
                className="font-['Inter'] font-medium text-[11px]"
                style={{ color: accentColors.primary }}
              >
                Voice Commands
              </span>
              <ChevronDown 
                className={`w-[12px] h-[12px] transition-transform ${showVoiceCommands ? 'rotate-180' : ''}`}
                style={{ color: accentColors.primary }}
              />
            </motion.button>
            
            {/* Voice Commands List */}
            <AnimatePresence>
              {showVoiceCommands && (
                <motion.div
                  className="w-full mt-[12px] rounded-[12px] overflow-hidden"
                  style={{
                    background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                  }}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div className="p-[12px]">
                    {voiceCommands.map((cmd, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between py-[8px]"
                        style={{
                          borderBottom: idx < voiceCommands.length - 1 
                            ? isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)'
                            : 'none',
                        }}
                      >
                        <span 
                          className="font-['SF_Mono','monospace'] text-[11px]"
                          style={{ color: accentColors.primary }}
                        >
                          {cmd.command}
                        </span>
                        <span 
                          className="font-['Inter'] text-[10px]"
                          style={{ color: textColors.muted }}
                        >
                          {cmd.action}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Transcription Result */}
        {transcription && (
          <motion.div
            className="rounded-[16px] p-[16px] mb-[16px]"
            style={{
              background: isDark 
                ? 'rgba(16, 185, 129, 0.1)'
                : 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-[8px] mb-[10px]">
              <CheckCircle className="w-[16px] h-[16px] text-emerald-500" strokeWidth={2} />
              <span className="font-['Inter'] font-semibold text-[12px] text-emerald-600">
                Transcription Complete
              </span>
            </div>
            <p 
              className="font-['Inter'] text-[14px] leading-[1.6]"
              style={{ color: textColors.primary }}
            >
              {transcription}
            </p>
            <button 
              className="mt-[12px] font-['Inter'] font-medium text-[12px] text-emerald-600"
            >
              Edit transcription →
            </button>
          </motion.div>
        )}
        
        {/* Manual Input Section */}
        <div 
          className="rounded-[16px] p-[16px]"
          style={{
            background: isDark 
              ? 'rgba(30, 41, 59, 0.6)'
              : 'rgba(255, 255, 255, 0.8)',
            border: isDark 
              ? '1px solid rgba(255,255,255,0.1)'
              : '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <p 
            className="font-['Inter'] font-medium text-[12px] mb-[10px]"
            style={{ color: textColors.muted }}
          >
            OR TYPE MANUALLY
          </p>
          <textarea
            className="w-full h-[120px] rounded-[12px] p-[14px] resize-none font-['Inter'] text-[14px]"
            style={{
              background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              color: textColors.primary,
            }}
            placeholder="Type your note here..."
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
          />
          
          {/* Quick Actions */}
          <div className="flex gap-[10px] mt-[12px]">
            <motion.button
              className="flex-1 py-[12px] rounded-[10px] flex items-center justify-center gap-[8px]"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Camera className="w-[18px] h-[18px]" style={{ color: textColors.description }} />
              <span className="font-['Inter'] font-medium text-[12px]" style={{ color: textColors.primary }}>
                Add Photo
              </span>
            </motion.button>
            
            <motion.button
              className="flex-1 py-[12px] rounded-[10px] flex items-center justify-center gap-[8px]"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Tag className="w-[18px] h-[18px]" style={{ color: textColors.description }} />
              <span className="font-['Inter'] font-medium text-[12px]" style={{ color: textColors.primary }}>
                Add Tags
              </span>
            </motion.button>
          </div>
        </div>
        
        {/* Auto-captured Metadata */}
        <div className="mt-[16px] p-[14px] rounded-[12px]" style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        }}>
          <p 
            className="font-['Inter'] font-medium text-[10px] mb-[10px] uppercase tracking-wide"
            style={{ color: textColors.muted }}
          >
            Auto-captured
          </p>
          <div className="flex flex-wrap gap-[8px]">
            {[
              { icon: Clock, label: new Date().toLocaleTimeString() },
              { icon: MapPin, label: 'Current location' },
              { icon: ThermometerSun, label: '72°F Sunny' },
              { icon: Battery, label: '85%' },
            ].map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px]"
                style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
              >
                <item.icon className="w-[12px] h-[12px]" style={{ color: textColors.muted }} />
                <span className="font-['Inter'] text-[10px]" style={{ color: textColors.description }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============ MAIN COMPONENT ============

export const NotesPage = ({ isDark = false }) => {
  const [notes, setNotes] = useState(sampleNotes);
  const [isOffline, setIsOffline] = useState(false);
  const [showNewNote, setShowNewNote] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTemplate, setFilterTemplate] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const textColors = getTextColors(isDark);
  const accentColors = getAccentColors(isDark);
  
  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = !searchQuery || 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTemplate = filterTemplate === 'all' || note.template === filterTemplate;
      return matchesSearch && matchesTemplate;
    });
  }, [notes, searchQuery, filterTemplate]);
  
  // Stats
  const stats = useMemo(() => ({
    total: notes.length,
    synced: notes.filter(n => n.syncStatus === 'synced').length,
    pending: notes.filter(n => n.syncStatus === 'pending').length,
    priority: notes.filter(n => n.priority === 'high').length,
  }), [notes]);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Offline Banner */}
      {isOffline && <OfflineBanner isDark={isDark} />}
      
      {/* Header */}
      <div className="shrink-0 px-[24px] pt-[8px] pb-[12px]">
        <div className="flex items-center justify-between mb-[12px]">
          <div>
            <h1 
              className="font-['Space_Grotesk'] font-bold text-[28px]"
              style={{ color: textColors.primary }}
            >
              Notes
            </h1>
            <p 
              className="font-['Inter'] text-[13px] mt-[2px]"
              style={{ color: textColors.muted }}
            >
              {stats.total} notes • {stats.synced} synced
            </p>
          </div>
          
          {/* Quick sync status */}
          {stats.pending > 0 && (
            <div 
              className="flex items-center gap-[6px] px-[10px] py-[6px] rounded-[8px]"
              style={{ background: 'rgba(245, 158, 11, 0.15)' }}
            >
              <Cloud className="w-[14px] h-[14px] text-amber-500" />
              <span className="font-['Inter'] font-semibold text-[11px] text-amber-600">
                {stats.pending} pending
              </span>
            </div>
          )}
        </div>
        
        {/* Search Bar - Large touch target */}
        <div 
          className="flex items-center gap-[10px] px-[14px] py-[12px] rounded-[14px]"
          style={{
            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <Search className="w-[20px] h-[20px]" style={{ color: textColors.muted }} />
          <input
            type="text"
            placeholder="Search notes..."
            className="flex-1 bg-transparent font-['Inter'] text-[14px] outline-none"
            style={{ color: textColors.primary }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <motion.button
            className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center"
            style={{
              background: showFilters ? accentColors.bgMedium : 'transparent',
              border: showFilters ? `1px solid ${accentColors.primary}40` : 'none',
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter 
              className="w-[18px] h-[18px]" 
              style={{ color: showFilters ? accentColors.primary : textColors.muted }} 
            />
          </motion.button>
        </div>
        
        {/* Filter chips */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="flex gap-[8px] mt-[12px] overflow-x-auto no-scrollbar"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <motion.button
                className="px-[12px] py-[8px] rounded-[8px] shrink-0"
                style={{
                  background: filterTemplate === 'all' ? accentColors.bgMedium : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  border: filterTemplate === 'all' ? `1px solid ${accentColors.primary}40` : 'transparent',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterTemplate('all')}
              >
                <span 
                  className="font-['Inter'] font-medium text-[12px]"
                  style={{ color: filterTemplate === 'all' ? accentColors.primary : textColors.description }}
                >
                  All
                </span>
              </motion.button>
              {noteTemplates.map((template) => (
                <motion.button
                  key={template.id}
                  className="px-[12px] py-[8px] rounded-[8px] flex items-center gap-[6px] shrink-0"
                  style={{
                    background: filterTemplate === template.id ? `${template.color}20` : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    border: filterTemplate === template.id ? `1px solid ${template.color}40` : 'transparent',
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterTemplate(template.id)}
                >
                  <template.icon 
                    className="w-[14px] h-[14px]" 
                    style={{ color: filterTemplate === template.id ? template.color : textColors.muted }} 
                  />
                  <span 
                    className="font-['Inter'] font-medium text-[12px]"
                    style={{ color: filterTemplate === template.id ? template.color : textColors.description }}
                  >
                    {template.name}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Notes List */}
      <div className="flex-1 overflow-y-auto px-[24px] pb-[180px]">
        {/* Priority Notes Section */}
        {stats.priority > 0 && filterTemplate === 'all' && (
          <div className="mb-[16px]">
            <p 
              className="font-['Inter'] font-semibold text-[11px] uppercase tracking-wide mb-[10px] flex items-center gap-[6px]"
              style={{ color: '#ef4444' }}
            >
              <AlertCircle className="w-[14px] h-[14px]" />
              Priority ({stats.priority})
            </p>
            <div className="flex flex-col gap-[12px]">
              {filteredNotes
                .filter(n => n.priority === 'high')
                .map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    isDark={isDark}
                    onPress={() => {}}
                    onDelete={() => setNotes(notes.filter(n => n.id !== note.id))}
                    onEdit={() => {}}
                  />
                ))}
            </div>
          </div>
        )}
        
        {/* All Notes */}
        <div>
          {filterTemplate === 'all' && stats.priority > 0 && (
            <p 
              className="font-['Inter'] font-semibold text-[11px] uppercase tracking-wide mb-[10px]"
              style={{ color: textColors.muted }}
            >
              All Notes
            </p>
          )}
          <div className="flex flex-col gap-[12px]">
            {filteredNotes
              .filter(n => n.priority !== 'high' || filterTemplate !== 'all')
              .map((note, idx) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isDark={isDark}
                  onPress={() => {}}
                  onDelete={() => setNotes(notes.filter(n => n.id !== note.id))}
                  onEdit={() => {}}
                />
              ))}
          </div>
        </div>
        
        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-[60px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div 
              className="w-[80px] h-[80px] rounded-[20px] flex items-center justify-center mb-[16px]"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
            >
              <FileText className="w-[36px] h-[36px]" style={{ color: textColors.muted }} />
            </div>
            <p 
              className="font-['Inter'] font-semibold text-[16px] mb-[6px]"
              style={{ color: textColors.primary }}
            >
              No notes found
            </p>
            <p 
              className="font-['Inter'] text-[13px] text-center max-w-[200px]"
              style={{ color: textColors.muted }}
            >
              {searchQuery ? 'Try a different search' : 'Tap + to create your first note'}
            </p>
          </motion.div>
        )}
      </div>
      
      {/* Floating Action Button - Extra large for field use */}
      <motion.button
        className="absolute bottom-[100px] right-[24px] w-[64px] h-[64px] rounded-full flex items-center justify-center z-50"
        style={{
          background: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.primaryLight} 100%)`,
          boxShadow: `0 8px 24px ${isDark ? 'rgba(133, 88, 242, 0.4)' : 'rgba(2, 132, 199, 0.35)'}`,
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowNewNote(true)}
        aria-label="Create new note"
      >
        <Plus className="w-[28px] h-[28px] text-white" strokeWidth={2.5} />
      </motion.button>
      
      {/* New Note Modal */}
      <AnimatePresence>
        {showNewNote && (
          <NewNoteModal
            isOpen={showNewNote}
            onClose={() => setShowNewNote(false)}
            isDark={isDark}
            isOffline={isOffline}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotesPage;

