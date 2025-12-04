import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Mic, MicOff, Plus, Search, Clock, MapPin, Cloud, CloudOff, 
  ChevronRight, MoreVertical, Trash2, Edit3, Share2, 
  CheckCircle, AlertCircle, Loader, FileText, Camera, 
  Tag, Filter, X, Check, Volume2, Pause, Play, 
  Battery, Wifi, WifiOff, Home, Clipboard, Wrench,
  Zap, ThermometerSun, Droplets, Wind, ChevronDown, Archive,
  RefreshCw, Download, Send, Eye, EyeOff, Link, Unlink,
  Layers, Grid3X3, List, SortAsc, SortDesc, Headphones,
  RotateCcw, Copy, Merge, Split, Flag, AlertTriangle,
  Radio, Bluetooth, BluetoothOff, Activity, Settings,
  ChevronLeft, ChevronUp, SkipBack, SkipForward, Square
} from 'lucide-react';

// ============ CONSTANTS & DATA MODELS ============

// Theme-aware accent colors
const getAccentColors = (isDark) => ({
  primary: isDark ? '#8558F2' : '#0284c7',
  primaryLight: isDark ? '#a78bfa' : '#0ea5e9',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  bgSubtle: isDark ? 'rgba(133, 88, 242, 0.08)' : 'rgba(2, 132, 199, 0.06)',
  bgLight: isDark ? 'rgba(133, 88, 242, 0.12)' : 'rgba(2, 132, 199, 0.08)',
  bgMedium: isDark ? 'rgba(133, 88, 242, 0.15)' : 'rgba(2, 132, 199, 0.1)',
});

// Text colors for accessibility (WCAG AA compliant)
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
    voiceCommand: 'quick note',
    description: 'Fast capture'
  },
  { 
    id: 'damage', 
    name: 'Damage Report', 
    icon: AlertCircle, 
    color: '#ef4444',
    fields: ['severity', 'location', 'description', 'recommendation'],
    voiceCommand: 'damage report',
    description: 'Document damage'
  },
  { 
    id: 'measurement', 
    name: 'Measurement', 
    icon: Clipboard, 
    color: '#10b981',
    fields: ['area', 'dimensions', 'notes'],
    voiceCommand: 'measurement',
    description: 'Record dimensions'
  },
  { 
    id: 'material', 
    name: 'Material Note', 
    icon: Wrench, 
    color: '#f59e0b',
    fields: ['material_type', 'condition', 'quantity', 'notes'],
    voiceCommand: 'material note',
    description: 'Material info'
  },
  { 
    id: 'safety', 
    name: 'Safety Alert', 
    icon: AlertTriangle, 
    color: '#dc2626',
    fields: ['hazard_type', 'severity', 'action_required'],
    voiceCommand: 'safety issue',
    description: 'Flag safety',
    priority: 'high'
  },
];

// Roofing industry vocabulary for transcription
const industryVocabulary = [
  'shingles', 'flashing', 'soffit', 'fascia', 'underlayment', 'ridge vent',
  'valley', 'eave', 'gable', 'hip', 'cricket', 'drip edge', 'ice dam',
  'decking', 'felt', 'starter strip', 'step flashing', 'counter flashing',
  'boot', 'pipe collar', 'skylight', 'dormer', 'rake', 'gutters', 'downspout',
  'granule loss', 'curling', 'buckling', 'blistering', 'algae', 'moss',
  'condenser', 'evaporator', 'compressor', 'refrigerant', 'ductwork', 'HVAC'
];

// Voice commands reference
const voiceCommands = {
  recording: [
    { command: '"Hey Zuper, record note"', action: 'Start recording', category: 'capture' },
    { command: '"Hey Zuper, take note"', action: 'Start recording', category: 'capture' },
    { command: '"Hey Zuper, new note"', action: 'Start recording', category: 'capture' },
    { command: '"Hey Zuper, damage report"', action: 'Start damage template', category: 'capture' },
    { command: '"Hey Zuper, safety issue"', action: 'Flag safety concern', category: 'capture' },
  ],
  control: [
    { command: '"Save" / "Done"', action: 'End and save recording', category: 'control' },
    { command: '"Cancel" / "Discard"', action: 'Delete current recording', category: 'control' },
    { command: '"Attach photo"', action: 'Link last photo', category: 'control' },
    { command: '"Mark urgent"', action: 'Flag as high priority', category: 'control' },
  ],
  playback: [
    { command: '"Play last note"', action: 'Replay recent note', category: 'playback' },
    { command: '"Battery status"', action: 'Check glass battery', category: 'system' },
  ],
};

// Sample notes data (simulating captured during fieldwork)
const generateSampleNotes = () => [
  {
    id: 'note-001',
    job_id: 'job-1247',
    inspection_id: 'insp-5821',
    created_timestamp: new Date().toISOString(),
    recording_duration: 45,
    audio_file_path: '/audio/note-001.webm',
    transcription_text: 'Found three cracked shingles on the north-facing slope near the ridge. The damage appears to be from wind uplift during last month\'s storm. Flashing around the chimney is also compromised with visible gaps. Recommend full replacement of damaged shingles and resealing of chimney flashing.',
    transcription_confidence: 94,
    edited_text: null,
    metadata: {
      gps_coordinates: { lat: 34.0522, lng: -118.2437 },
      weather: { temp: 72, condition: 'sunny', humidity: 45 },
      device_battery: 85,
      glass_model: 'Zuper Glass Pro',
    },
    categorization: {
      type: 'damage',
      severity: 'medium',
      roof_section: 'North slope - Ridge area',
      tags: ['shingles', 'wind damage', 'flashing', 'chimney'],
    },
    attachments: {
      photos: ['photo-101', 'photo-102'],
      videos: [],
    },
    sync_status: 'synced',
    reviewed: true,
    included_in_report: true,
  },
  {
    id: 'note-002',
    job_id: 'job-1247',
    inspection_id: 'insp-5821',
    created_timestamp: new Date(Date.now() - 1200000).toISOString(),
    recording_duration: 28,
    audio_file_path: '/audio/note-002.webm',
    transcription_text: 'Soffit vents on the east side are approximately eighty percent blocked with debris and old insulation. This is causing inadequate attic ventilation. Some paint peeling on the fascia board below the blocked vents, likely from moisture buildup.',
    transcription_confidence: 89,
    edited_text: 'Soffit vents on the east side are approximately 80% blocked with debris and old insulation. This is causing inadequate attic ventilation. Some paint peeling on the fascia board below the blocked vents, likely from moisture buildup.',
    metadata: {
      gps_coordinates: { lat: 34.0525, lng: -118.2440 },
      weather: { temp: 73, condition: 'sunny', humidity: 43 },
      device_battery: 82,
      glass_model: 'Zuper Glass Pro',
    },
    categorization: {
      type: 'damage',
      severity: 'low',
      roof_section: 'East side - Soffit',
      tags: ['soffit', 'ventilation', 'fascia', 'moisture'],
    },
    attachments: {
      photos: ['photo-103'],
      videos: [],
    },
    sync_status: 'synced',
    reviewed: true,
    included_in_report: false,
  },
  {
    id: 'note-003',
    job_id: 'job-1247',
    inspection_id: 'insp-5821',
    created_timestamp: new Date(Date.now() - 2400000).toISOString(),
    recording_duration: 52,
    audio_file_path: '/audio/note-003.webm',
    transcription_text: 'SAFETY CONCERN: Section of roof decking feels soft and spongy near the main valley intersection. Do NOT walk on this marked area. This indicates possible water damage or rot underneath the shingles. Recommend immediate structural assessment before any repair work.',
    transcription_confidence: 96,
    edited_text: null,
    metadata: {
      gps_coordinates: { lat: 34.0520, lng: -118.2435 },
      weather: { temp: 74, condition: 'sunny', humidity: 42 },
      device_battery: 78,
      glass_model: 'Zuper Glass Pro',
    },
    categorization: {
      type: 'safety',
      severity: 'high',
      roof_section: 'Main valley intersection',
      tags: ['safety', 'decking', 'water damage', 'structural'],
    },
    attachments: {
      photos: ['photo-104', 'photo-105', 'photo-106'],
      videos: ['video-101'],
    },
    sync_status: 'synced',
    reviewed: true,
    included_in_report: true,
  },
  {
    id: 'note-004',
    job_id: 'job-1247',
    inspection_id: 'insp-5821',
    created_timestamp: new Date(Date.now() - 3600000).toISOString(),
    recording_duration: 35,
    audio_file_path: '/audio/note-004.webm',
    transcription_text: 'Total roof area measurements. Main house section approximately eighteen hundred square feet. Attached garage section approximately six hundred square feet. Total estimated area twenty four hundred square feet.',
    transcription_confidence: 91,
    edited_text: 'Total roof area measurements:\n• Main house section: ~1,800 sq ft\n• Garage section: ~600 sq ft\n• Total: ~2,400 sq ft',
    metadata: {
      gps_coordinates: { lat: 34.0522, lng: -118.2437 },
      weather: { temp: 71, condition: 'sunny', humidity: 46 },
      device_battery: 75,
      glass_model: 'Zuper Glass Pro',
    },
    categorization: {
      type: 'measurement',
      severity: 'low',
      roof_section: 'Full property',
      tags: ['measurements', 'area', 'square footage'],
    },
    attachments: {
      photos: [],
      videos: [],
    },
    sync_status: 'synced',
    reviewed: false,
    included_in_report: false,
  },
  {
    id: 'note-005',
    job_id: 'job-1247',
    inspection_id: 'insp-5821',
    created_timestamp: new Date(Date.now() - 300000).toISOString(),
    recording_duration: 22,
    audio_file_path: '/audio/note-005.webm',
    transcription_text: 'Pipe boot around the plumbing vent on the south slope is cracked and needs replacement. Standard three inch boot should work. Adding this to the materials list.',
    transcription_confidence: 87,
    edited_text: null,
    metadata: {
      gps_coordinates: { lat: 34.0523, lng: -118.2438 },
      weather: { temp: 72, condition: 'sunny', humidity: 44 },
      device_battery: 88,
      glass_model: 'Zuper Glass Pro',
    },
    categorization: {
      type: 'material',
      severity: 'medium',
      roof_section: 'South slope - Vent area',
      tags: ['pipe boot', 'plumbing vent', 'replacement'],
    },
    attachments: {
      photos: ['photo-107'],
      videos: [],
    },
    sync_status: 'pending',
    reviewed: false,
    included_in_report: false,
  },
];

