"use client";

import React from 'react';

export const BackgroundEffect: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-10"></div>
      
      {/* Gradient orbs */}
      <div className="absolute top-20 left-[10%] w-72 h-72 bg-[var(--primary-50)] rounded-full filter blur-3xl opacity-30 animate-pulse-slow"></div>
      <div className="absolute bottom-32 right-[15%] w-96 h-96 bg-[var(--secondary-50)] rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
      
      {/* Floating crypto icons */}
      <div className="absolute top-1/4 left-1/6 animate-float opacity-10">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
        </svg>
      </div>
      <div className="absolute top-1/3 right-1/4 animate-float opacity-10" style={{ animationDelay: '1.5s' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm-.5 18.25H8.75v-2.75h2.75v2.75zm0-4.25H8.75V5.75h2.75v8.25zm4.5 4.25h-2.75v-2.75h2.75v2.75zm0-4.25h-2.75V5.75h2.75v8.25z" />
        </svg>
      </div>
      <div className="absolute bottom-1/4 left-1/3 animate-float opacity-10" style={{ animationDelay: '1s' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm-1.483-6.629L8.106 12l2.41-5.371 2.415 5.371-2.414 5.371zm2.97 0L15.9 12l-2.414-5.371-2.414 5.371 2.414 5.371z" />
        </svg>
      </div>
      
      {/* Small particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div 
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-30"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `pulse ${3 + Math.random() * 3}s infinite`
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundEffect; 