import React from 'react';

export const GlassStripes = ({ className }) => {
  return (
    <div className={`flex items-end ${className}`}>
      {Array.from({ length: 26 }).map((_, i) => {
        const heights = i < 12 ? '264' : i < 15 ? '251' : i < 18 ? '233' : '264';
        const opacities = i < 12 ? '70' : i < 15 ? '60' : i < 18 ? '30' : '0';
        const widths = i % 2 === 0 ? '13' : '14';
        return (
          <div
            key={i}
            className="backdrop-blur-[10.35px] backdrop-filter bg-gradient-to-b from-[rgba(255,255,255,0)] shrink-0 to-[84.186%] to-[rgba(255,255,255,0)] via-[56.155%] via-[rgba(238,238,242,0.13)]"
            style={{
              height: `${heights}px`,
              width: `${widths}px`,
              opacity: opacities === '70' ? 0.7 : opacities === '60' ? 0.6 : opacities === '30' ? 0.3 : 0
            }}
          />
        );
      })}
    </div>
  );
};

