import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Hyper-Unique & Expressive CampusBuzz Cyber Robot Mascot ("BuzzBot")
 * Features:
 * - Dynamic witty comic speech/thought bubbles
 * - Reticle laser eye-tracking that follows user typing
 * - Cute robotic hands covering eyes on password field with peeking mode
 * - Visor emote mouths (happy, focused, blushing, shocked, victorious)
 * - Interactive click/tickle response with heart/star eyes
 * - Mechanical ear equalizers and holographic scanning laser beam
 */
export default function InteractiveRobotMascot({
  focusedField = null,
  textLength = 0,
  inputValue = '',
  showPassword = false,
  isLoading = false,
  isSuccess = false,
  hasError = false
}) {
  // Natural blinking
  const [isBlinking, setIsBlinking] = useState(false);
  // Interactive click/tickle state
  const [isTickled, setIsTickled] = useState(false);
  // Idle speech rotator
  const [idleThoughtIndex, setIdleThoughtIndex] = useState(0);

  const idleThoughts = [
    "Hey! I'm BuzzBot 🤖 Log in to unlock campus!",
    "10,200 creators live! Tap me to say hi! ⚡",
    "Ready to collab? Enter your credentials! 🚀",
    "Psst... I protect your student account! 🛡️"
  ];

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3200 + Math.random() * 2200);

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const thoughtInterval = setInterval(() => {
      setIdleThoughtIndex((prev) => (prev + 1) % idleThoughts.length);
    }, 6000);

    return () => clearInterval(thoughtInterval);
  }, []);

  // Compute Eye Pupil Position & Inquisitive Head Tilt
  let eyeX = 0;
  let eyeY = 0;
  let isCoveringEyes = false;
  let isPeeking = false;

  if (focusedField === 'password') {
    if (!showPassword) {
      isCoveringEyes = true;
    } else {
      isPeeking = true;
    }
  } else if (focusedField === 'email' || focusedField === 'fullName' || focusedField === 'collegeName' || focusedField === 'department') {
    eyeY = 5;
    const normalized = Math.min(Math.max(textLength, 0), 28);
    eyeX = (normalized / 28) * 18 - 9; // -9px to +9px
  } else {
    eyeX = 0;
    eyeY = 1;
  }

  // Head tilt angle based on horizontal typing scan
  const headTilt = eyeX * 0.85;

  // Compute dynamic speech bubble text
  const getSpeechText = () => {
    if (isSuccess) return "ACCESS GRANTED! Welcome back Creator! 🎉🔥";
    if (hasError) return "Uh oh! Glitch detected! Check your credentials? 🤖⚡";
    if (isLoading) return "Verifying student node on CampusBuzz grid... 🛰️";
    if (isTickled) return "BEEP BOOP! Hehe that tickles my circuits! ✨⚡";

    if (focusedField === 'password') {
      if (!showPassword) {
        return textLength > 8 
          ? "Oof! Super strong password! 🙈🛡️" 
          : "NO PEEKING! Eyes covered, promise! 🙈🔒";
      } else {
        return "🤫 Peeking with one eye! Your secret is safe with me!";
      }
    }

    if (focusedField === 'email') {
      if (textLength === 0) return "Drop your university email! 📧";
      if (typeof inputValue === 'string' && inputValue.includes('@') && inputValue.includes('.')) {
        return "Verified collegiate email detected! ✨🎓";
      }
      return "Scanning campus credentials... 🔍";
    }

    if (focusedField === 'fullName') return "What's your creator alias? ✨";
    if (focusedField === 'collegeName') return "Represent your university! 🏛️";

    return idleThoughts[idleThoughtIndex];
  };

  const handleMascotClick = () => {
    setIsTickled(true);
    setTimeout(() => setIsTickled(false), 2400);
  };

  return (
    <div className="relative w-52 h-32 mx-auto select-none z-30 flex flex-col items-center">
      {/* ======================================================== */}
      {/* 1. DYNAMIC COMIC SPEECH / THOUGHT BUBBLE                 */}
      {/* ======================================================== */}
      <AnimatePresence mode="wait">
        <motion.div
          key={getSpeechText()}
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          className="absolute -top-11 z-40 px-3.5 py-1.5 rounded-2xl bg-[#0f1225]/95 border border-purple-500/40 text-[11px] font-medium text-purple-200 shadow-[0_8px_25px_rgba(0,0,0,0.7)] backdrop-blur-md whitespace-nowrap flex items-center gap-1.5 cursor-pointer pointer-events-auto group hover:border-purple-400"
          onClick={handleMascotClick}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
          <span className="font-semibold text-slate-100">{getSpeechText()}</span>
          
          {/* Speech Bubble Arrow pointing down to robot antenna */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0f1225] border-r border-b border-purple-500/40 transform rotate-45" />
        </motion.div>
      </AnimatePresence>

      {/* ======================================================== */}
      {/* 2. AMBIENT NEON BACK-GLOW                                */}
      {/* ======================================================== */}
      <motion.div
        animate={{
          scale: isSuccess ? [1, 1.3, 1] : (isTickled ? [1, 1.25, 1] : [1, 1.08, 1]),
          opacity: isSuccess ? 0.9 : (hasError ? 0.85 : (isCoveringEyes ? 0.65 : 0.45))
        }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute inset-0 rounded-full blur-2xl pointer-events-none transition-colors duration-500 ${
          isSuccess 
            ? 'bg-emerald-500/40' 
            : (hasError ? 'bg-rose-500/45' : (isCoveringEyes ? 'bg-pink-500/40' : (isTickled ? 'bg-amber-400/35' : 'bg-purple-600/40')))
        }`}
      />

      {/* ======================================================== */}
      {/* 3. ROBOT MASCOT SVG RIG                                  */}
      {/* ======================================================== */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleMascotClick}
        className="w-full h-full cursor-pointer pointer-events-auto"
        title="BuzzBot: Click me!"
      >
        <svg
          viewBox="0 0 180 120"
          className="w-full h-full overflow-visible drop-shadow-[0_14px_30px_rgba(0,0,0,0.7)]"
        >
          <defs>
            {/* Metallic Chassis Gradient */}
            <linearGradient id="buzzHeadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2c224d" />
              <stop offset="45%" stopColor="#17192e" />
              <stop offset="100%" stopColor="#0b0d1a" />
            </linearGradient>

            {/* Dark Visor OLED Screen Gradient */}
            <linearGradient id="buzzVisorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#060712" />
              <stop offset="100%" stopColor="#0f1124" />
            </linearGradient>

            {/* Neon Cyan Eye Gradient */}
            <linearGradient id="buzzEyeCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Neon Pink Eye Gradient */}
            <linearGradient id="buzzEyePink" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>

            {/* Gold Accent Gradient */}
            <linearGradient id="buzzGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>

            {/* Scan Beam Gradient */}
            <linearGradient id="scanBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* ======================================================== */}
          {/* ANTENNA WITH GLOWING CYBER BEACON                        */}
          {/* ======================================================== */}
          <motion.g 
            transform="translate(90, 26)"
            animate={{ rotate: isTickled ? [0, -15, 15, -10, 10, 0] : 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Spring Coil / Stem */}
            <line x1="0" y1="0" x2="0" y2="-16" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="0" cy="-6" r="2" fill="#c084fc" />

            {/* Glowing Antenna Orb with Radar Pulse Ring */}
            <motion.circle
              cx="0"
              cy="-18"
              r="5"
              animate={{
                scale: isCoveringEyes || isTickled ? [1, 1.35, 1] : [1, 1.15, 1],
                fill: isSuccess ? '#34d399' : (hasError ? '#f43f5e' : (isCoveringEyes ? '#f472b6' : (isTickled ? '#fbbf24' : '#38bdf8')))
              }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
              className="filter drop-shadow-[0_0_10px_#38bdf8]"
            />
            {/* Antenna Wave Ring */}
            <motion.circle
              cx="0"
              cy="-18"
              r="9"
              fill="none"
              stroke={isSuccess ? '#34d399' : (hasError ? '#f43f5e' : '#38bdf8')}
              strokeWidth="1"
              animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
            />
          </motion.g>

          {/* ======================================================== */}
          {/* MECHANICAL EARS (WITH AUDIO EQUALIZER BARS)              */}
          {/* ======================================================== */}
          {/* Left Ear */}
          <g transform="translate(24, 46)">
            <rect x="0" y="0" width="8" height="22" rx="4" fill="#1e1838" stroke="#a855f7" strokeWidth="1.5" />
            {/* 3 Animated Equalizer Bars */}
            <motion.line x1="2.5" y1="6" x2="2.5" y2="16" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round"
              animate={{ y2: [14, 8, 15, 10] }} transition={{ duration: 0.8, repeat: Infinity }} />
            <motion.line x1="5.5" y1="5" x2="5.5" y2="17" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round"
              animate={{ y2: [9, 16, 7, 14] }} transition={{ duration: 0.9, repeat: Infinity, delay: 0.2 }} />
          </g>

          {/* Right Ear */}
          <g transform="translate(148, 46)">
            <rect x="0" y="0" width="8" height="22" rx="4" fill="#1e1838" stroke="#a855f7" strokeWidth="1.5" />
            {/* 3 Animated Equalizer Bars */}
            <motion.line x1="2.5" y1="5" x2="2.5" y2="17" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round"
              animate={{ y2: [8, 15, 9, 16] }} transition={{ duration: 0.85, repeat: Infinity }} />
            <motion.line x1="5.5" y1="6" x2="5.5" y2="16" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round"
              animate={{ y2: [15, 9, 14, 8] }} transition={{ duration: 0.95, repeat: Infinity, delay: 0.15 }} />
          </g>

          {/* ======================================================== */}
          {/* MAIN HEAD (Organic Inquisitive Tilt & Bounce)            */}
          {/* ======================================================== */}
          <motion.g
            animate={{
              rotate: isTickled ? [0, -8, 8, -5, 5, 0] : headTilt,
              y: isTickled ? [0, -12, 0] : (isLoading ? [0, -4, 0] : (isSuccess ? [0, -6, 0] : [0, -2, 0]))
            }}
            transition={{
              rotate: { type: 'spring', damping: 15, stiffness: 180 },
              y: { duration: isTickled ? 0.5 : 3.2, repeat: isTickled ? 1 : Infinity, ease: 'easeInOut' }
            }}
            style={{ originX: '90px', originY: '75px' }}
          >
            {/* Head Body Shell */}
            <rect
              x="30"
              y="26"
              width="120"
              height="72"
              rx="26"
              fill="url(#buzzHeadGrad)"
              stroke="#a855f7"
              strokeWidth="2.2"
              strokeOpacity="0.55"
            />

            {/* Metallic Top Highlight Sheen */}
            <path
              d="M 48 30 Q 90 35 132 30"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />

            {/* ======================================================== */}
            {/* VISOR (Dark Glass OLED Screen)                          */}
            {/* ======================================================== */}
            <rect
              x="40"
              y="38"
              width="100"
              height="48"
              rx="18"
              fill="url(#buzzVisorGrad)"
              stroke="#7c3aed"
              strokeWidth="1.5"
              strokeOpacity="0.75"
            />

            {/* Visor Corner Specular Reflection */}
            <path
              d="M 48 42 Q 90 46 132 42"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1.2"
              fill="none"
            />

            {/* Active Holographic Scan Beam (Animates when typing!) */}
            {focusedField && (
              <motion.line
                x1="44"
                y1="40"
                x2="136"
                y2="40"
                stroke="url(#scanBeamGrad)"
                strokeWidth="2"
                animate={{ y1: [40, 80, 40], y2: [40, 80, 40] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
              />
            )}

            {/* Cheek Blush LEDs (Active on Password / Tickle) */}
            <motion.circle
              cx="48"
              cy="74"
              r="4"
              animate={{
                opacity: isCoveringEyes || isPeeking || isTickled ? 0.9 : 0.15,
                scale: isCoveringEyes || isPeeking || isTickled ? 1.3 : 1
              }}
              fill="#f472b6"
              className="filter drop-shadow-[0_0_8px_#f472b6]"
            />
            <motion.circle
              cx="132"
              cy="74"
              r="4"
              animate={{
                opacity: isCoveringEyes || isPeeking || isTickled ? 0.9 : 0.15,
                scale: isCoveringEyes || isPeeking || isTickled ? 1.3 : 1
              }}
              fill="#f472b6"
              className="filter drop-shadow-[0_0_8px_#f472b6]"
            />

            {/* ======================================================== */}
            {/* DYNAMIC DIGITAL EYES (MULTIPLE UNIQUE STATES)            */}
            {/* ======================================================== */}
            {isTickled ? (
              /* STATE 1: Tickled (Heart Eyes ♥_♥) */
              <g fill="#ec4899" className="filter drop-shadow-[0_0_10px_#ec4899]">
                {/* Left Heart */}
                <path d="M 68 54 A 3.5 3.5 0 0 0 61 54 A 3.5 3.5 0 0 0 54 54 Q 54 62 61 67 Q 68 62 68 54 Z" transform="translate(6, -4)" />
                {/* Right Heart */}
                <path d="M 68 54 A 3.5 3.5 0 0 0 61 54 A 3.5 3.5 0 0 0 54 54 Q 54 62 61 67 Q 68 62 68 54 Z" transform="translate(48, -4)" />
              </g>
            ) : isSuccess ? (
              /* STATE 2: Success (Happy Japanese Anime Arcs ^_^) */
              <g stroke="#34d399" strokeWidth="3.2" strokeLinecap="round" fill="none" className="filter drop-shadow-[0_0_10px_#34d399]">
                <path d="M 58 60 Q 68 49 78 60" />
                <path d="M 102 60 Q 112 49 122 60" />
              </g>
            ) : hasError ? (
              /* STATE 3: Error (Shocked Wide Reticles O_O) */
              <g fill="#f43f5e" className="filter drop-shadow-[0_0_10px_#f43f5e]">
                <circle cx="68" cy="58" r="8.5" />
                <circle cx="112" cy="58" r="8.5" />
                <circle cx="68" cy="58" r="3" fill="#ffffff" />
                <circle cx="112" cy="58" r="3" fill="#ffffff" />
              </g>
            ) : isCoveringEyes ? (
              /* STATE 4: Password Hidden (Closed Happy Wink / Security Sleep) */
              <g stroke="#f472b6" strokeWidth="2.8" strokeLinecap="round" fill="none" className="filter drop-shadow-[0_0_8px_#f472b6]">
                <path d="M 60 60 Q 68 54 76 60" />
                <path d="M 104 60 Q 112 54 120 60" />
              </g>
            ) : isPeeking ? (
              /* STATE 5: Peeking Mode (One Eye Closed, One Cheeky Eye Open!) */
              <g>
                {/* Left Eye Closed Wink */}
                <path d="M 60 60 Q 68 54 76 60" stroke="#f472b6" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                {/* Right Eye Wide Open Peeking */}
                <g transform="translate(104, 50)">
                  <rect x="0" y="0" width="18" height="18" rx="9" fill="url(#buzzEyeCyan)" className="filter drop-shadow-[0_0_10px_#38bdf8]" />
                  <circle cx="7" cy="7" r="3" fill="#ffffff" />
                </g>
              </g>
            ) : (
              /* STATE 6: Dynamic Eye Tracking (Tracks Typing Left-to-Right!) */
              <g>
                {/* Left Eye */}
                <motion.g
                  animate={{
                    x: eyeX,
                    y: eyeY,
                    scaleY: isBlinking ? 0.08 : 1
                  }}
                  transition={{
                    x: { type: 'spring', damping: 18, stiffness: 220 },
                    y: { type: 'spring', damping: 18, stiffness: 220 },
                    scaleY: { duration: 0.12 }
                  }}
                  style={{ originY: '58px', originX: '68px' }}
                >
                  <rect
                    x="59"
                    y="49"
                    width="18"
                    height="18"
                    rx="9"
                    fill="url(#buzzEyeCyan)"
                    className="filter drop-shadow-[0_0_12px_#38bdf8]"
                  />
                  {/* Digital Pupil Reticle HUD */}
                  <circle cx="65" cy="55" r="2.8" fill="#ffffff" />
                  <line x1="68" y1="52" x2="68" y2="64" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
                  <line x1="62" y1="58" x2="74" y2="58" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
                </motion.g>

                {/* Right Eye */}
                <motion.g
                  animate={{
                    x: eyeX,
                    y: eyeY,
                    scaleY: isBlinking ? 0.08 : 1
                  }}
                  transition={{
                    x: { type: 'spring', damping: 18, stiffness: 220 },
                    y: { type: 'spring', damping: 18, stiffness: 220 },
                    scaleY: { duration: 0.12 }
                  }}
                  style={{ originY: '58px', originX: '112px' }}
                >
                  <rect
                    x="103"
                    y="49"
                    width="18"
                    height="18"
                    rx="9"
                    fill="url(#buzzEyeCyan)"
                    className="filter drop-shadow-[0_0_12px_#38bdf8]"
                  />
                  {/* Digital Pupil Reticle HUD */}
                  <circle cx="109" cy="55" r="2.8" fill="#ffffff" />
                  <line x1="112" y1="52" x2="112" y2="64" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
                  <line x1="106" y1="58" x2="118" y2="58" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
                </motion.g>
              </g>
            )}

            {/* ======================================================== */}
            {/* VISOR EMOTE MOUTH (EXPRESSIVE CYBER SMILE)               */}
            {/* ======================================================== */}
            {isSuccess || isTickled ? (
              /* Joyful Beaming Grin ᗜ */
              <path
                d="M 82 72 Q 90 82 98 72 Z"
                fill="#34d399"
                className="filter drop-shadow-[0_0_6px_#34d399]"
              />
            ) : hasError ? (
              /* Surprised 'o' */
              <circle cx="90" cy="74" r="3.5" fill="#f43f5e" />
            ) : isCoveringEyes ? (
              /* Shy squiggle ~ */
              <path
                d="M 83 75 Q 87 72 90 75 Q 93 78 97 75"
                stroke="#f472b6"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            ) : isPeeking ? (
              /* Cheeky Smirk */
              <path
                d="M 84 74 Q 92 78 97 72"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              /* Friendly Robot Smile ◡ */
              <path
                d="M 83 72 Q 90 78 97 72"
                stroke="#c084fc"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </motion.g>

          {/* ======================================================== */}
          {/* CAMPUSBUZZ GOLD MEDALLION / TIE (COLLEGIATE MASCOT)      */}
          {/* ======================================================== */}
          <g transform="translate(90, 102)">
            <polygon points="-8,0 8,0 0,11" fill="url(#buzzGold)" stroke="#fde047" strokeWidth="1" />
            <circle cx="0" cy="4" r="1.5" fill="#1e1838" />
          </g>

          {/* ======================================================== */}
          {/* ROBOT PAWS (RESTING ON CARD EDGE OR COVERING EYES)       */}
          {/* ======================================================== */}
          {/* Left Hand */}
          <motion.g
            animate={
              isCoveringEyes
                ? { x: 30, y: -34, rotate: 20 }   // High up covering left eye
                : isPeeking
                ? { x: 30, y: -22, rotate: 28 }   // Half-covering
                : { x: 0, y: 0, rotate: 0 }        // Resting on card edge
            }
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          >
            {/* Hand Chassis */}
            <rect
              x="42"
              y="94"
              width="24"
              height="16"
              rx="8"
              fill="#1e1838"
              stroke="#c084fc"
              strokeWidth="1.8"
              className="filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.65)]"
            />
            {/* Knuckle Sensor LED */}
            <circle cx="54" cy="102" r="2.5" fill="#38bdf8" />
          </motion.g>

          {/* Right Hand */}
          <motion.g
            animate={
              isCoveringEyes
                ? { x: -30, y: -34, rotate: -20 }  // High up covering right eye
                : isPeeking
                ? { x: -8, y: 0, rotate: 0 }       // Lowered while peeking!
                : { x: 0, y: 0, rotate: 0 }         // Resting on card edge
            }
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          >
            {/* Hand Chassis */}
            <rect
              x="114"
              y="94"
              width="24"
              height="16"
              rx="8"
              fill="#1e1838"
              stroke="#c084fc"
              strokeWidth="1.8"
              className="filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.65)]"
            />
            {/* Knuckle Sensor LED */}
            <circle cx="126" cy="102" r="2.5" fill="#38bdf8" />
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
}
