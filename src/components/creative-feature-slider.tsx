import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Zap, Target, Rocket, Shield, Crown, ChevronLeft, ChevronRight, Cpu } from 'lucide-react';

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  stats: string;
  badge: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    title: "Lightning Speed",
    subtitle: "Performance Optimized",
    description: "Experience blazing fast interactions with our ultra-optimized slider engine",
    icon: Zap,
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    stats: "99.9% Uptime",
    badge: "Ultra Fast"
  },
  {
    id: 2,
    title: "Precision Targeting",
    subtitle: "Smart Analytics",
    description: "Target your audience with surgical precision using advanced AI algorithms",
    icon: Target,
    gradient: "from-amber-400 via-orange-500 to-red-500",
    stats: "10x Better ROI",
    badge: "AI Powered"
  },
  {
    id: 3,
    title: "Rocket Launch",
    subtitle: "Scale Instantly",
    description: "Launch your projects at light speed with our automated deployment pipeline",
    icon: Rocket,
    gradient: "from-cyan-400 via-blue-500 to-indigo-600",
    stats: "0.3s Deploy",
    badge: "Auto Scale"
  },
  {
    id: 4,
    title: "Fort Knox Security",
    subtitle: "Enterprise Grade",
    description: "Military-grade security protocols protect your data with zero compromises",
    icon: Shield,
    gradient: "from-emerald-400 via-green-500 to-teal-600",
    stats: "100% Secure",
    badge: "Bulletproof"
  },
  {
    id: 5,
    title: "Crown Jewel",
    subtitle: "Premium Experience",
    description: "Luxury features that transform ordinary workflows into extraordinary experiences",
    icon: Crown,
    gradient: "from-violet-500 via-purple-600 to-indigo-700",
    stats: "Elite Tier",
    badge: "Luxury"
  }
];

function CreativeSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDE_DURATION = 4000;
  const PROGRESS_INTERVAL = 50;

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    setProgress(0);
    
    requestAnimationFrame(() => {
      setTimeout(() => setIsTransitioning(false), 300);
    });
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % slides.length);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + slides.length) % slides.length);
  }, [currentIndex, goToSlide]);

  useEffect(() => {
    if (!isAutoPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    progressRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + (100 / (SLIDE_DURATION / PROGRESS_INTERVAL));
      });
    }, PROGRESS_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isAutoPlaying, nextSlide]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying(!isAutoPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [prevSlide, nextSlide, isAutoPlaying]);

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative w-full h-[400px] sm:h-[280px] bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 shadow-float">
      {/* Background Pattern - Mobile Optimized */}
      <div className="absolute inset-0 opacity-20 sm:opacity-30">
        <div className="absolute top-10 left-10 w-40 h-40 sm:w-72 sm:h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-lg sm:blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-10 w-40 h-40 sm:w-72 sm:h-72 bg-yellow-500/20 rounded-full mix-blend-multiply filter blur-lg sm:blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/4 w-40 h-40 sm:w-72 sm:h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-lg sm:blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main Content Container - Stacked on mobile */}
      <div className="relative h-full flex flex-col sm:flex-row">
        {/* Top Content Panel on mobile, Left on desktop */}
        <div className="flex-1 p-4 sm:p-8 flex flex-col justify-between">
          {/* Header Section */}
          <div className="space-y-3 sm:space-y-4">
            {/* Badge & Stats */}
            <div className="flex items-center justify-between">
              <div className={`inline-flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-white bg-gradient-to-r ${currentSlide.gradient}`}>
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span className="truncate">{currentSlide.badge}</span>
              </div>
              <div className="text-[10px] sm:text-xs text-white/60 font-mono">
                {currentSlide.stats}
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-2 sm:space-y-3">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight animate-slide-in">
                  {currentSlide.title}
                </h3>
                <p className="text-xs sm:text-sm text-purple-300 font-semibold">
                  {currentSlide.subtitle}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-sm">
                {currentSlide.description}
              </p>
            </div>
          </div>

          {/* Bottom Section - Progress & Controls */}
          <div className="space-y-3 sm:space-y-4 mt-2 sm:mt-0">
            {/* Progress Bar */}
            <div className="space-y-1 sm:space-y-2">
              <div className="flex justify-between text-[10px] sm:text-xs text-white/60">
                <span>Progress</span>
                <button 
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="hover:text-white transition-colors"
                >
                  {isAutoPlaying ? 'Pause' : 'Play'}
                </button>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${currentSlide.gradient} transition-all duration-75 ease-linear rounded-full`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={prevSlide}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105"
                  disabled={isTransitioning}
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105"
                  disabled={isTransitioning}
                >
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </button>
              </div>

              {/* Slide Indicators - Hidden on smallest screens */}
              <div className="hidden xs:flex items-center gap-1 sm:gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-200 ${
                      index === currentIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Visual Panel on mobile, Right on desktop */}
        <div className="w-full h-48 sm:w-[40%] sm:h-full relative overflow-hidden">
          {/* Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-r ${currentSlide.gradient} opacity-20`} />
          
          {/* Geometric Shapes - Simplified on mobile */}
          <div className="absolute inset-0">
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm rotate-12 animate-float" />
            <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/5 backdrop-blur-sm animate-pulse-custom" />
            <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm animate-glow" />
          </div>

          {/* Main Icon - Centered and scaled for mobile */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl bg-gradient-to-r ${currentSlide.gradient} flex items-center justify-center shadow-glow transition-all duration-500 hover:scale-110 animate-zoom-in`}>
              <currentSlide.icon className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
            </div>
          </div>

          {/* Shimmer Effect */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
              backgroundSize: '200% 200%',
              animation: 'shimmer 3s linear infinite'
            }}
          />
        </div>
      </div>

      {/* Slide Counter - Position adjusted for mobile */}
    </div>
  );
}

export default function CreativeFeatureSlider() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden py-10 sm:py-20">
      {/* Animated Background - Simplified on mobile */}
      <div className="absolute inset-0 opacity-20 sm:opacity-30">
        <div className="absolute top-10 left-10 w-40 h-40 sm:w-72 sm:h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-lg sm:blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-10 w-40 h-40 sm:w-72 sm:h-72 bg-yellow-500/20 rounded-full mix-blend-multiply filter blur-lg sm:blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/4 w-40 h-40 sm:w-72 sm:h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-lg sm:blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Container - Padding adjusted for mobile */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Section - Text sizes adjusted for mobile */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1 sm:gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6 sm:mb-8 hover:bg-white/10 transition-colors duration-300">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 animate-pulse" />
            <span className="text-xs sm:text-base text-white/80 font-medium tracking-wide">Why You will love this</span>
          </div>

          <h1 className="text-[50px] md:text-[80px] lg:text-[90px] font-bold text-white mb-4 sm:mb-6 leading-tight">
            <span className="block">Explore The</span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent animate-gradient-x">
              Difference
            </span>
          </h1>
          
          <p className="text-sm sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Experience the perfect blend of stunning visuals, optimal performance, and compact design. 
            Built for the modern web.
          </p>
        </div>

        {/* Main Slider Container - Full width on mobile */}
        <div className="w-full max-w-7xl mx-auto mb-10 sm:mb-16">
          <CreativeSlider />
        </div>

        {/* Features Grid - 1 column on mobile */}

        {/* Technical Stats - 2 columns on mobile */}

      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(5deg); }
          66% { transform: translateY(5px) rotate(-5deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          animation: gradient-x 4s ease infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Mobile-specific adjustments */
        @media (max-width: 640px) {
          .shadow-float {
            box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
          }
          .shadow-glow {
            box-shadow: 0 0 15px rgba(168, 85, 247, 0.3);
          }
        }
      `}</style>
    </section>
  );
}
