import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function AiOrb({ size = "md", onClick, interactive = true }) {
  const sizeMap = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
    xl: "w-28 h-28"
  };

  const orbSize = sizeMap[size] || sizeMap.md;

  return (
    <div 
      onClick={onClick}
      className={`relative ${orbSize} flex items-center justify-center ${interactive ? 'cursor-pointer group' : ''}`}
    >
      {/* Outer ambient soft glowing aura (clean 2D breathing pulse) */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600/30 via-pink-500/25 to-indigo-500/30 blur-xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Subtle glowing ring */}
      <div className="absolute -inset-1 rounded-full border border-purple-500/30" />

      {/* Core glowing sphere */}
      <motion.div
        className="relative w-full h-full rounded-full bg-gradient-to-tr from-purple-700 via-indigo-600 to-pink-500 p-[2px] shadow-[0_0_20px_rgba(168,85,247,0.5)] overflow-hidden"
        whileHover={interactive ? { scale: 1.08 } : {}}
        whileTap={interactive ? { scale: 0.95 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1b0b38] via-[#0f0a24] to-[#250b45] flex items-center justify-center relative overflow-hidden">
          <Sparkles className="w-1/2 h-1/2 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        </div>
      </motion.div>
    </div>
  );
}
