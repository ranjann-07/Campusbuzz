import React from 'react';

export default function ThreeCanvas({ className = "" }) {
  // 3D Three.js WebGL effects stopped as requested
  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      {/* Sleek, ambient dark atmospheric glows without 3D WebGL */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-2/3 left-10 w-[400px] h-[300px] bg-pink-600/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