// ============ SUB-COMPONENTS ============

// Glass HUD Simulation Component
const GlassHUDPreview = ({ 
  isRecording, 
  recordingDuration, 
  isConnected, 
  batteryLevel,
  jobName,
  lastAction,
  isDark 
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="relative w-full h-[180px] rounded-[16px] overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 60px rgba(0, 0, 0, 0.3)',
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Glass lens effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.05) 0%, transparent 50%)',
        }}
      />
      
      {/* HUD Content */}
      <div className="relative z-10 p-[16px] h-full flex flex-col justify-between">
        {/* Top Bar - Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            {/* Connection Status */}
            <div className="flex items-center gap-[4px]">
              {isConnected ? (
                <Bluetooth className="w-[12px] h-[12px] text-emerald-400" />
              ) : (
                <BluetoothOff className="w-[12px] h-[12px] text-red-400" />
              )}
              <span className="font-['SF_Mono',monospace] text-[9px] text-white/60">
                {isConnected ? 'LINKED' : 'DISCONNECTED'}
              </span>
            </div>
          </div>
          
          {/* Battery */}
          <div className="flex items-center gap-[4px]">
            <Battery className="w-[12px] h-[12px] text-white/60" />
            <span className="font-['SF_Mono',monospace] text-[9px] text-white/60">
              {batteryLevel}%
            </span>
          </div>
        </div>
        
        {/* Center - Main Display */}
        <div className="flex-1 flex items-center justify-center">
          {isRecording ? (
            <div className="flex flex-col items-center">
              {/* Recording indicator */}
              <motion.div 
                className="flex items-center gap-[8px] mb-[8px]"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="w-[10px] h-[10px] rounded-full bg-red-500" />
                <span className="font-['SF_Mono',monospace] text-[14px] text-red-400 font-bold">
                  REC
                </span>
              </motion.div>
              
              {/* Timer */}
              <span className="font-['SF_Mono',monospace] text-[28px] text-white font-bold tracking-wider">
                {formatTime(recordingDuration)}
              </span>
              
              {/* Waveform visualization */}
              <div className="flex items-center gap-[2px] mt-[8px]">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-[3px] bg-red-400 rounded-full"
                    animate={{ 
                      height: [4, 8 + Math.random() * 12, 4],
                    }}
                    transition={{ 
                      duration: 0.3 + Math.random() * 0.2,
                      repeat: Infinity,
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </div>
              
              <span className="font-['SF_Mono',monospace] text-[9px] text-white/40 mt-[8px]">
                Say "SAVE" or "CANCEL"
              </span>
            </div>
          ) : lastAction ? (
            <motion.div 
              className="flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <CheckCircle className="w-[32px] h-[32px] text-emerald-400 mb-[6px]" />
              <span className="font-['SF_Mono',monospace] text-[12px] text-emerald-400 font-semibold">
                {lastAction}
              </span>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center">
              <Mic className="w-[24px] h-[24px] text-white/30 mb-[6px]" />
              <span className="font-['SF_Mono',monospace] text-[10px] text-white/40">
                Say "Hey Zuper, record note"
              </span>
            </div>
          )}
        </div>
        
        {/* Bottom Bar - Job Info */}
        <div className="flex items-center justify-between">
          <span className="font-['SF_Mono',monospace] text-[9px] text-white/50 truncate max-w-[200px]">
            {jobName || 'No active job'}
          </span>
          <span className="font-['SF_Mono',monospace] text-[9px] text-white/40">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
      
      {/* Corner accents */}
      <div className="absolute top-[8px] left-[8px] w-[20px] h-[20px] border-l-2 border-t-2 border-white/20 rounded-tl-[4px]" />
      <div className="absolute top-[8px] right-[8px] w-[20px] h-[20px] border-r-2 border-t-2 border-white/20 rounded-tr-[4px]" />
      <div className="absolute bottom-[8px] left-[8px] w-[20px] h-[20px] border-l-2 border-b-2 border-white/20 rounded-bl-[4px]" />
      <div className="absolute bottom-[8px] right-[8px] w-[20px] h-[20px] border-r-2 border-b-2 border-white/20 rounded-br-[4px]" />
    </motion.div>
  );
};

// Sync Status Badge
const SyncStatusBadge = ({ status, isDark, size = 'normal' }) => {
  const configs = {
    synced: { icon: CheckCircle, color: '#10b981', label: 'Synced', bg: 'rgba(16, 185, 129, 0.15)' },
    pending: { icon: Cloud, color: '#f59e0b', label: 'Pending', bg: 'rgba(245, 158, 11, 0.15)' },
    syncing: { icon: Loader, color: '#3b82f6', label: 'Syncing', bg: 'rgba(59, 130, 246, 0.15)' },
    local: { icon: CloudOff, color: '#94a3b8', label: 'Local', bg: 'rgba(148, 163, 184, 0.15)' },
    error: { icon: AlertCircle, color: '#ef4444', label: 'Error', bg: 'rgba(239, 68, 68, 0.15)' },
  };
  
  const config = configs[status] || configs.local;
  const Icon = config.icon;
  const isSmall = size === 'small';
  
  return (
    <div 
      className={`flex items-center gap-[4px] rounded-[6px] ${isSmall ? 'px-[6px] py-[2px]' : 'px-[8px] py-[4px]'}`}
      style={{ background: config.bg }}
    >
      <Icon 
        className={`${isSmall ? 'w-[10px] h-[10px]' : 'w-[12px] h-[12px]'} ${status === 'syncing' ? 'animate-spin' : ''}`} 
        style={{ color: config.color }} 
        strokeWidth={2.5}
      />
      <span 
        className={`font-['Inter'] font-semibold uppercase tracking-wide ${isSmall ? 'text-[8px]' : 'text-[10px]'}`}
        style={{ color: config.color }}
      >
        {config.label}
      </span>
    </div>
  );
};

// Connection Status Banner
const ConnectionBanner = ({ isConnected, glassInfo, isDark, onReconnect }) => {
  const accentColors = getAccentColors(isDark);
  
  return (
    <motion.div
      className="w-full rounded-[12px] p-[12px] flex items-center justify-between"
      style={{
        background: isConnected 
          ? isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)'
          : isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.08)',
        border: isConnected 
          ? '1px solid rgba(16, 185, 129, 0.2)'
          : '1px solid rgba(239, 68, 68, 0.2)',
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-[10px]">
        {isConnected ? (
          <Bluetooth className="w-[18px] h-[18px] text-emerald-500" strokeWidth={2} />
        ) : (
          <BluetoothOff className="w-[18px] h-[18px] text-red-500" strokeWidth={2} />
        )}
        <div>
          <p className={`font-['Inter'] font-semibold text-[12px] ${isConnected ? 'text-emerald-600' : 'text-red-600'}`}>
            {isConnected ? 'Glass Connected' : 'Glass Disconnected'}
          </p>
          {isConnected && glassInfo && (
            <p className="font-['Inter'] text-[10px] text-emerald-500/70">
              {glassInfo.model} • {glassInfo.battery}% battery
            </p>
          )}
        </div>
      </div>
      
      {!isConnected && (
        <motion.button
          className="px-[12px] py-[6px] rounded-[8px] bg-red-500/20"
          whileTap={{ scale: 0.95 }}
          onClick={onReconnect}
        >
          <span className="font-['Inter'] font-semibold text-[11px] text-red-500">
            Reconnect
          </span>
        </motion.button>
      )}
    </motion.div>
  );
};

// Audio Player Component
const AudioPlayer = ({ audioPath, duration, isDark }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  const textColors = getTextColors(isDark);
  const accentColors = getAccentColors(isDark);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  // Simulate playback
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + (0.1 * playbackRate);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, playbackRate]);
  
  return (
    <div 
      className="rounded-[12px] p-[12px]"
      style={{
        background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
        border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex items-center gap-[12px]">
        {/* Play/Pause Button */}
        <motion.button
          className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
          style={{ background: accentColors.primary }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <Pause className="w-[18px] h-[18px] text-white" fill="white" />
          ) : (
            <Play className="w-[18px] h-[18px] text-white ml-[2px]" fill="white" />
          )}
        </motion.button>
        
        {/* Progress Bar */}
        <div className="flex-1">
          <div 
            className="h-[4px] rounded-full overflow-hidden cursor-pointer"
            style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percent = x / rect.width;
              setCurrentTime(percent * duration);
            }}
          >
            <motion.div 
              className="h-full rounded-full"
              style={{ 
                background: accentColors.primary,
                width: `${progress}%`,
              }}
            />
          </div>
          
          {/* Time Display */}
          <div className="flex items-center justify-between mt-[6px]">
            <span className="font-['SF_Mono',monospace] text-[10px]" style={{ color: textColors.muted }}>
              {formatTime(currentTime)}
            </span>
            <span className="font-['SF_Mono',monospace] text-[10px]" style={{ color: textColors.muted }}>
              {formatTime(duration)}
            </span>
          </div>
        </div>
        
        {/* Playback Speed */}
        <motion.button
          className="px-[8px] py-[4px] rounded-[6px]"
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPlaybackRate(prev => prev === 2 ? 0.5 : prev + 0.5)}
        >
          <span className="font-['SF_Mono',monospace] text-[10px] font-semibold" style={{ color: textColors.description }}>
            {playbackRate}x
          </span>
        </motion.button>
      </div>
    </div>
  );
};

