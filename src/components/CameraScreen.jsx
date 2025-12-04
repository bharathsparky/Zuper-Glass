import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Settings, Image, Check, Camera, Video } from 'lucide-react';

// Zuper Glass icon
const ZuperGlassIcon = ({ className, selected }) => (
  <svg 
    className={className} 
    width="32" 
    height="24" 
    viewBox="0 0 43 28" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M40.2794 7.76959C40.2294 7.71531 38.9987 7.66864 38.8615 7.6496C35.6241 7.19294 32.0929 6.83295 28.6986 7.13818C25.1095 7.46103 22.2821 8.9429 18.5997 8.39244C15.9156 7.99149 13.3231 7.20056 10.5816 7.03914C7.75104 6.87295 4.51584 7.26627 1.8541 7.6496C1.68662 7.67341 0.374827 7.71055 0.320461 7.76959C0.282755 7.81102 0.306869 8.79052 0.316515 8.93385C0.322215 9.02147 0.62868 10.5314 0.671208 10.6062C0.884726 10.9819 1.32974 10.4681 1.70372 11.329C2.65468 13.5214 2.82567 18.1227 4.61449 19.5383C7.77209 22.0364 14.4889 21.3102 16.6995 17.5308C17.6513 15.9037 18.2388 12.9599 19.1657 11.5557C19.185 11.5266 19.5107 11.1681 19.5357 11.1605C19.779 11.0876 20.8098 11.0595 21.0645 11.1605C21.5771 11.3638 23.458 16.9784 24.2471 18.0327C26.6918 21.2997 32.9211 21.963 35.9853 19.5383C37.747 18.1446 37.9991 13.488 38.8965 11.329C39.2477 10.4838 39.7265 10.9543 39.9137 10.6376C40.0641 10.3829 40.1351 9.37955 40.1667 9.07004C40.1711 9.02528 40.2767 9.03909 40.2833 8.93385C40.2929 8.79004 40.3175 7.81102 40.2794 7.76959ZM2.21713 10.4986C1.69276 10.4986 1.26704 10.0367 1.26704 9.46669C1.26704 8.89671 1.69276 8.43482 2.21713 8.43482C2.74149 8.43482 3.16721 8.89671 3.16721 9.46669C3.16721 10.0367 2.74193 10.4986 2.21713 10.4986ZM12.9811 19.3064C8.8822 20.7769 4.44393 20.2483 3.66703 14.8394C2.71431 8.20625 5.47469 7.90673 10.9279 8.29339C11.9188 8.36387 14.3832 8.71243 15.293 9.02718C18.686 10.2 16.1549 18.1674 12.9811 19.3064ZM28.888 19.6831C27.1632 19.3164 25.9404 18.6103 25.0556 16.9037C23.6605 14.2113 22.3719 9.59669 26.2319 8.77671C28.3816 8.32006 31.3607 8.10101 33.5634 8.29339C36.4908 8.54957 36.8885 9.60479 37.0415 12.5714C37.3471 18.5103 34.1465 20.8002 28.888 19.6831ZM38.4221 10.4986C37.8973 10.4986 37.4721 10.0367 37.4721 9.46669C37.4721 8.89671 37.8973 8.43482 38.4221 8.43482C38.947 8.43482 39.3722 8.89671 39.3722 9.46669C39.3722 10.0367 38.947 10.4986 38.4221 10.4986Z" 
      fill={selected ? '#ffffff' : 'rgba(255,255,255,0.6)'} 
      stroke={selected ? '#ffffff' : 'rgba(255,255,255,0.6)'} 
      strokeWidth="0.3"
    />
  </svg>
);

// Format seconds to MM:SS
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Sample viewfinder image (roof inspection)
const sampleViewfinderImage = '/assets/figma-assets/598cd013b8500e290215fdc47888787468011a5c.png';

