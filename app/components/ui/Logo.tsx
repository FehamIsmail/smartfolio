"use client";

import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-8 h-8">
        {/* Logo shape with glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg opacity-75 blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">S</span>
        </div>
      </div>
      <div className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        SmartFolio
      </div>
    </div>
  );
};

export default Logo; 