// Note Card - Full review version
const NoteCard = ({ note, isDark, isSelected, onSelect, onToggleSelect, onEdit, onDelete, isExpanded, onToggleExpand }) => {
  const textColors = getTextColors(isDark);
  const accentColors = getAccentColors(isDark);
  
  const template = noteTemplates.find(t => t.id === note.categorization.type) || noteTemplates[0];
  const TemplateIcon = template.icon;
  const isPriority = note.categorization.severity === 'high';
  const displayText = note.edited_text || note.transcription_text;
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      className="relative w-full rounded-[16px] overflow-hidden"
      style={{
        background: isDark 
          ? isPriority ? 'rgba(239, 68, 68, 0.08)' : 'rgba(30, 41, 59, 0.8)'
          : isPriority ? 'rgba(239, 68, 68, 0.04)' : 'rgba(255, 255, 255, 0.95)',
        border: isSelected
          ? `2px solid ${accentColors.primary}`
          : isPriority 
            ? '2px solid rgba(239, 68, 68, 0.3)'
            : isDark 
              ? '1px solid rgba(255, 255, 255, 0.08)'
              : '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: isDark 
          ? '0 4px 16px rgba(0, 0, 0, 0.2)'
          : '0 4px 16px rgba(0, 0, 0, 0.06)',
      }}
      layout
    >
      {/* Priority/Severity stripe */}
      {isPriority && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-[4px]"
          style={{ background: '#ef4444' }}
        />
      )}
      
      <div className="p-[14px]">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-[10px] mb-[10px]">
          <div className="flex items-center gap-[10px] flex-1 min-w-0">
            {/* Selection checkbox */}
            <motion.button
              className="w-[24px] h-[24px] rounded-[6px] flex items-center justify-center shrink-0"
              style={{
                background: isSelected ? accentColors.primary : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                border: isSelected ? 'none' : isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
              }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect();
              }}
            >
              {isSelected && <Check className="w-[14px] h-[14px] text-white" strokeWidth={3} />}
            </motion.button>
            
            {/* Template Icon */}
            <div 
              className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center shrink-0"
              style={{ 
                background: `${template.color}15`,
                border: `1px solid ${template.color}30`,
              }}
            >
              <TemplateIcon 
                className="w-[18px] h-[18px]" 
                style={{ color: template.color }} 
                strokeWidth={2}
              />
            </div>
            
            {/* Title & Meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-[6px]">
                <span 
                  className="font-['Inter'] font-semibold text-[13px] truncate"
                  style={{ color: textColors.primary }}
                >
                  {template.name}
                </span>
                {!note.reviewed && (
                  <div className="w-[6px] h-[6px] rounded-full bg-blue-500 shrink-0" />
                )}
              </div>
              <p 
                className="font-['Inter'] text-[10px]"
                style={{ color: textColors.muted }}
              >
                {formatDate(note.created_timestamp)} at {formatTime(note.created_timestamp)} • {note.recording_duration}s
              </p>
            </div>
          </div>
          
          {/* Status badges */}
          <div className="flex items-center gap-[6px] shrink-0">
            <SyncStatusBadge status={note.sync_status} isDark={isDark} size="small" />
            {note.included_in_report && (
              <div 
                className="w-[20px] h-[20px] rounded-[4px] flex items-center justify-center"
                style={{ background: 'rgba(16, 185, 129, 0.15)' }}
              >
                <FileText className="w-[10px] h-[10px] text-emerald-500" />
              </div>
            )}
          </div>
        </div>
        
        {/* Transcription Preview/Full */}
        <div 
          className="rounded-[10px] p-[12px] mb-[10px]"
          style={{
            background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
          }}
        >
          {/* Confidence indicator */}
          {note.transcription_confidence < 90 && (
            <div className="flex items-center gap-[4px] mb-[6px]">
              <AlertCircle className="w-[10px] h-[10px] text-amber-500" />
              <span className="font-['Inter'] text-[9px] text-amber-500">
                {note.transcription_confidence}% confidence - Review recommended
              </span>
            </div>
          )}
          
          <p 
            className={`font-['Inter'] text-[13px] leading-[1.6] ${isExpanded ? '' : 'line-clamp-3'}`}
            style={{ color: textColors.description, whiteSpace: 'pre-wrap' }}
          >
            {displayText}
          </p>
          
          {displayText.length > 150 && (
            <button 
              className="mt-[6px] font-['Inter'] font-medium text-[11px]"
              style={{ color: accentColors.primary }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
          
          {note.edited_text && (
            <div className="flex items-center gap-[4px] mt-[6px]">
              <Edit3 className="w-[10px] h-[10px]" style={{ color: textColors.muted }} />
              <span className="font-['Inter'] text-[9px]" style={{ color: textColors.muted }}>
                Edited
              </span>
            </div>
          )}
        </div>
        
        {/* Audio Player */}
        <AudioPlayer 
          audioPath={note.audio_file_path} 
          duration={note.recording_duration} 
          isDark={isDark} 
        />
        
        {/* Metadata Row */}
        <div className="flex items-center flex-wrap gap-[8px] mt-[10px]">
          {/* Location */}
          {note.categorization.roof_section && (
            <div className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px]"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
            >
              <MapPin className="w-[10px] h-[10px]" style={{ color: textColors.muted }} />
              <span className="font-['Inter'] text-[10px]" style={{ color: textColors.description }}>
                {note.categorization.roof_section}
              </span>
            </div>
          )}
          
            {/* Source indicator */}
          {note.metadata?.source && (
            <div className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px]"
              style={{ 
                background: note.metadata.source === 'app_typed' 
                  ? isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.08)'
                  : note.metadata.source === 'app_voice'
                    ? isDark ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.08)'
                    : isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)'
              }}
            >
              {note.metadata.source === 'app_typed' ? (
                <>
                  <FileText className="w-[10px] h-[10px] text-blue-500" />
                  <span className="font-['Inter'] text-[10px] text-blue-500">Typed</span>
                </>
              ) : note.metadata.source === 'app_voice' ? (
                <>
                  <Mic className="w-[10px] h-[10px] text-purple-500" />
                  <span className="font-['Inter'] text-[10px] text-purple-500">App Voice</span>
                </>
              ) : (
                <>
                  <Radio className="w-[10px] h-[10px] text-emerald-500" />
                  <span className="font-['Inter'] text-[10px] text-emerald-500">Glass</span>
                </>
              )}
            </div>
          )}
          
          {/* Photos */}
          {note.attachments.photos.length > 0 && (
            <div className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px]"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
            >
              <Camera className="w-[10px] h-[10px]" style={{ color: textColors.muted }} />
              <span className="font-['Inter'] text-[10px]" style={{ color: textColors.description }}>
                {note.attachments.photos.length} photo{note.attachments.photos.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
          
          {/* Tags */}
          {note.categorization.tags.slice(0, 3).map((tag, idx) => (
            <span 
              key={idx}
              className="px-[6px] py-[2px] rounded-[4px] font-['Inter'] text-[9px]"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                color: textColors.muted,
              }}
            >
              {tag}
            </span>
          ))}
          {note.categorization.tags.length > 3 && (
            <span className="font-['Inter'] text-[9px]" style={{ color: textColors.muted }}>
              +{note.categorization.tags.length - 3}
            </span>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-[8px] mt-[12px] pt-[12px]" style={{
          borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
        }}>
          <motion.button
            className="flex-1 py-[10px] rounded-[8px] flex items-center justify-center gap-[6px]"
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
            }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Edit3 className="w-[14px] h-[14px]" style={{ color: textColors.description }} />
            <span className="font-['Inter'] font-medium text-[11px]" style={{ color: textColors.primary }}>
              Edit
            </span>
          </motion.button>
          
          <motion.button
            className="flex-1 py-[10px] rounded-[8px] flex items-center justify-center gap-[6px]"
            style={{
              background: note.included_in_report 
                ? 'rgba(16, 185, 129, 0.1)' 
                : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
              border: note.included_in_report ? '1px solid rgba(16, 185, 129, 0.2)' : 'none',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <FileText 
              className="w-[14px] h-[14px]" 
              style={{ color: note.included_in_report ? '#10b981' : textColors.description }} 
            />
            <span 
              className="font-['Inter'] font-medium text-[11px]" 
              style={{ color: note.included_in_report ? '#10b981' : textColors.primary }}
            >
              {note.included_in_report ? 'In Report' : 'Add to Report'}
            </span>
          </motion.button>
          
          <motion.button
            className="w-[40px] h-[40px] rounded-[8px] flex items-center justify-center"
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
            }}
            whileTap={{ scale: 0.9 }}
          >
            <MoreVertical className="w-[16px] h-[16px]" style={{ color: textColors.muted }} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Active Recording Overlay (shown when phone is pulled out during recording)