export const CameraScreen = ({ 
  isOpen, 
  onClose, 
  inspectionTitle = "Roof inspection for Henry",
  onCapture 
}) => {
  const [cameraSource, setCameraSource] = useState('phone'); // 'phone' or 'glass'
  const [captureMode, setCaptureMode] = useState('photo'); // 'photo' or 'video'
  const [isCapturing, setIsCapturing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setRecordingTime(0);
    }
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  const handleCapture = () => {
    if (captureMode === 'photo') {
      setIsCapturing(true);
      setTimeout(() => {
        setIsCapturing(false);
        if (cameraSource === 'phone') {
          fileInputRef.current?.click();
        } else {
          onCapture?.({ source: 'glass', type: 'photo', timestamp: Date.now() });
        }
      }, 150);
    } else {
      if (isRecording) {
        setIsRecording(false);
        onCapture?.({ 
          source: cameraSource, 
          type: 'video', 
          duration: recordingTime,
          timestamp: Date.now() 
        });
      } else {
        if (cameraSource === 'phone') {
          videoInputRef.current?.click();
        } else {
          setIsRecording(true);
        }
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onCapture?.({ source: 'phone', type: 'photo', file, timestamp: Date.now() });
      e.target.value = '';
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onCapture?.({ source: 'phone', type: 'video', file, timestamp: Date.now() });
      e.target.value = '';
    }
  };

  const handleDone = () => {
    if (isRecording) {
      setIsRecording(false);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute inset-0 z-[200] overflow-hidden rounded-[48px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            capture="environment"
            className="hidden"
            onChange={handleVideoChange}
          />

          {/* Full Screen Viewfinder */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${sampleViewfinderImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* Recording border indicator */}
          {isRecording && (
            <motion.div 
              className="absolute inset-0 rounded-[48px] pointer-events-none z-10"
              style={{ border: '4px solid #ef4444' }}
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}

          {/* Gradient overlays for readability */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 25%, transparent 70%, rgba(0,0,0,0.7) 100%)
              `,
            }}
          />

          {/* Capture flash overlay */}
          <AnimatePresence>
            {isCapturing && (
              <motion.div
                className="absolute inset-0 z-50 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              />
            )}
          </AnimatePresence>

          {/* === OVERLAY CONTROLS === */}
          
          {/* Status Bar - Top */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-[24px] pt-[21px] pb-[12px]">
            <div className="flex-1 flex justify-start">
              <span className="font-['SF_Pro',-apple-system,sans-serif] font-semibold text-[17px] text-white drop-shadow-lg">
                9:41
              </span>
            </div>
            <div className="flex items-center gap-[7px]">
              <svg width="19" height="12" viewBox="0 0 20 13" fill="white" className="drop-shadow-lg">
                <path fillRule="evenodd" clipRule="evenodd" d="M19.2 1.14623C19.2 0.513183 18.7224 0 18.1333 0H17.0667C16.4776 0 16 0.513183 16 1.14623V11.0802C16 11.7132 16.4776 12.2264 17.0667 12.2264H18.1333C18.7224 12.2264 19.2 11.7132 19.2 11.0802V1.14623ZM11.7659 2.44528H12.8326C13.4217 2.44528 13.8992 2.97078 13.8992 3.61902V11.0527C13.8992 11.7009 13.4217 12.2264 12.8326 12.2264H11.7659C11.1768 12.2264 10.6992 11.7009 10.6992 11.0527V3.61902C10.6992 2.97078 11.1768 2.44528 11.7659 2.44528ZM7.43411 5.09433H6.36745C5.77834 5.09433 5.30078 5.62652 5.30078 6.28301V11.0377C5.30078 11.6942 5.77834 12.2264 6.36745 12.2264H7.43411C8.02322 12.2264 8.50078 11.6942 8.50078 11.0377V6.28301C8.50078 5.62652 8.02322 5.09433 7.43411 5.09433ZM2.13333 7.53962H1.06667C0.477563 7.53962 0 8.06421 0 8.71132V11.0547C0 11.7018 0.477563 12.2264 1.06667 12.2264H2.13333C2.72244 12.2264 3.2 11.7018 3.2 11.0547V8.71132C3.2 8.06421 2.72244 7.53962 2.13333 7.53962Z"/>
              </svg>
              <svg width="17" height="12" viewBox="0 0 18 13" fill="white" className="drop-shadow-lg">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.5713 2.46628C11.0584 2.46639 13.4504 3.38847 15.2529 5.04195C15.3887 5.1696 15.6056 5.16799 15.7393 5.03834L17.0368 3.77487C17.1045 3.70911 17.1422 3.62004 17.1417 3.52735C17.1411 3.43467 17.1023 3.34603 17.0338 3.28104C12.3028 -1.09368 4.83907 -1.09368 0.108056 3.28104C0.039524 3.34598 0.000639766 3.4346 7.82398e-06 3.52728C-0.000624118 3.61996 0.0370483 3.70906 0.104689 3.77487L1.40255 5.03834C1.53615 5.16819 1.75327 5.1698 1.88893 5.04195C3.69167 3.38836 6.08395 2.46628 8.5713 2.46628ZM8.56795 6.68656C9.92527 6.68647 11.2341 7.19821 12.2403 8.12234C12.3763 8.2535 12.5907 8.25065 12.7234 8.11593L14.0106 6.79663C14.0784 6.72742 14.1161 6.63355 14.1151 6.53599C14.1141 6.43844 14.0746 6.34536 14.0054 6.27757C10.9416 3.38672 6.19688 3.38672 3.13305 6.27757C3.06384 6.34536 3.02435 6.43849 3.02345 6.53607C3.02254 6.63365 3.06028 6.72752 3.12822 6.79663L4.41513 8.11593C4.54778 8.25065 4.76215 8.2535 4.89823 8.12234C5.90368 7.19882 7.21152 6.68713 8.56795 6.68656ZM11.0924 9.48011C11.0943 9.58546 11.0572 9.68703 10.9899 9.76084L8.81327 12.2156C8.74946 12.2877 8.66247 12.3283 8.5717 12.3283C8.48093 12.3283 8.39394 12.2877 8.33013 12.2156L6.1531 9.76084C6.08585 9.68697 6.04886 9.58537 6.05085 9.48002C6.05284 9.37467 6.09365 9.27491 6.16364 9.20429C7.55374 7.8904 9.58966 7.8904 10.9798 9.20429C11.0497 9.27497 11.0904 9.37476 11.0924 9.48011Z"/>
              </svg>
              <svg width="27" height="13" viewBox="0 0 28 13" fill="none" className="drop-shadow-lg">
                <rect x="0.5" y="0.5" width="24" height="12" rx="3.8" stroke="white" strokeOpacity="0.35"/>
                <path d="M26 4.78113V8.8566C26.8047 8.51143 27.328 7.70847 27.328 6.81886C27.328 5.92926 26.8047 5.1263 26 4.78113" fill="white" fillOpacity="0.4"/>
                <rect x="2" y="2" width="21" height="9" rx="2.5" fill="white"/>
              </svg>
            </div>
          </div>

          {/* Top Toolbar - Glass overlay */}
          <div className="absolute top-[55px] left-[16px] right-[16px] z-20">
            <div 
              className="flex items-center justify-between px-[12px] py-[8px] rounded-[14px]"
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Back Button */}
              <motion.button
                className="w-[36px] h-[36px] rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
              >
                <ChevronLeft className="w-[20px] h-[20px] text-white" strokeWidth={2.5} />
              </motion.button>

              {/* Title / Recording indicator */}
              <div className="flex flex-col items-center">
                {isRecording ? (
                  <div className="flex items-center gap-[8px]">
                    <motion.div 
                      className="w-[8px] h-[8px] rounded-full bg-red-500"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="font-['Inter',sans-serif] font-semibold text-[15px] text-red-400">
                      {formatTime(recordingTime)}
                    </span>
                  </div>
                ) : (
                  <>
                    <span className="font-['Inter',sans-serif] font-semibold text-[14px] text-white">
                      Capture
                    </span>
                    <span className="font-['Inter',sans-serif] text-[10px] text-white/60">
                      {inspectionTitle}
                    </span>
                  </>
                )}
              </div>

              {/* Settings Button */}
              <motion.button
                className="w-[36px] h-[36px] rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-[18px] h-[18px] text-white/80" strokeWidth={2} />
              </motion.button>
            </div>
          </div>

          {/* Camera Source Toggle - Top right area */}
          <div className="absolute top-[120px] right-[16px] z-20">
            <div 
              className="flex flex-col items-center gap-[8px] p-[6px] rounded-[12px]"
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              <motion.button
                className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center"
                style={{
                  background: cameraSource === 'phone' 
                    ? 'linear-gradient(135deg, #8558F2 0%, #6366f1 100%)' 
                    : 'rgba(255, 255, 255, 0.1)',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCameraSource('phone')}
              >
                <Camera 
                  className="w-[20px] h-[20px]" 
                  style={{ color: '#ffffff' }}
                  strokeWidth={2}
                />
              </motion.button>
              <motion.button
                className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center"
                style={{
                  background: cameraSource === 'glass' 
                    ? 'linear-gradient(135deg, #8558F2 0%, #6366f1 100%)' 
                    : 'rgba(255, 255, 255, 0.1)',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCameraSource('glass')}
              >
                <ZuperGlassIcon className="w-[24px] h-[16px]" selected={true} />
              </motion.button>
            </div>
          </div>

          {/* Bottom Controls - Overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-20 pb-[20px]">
            {/* Photo/Video Mode Toggle */}
            <div className="flex justify-center mb-[16px]">
              <div 
                className="flex items-center gap-[4px] p-[4px] rounded-full"
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
              >
                <motion.button
                  className="flex items-center gap-[6px] px-[16px] py-[8px] rounded-full"
                  style={{
                    background: captureMode === 'photo' 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'transparent',
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCaptureMode('photo')}
                >
                  <Camera 
                    className="w-[16px] h-[16px]" 
                    style={{ color: captureMode === 'photo' ? '#ffffff' : 'rgba(255,255,255,0.5)' }}
                    strokeWidth={2}
                  />
                  <span 
                    className="font-['Inter',sans-serif] font-medium text-[12px]"
                    style={{ color: captureMode === 'photo' ? '#ffffff' : 'rgba(255,255,255,0.5)' }}
                  >
                    Photo
                  </span>
                </motion.button>
                
                <motion.button
                  className="flex items-center gap-[6px] px-[16px] py-[8px] rounded-full"
                  style={{
                    background: captureMode === 'video' 
                      ? 'rgba(239, 68, 68, 0.3)' 
                      : 'transparent',
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCaptureMode('video')}
                >
                  <Video 
                    className="w-[16px] h-[16px]" 
                    style={{ color: captureMode === 'video' ? '#ef4444' : 'rgba(255,255,255,0.5)' }}
                    strokeWidth={2}
                  />
                  <span 
                    className="font-['Inter',sans-serif] font-medium text-[12px]"
                    style={{ color: captureMode === 'video' ? '#ef4444' : 'rgba(255,255,255,0.5)' }}
                  >
                    Video
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Main Controls Row */}
            <div className="flex items-center justify-between px-[32px]">
              {/* Gallery Button */}
              <motion.button
                className="w-[50px] h-[50px] rounded-[14px] flex items-center justify-center"
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Image className="w-[24px] h-[24px] text-white" strokeWidth={1.5} />
              </motion.button>

              {/* Capture/Record Button */}
              <motion.button
                className="relative w-[80px] h-[80px] flex items-center justify-center"
                whileTap={{ scale: 0.95 }}
                onClick={handleCapture}
              >
                {captureMode === 'photo' ? (
                  <>
                    {/* Photo mode - White ring with purple center */}
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'transparent',
                        border: '4px solid rgba(255, 255, 255, 0.9)',
                        boxShadow: '0 0 30px rgba(133, 88, 242, 0.4)',
                      }}
                    />
                    <div 
                      className="w-[64px] h-[64px] rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, #8558F2 0%, #6366f1 100%)',
                        boxShadow: '0 4px 20px rgba(133, 88, 242, 0.5)',
                      }}
                    />
                  </>
                ) : (
                  <>
                    {/* Video mode - Red */}
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'transparent',
                        border: `4px solid ${isRecording ? '#ef4444' : 'rgba(239, 68, 68, 0.7)'}`,
                        boxShadow: isRecording 
                          ? '0 0 40px rgba(239, 68, 68, 0.6)'
                          : '0 0 30px rgba(239, 68, 68, 0.4)',
                      }}
                    />
                    <motion.div 
                      animate={isRecording ? { scale: [1, 0.9, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{
                        width: isRecording ? '32px' : '64px',
                        height: isRecording ? '32px' : '64px',
                        borderRadius: isRecording ? '8px' : '50%',
                        background: '#ef4444',
                        boxShadow: '0 4px 20px rgba(239, 68, 68, 0.5)',
                      }}
                    />
                  </>
                )}
              </motion.button>

              {/* Done Button */}
              <motion.button
                className="w-[50px] h-[50px] rounded-[14px] flex items-center justify-center"
                style={{
                  background: 'rgba(16, 185, 129, 0.3)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDone}
              >
                <Check className="w-[24px] h-[24px] text-emerald-400" strokeWidth={2.5} />
              </motion.button>
            </div>

            {/* Home Indicator */}
            <div className="flex justify-center mt-[16px]">
              <div className="w-[134px] h-[5px] rounded-full bg-white/30" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CameraScreen;
