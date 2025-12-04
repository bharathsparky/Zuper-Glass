import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';

const SplashScreen = ({ onComplete }) => {
  const [animationData, setAnimationData] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Load the Lottie animation
    fetch('/assets/logo.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error('Failed to load animation:', err));
  }, []);

  useEffect(() => {
    if (animationComplete) {
      // Fade out splash and transition to login
      const fadeTimer = setTimeout(() => {
        setShowSplash(false);
        setTimeout(() => {
          onComplete();
        }, 500); // Wait for fade animation
      }, 300);
      
      return () => clearTimeout(fadeTimer);
    }
  }, [animationComplete, onComplete]);

  const handleAnimationComplete = () => {
    setAnimationComplete(true);
  };

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="absolute inset-0 z-[200] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            // White background for the logo animation (as designed)
            background: '#FFFFFF',
          }}
        >
          {/* Dark theme gradient overlay - fades in during transition */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: animationComplete ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: `
                radial-gradient(ellipse 120% 80% at 50% 0%, rgba(133, 88, 242, 0.25) 0%, transparent 50%),
                radial-gradient(ellipse 100% 60% at 80% 80%, rgba(99, 102, 241, 0.2) 0%, transparent 50%),
                linear-gradient(180deg, #0f172a 0%, #1e293b 30%, #0f172a 70%, #020617 100%)
              `,
            }}
          />

          {/* Full Screen Lottie Animation */}
          {animationData ? (
            <Lottie
              animationData={animationData}
              loop={false}
              autoplay={true}
              style={{ 
                width: '100%', 
                height: '100%',
                position: 'absolute',
                inset: 0,
              }}
              onComplete={handleAnimationComplete}
            />
          ) : (
            // Premium loading state while Lottie loads
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{
                background: `
                  radial-gradient(ellipse 120% 80% at 50% 0%, rgba(133, 88, 242, 0.25) 0%, transparent 50%),
                  radial-gradient(ellipse 100% 60% at 80% 80%, rgba(99, 102, 241, 0.2) 0%, transparent 50%),
                  linear-gradient(180deg, #0f172a 0%, #1e293b 30%, #0f172a 70%, #020617 100%)
                `,
              }}
            >
              {/* Glowing orb */}
              <motion.div
                className="absolute w-[300px] h-[300px] rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(133, 88, 242, 0.3) 0%, transparent 60%)',
                  filter: 'blur(60px)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              {/* Loading spinner */}
              <motion.div
                className="w-[60px] h-[60px] rounded-full border-4 border-purple-500/30 border-t-purple-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              
              <motion.p
                className="mt-6 font-['Inter'] text-[14px] text-slate-400 tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Loading...
              </motion.p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;