const ActiveRecordingOverlay = ({ isVisible, recordingDuration, isDark, onStop }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (!isVisible) return null;
  
  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(20px)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="flex items-center gap-[12px] mb-[20px]"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <div className="w-[16px] h-[16px] rounded-full bg-red-500" />
        <span className="font-['SF_Mono',monospace] text-[18px] text-red-400 font-bold">
          RECORDING ON GLASS
        </span>
      </motion.div>
      
      <span className="font-['SF_Mono',monospace] text-[48px] text-white font-bold tracking-wider mb-[8px]">
        {formatTime(recordingDuration)}
      </span>
      
      <p className="font-['Inter'] text-[14px] text-white/60 mb-[40px]">
        Audio is being captured via smart glass
      </p>
      
      <motion.button
        className="px-[32px] py-[16px] rounded-[12px] bg-red-500 flex items-center gap-[10px]"
        whileTap={{ scale: 0.95 }}
        onClick={onStop}
      >
        <Square className="w-[20px] h-[20px] text-white" fill="white" />
        <span className="font-['Inter'] font-semibold text-[16px] text-white">
          Stop Recording
        </span>
      </motion.button>
    </motion.div>
  );
};

// Voice Commands Sheet
const VoiceCommandsSheet = ({ isOpen, onClose, isDark }) => {
  const textColors = getTextColors(isDark);
  const accentColors = getAccentColors(isDark);
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col"
      style={{
        background: isDark 
          ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
      }}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      {/* Header */}
      <div className="shrink-0 px-[20px] pt-[16px] pb-[12px] flex items-center justify-between"
        style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)' }}
      >
        <motion.button
          className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center"
          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
        >
          <ChevronDown className="w-[20px] h-[20px]" style={{ color: textColors.primary }} />
        </motion.button>
        
        <h2 className="font-['Space_Grotesk'] font-bold text-[18px]" style={{ color: textColors.primary }}>
          Voice Commands
        </h2>
        
        <div className="w-[40px]" />
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-[20px] py-[16px]">
        {/* Recording Commands */}
        <div className="mb-[24px]">
          <div className="flex items-center gap-[8px] mb-[12px]">
            <Mic className="w-[16px] h-[16px]" style={{ color: accentColors.primary }} />
            <h3 className="font-['Inter'] font-semibold text-[14px]" style={{ color: textColors.primary }}>
              Start Recording
            </h3>
          </div>
          <div className="space-y-[8px]">
            {voiceCommands.recording.map((cmd, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-[12px] rounded-[10px]"
                style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
              >
                <span className="font-['SF_Mono',monospace] text-[12px]" style={{ color: accentColors.primary }}>
                  {cmd.command}
                </span>
                <span className="font-['Inter'] text-[11px]" style={{ color: textColors.muted }}>
                  {cmd.action}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Control Commands */}
        <div className="mb-[24px]">
          <div className="flex items-center gap-[8px] mb-[12px]">
            <Settings className="w-[16px] h-[16px]" style={{ color: accentColors.primary }} />
            <h3 className="font-['Inter'] font-semibold text-[14px]" style={{ color: textColors.primary }}>
              Control Commands
            </h3>
          </div>
          <div className="space-y-[8px]">
            {voiceCommands.control.map((cmd, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-[12px] rounded-[10px]"
                style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
              >
                <span className="font-['SF_Mono',monospace] text-[12px]" style={{ color: accentColors.primary }}>
                  {cmd.command}
                </span>
                <span className="font-['Inter'] text-[11px]" style={{ color: textColors.muted }}>
                  {cmd.action}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Playback Commands */}
        <div>
          <div className="flex items-center gap-[8px] mb-[12px]">
            <Headphones className="w-[16px] h-[16px]" style={{ color: accentColors.primary }} />
            <h3 className="font-['Inter'] font-semibold text-[14px]" style={{ color: textColors.primary }}>
              System Commands
            </h3>
          </div>
          <div className="space-y-[8px]">
            {voiceCommands.playback.map((cmd, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-[12px] rounded-[10px]"
                style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
              >
                <span className="font-['SF_Mono',monospace] text-[12px]" style={{ color: accentColors.primary }}>
                  {cmd.command}
                </span>
                <span className="font-['Inter'] text-[11px]" style={{ color: textColors.muted }}>
                  {cmd.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Note Creation Modal - Voice Recording Mode (App)
const VoiceRecordingModal = ({ isOpen, onClose, onSave, isDark, activeJob }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [showLiveTranscription, setShowLiveTranscription] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('quick');
  const [selectedSeverity, setSelectedSeverity] = useState('low');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const textColors = getTextColors(isDark);
  const accentColors = getAccentColors(isDark);
  
  // Recording timer
  useEffect(() => {
    let interval;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);
  
  // Simulate live transcription
  useEffect(() => {
    if (isRecording && !isPaused && showLiveTranscription) {
      const phrases = [
        "Found ",
        "Found damage ",
        "Found damage on ",
        "Found damage on the ",
        "Found damage on the north ",
        "Found damage on the north slope... ",
      ];
      const interval = setInterval(() => {
        const index = Math.min(Math.floor(recordingDuration / 2), phrases.length - 1);
        setTranscription(phrases[index]);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isRecording, isPaused, recordingDuration, showLiveTranscription]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleStartRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingDuration(0);
    setTranscription('');
  };
  
  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };
  
  const handleStopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setTranscription("Found significant shingle damage on the north-facing slope near the ridge cap. Three to four shingles show signs of wind uplift and need replacement. The flashing around the chimney also appears compromised.");
      setIsProcessing(false);
    }, 1500);
  };
  
  const handleSave = () => {
    const newNote = {
      id: `note-${Date.now()}`,
      job_id: activeJob?.id || 'job-1247',
      inspection_id: 'insp-5821',
      created_timestamp: new Date().toISOString(),
      recording_duration: recordingDuration,
      audio_file_path: '/audio/app-recording.webm',
      transcription_text: transcription,
      transcription_confidence: 94,
      edited_text: null,
      metadata: {
        gps_coordinates: { lat: 34.0522, lng: -118.2437 },
        weather: { temp: 72, condition: 'sunny', humidity: 45 },
        device_battery: 95,
        source: 'app_voice', // Distinguishes from glass recording
      },
      categorization: {
        type: selectedCategory,
        severity: selectedSeverity,
        roof_section: 'Auto-detected',
        tags: [],
      },
      attachments: { photos: [], videos: [] },
      sync_status: 'synced',
      reviewed: false,
      included_in_report: false,
    };
    onSave(newNote);
    onClose();
  };
  
  const handleDiscard = () => {
    setIsRecording(false);
    setRecordingDuration(0);
    setTranscription('');
    onClose();
  };
  
  if (!isOpen) return null;
  
  const template = noteTemplates.find(t => t.id === selectedCategory);
  
  return (
    <motion.div
      className="absolute inset-0 z-[100] flex flex-col"
      style={{
        background: isDark 
          ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
      }}
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      {/* Header */}
      <div 
        className="shrink-0 px-[20px] pt-[16px] pb-[12px] flex items-center justify-between"
        style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)' }}
      >
        <motion.button
          className="w-[44px] h-[44px] rounded-[12px] flex items-center justify-center"
          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDiscard}
        >
          <X className="w-[20px] h-[20px]" style={{ color: textColors.primary }} strokeWidth={2} />
        </motion.button>
        
        <div className="flex items-center gap-[8px]">
          <Mic className="w-[18px] h-[18px]" style={{ color: accentColors.primary }} />
          <h1 className="font-['Space_Grotesk'] font-bold text-[18px]" style={{ color: textColors.primary }}>
            Voice Note
          </h1>
        </div>
        
        <motion.button
          className="px-[16px] py-[10px] rounded-[10px] flex items-center gap-[6px]"
          style={{
            background: transcription ? accentColors.primary : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            opacity: transcription ? 1 : 0.5,
          }}
          whileTap={{ scale: 0.95 }}
          disabled={!transcription}
          onClick={handleSave}
        >
          <Check className="w-[16px] h-[16px]" style={{ color: transcription ? 'white' : textColors.muted }} strokeWidth={2.5} />
          <span className="font-['Inter'] font-semibold text-[13px]" style={{ color: transcription ? 'white' : textColors.muted }}>
            Save
          </span>
        </motion.button>
      </div>
      
      {/* Active Job Indicator */}
      {activeJob && (
        <div 
          className="mx-[20px] mt-[12px] px-[12px] py-[8px] rounded-[8px] flex items-center gap-[8px]"
          style={{ background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)' }}
        >
          <Link className="w-[12px] h-[12px] text-emerald-500" />
          <span className="font-['Inter'] text-[11px] text-emerald-600">
            Linked to: {activeJob.name || 'Roof Inspection #1247'}
          </span>
        </div>
      )}
      
      {/* Main Recording Area - Added overflow-y-auto and pb for scrolling when content is long */}
      <div className="flex-1 flex flex-col items-center justify-center px-[24px] overflow-y-auto pb-[100px] no-scrollbar">
        {!isRecording && !transcription ? (
          /* Ready to Record State */
          <div className="flex flex-col items-center">
            <motion.button
              className="w-[100px] h-[100px] rounded-full flex items-center justify-center mb-[20px]"
              style={{
                background: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.primaryLight} 100%)`,
                boxShadow: `0 12px 40px ${isDark ? 'rgba(133, 88, 242, 0.4)' : 'rgba(2, 132, 199, 0.35)'}`,
              }}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleStartRecording}
            >
              <Mic className="w-[40px] h-[40px] text-white" strokeWidth={1.5} />
            </motion.button>
            
            <p className="font-['Inter'] font-semibold text-[16px] mb-[6px]" style={{ color: textColors.primary }}>
              Tap to Start Recording
            </p>
            <p className="font-['Inter'] text-[13px] text-center max-w-[240px]" style={{ color: textColors.muted }}>
              Use your phone's microphone to capture a voice note
            </p>
            
            {/* Hold to talk option */}
            <div 
              className="mt-[24px] px-[16px] py-[10px] rounded-[10px]"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
            >
              <p className="font-['Inter'] text-[11px] text-center" style={{ color: textColors.muted }}>
                💡 Tip: Hold the button for walkie-talkie style recording
              </p>
            </div>
          </div>
        ) : isRecording ? (
          /* Recording State */
          <div className="flex flex-col items-center w-full">
            {/* Recording indicator */}
            <motion.div 
              className="flex items-center gap-[10px] mb-[16px]"
              animate={{ opacity: isPaused ? 0.5 : [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: isPaused ? 0 : Infinity }}
            >
              <div className={`w-[14px] h-[14px] rounded-full ${isPaused ? 'bg-amber-500' : 'bg-red-500'}`} />
              <span className={`font-['SF_Mono',monospace] text-[16px] font-bold ${isPaused ? 'text-amber-500' : 'text-red-500'}`}>
                {isPaused ? 'PAUSED' : 'RECORDING'}
              </span>
            </motion.div>
            
            {/* Timer */}
            <span className="font-['SF_Mono',monospace] text-[48px] font-bold mb-[16px]" style={{ color: textColors.primary }}>
              {formatTime(recordingDuration)}
            </span>
            
            {/* Waveform Visualization */}
            <div className="flex items-center gap-[3px] h-[60px] mb-[24px]">
              {[...Array(24)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-[4px] rounded-full"
                  style={{ background: isPaused ? textColors.muted : accentColors.primary }}
                  animate={isPaused ? { height: 8 } : { 
                    height: [8, 20 + Math.random() * 40, 8],
                  }}
                  transition={{ 
                    duration: 0.2 + Math.random() * 0.3,
                    repeat: isPaused ? 0 : Infinity,
                    delay: i * 0.02,
                  }}
                />
              ))}
            </div>
            
            {/* Live Transcription Toggle */}
            <motion.button
              className="flex items-center gap-[8px] px-[14px] py-[8px] rounded-[8px] mb-[20px]"
              style={{
                background: showLiveTranscription 
                  ? isDark ? 'rgba(133, 88, 242, 0.15)' : 'rgba(2, 132, 199, 0.1)'
                  : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                border: showLiveTranscription ? `1px solid ${accentColors.primary}30` : 'none',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLiveTranscription(!showLiveTranscription)}
            >
              {showLiveTranscription ? (
                <Eye className="w-[14px] h-[14px]" style={{ color: accentColors.primary }} />
              ) : (
                <EyeOff className="w-[14px] h-[14px]" style={{ color: textColors.muted }} />
              )}
              <span className="font-['Inter'] text-[12px]" style={{ color: showLiveTranscription ? accentColors.primary : textColors.muted }}>
                Live Transcription
              </span>
            </motion.button>
            
            {/* Live Transcription Preview */}
            {showLiveTranscription && transcription && (
              <motion.div
                className="w-full p-[14px] rounded-[12px] mb-[24px]"
                style={{
                  background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                  border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="font-['Inter'] text-[13px] italic" style={{ color: textColors.description }}>
                  {transcription}
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >|</motion.span>
                </p>
              </motion.div>
            )}
            
            {/* Control Buttons */}
            <div className="flex items-center gap-[16px]">
              <motion.button
                className="w-[56px] h-[56px] rounded-full flex items-center justify-center"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePauseResume}
              >
                {isPaused ? (
                  <Play className="w-[24px] h-[24px]" style={{ color: textColors.primary }} fill={textColors.primary} />
                ) : (
                  <Pause className="w-[24px] h-[24px]" style={{ color: textColors.primary }} fill={textColors.primary} />
                )}
              </motion.button>
              
              <motion.button
                className="w-[72px] h-[72px] rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                }}
                whileTap={{ scale: 0.9 }}
                onClick={handleStopRecording}
              >
                <Square className="w-[28px] h-[28px] text-white" fill="white" />
              </motion.button>
              
              <motion.button
                className="w-[56px] h-[56px] rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDiscard}
              >
                <Trash2 className="w-[22px] h-[22px] text-red-500" />
              </motion.button>
            </div>
          </div>
        ) : isProcessing ? (
          /* Processing State */
          <div className="flex flex-col items-center">
            <motion.div
              className="w-[60px] h-[60px] rounded-full border-4 border-t-transparent mb-[20px]"
              style={{ borderColor: `${accentColors.primary}40`, borderTopColor: 'transparent' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="font-['Inter'] font-semibold text-[16px]" style={{ color: textColors.primary }}>
              Processing Audio...
            </p>
            <p className="font-['Inter'] text-[13px] mt-[6px]" style={{ color: textColors.muted }}>
              Converting speech to text
            </p>
          </div>
        ) : (
          /* Review State */
          <div className="w-full">
            <div className="flex items-center gap-[8px] mb-[12px]">
              <CheckCircle className="w-[18px] h-[18px] text-emerald-500" />
              <span className="font-['Inter'] font-semibold text-[14px] text-emerald-600">
                Recording Complete
              </span>
              <span className="font-['Inter'] text-[12px]" style={{ color: textColors.muted }}>
                ({formatTime(recordingDuration)})
              </span>
            </div>
            
            {/* Transcription */}
            <div 
              className="w-full p-[16px] rounded-[14px] mb-[16px]"
              style={{
                background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <textarea
                className="w-full min-h-[120px] bg-transparent font-['Inter'] text-[14px] leading-[1.6] outline-none resize-none"
                style={{ color: textColors.primary }}
                value={transcription}
                onChange={(e) => setTranscription(e.target.value)}
                placeholder="Edit transcription..."
              />
            </div>
            
            {/* Audio Playback */}
            <AudioPlayer audioPath="" duration={recordingDuration} isDark={isDark} />
            
            {/* Category & Severity Selection */}
            <div className="flex gap-[10px] mt-[16px]">
              <div className="flex-1">
                <p className="font-['Inter'] text-[10px] uppercase tracking-wide mb-[6px]" style={{ color: textColors.muted }}>
                  Category
                </p>
                <div className="flex gap-[6px] flex-wrap">
                  {noteTemplates.slice(0, 3).map((t) => (
                    <motion.button
                      key={t.id}
                      className="px-[10px] py-[6px] rounded-[8px] flex items-center gap-[4px]"
                      style={{
                        background: selectedCategory === t.id ? `${t.color}20` : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        border: selectedCategory === t.id ? `1px solid ${t.color}40` : 'none',
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(t.id)}
                    >
                      <t.icon className="w-[12px] h-[12px]" style={{ color: t.color }} />
                      <span className="font-['Inter'] text-[11px]" style={{ color: selectedCategory === t.id ? t.color : textColors.description }}>
                        {t.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-[10px] mt-[16px]">
              <motion.button
                className="flex-1 py-[12px] rounded-[10px] flex items-center justify-center gap-[8px]"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Camera className="w-[16px] h-[16px]" style={{ color: textColors.description }} />
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
                onClick={() => {
                  setTranscription('');
                  setRecordingDuration(0);
                  setIsRecording(false);
                }}
              >
                <RotateCcw className="w-[16px] h-[16px]" style={{ color: textColors.description }} />
                <span className="font-['Inter'] font-medium text-[12px]" style={{ color: textColors.primary }}>
                  Re-record
                </span>
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Note Creation Modal - Type Mode (App)
const TypeNoteModal = ({ isOpen, onClose, onSave, isDark, activeJob }) => {
  const [noteText, setNoteText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('quick');
  const [selectedSeverity, setSelectedSeverity] = useState('low');
  const [roofSection, setRoofSection] = useState('');
  const [tags, setTags] = useState('');
  const [showFormatting, setShowFormatting] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isVoiceTyping, setIsVoiceTyping] = useState(false);
  
  const textColors = getTextColors(isDark);
  const accentColors = getAccentColors(isDark);
  
  // Auto-save draft every 10 seconds
  useEffect(() => {
    if (noteText.length > 0) {
      const interval = setInterval(() => {
        setLastSaved(new Date());
        // In real app, save to local storage here
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [noteText]);
  
  const handleSave = () => {
    if (!noteText.trim()) return;
    
    const newNote = {
      id: `note-${Date.now()}`,
      job_id: activeJob?.id || 'job-1247',
      inspection_id: 'insp-5821',
      created_timestamp: new Date().toISOString(),
      recording_duration: 0,
      audio_file_path: null, // No audio for typed notes
      transcription_text: noteText,
      transcription_confidence: 100, // Typed = 100% accuracy
      edited_text: null,
      metadata: {
        gps_coordinates: { lat: 34.0522, lng: -118.2437 },
        weather: { temp: 72, condition: 'sunny', humidity: 45 },
        device_battery: 95,
        source: 'app_typed', // Distinguishes from voice
      },
      categorization: {
        type: selectedCategory,
        severity: selectedSeverity,
        roof_section: roofSection || 'Not specified',
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
      },
      attachments: { photos: [], videos: [] },
      sync_status: 'synced',
      reviewed: true, // Typed notes are already "reviewed"
      included_in_report: false,
    };
    onSave(newNote);
    onClose();
  };
  
  const handleSaveAndNew = () => {
    handleSave();
    setNoteText('');
    setRoofSection('');
    setTags('');
  };
  
  const insertFormatting = (format) => {
    switch(format) {
      case 'bullet':
        setNoteText(prev => prev + '\n• ');
        break;
      case 'number':
        setNoteText(prev => prev + '\n1. ');
        break;
      default:
        break;
    }
  };
  
  if (!isOpen) return null;
  
  const template = noteTemplates.find(t => t.id === selectedCategory);
  
  return (
    <motion.div
      className="absolute inset-0 z-[100] flex flex-col"
      style={{
        background: isDark 
          ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
      }}
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      {/* Header */}
      <div 
        className="shrink-0 px-[20px] pt-[16px] pb-[12px] flex items-center justify-between"
        style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)' }}
      >
        <motion.button
          className="w-[44px] h-[44px] rounded-[12px] flex items-center justify-center"
          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
        >
          <X className="w-[20px] h-[20px]" style={{ color: textColors.primary }} strokeWidth={2} />
        </motion.button>
        
        <div className="flex items-center gap-[8px]">
          <FileText className="w-[18px] h-[18px]" style={{ color: accentColors.primary }} />
          <h1 className="font-['Space_Grotesk'] font-bold text-[18px]" style={{ color: textColors.primary }}>
            Type Note
          </h1>
        </div>
        
        <motion.button
          className="px-[16px] py-[10px] rounded-[10px] flex items-center gap-[6px]"
          style={{
            background: noteText.trim() ? accentColors.primary : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            opacity: noteText.trim() ? 1 : 0.5,
          }}
          whileTap={{ scale: 0.95 }}
          disabled={!noteText.trim()}
          onClick={handleSave}
        >
          <Check className="w-[16px] h-[16px]" style={{ color: noteText.trim() ? 'white' : textColors.muted }} strokeWidth={2.5} />
          <span className="font-['Inter'] font-semibold text-[13px]" style={{ color: noteText.trim() ? 'white' : textColors.muted }}>
            Save
          </span>
        </motion.button>
      </div>
      
      {/* Active Job Indicator */}
      {activeJob && (
        <div 
          className="mx-[20px] mt-[12px] px-[12px] py-[8px] rounded-[8px] flex items-center gap-[8px]"
          style={{ background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)' }}
        >
          <Link className="w-[12px] h-[12px] text-emerald-500" />
          <span className="font-['Inter'] text-[11px] text-emerald-600">
            Linked to: {activeJob.name || 'Roof Inspection #1247'}
          </span>
        </div>
      )}
      
      {/* Content - Added pb-[120px] for proper scroll area */}
      <div className="flex-1 overflow-y-auto px-[20px] pt-[16px] pb-[120px] no-scrollbar">
        {/* Text Editor */}
        <div 
          className="rounded-[14px] overflow-hidden mb-[16px]"
          style={{
            background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
          }}
        >
          {/* Formatting Toolbar */}
          <div 
            className="flex items-center justify-between px-[12px] py-[8px]"
            style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-center gap-[4px]">
              <motion.button
                className="w-[32px] h-[32px] rounded-[6px] flex items-center justify-center"
                style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => insertFormatting('bullet')}
              >
                <span className="font-['Inter'] font-bold text-[14px]" style={{ color: textColors.description }}>•</span>
              </motion.button>
              <motion.button
                className="w-[32px] h-[32px] rounded-[6px] flex items-center justify-center"
                style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => insertFormatting('number')}
              >
                <span className="font-['Inter'] font-bold text-[12px]" style={{ color: textColors.description }}>1.</span>
              </motion.button>
            </div>
            
            {/* Voice-to-text toggle */}
            <motion.button
              className="flex items-center gap-[6px] px-[10px] py-[6px] rounded-[8px]"
              style={{
                background: isVoiceTyping 
                  ? 'rgba(239, 68, 68, 0.15)' 
                  : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                border: isVoiceTyping ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVoiceTyping(!isVoiceTyping)}
            >
              <Mic className="w-[14px] h-[14px]" style={{ color: isVoiceTyping ? '#ef4444' : textColors.muted }} />
              <span className="font-['Inter'] text-[11px]" style={{ color: isVoiceTyping ? '#ef4444' : textColors.muted }}>
                {isVoiceTyping ? 'Listening...' : 'Dictate'}
              </span>
            </motion.button>
          </div>
          
          {/* Text Area */}
          <textarea
            className="w-full min-h-[200px] p-[14px] bg-transparent font-['Inter'] text-[14px] leading-[1.6] outline-none resize-none"
            style={{ color: textColors.primary }}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Type your note here...

Example:
• Measured roof area: 2,400 sq ft
• Shingle type: 3-tab asphalt
• Estimated replacement cost: $8,500"
          />
          
          {/* Footer */}
          <div 
            className="flex items-center justify-between px-[12px] py-[8px]"
            style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)' }}
          >
            <span className="font-['Inter'] text-[10px]" style={{ color: textColors.muted }}>
              {noteText.length}/10,000 characters
            </span>
            {lastSaved && (
              <span className="font-['Inter'] text-[10px]" style={{ color: textColors.muted }}>
                Draft saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>
        
        {/* Metadata Panel */}
        <div 
          className="rounded-[14px] p-[14px] mb-[16px]"
          style={{
            background: isDark ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.02)',
            border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
          }}
        >
          <p className="font-['Inter'] font-semibold text-[12px] mb-[12px]" style={{ color: textColors.primary }}>
            Note Details
          </p>
          
          {/* Category Selection */}
          <div className="mb-[12px]">
            <p className="font-['Inter'] text-[10px] uppercase tracking-wide mb-[6px]" style={{ color: textColors.muted }}>
              Category
            </p>
            <div className="flex gap-[6px] flex-wrap">
              {noteTemplates.map((t) => (
                <motion.button
                  key={t.id}
                  className="px-[10px] py-[6px] rounded-[8px] flex items-center gap-[4px]"
                  style={{
                    background: selectedCategory === t.id ? `${t.color}20` : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    border: selectedCategory === t.id ? `1px solid ${t.color}40` : 'none',
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(t.id)}
                >
                  <t.icon className="w-[12px] h-[12px]" style={{ color: t.color }} />
                  <span className="font-['Inter'] text-[11px]" style={{ color: selectedCategory === t.id ? t.color : textColors.description }}>
                    {t.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Severity Selection */}
          <div className="mb-[12px]">
            <p className="font-['Inter'] text-[10px] uppercase tracking-wide mb-[6px]" style={{ color: textColors.muted }}>
              Severity
            </p>
            <div className="flex gap-[6px]">
              {[
                { id: 'low', label: 'Low', color: '#10b981' },
                { id: 'medium', label: 'Medium', color: '#f59e0b' },
                { id: 'high', label: 'High', color: '#ef4444' },
              ].map((s) => (
                <motion.button
                  key={s.id}
                  className="px-[12px] py-[6px] rounded-[8px]"
                  style={{
                    background: selectedSeverity === s.id ? `${s.color}20` : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    border: selectedSeverity === s.id ? `1px solid ${s.color}40` : 'none',
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSeverity(s.id)}
                >
                  <span className="font-['Inter'] text-[11px]" style={{ color: selectedSeverity === s.id ? s.color : textColors.description }}>
                    {s.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Roof Section */}
          <div className="mb-[12px]">
            <p className="font-['Inter'] text-[10px] uppercase tracking-wide mb-[6px]" style={{ color: textColors.muted }}>
              Roof Section
            </p>
            <input
              type="text"
              className="w-full px-[12px] py-[10px] rounded-[8px] font-['Inter'] text-[13px] outline-none"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                color: textColors.primary,
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
              }}
              placeholder="e.g., North slope, Ridge area"
              value={roofSection}
              onChange={(e) => setRoofSection(e.target.value)}
            />
          </div>
          
          {/* Tags */}
          <div>
            <p className="font-['Inter'] text-[10px] uppercase tracking-wide mb-[6px]" style={{ color: textColors.muted }}>
              Tags (comma separated)
            </p>
            <input
              type="text"
              className="w-full px-[12px] py-[10px] rounded-[8px] font-['Inter'] text-[13px] outline-none"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                color: textColors.primary,
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
              }}
              placeholder="e.g., shingles, flashing, damage"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>
        
        {/* Photo Attachment */}
        <motion.button
          className="w-full py-[14px] rounded-[12px] flex items-center justify-center gap-[8px] mb-[16px]"
          style={{
            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            border: `2px dashed ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Camera className="w-[18px] h-[18px]" style={{ color: textColors.muted }} />
          <span className="font-['Inter'] font-medium text-[13px]" style={{ color: textColors.description }}>
            Add Photo or Video
          </span>
        </motion.button>
        
        {/* Quick Actions */}
        <div className="flex gap-[10px]">
          <motion.button
            className="flex-1 py-[14px] rounded-[12px] flex items-center justify-center gap-[8px]"
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveAndNew}
            disabled={!noteText.trim()}
          >
            <Plus className="w-[16px] h-[16px]" style={{ color: textColors.description }} />
            <span className="font-['Inter'] font-medium text-[13px]" style={{ color: textColors.primary }}>
              Save & New
            </span>
          </motion.button>
          
          <motion.button
            className="flex-1 py-[14px] rounded-[12px] flex items-center justify-center gap-[8px]"
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-[16px] h-[16px]" style={{ color: textColors.description }} />
            <span className="font-['Inter'] font-medium text-[13px]" style={{ color: textColors.primary }}>
              Save Draft
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// FAB Menu for Note Creation
const NoteCreationFAB = ({ isDark, onVoiceNote, onTypeNote, isGlassConnected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const textColors = getTextColors(isDark);
  const accentColors = getAccentColors(isDark);
  
  return (
    <div className="absolute bottom-[100px] right-[24px] z-40">
      {/* Menu Options */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Voice Note Option */}
            <motion.button
              className="absolute bottom-[140px] right-0 flex items-center gap-[10px]"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ delay: 0.05 }}
              onClick={() => {
                setIsOpen(false);
                onVoiceNote();
              }}
            >
              <span 
                className="px-[12px] py-[8px] rounded-[8px] font-['Inter'] font-medium text-[12px] whitespace-nowrap"
                style={{
                  background: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                  color: textColors.primary,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                }}
              >
                Voice Note
              </span>
              <div 
                className="w-[52px] h-[52px] rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.primaryLight} 100%)`,
                  boxShadow: `0 6px 20px ${isDark ? 'rgba(133, 88, 242, 0.35)' : 'rgba(2, 132, 199, 0.3)'}`,
                }}
              >
                <Mic className="w-[22px] h-[22px] text-white" />
              </div>
            </motion.button>
            
            {/* Type Note Option */}
            <motion.button
              className="absolute bottom-[70px] right-0 flex items-center gap-[10px]"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ delay: 0.1 }}
              onClick={() => {
                setIsOpen(false);
                onTypeNote();
              }}
            >
              <span 
                className="px-[12px] py-[8px] rounded-[8px] font-['Inter'] font-medium text-[12px] whitespace-nowrap"
                style={{
                  background: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                  color: textColors.primary,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                }}
              >
                Type Note
              </span>
              <div 
                className="w-[52px] h-[52px] rounded-full flex items-center justify-center"
                style={{
                  background: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                  border: isDark ? '2px solid rgba(255,255,255,0.15)' : '2px solid rgba(0,0,0,0.1)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                }}
              >
                <FileText className="w-[22px] h-[22px]" style={{ color: accentColors.primary }} />
              </div>
            </motion.button>
          </>
        )}
      </AnimatePresence>
      
      {/* Main FAB */}
      <motion.button
        className="w-[60px] h-[60px] rounded-full flex items-center justify-center"
        style={{
          background: isOpen 
            ? isDark ? 'rgba(239, 68, 68, 0.9)' : 'rgba(239, 68, 68, 0.9)'
            : `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.primaryLight} 100%)`,
          boxShadow: `0 8px 24px ${isOpen ? 'rgba(239, 68, 68, 0.35)' : isDark ? 'rgba(133, 88, 242, 0.4)' : 'rgba(2, 132, 199, 0.35)'}`,
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        animate={{ rotate: isOpen ? 45 : 0 }}
      >
        {isOpen ? (
          <X className="w-[26px] h-[26px] text-white" strokeWidth={2.5} />
        ) : (
          <Plus className="w-[26px] h-[26px] text-white" strokeWidth={2.5} />
        )}
      </motion.button>
    </div>
  );
};

// ============ MAIN COMPONENT ============

export const NotesPage = ({ isDark = false, isGlassConnected = true, activeJob = null }) => {
  // State
  const [notes, setNotes] = useState(generateSampleNotes());
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'hud'
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [expandedNotes, setExpandedNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showVoiceCommands, setShowVoiceCommands] = useState(false);
  const [isRecordingOnGlass, setIsRecordingOnGlass] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [lastHUDAction, setLastHUDAction] = useState(null);
  
  // Multi-modal input states
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  
  const textColors = getTextColors(isDark);
  const accentColors = getAccentColors(isDark);
  
  // Simulate glass recording
  useEffect(() => {
    let interval;
    if (isRecordingOnGlass) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecordingOnGlass]);
  
  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    let result = [...notes];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(note => 
        (note.edited_text || note.transcription_text).toLowerCase().includes(query) ||
        note.categorization.tags.some(tag => tag.toLowerCase().includes(query)) ||
        note.categorization.roof_section?.toLowerCase().includes(query)
      );
    }
    
    // Type filter
    if (filterType !== 'all') {
      result = result.filter(note => note.categorization.type === filterType);
    }
    
    // Severity filter
    if (filterSeverity !== 'all') {
      result = result.filter(note => note.categorization.severity === filterSeverity);
    }
    
    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_timestamp) - new Date(a.created_timestamp);
        case 'oldest':
          return new Date(a.created_timestamp) - new Date(b.created_timestamp);
        case 'severity':
          const severityOrder = { high: 0, medium: 1, low: 2 };
          return severityOrder[a.categorization.severity] - severityOrder[b.categorization.severity];
        default:
          return 0;
      }
    });
    
    return result;
  }, [notes, searchQuery, filterType, filterSeverity, sortBy]);
  
  // Stats
  const stats = useMemo(() => ({
    total: notes.length,
    unreviewed: notes.filter(n => !n.reviewed).length,
    inReport: notes.filter(n => n.included_in_report).length,
    pending: notes.filter(n => n.sync_status === 'pending').length,
    highSeverity: notes.filter(n => n.categorization.severity === 'high').length,
  }), [notes]);
  
  // Handlers
  const handleToggleSelect = (noteId) => {
    setSelectedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedNotes.length === filteredNotes.length) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(filteredNotes.map(n => n.id));
    }
  };
  
  const handleToggleExpand = (noteId) => {
    setExpandedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };
  
  const handleSimulateRecording = () => {
    setIsRecordingOnGlass(true);
    setRecordingDuration(0);
  };
  
  const handleStopRecording = () => {
    setIsRecordingOnGlass(false);
    setLastHUDAction('NOTE SAVED');
    setTimeout(() => setLastHUDAction(null), 2000);
    
    // Add new note
    const newNote = {
      id: `note-${Date.now()}`,
      job_id: 'job-1247',
      inspection_id: 'insp-5821',
      created_timestamp: new Date().toISOString(),
      recording_duration: recordingDuration,
      audio_file_path: '/audio/new-note.webm',
      transcription_text: 'New voice note captured from smart glass. Processing transcription...',
      transcription_confidence: 0,
      edited_text: null,
      metadata: {
        gps_coordinates: { lat: 34.0522, lng: -118.2437 },
        weather: { temp: 72, condition: 'sunny', humidity: 45 },
        device_battery: 80,
        glass_model: 'Zuper Glass Pro',
      },
      categorization: {
        type: 'quick',
        severity: 'low',
        roof_section: 'Auto-detected',
        tags: [],
      },
      attachments: { photos: [], videos: [] },
      sync_status: 'syncing',
      reviewed: false,
      included_in_report: false,
    };
    
    setNotes(prev => [newNote, ...prev]);
    setRecordingDuration(0);
    
    // Simulate transcription complete
    setTimeout(() => {
      setNotes(prev => prev.map(n => 
        n.id === newNote.id 
          ? { 
              ...n, 
              transcription_text: 'This is a simulated transcription from voice recording on smart glass. The area near the gutter shows signs of water pooling. Recommend checking the slope and drainage.',
              transcription_confidence: 92,
              sync_status: 'synced',
            }
          : n
      ));
    }, 3000);
  };

  return (
    <div className="flex flex-col w-full h-full relative">
      {/* Active Recording Overlay */}
      <AnimatePresence>
        {isRecordingOnGlass && viewMode === 'list' && (
          <ActiveRecordingOverlay
            isVisible={true}
            recordingDuration={recordingDuration}
            isDark={isDark}
            onStop={handleStopRecording}
          />
        )}
      </AnimatePresence>
      
      {/* Voice Commands Sheet */}
      <AnimatePresence>
        {showVoiceCommands && (
          <VoiceCommandsSheet
            isOpen={showVoiceCommands}
            onClose={() => setShowVoiceCommands(false)}
            isDark={isDark}
          />
        )}
      </AnimatePresence>
      
      {/* Header */}
      <div className="shrink-0 px-[24px] pt-[8px] pb-[12px]">
        <div className="flex items-center justify-between mb-[12px]">
          <div>
            <h1 
              className="font-['Space_Grotesk'] font-bold text-[26px]"
              style={{ color: textColors.primary }}
            >
              Notes
            </h1>
            <p 
              className="font-['Inter'] text-[12px] mt-[2px]"
              style={{ color: textColors.muted }}
            >
              {stats.total} notes • {stats.unreviewed} to review
            </p>
          </div>
          
          {/* View Toggle */}
          <div 
            className="flex items-center rounded-[10px] p-[4px]"
            style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
          >
            <motion.button
              className="px-[12px] py-[8px] rounded-[8px]"
              style={{
                background: viewMode === 'list' ? accentColors.primary : 'transparent',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
            >
              <List 
                className="w-[16px] h-[16px]" 
                style={{ color: viewMode === 'list' ? 'white' : textColors.muted }} 
              />
            </motion.button>
            <motion.button
              className="px-[12px] py-[8px] rounded-[8px]"
              style={{
                background: viewMode === 'hud' ? accentColors.primary : 'transparent',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('hud')}
            >
              <Radio 
                className="w-[16px] h-[16px]" 
                style={{ color: viewMode === 'hud' ? 'white' : textColors.muted }} 
              />
            </motion.button>
          </div>
        </div>
        
        {/* Connection Status */}
        <ConnectionBanner
          isConnected={isGlassConnected}
          glassInfo={{ model: 'Zuper Glass Pro', battery: 85 }}
          isDark={isDark}
          onReconnect={() => {}}
        />
      </div>
      
      {/* Content based on view mode */}
      {viewMode === 'hud' ? (
        /* HUD Preview Mode */
        <div className="flex-1 overflow-y-auto px-[24px] pb-[100px]">
          {/* Glass HUD Preview */}
          <div className="mb-[16px]">
            <p 
              className="font-['Inter'] font-medium text-[11px] uppercase tracking-wide mb-[8px]"
              style={{ color: textColors.muted }}
            >
              Glass HUD Preview
            </p>
            <GlassHUDPreview
              isRecording={isRecordingOnGlass}
              recordingDuration={recordingDuration}
              isConnected={isGlassConnected}
              batteryLevel={85}
              jobName="Roof Inspection #1247 - 123 Oak Street"
              lastAction={lastHUDAction}
              isDark={isDark}
            />
          </div>
          
          {/* Recording Controls */}
          <div 
            className="rounded-[16px] p-[16px] mb-[16px]"
            style={{
              background: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <p className="font-['Inter'] font-semibold text-[13px] mb-[12px]" style={{ color: textColors.primary }}>
              Simulate Glass Recording
            </p>
            
            <div className="flex gap-[10px]">
              <motion.button
                className="flex-1 py-[14px] rounded-[12px] flex items-center justify-center gap-[8px]"
                style={{
                  background: isRecordingOnGlass 
                    ? 'rgba(239, 68, 68, 0.2)' 
                    : `linear-gradient(135deg, ${accentColors.primary} 0%, ${accentColors.primaryLight} 100%)`,
                  border: isRecordingOnGlass ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={isRecordingOnGlass ? handleStopRecording : handleSimulateRecording}
              >
                {isRecordingOnGlass ? (
                  <>
                    <Square className="w-[18px] h-[18px] text-red-500" fill="#ef4444" />
                    <span className="font-['Inter'] font-semibold text-[14px] text-red-500">
                      Stop Recording
                    </span>
                  </>
                ) : (
                  <>
                    <Mic className="w-[18px] h-[18px] text-white" />
                    <span className="font-['Inter'] font-semibold text-[14px] text-white">
                      Start Recording
                    </span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
          
          {/* Voice Commands Button */}
          <motion.button
            className="w-full py-[14px] rounded-[12px] flex items-center justify-center gap-[8px]"
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowVoiceCommands(true)}
          >
            <Volume2 className="w-[16px] h-[16px]" style={{ color: accentColors.primary }} />
            <span className="font-['Inter'] font-medium text-[13px]" style={{ color: textColors.primary }}>
              View Voice Commands
            </span>
          </motion.button>
        </div>
      ) : (
        /* List View Mode */
        <>
          {/* Search & Filters */}
          <div className="shrink-0 px-[24px] pb-[12px]">
            {/* Search Bar */}
            <div 
              className="flex items-center gap-[10px] px-[14px] py-[10px] rounded-[12px] mb-[10px]"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <Search className="w-[18px] h-[18px]" style={{ color: textColors.muted }} />
              <input
                type="text"
                placeholder="Search notes, tags, locations..."
                className="flex-1 bg-transparent font-['Inter'] text-[13px] outline-none"
                style={{ color: textColors.primary }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <motion.button
                className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center"
                style={{
                  background: showFilters ? accentColors.bgMedium : 'transparent',
                }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter 
                  className="w-[16px] h-[16px]" 
                  style={{ color: showFilters ? accentColors.primary : textColors.muted }} 
                />
              </motion.button>
            </div>
            
            {/* Filter Options */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {/* Type Filter */}
                  <div className="flex gap-[6px] mb-[8px] overflow-x-auto no-scrollbar">
                    {['all', ...noteTemplates.map(t => t.id)].map((type) => {
                      const template = noteTemplates.find(t => t.id === type);
                      return (
                        <motion.button
                          key={type}
                          className="px-[10px] py-[6px] rounded-[8px] flex items-center gap-[4px] shrink-0"
                          style={{
                            background: filterType === type 
                              ? (template?.color || accentColors.primary) + '20'
                              : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                            border: filterType === type 
                              ? `1px solid ${template?.color || accentColors.primary}40`
                              : 'none',
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setFilterType(type)}
                        >
                          {template && <template.icon className="w-[12px] h-[12px]" style={{ color: template.color }} />}
                          <span 
                            className="font-['Inter'] font-medium text-[11px]"
                            style={{ color: filterType === type ? (template?.color || accentColors.primary) : textColors.description }}
                          >
                            {type === 'all' ? 'All Types' : template?.name}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                  
                  {/* Severity & Sort */}
                  <div className="flex gap-[8px]">
                    <select
                      className="flex-1 px-[10px] py-[8px] rounded-[8px] font-['Inter'] text-[11px] outline-none"
                      style={{
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        color: textColors.primary,
                        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
                      }}
                      value={filterSeverity}
                      onChange={(e) => setFilterSeverity(e.target.value)}
                    >
                      <option value="all">All Severity</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    
                    <select
                      className="flex-1 px-[10px] py-[8px] rounded-[8px] font-['Inter'] text-[11px] outline-none"
                      style={{
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        color: textColors.primary,
                        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)',
                      }}
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="severity">By Severity</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Batch Actions (when items selected) */}
            <AnimatePresence>
              {selectedNotes.length > 0 && (
                <motion.div
                  className="flex items-center gap-[8px] mt-[10px] p-[10px] rounded-[10px]"
                  style={{ background: accentColors.bgLight }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <span className="font-['Inter'] font-medium text-[12px]" style={{ color: accentColors.primary }}>
                    {selectedNotes.length} selected
                  </span>
                  <div className="flex-1" />
                  <motion.button 
                    className="px-[10px] py-[6px] rounded-[6px]"
                    style={{ background: accentColors.bgMedium }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="font-['Inter'] font-medium text-[11px]" style={{ color: accentColors.primary }}>
                      Add to Report
                    </span>
                  </motion.button>
                  <motion.button 
                    className="px-[10px] py-[6px] rounded-[6px]"
                    style={{ background: 'rgba(239, 68, 68, 0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedNotes([])}
                  >
                    <span className="font-['Inter'] font-medium text-[11px] text-red-500">
                      Clear
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Notes List */}
          <div className="flex-1 overflow-y-auto px-[24px] pb-[180px]">
            {/* Stats Bar */}
            <div className="flex items-center gap-[8px] mb-[12px]">
              {stats.highSeverity > 0 && (
                <div className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px]"
                  style={{ background: 'rgba(239, 68, 68, 0.1)' }}
                >
                  <AlertTriangle className="w-[12px] h-[12px] text-red-500" />
                  <span className="font-['Inter'] font-semibold text-[10px] text-red-500">
                    {stats.highSeverity} priority
                  </span>
                </div>
              )}
              {stats.pending > 0 && (
                <div className="flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px]"
                  style={{ background: 'rgba(245, 158, 11, 0.1)' }}
                >
                  <Cloud className="w-[12px] h-[12px] text-amber-500" />
                  <span className="font-['Inter'] font-semibold text-[10px] text-amber-500">
                    {stats.pending} syncing
                  </span>
                </div>
              )}
              <div className="flex-1" />
              <motion.button
                className="font-['Inter'] font-medium text-[11px]"
                style={{ color: accentColors.primary }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSelectAll}
              >
                {selectedNotes.length === filteredNotes.length ? 'Deselect All' : 'Select All'}
              </motion.button>
            </div>
            
            {/* Notes */}
            <div className="flex flex-col gap-[12px]">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isDark={isDark}
                  isSelected={selectedNotes.includes(note.id)}
                  onToggleSelect={() => handleToggleSelect(note.id)}
                  onEdit={() => {}}
                  onDelete={() => setNotes(prev => prev.filter(n => n.id !== note.id))}
                  isExpanded={expandedNotes.includes(note.id)}
                  onToggleExpand={() => handleToggleExpand(note.id)}
                />
              ))}
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
                  className="font-['Inter'] text-[13px] text-center max-w-[240px]"
                  style={{ color: textColors.muted }}
                >
                  {searchQuery ? 'Try adjusting your search or filters' : 'Notes captured on glass will appear here'}
                </p>
              </motion.div>
            )}
          </div>
        </>
      )}
      
      {/* Multi-Modal FAB */}
      <NoteCreationFAB
        isDark={isDark}
        isGlassConnected={isGlassConnected}
        onVoiceNote={() => setShowVoiceModal(true)}
        onTypeNote={() => setShowTypeModal(true)}
      />
      
      {/* Voice Recording Modal (App) */}
      <AnimatePresence>
        {showVoiceModal && (
          <VoiceRecordingModal
            isOpen={showVoiceModal}
            onClose={() => setShowVoiceModal(false)}
            onSave={(newNote) => setNotes(prev => [newNote, ...prev])}
            isDark={isDark}
            activeJob={activeJob || { id: 'job-1247', name: 'Roof Inspection #1247' }}
          />
        )}
      </AnimatePresence>
      
      {/* Type Note Modal (App) */}
      <AnimatePresence>
        {showTypeModal && (
          <TypeNoteModal
            isOpen={showTypeModal}
            onClose={() => setShowTypeModal(false)}
            onSave={(newNote) => setNotes(prev => [newNote, ...prev])}
            isDark={isDark}
            activeJob={activeJob || { id: 'job-1247', name: 'Roof Inspection #1247' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotesPage;
