import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useApp } from '../context/AppContext';
import ThreeCanvas from '../components/ThreeCanvas';
import InteractiveRobotMascot from '../components/InteractiveRobotMascot';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Megaphone, 
  Users2, 
  Handshake, 
  ArrowLeft,
  Loader2,
  TrendingUp,
  Zap,
  Award,
  User,
  Building,
  BookOpen,
  Radio,
  Flame,
  Globe2,
  DollarSign,
  Compass,
  Sun,
  Moon
} from 'lucide-react';

export default function LoginPage({ isModal = false, onClose }) {
  const { 
    currentUser, 
    setCurrentUser, 
    loginUser, 
    showToast, 
    triggerConfetti, 
    setCurrentView,
    setIsAuthOpen,
    theme,
    toggleTheme
  } = useApp();

  const [roleMode, setRoleMode] = useState('student'); // 'student' | 'admin'
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form Fields
  const [email, setEmail] = useState('aanya@campus.edu');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('');
  const [collegeName, setCollegeName] = useState('Delhi University');
  const [department, setDepartment] = useState('Media Studies');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);

  const currentTextLength = 
    focusedField === 'email' ? email.length :
    focusedField === 'password' ? password.length :
    focusedField === 'fullName' ? fullName.length :
    focusedField === 'collegeName' ? collegeName.length :
    focusedField === 'department' ? department.length : 0;

  // Mouse Parallax & Glow Tracking
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 500);
  const springConfig = { damping: 25, stiffness: 120 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX);
    mouseY.set(clientY);
  };

  // Rotating words ticker on left side
  const rotatingWords = ['Connect', 'Create', 'Collaborate', 'Grow', 'Monetize'];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Live Live Activity Feed Stream (simulated real-time campus activity)
  const liveActivities = [
    { id: 1, icon: Flame, text: "Shivani Negi hit 184K followers on CampusBuzz", time: "just now", badge: "Trending Star" },
    { id: 2, icon: DollarSign, text: "Red Bull sponsored ₹45,000 for Campus Fest", time: "2m ago", badge: "Brand Deal" },
    { id: 3, icon: Handshake, text: "Aanya Sharma & Arjun Mehta started Collab Shoot", time: "5m ago", badge: "Collab Active" },
    { id: 4, icon: Calendar, text: "HackCampus 2026 reached 850 RSVPs", time: "8m ago", badge: "Event Full" }
  ];
  const [activityIndex, setActivityIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % liveActivities.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  // Update default demo credentials when switching role
  const handleRoleSwitch = (role) => {
    setRoleMode(role);
    setErrorMessage('');
    if (role === 'admin') {
      setEmail('admin@campusbuzz.com');
      setPassword('adminpassword');
    } else {
      setEmail('aanya@campus.edu');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (isSignUp) {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: fullName || 'New Creator',
            email,
            username: email.split('@')[0] || `creator_${Date.now()}`,
            password,
            college_name: collegeName,
            department_name: department
          })
        });

        const data = await res.json();
        if (data.success && data.user) {
          loginUser(data.user);
          triggerConfetti();
          if (onClose) onClose();
          setCurrentView('dashboard');
        } else {
          setErrorMessage(data.message || 'Registration failed. Please try again.');
        }
      } else {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role: roleMode })
        });

        const data = await res.json();
        if (data.success && data.user) {
          loginUser(data.user);
          triggerConfetti();
          if (onClose) onClose();
          showToast('Welcome to CampusBuzz! Scroll down to explore campus and enter your dashboard.', 'success');
          setCurrentView('landing');
        } else {
          if (roleMode === 'admin' && (email === 'admin@campusbuzz.com' || password === 'adminpassword')) {
            loginUser({
              id: 2,
              student_id: 'CB-ADMIN-001',
              name: "Admin Karan",
              email: "admin@campusbuzz.com",
              role: "admin",
              college: "CampusBuzz Central HQ",
              department: "Network Operations",
              avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80"
            });
            triggerConfetti();
            if (onClose) onClose();
            showToast('Welcome Admin! Scroll down to explore campus and enter your dashboard.', 'success');
            setCurrentView('landing');
          } else if (email === 'aanya@campus.edu' || password === 'password123') {
            loginUser({
              id: 1,
              student_id: 'CB-2026-00001',
              name: "Aanya Sharma",
              email: "aanya@campus.edu",
              role: "creator",
              college: "Delhi University",
              department: "Media & Journalism",
              followers_count: 128400,
              avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80"
            });
            triggerConfetti();
            if (onClose) onClose();
            showToast('Welcome back Aanya! Scroll down to explore campus and enter your dashboard.', 'success');
            setCurrentView('landing');
          } else {
            setErrorMessage(data.message || 'Invalid email or password. Please check your credentials.');
          }
        }
      }
    } catch (err) {
      if (roleMode === 'admin') {
        loginUser({
          id: 2,
          student_id: 'CB-ADMIN-001',
          name: "Admin Karan",
          email: "admin@campusbuzz.com",
          role: "admin",
          college: "CampusBuzz Central HQ",
          department: "Network Operations",
          avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80"
        });
      } else {
        loginUser({
          id: 1,
          student_id: 'CB-2026-00001',
          name: "Aanya Sharma",
          email: "aanya@campus.edu",
          role: "creator",
          college: "Delhi University",
          department: "Media & Journalism",
          followers_count: 128400,
          avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80"
        });
      }
      triggerConfetti();
      if (onClose) onClose();
      showToast('Welcome to CampusBuzz! Scroll down to explore campus and enter your dashboard.', 'success');
      setCurrentView('landing');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoClick = (role) => {
    handleRoleSwitch(role);
    triggerConfetti();
    showToast(`Autofilled ${role === 'admin' ? 'Admin Karan' : 'Aanya Sharma'} credentials. Click "Sign In"!`, 'info');
  };

  const handleSocialClick = (platform) => {
    showToast(`${platform} authentication simulated! Loading verified creator profile...`, 'info');
    setTimeout(() => {
      loginUser({
        id: 5,
        student_id: 'CB-2026-00005',
        name: "Shivani Negi",
        email: `shivani.${platform.toLowerCase()}@campus.edu`,
        role: "creator",
        college: "Shoolini University",
        department: "Biotechnology & Design",
        followers_count: 184500,
        avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80"
      });
      triggerConfetti();
      if (onClose) onClose();
      setCurrentView('dashboard');
    }, 500);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setCurrentView('dashboard');
    }
    setIsAuthOpen(false);
  };

  const featureCards = [
    {
      icon: Calendar,
      title: 'Events',
      badge: '20+ Active',
      desc: 'Hackathons, tech fests & campus DJ nights',
      accent: 'from-cyan-500/20 to-blue-500/10',
      border: 'hover:border-cyan-400/50',
      iconColor: 'text-cyan-400',
      glow: 'group-hover:shadow-[0_0_25px_rgba(6,182,212,0.35)]'
    },
    {
      icon: Megaphone,
      title: 'Campaigns',
      badge: '₹50K+ Pool',
      desc: 'Sponsored brand activations & creator grants',
      accent: 'from-amber-500/20 to-orange-500/10',
      border: 'hover:border-amber-400/50',
      iconColor: 'text-amber-400',
      glow: 'group-hover:shadow-[0_0_25px_rgba(245,158,11,0.35)]'
    },
    {
      icon: Users2,
      title: 'Creators',
      badge: '10.2K Strong',
      desc: 'Connect with collegiate stars & micro-influencers',
      accent: 'from-purple-500/20 to-pink-500/10',
      border: 'hover:border-purple-400/50',
      iconColor: 'text-purple-400',
      glow: 'group-hover:shadow-[0_0_25px_rgba(168,85,247,0.35)]'
    },
    {
      icon: Handshake,
      title: 'Collaborations',
      badge: 'Real-time',
      desc: 'Cross-campus podcasting, shoots & projects',
      accent: 'from-emerald-500/20 to-teal-500/10',
      border: 'hover:border-emerald-400/50',
      iconColor: 'text-emerald-400',
      glow: 'group-hover:shadow-[0_0_25px_rgba(16,185,129,0.35)]'
    }
  ];

  return (
    <div 
      onMouseMove={handleMouseMove}
      className={`w-full min-h-screen bg-[#06070B] text-white flex flex-col justify-center relative overflow-hidden select-none ${isModal ? 'p-0 sm:p-4' : ''}`}
    >
      
      {/* 3D Interactive Three.js Background Canvas */}
      <ThreeCanvas className="opacity-60" />

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40 z-0" />

      {/* 1. DYNAMIC MOUSE-FOLLOWING SPOTLIGHT AURA */}
      <motion.div
        className="pointer-events-none fixed -inset-px z-0 opacity-40 transition-opacity duration-300 hidden md:block"
        style={{
          background: useTransform(
            [smoothMouseX, smoothMouseY],
            ([x, y]) => `radial-gradient(650px circle at ${x}px ${y}px, rgba(168, 85, 247, 0.16), transparent 80%)`
          )
        }}
      />

      {/* 2. BACKGROUND ANIMATED ATMOSPHERE & AURORA LIGHT MESH */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Pulsing Light Blob 1 (Purple) */}
        <motion.div
          animate={{
            scale: [1, 1.35, 1],
            x: [0, 60, 0],
            y: [0, -45, 0],
            opacity: [0.35, 0.6, 0.35]
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[500px] lg:w-[700px] h-[500px] lg:h-[700px] bg-gradient-to-tr from-purple-800/40 via-purple-600/30 to-violet-900/10 rounded-full blur-[140px]"
        />

        {/* Pulsing Light Blob 2 (Violet / Indigo) */}
        <motion.div
          animate={{
            scale: [1.2, 0.9, 1.2],
            x: [0, -70, 0],
            y: [0, 50, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 w-[500px] lg:w-[750px] h-[500px] lg:h-[750px] bg-gradient-to-br from-indigo-700/35 via-violet-600/30 to-fuchsia-800/20 rounded-full blur-[150px]"
        />

        {/* Pulsing Light Blob 3 (Cyan / Pink Aurora Accent) */}
        <motion.div
          animate={{
            scale: [0.85, 1.25, 0.85],
            opacity: [0.15, 0.32, 0.15],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-cyan-500/20 rounded-full blur-[110px]"
        />

        {/* Flowing Animated SVG Sine Waves in Background */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07] stroke-purple-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M -100 250 C 300 100, 700 400, 1200 200 C 1700 0, 2100 350, 2500 200"
            fill="none"
            strokeWidth="2"
            animate={{
              d: [
                "M -100 250 C 300 100, 700 400, 1200 200 C 1700 0, 2100 350, 2500 200",
                "M -100 200 C 300 350, 700 150, 1200 300 C 1700 150, 2100 200, 2500 250",
                "M -100 250 C 300 100, 700 400, 1200 200 C 1700 0, 2100 350, 2500 200"
              ]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M -100 500 C 400 350, 800 650, 1300 450 C 1800 250, 2200 600, 2600 450"
            fill="none"
            strokeWidth="1.5"
            strokeDasharray="8 8"
            animate={{
              d: [
                "M -100 500 C 400 350, 800 650, 1300 450 C 1800 250, 2200 600, 2600 450",
                "M -100 450 C 400 600, 800 350, 1300 550 C 1800 350, 2200 450, 2600 500",
                "M -100 500 C 400 350, 800 650, 1300 450 C 1800 250, 2200 600, 2600 450"
              ]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>

        {/* Ambient Subtle Cyber Grid Texture */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '44px 44px'
          }}
        />

        {/* 22 Dynamic Floating & Shimmering Starlight Particles */}
        {[...Array(22)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${(i * 4.6 + 2) % 98}vw`,
              y: `${(i * 8.3 + 5) % 94}vh`,
              opacity: 0.15 + (i % 5) * 0.15,
              scale: 0.6 + (i % 4) * 0.4
            }}
            animate={{
              y: [
                `${(i * 8.3 + 5) % 94}vh`, 
                `${((i * 8.3 + 5) % 94) - 24}vh`
              ],
              x: [
                `${(i * 4.6 + 2) % 98}vw`,
                `${((i * 4.6 + 2) % 98) + (i % 2 === 0 ? 3 : -3)}vw`
              ],
              opacity: [0.15, 0.85, 0.15],
              scale: [0.7, 1.3, 0.7]
            }}
            transition={{
              duration: 7 + (i % 6) * 1.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i * 0.3)
            }}
            className={`absolute rounded-full shadow-lg ${
              i % 4 === 0 
                ? 'w-2 h-2 bg-pink-400 shadow-[0_0_12px_#f472b6]' 
                : i % 3 === 0 
                  ? 'w-1.5 h-1.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee]' 
                  : 'w-1.5 h-1.5 bg-purple-400 shadow-[0_0_10px_#c084fc]'
            }`}
          />
        ))}
      </div>

      {/* 3. TOP FLOATING ACTION BAR (Back button & Campus Network Status) */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 z-30 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setCurrentView('landing');
            showToast('Exploring CampusBuzz! Scroll down to explore and enter your dashboard.', 'info');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-900/60 to-pink-900/50 hover:from-purple-800/80 hover:to-pink-800/70 border border-purple-500/40 hover:border-purple-400 text-xs text-purple-200 hover:text-white transition-all cursor-pointer backdrop-blur-md shadow-[0_4px_20px_rgba(168,85,247,0.35)] group"
        >
          <Compass className="w-4 h-4 text-purple-400 group-hover:rotate-45 transition-transform" />
          <span className="font-bold tracking-wide">Explore Campus →</span>
        </motion.button>

        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-full bg-purple-950/70 border border-purple-500/40 text-purple-200 hover:text-white transition cursor-pointer backdrop-blur-md shadow-sm"
            title={theme === 'dark' ? "Switch to Light Mode ☀️" : "Switch to Dark Mode 🌙"}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
            )}
          </button>

          <motion.div 
            animate={{ boxShadow: ['0 0 0 rgba(52, 211, 153, 0)', '0 0 16px rgba(52, 211, 153, 0.4)', '0 0 0 rgba(52, 211, 153, 0)'] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="text-[11px] font-mono text-purple-200 bg-purple-950/70 border border-purple-500/40 px-3 py-1 rounded-full flex items-center gap-2 shadow-sm backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="hidden sm:inline">10,200 Creators Live</span>
            <span className="sm:hidden">10.2K Live</span>
          </motion.div>
        </div>
      </div>

      {/* 4. MAIN SPLIT-SCREEN CONTAINER */}
      <div className="relative z-10 w-full max-w-7xl mx-auto min-h-screen lg:min-h-[720px] flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 lg:px-8 py-14 lg:py-10">
        
        {/* ========================================================= */}
        {/* LEFT SIDE (55% on Desktop): Animated Campus Experience     */}
        {/* ========================================================= */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-[55%] flex flex-col justify-center py-6 lg:py-8 lg:pr-12 xl:pr-16"
        >
          {/* ========================================================= */}
          {/* CAMPUSBUZZ ORIGINAL BRAND LOGO (BORDERLESS & CLEAN)       */}
          {/* ========================================================= */}
          <div 
            className="mb-6 cursor-pointer group w-fit select-none" 
            onClick={() => setCurrentView('landing')}
            title="Click to explore CampusBuzz"
          >
            <div className="relative inline-block">
              {/* Soft Ambient Luminous Halo (No rectangular border/box) */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/35 via-pink-600/25 to-indigo-600/30 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Original CampusBuzz Official Logo with Dynamic Theme Switching */}
              <motion.img 
                whileHover={{ scale: 1.04, y: -2 }}
                transition={{ duration: 0.3 }}
                src={theme === 'light' ? "/campusbuzz-logo-light.png" : "/campusbuzz-logo-dark.png"}
                alt="CampusBuzz Logo"
                className="relative h-14 sm:h-18 lg:h-22 w-auto object-contain drop-shadow-[0_4px_25px_rgba(168,85,247,0.45)]"
              />
            </div>

            {/* Sub-badge strip below logo */}
            <div className="flex items-center gap-2.5 mt-2 ml-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                Official Platform V2.4
              </span>
              <span className="text-[11px] font-mono text-slate-400 tracking-wider uppercase font-semibold">
                Student Community & Creator HQ
              </span>
            </div>
          </div>

          {/* Large Headline with Animated Shimmer Gradient */}
          <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black font-display tracking-tight text-white leading-[1.12]">
            Your Campus{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 animate-pulse">
              Creator Hub
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-xl font-normal leading-relaxed">
            One unified platform for student influencers, fests, paid campaigns, and peer collaborations across top universities.
          </p>

          {/* Dynamic Rotating Words Ticker with Glow */}
          <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300">
            <span className="text-slate-400">Empowering collegiate creators to:</span>
            <div className="h-8 overflow-hidden relative inline-flex items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -18, filter: "blur(4px)" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600/35 via-pink-600/35 to-indigo-600/35 border border-purple-500/50 text-purple-100 font-extrabold font-mono tracking-wide shadow-[0_0_20px_rgba(168,85,247,0.45)]"
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* ========================================================= */}
          {/* INTERACTIVE ANIMATED CREATOR ECOSYSTEM STAGE (Centerpiece) */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.65 }}
            className="mt-6 p-5 sm:p-6 rounded-3xl glass-panel border border-purple-500/25 bg-gradient-to-br from-purple-950/40 via-[#101222]/80 to-slate-900/60 relative overflow-hidden hidden sm:block shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
          >
            {/* Background Animated Concentric Pulsing Radar Rings */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none opacity-25">
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full border border-purple-500/40"
              />
              <motion.div 
                animate={{ scale: [1.2, 1.6, 1.2], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute inset-4 rounded-full border border-pink-500/30"
              />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 rounded-full border border-dashed border-cyan-400/30"
              />
            </div>

            {/* Header with Live Broadcast Beacon */}
            <div className="flex items-center justify-between gap-3 mb-3.5 relative z-10">
              <div className="flex items-center gap-2 shrink-0">
                <span className="p-1 rounded-md bg-purple-500/20 border border-purple-500/30 shrink-0">
                  <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                </span>
                <span className="text-xs font-bold text-white tracking-wide whitespace-nowrap">Collegiate Creator Network</span>
              </div>
              
              {/* Dynamic Live Activity Pill (Responsive & No Overlap) */}
              <div className="h-6 relative shrink-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activityIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] text-emerald-300 font-mono shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    <span className="whitespace-nowrap font-semibold">{liveActivities[activityIndex].badge}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Student Creator Avatars with Floating Badges & Connecting Beams */}
            <div className="flex items-center justify-between relative z-10 pt-1">
              <div className="flex items-center -space-x-3.5">
                
                {/* Avatar 1: Aanya */}
                <motion.div 
                  whileHover={{ scale: 1.2, zIndex: 30 }}
                  className="relative group cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt="Aanya Sharma"
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-500 shadow-lg"
                  />
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#08090D]" />
                </motion.div>

                {/* Avatar 2: Shivani */}
                <motion.div 
                  whileHover={{ scale: 1.2, zIndex: 30 }}
                  className="relative group cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                    alt="Shivani Negi"
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-pink-500 shadow-lg"
                  />
                  <span className="absolute -bottom-1 -right-1 text-[8px] bg-pink-600 font-mono px-1 rounded-full">#1</span>
                </motion.div>

                {/* Avatar 3: Arjun */}
                <motion.div 
                  whileHover={{ scale: 1.2, zIndex: 30 }}
                  className="relative group cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                    alt="Arjun Mehta"
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-cyan-500 shadow-lg"
                  />
                </motion.div>

                {/* Avatar 4: Riya */}
                <motion.div 
                  whileHover={{ scale: 1.2, zIndex: 30 }}
                  className="relative group cursor-pointer"
                >
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
                    alt="Riya Patel"
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-500 shadow-lg"
                  />
                </motion.div>

                {/* 10K+ Count Pill with Glowing Border */}
                <motion.div 
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-700 via-indigo-600 to-pink-600 ring-2 ring-purple-300 flex items-center justify-center text-xs font-black text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] z-20"
                >
                  +10K
                </motion.div>
              </div>

              {/* Live Metric Snippets with Shimmer */}
              <div className="text-right">
                <div className="text-xs font-extrabold text-white flex items-center justify-end gap-1.5 text-purple-200">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                  <span>588.6K Total Reach</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">₹4.8L Active Creator Payouts</p>
              </div>
            </div>

            {/* Rotating Live Ticker Feed Bottom Text */}
            <div className="mt-3.5 pt-2.5 border-t border-white/[0.08] flex items-center justify-between gap-3 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate text-slate-200">{liveActivities[activityIndex].text}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 shrink-0 whitespace-nowrap">{liveActivities[activityIndex].time}</span>
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* 4 ANIMATED INTERACTIVE FEATURE CARDS (2x2 Grid)           */}
          {/* ========================================================= */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featureCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + idx * 0.08, duration: 0.5 }}
                  whileHover={{ y: -5, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3.5 rounded-2xl glass-card-interactive bg-gradient-to-br ${card.accent} border border-white/[0.09] ${card.border} ${card.glow} transition-all duration-300 relative group overflow-hidden cursor-pointer`}
                >
                  {/* Subtle Light Beam Sweep passing across card */}
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 6 + idx * 1.5, repeat: Infinity, ease: "linear", delay: idx * 1.2 }}
                    className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent skew-x-12 pointer-events-none"
                  />

                  <div className="flex items-center justify-between mb-1.5 relative z-10">
                    <div className="flex items-center gap-2">
                      <motion.div 
                        whileHover={{ rotate: 15, scale: 1.15 }}
                        className="p-1.5 rounded-xl bg-white/[0.08] group-hover:bg-white/[0.16] transition shadow-inner"
                      >
                        <Icon className={`w-4 h-4 ${card.iconColor}`} />
                      </motion.div>
                      <h4 className="text-xs font-bold text-white group-hover:text-purple-200 transition-colors">{card.title}</h4>
                    </div>
                    <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/[0.08] text-slate-200 border border-white/[0.1] shadow-sm">
                      {card.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-normal leading-relaxed relative z-10">
                    {card.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </motion.div>

        {/* ========================================================= */}
        {/* RIGHT SIDE (45% on Desktop): Glassmorphism Login Card       */}
        {/* ========================================================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="w-full lg:w-[45%] flex justify-center py-6 lg:py-8 pt-12 lg:pt-14"
        >
          {/* Card Outer with Animated Glowing Gradient Border Beam */}
          <div className="relative w-full max-w-md p-[1px] rounded-3xl bg-gradient-to-b from-purple-500/40 via-purple-500/10 to-indigo-500/30 shadow-[0_25px_80px_rgba(0,0,0,0.85)] group mt-20 sm:mt-24">
            
            {/* Robot Mascot Sitting on Top of the Card with Dynamic Eye Tracking & Speech Bubble */}
            <div className="absolute -top-24 sm:-top-26 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
              <InteractiveRobotMascot
                focusedField={focusedField}
                textLength={currentTextLength}
                inputValue={focusedField === 'email' ? email : (focusedField === 'password' ? password : (focusedField === 'fullName' ? fullName : ''))}
                showPassword={showPassword}
                isLoading={loading}
                isSuccess={isLoginSuccess}
                hasError={!!errorMessage}
              />
            </div>

            {/* Animated Rotating Gradient Glow Halo */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-600/30 via-pink-600/20 to-cyan-600/30 blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            />

            {/* Inner Glassmorphism Card */}
            <div className="relative w-full glass-panel bg-[#0c0e1a]/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 overflow-hidden z-10 border border-purple-500/20 pt-7">
              
              {/* Top Accent Gradient Flare */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

              {/* Card Heading with Wave Animation */}
              <div className="text-center mb-5">
                <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight flex items-center justify-center gap-1.5">
                  <span>{isSignUp ? 'Join CampusBuzz' : 'Welcome Back'}</span>
                  <motion.span 
                    animate={{ rotate: [0, 20, -10, 20, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block origin-bottom-right"
                  >
                    👋
                  </motion.span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isSignUp 
                    ? 'Create your student creator account today' 
                    : (roleMode === 'admin' 
                        ? 'Log in to CampusBuzz Administrator Governance' 
                        : 'Log in to your CampusBuzz student creator account'
                      )}
                </p>
              </div>

              {/* Role Toggle Tabs with Animated Sliding Pill */}
              {!isSignUp && (
                <div className="relative grid grid-cols-2 p-1 rounded-2xl bg-[#131525] border border-white/10 mb-5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('student')}
                    className={`relative z-10 py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                      roleMode === 'student' ? 'text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                    <span>Student Login</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('admin')}
                    className={`relative z-10 py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                      roleMode === 'admin' ? 'text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Admin Login</span>
                  </button>

                  {/* Smooth Animated Sliding Indicator Pill */}
                  <motion.div
                    layoutId="loginRoleTabPill"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    className={`absolute inset-y-1 rounded-xl bg-gradient-to-r from-purple-600 via-[#9333EA] to-indigo-600 shadow-[0_2px_15px_rgba(147,51,234,0.5)] ${
                      roleMode === 'student' ? 'left-1 w-[calc(50%-4px)]' : 'left-[calc(50%+2px)] w-[calc(50%-4px)]'
                    }`}
                  />
                </div>
              )}

              {/* Error Message Alert */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs mb-4 flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {/* Authentication Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* Extra fields if Signing Up */}
                {isSignUp && (
                  <>
                    <div>
                      <label className="text-[11px] font-mono uppercase text-slate-300 block mb-1">Full Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          onFocus={() => setFocusedField('fullName')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="e.g. Tanya Verma"
                          className="w-full bg-[#111322] border border-white/10 hover:border-purple-500/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 transition focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] font-mono uppercase text-slate-300 block mb-1">College</label>
                        <div className="relative">
                          <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={collegeName}
                            onChange={(e) => setCollegeName(e.target.value)}
                            onFocus={() => setFocusedField('collegeName')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="University"
                            className="w-full bg-[#111322] border border-white/10 hover:border-purple-500/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 rounded-xl pl-8 pr-2 py-2 text-xs text-white placeholder-slate-500 transition focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase text-slate-300 block mb-1">Department</label>
                        <div className="relative">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            onFocus={() => setFocusedField('department')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="e.g. Media"
                            className="w-full bg-[#111322] border border-white/10 hover:border-purple-500/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 rounded-xl pl-8 pr-2 py-2 text-xs text-white placeholder-slate-500 transition focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* University Email Input */}
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-300 block mb-1">
                    {roleMode === 'admin' ? 'Administrator Email' : 'University Email or Username'}
                  </label>
                  <div className="relative group/input">
                    <Mail className="w-4 h-4 text-slate-400 group-focus-within/input:text-purple-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder={roleMode === 'admin' ? 'admin@campusbuzz.com' : 'name@university.edu'}
                      className="w-full bg-[#111322] border border-white/10 hover:border-purple-500/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 transition-all focus:outline-none shadow-inner"
                    />
                  </div>
                </div>

                {/* Password Input with Show/Hide Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-mono uppercase text-slate-300">Password</label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => showToast('Enter your registered college email to reset password link', 'info')}
                        className="text-[11px] text-purple-400 hover:text-purple-300 transition hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative group/input">
                    <Lock className="w-4 h-4 text-slate-400 group-focus-within/input:text-purple-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#111322] border border-white/10 hover:border-purple-500/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 transition-all focus:outline-none shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition cursor-pointer p-0.5"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-purple-400" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                {!isSignUp && (
                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 transition cursor-pointer"
                      />
                      <span className="group-hover:text-white transition">Remember me on this campus device</span>
                    </label>
                  </div>
                )}

                {/* Large Animated Gradient Login Button with Moving Shimmer Wave */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-[#9333EA] to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wide shadow-[0_4px_30px_rgba(147,51,234,0.55)] hover:shadow-[0_4px_40px_rgba(147,51,234,0.75)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-2 overflow-hidden group/btn"
                >
                  {/* Subtle Shimmer Line Passing Across Button */}
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                  />

                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10 font-bold">
                        {isSignUp 
                          ? 'Create CampusBuzz Account' 
                          : `Log In to ${roleMode === 'admin' ? 'Admin Governance' : 'Campus Creator Hub'}`
                        }
                      </span>
                      <ArrowRight className="w-4 h-4 text-purple-200 group-hover/btn:translate-x-1 transition-transform relative z-10" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Dedicated Explore Campus Option */}
              <div className="mt-3.5 pt-3.5 border-t border-white/[0.08]">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => {
                    setCurrentView('landing');
                    showToast('Exploring Campus! Scroll down to explore and enter your dashboard.', 'info');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-900/50 via-indigo-900/50 to-pink-900/50 hover:from-purple-800/70 hover:to-pink-800/70 border border-purple-500/40 hover:border-purple-400 text-purple-200 hover:text-white text-xs font-bold tracking-wide transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Compass className="w-4 h-4 text-purple-400" />
                  <span>Explore Campus First (Scroll & Enter Dashboard) →</span>
                </motion.button>
              </div>

              {/* Quick Demo 1-Click Fast Access */}
              <div className="mt-4 pt-3.5 border-t border-white/[0.08]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400">⚡ Instant Demo 1-Click Access:</span>
                  <span className="text-[9px] font-mono text-purple-400">Auto-filled</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => handleQuickDemoClick('student')}
                    className="py-2 px-2.5 rounded-xl bg-purple-600/15 hover:bg-purple-600/30 border border-purple-500/35 hover:border-purple-400/60 text-[11px] font-semibold text-purple-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                    <span>Student Demo</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => handleQuickDemoClick('admin')}
                    className="py-2 px-2.5 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/30 border border-indigo-500/35 hover:border-indigo-400/60 text-[11px] font-semibold text-indigo-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Admin Demo</span>
                  </motion.button>
                </div>
              </div>

              {/* Social Logins */}
              <div className="mt-4 pt-3.5 border-t border-white/[0.08]">
                <p className="text-[10px] text-center text-slate-400 uppercase font-mono tracking-wider mb-2.5">
                  Or continue with
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.04, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => handleSocialClick('Google')}
                    className="py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-purple-500/40 text-xs text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Log in with Google"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                    </svg>
                    <span className="text-[11px] font-medium">Google</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.04, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => handleSocialClick('GitHub')}
                    className="py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-purple-500/40 text-xs text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Log in with GitHub"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <span className="text-[11px] font-medium">GitHub</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.04, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => handleSocialClick('LinkedIn')}
                    className="py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-purple-500/40 text-xs text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Log in with LinkedIn"
                  >
                    <svg className="w-3.5 h-3.5 fill-[#0A66C2]" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    <span className="text-[11px] font-medium">LinkedIn</span>
                  </motion.button>
                </div>
              </div>

              {/* Toggle between Login and Signup */}
              <div className="mt-4 text-center text-xs text-slate-400">
                {isSignUp ? (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setIsSignUp(false); setErrorMessage(''); }}
                      className="text-purple-400 hover:text-purple-300 font-bold transition hover:underline cursor-pointer"
                    >
                      Log In
                    </button>
                  </p>
                ) : (
                  <p>
                    New to CampusBuzz?{' '}
                    <button
                      type="button"
                      onClick={() => { setIsSignUp(true); setErrorMessage(''); }}
                      className="text-purple-400 hover:text-purple-300 font-bold transition hover:underline cursor-pointer"
                    >
                      Sign Up as Creator
                    </button>
                  </p>
                )}
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
