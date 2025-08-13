import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Target, Rocket, Shield, Crown, ChevronLeft, ChevronRight } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Learning Paths",
    description: "Personalized curriculum that adapts to your learning style and pace with intelligent recommendations",
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    color: "#8b5cf6",
    highlight: "Smart & Adaptive",
    stats: "10K+ paths created"
  },
  {
    icon: Zap,
    title: "Lightning-Fast Progress",
    description: "Accelerated learning with micro-lessons and instant feedback loops that maximize retention",
    gradient: "from-amber-400 via-orange-500 to-red-500",
    color: "#f59e0b",
    highlight: "2x Faster Results",
    stats: "Average 4 weeks"
  },
  {
    icon: Target,
    title: "Industry-Focused Content",
    description: "Real-world projects and skills that employers actually want, updated monthly",
    gradient: "from-cyan-400 via-blue-500 to-indigo-600",
    color: "#06b6d4",
    highlight: "Job-Ready Skills",
    stats: "500+ companies"
  },
  {
    icon: Rocket,
    title: "Career Launch Support",
    description: "Dedicated mentorship and job placement assistance with industry professionals",
    gradient: "from-emerald-400 via-green-500 to-teal-600",
    color: "#10b981",
    highlight: "95% Job Placement",
    stats: "Within 6 months"
  },
  {
    icon: Shield,
    title: "Lifetime Access",
    description: "Keep learning forever with continuous content updates and new course additions",
    gradient: "from-red-400 via-rose-500 to-pink-600",
    color: "#ef4444",
    highlight: "Never Expires",
    stats: "Updates weekly"
  },
  {
    icon: Crown,
    title: "Elite Community",
    description: "Connect with top professionals and industry leaders in our exclusive network",
    gradient: "from-violet-500 via-purple-600 to-indigo-700",
    color: "#7c3aed",
    highlight: "Premium Network",
    stats: "50K+ members"
  }
];

export default function CreativeFeatureSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % features.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
    setProgress(0);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + 0.5; // Slower increment for smoother animation
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleFeatureClick = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 3000); // Resume auto-play after 3 seconds
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden py-20">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-80 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8 hover:bg-white/10 transition-colors duration-300">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="text-white/80 font-medium tracking-wide">Discover What Makes Us Different</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            <span className="block">Experience</span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent animate-gradient-x">
              Excellence
            </span>
          </h1>
          
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Discover the features that set us apart and transform your learning journey into something extraordinary
          </p>
        </div>

        {/* Main Slider Container */}
        <div className="relative max-w-7xl mx-auto">
          
          {/* Main Feature Display */}
          <div className="relative mb-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Feature Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div 
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${features[activeIndex].gradient} flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300`}
                    >
                      {React.createElement(features[activeIndex].icon, { 
                        className: "w-8 h-8 text-white" 
                      })}
                    </div>
                    <div>
                      <span 
                        className={`inline-block px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${features[activeIndex].gradient} text-white shadow-lg`}
                      >
                        {features[activeIndex].highlight}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                      {features[activeIndex].title}
                    </h2>
                    <p className="text-xl text-white/70 leading-relaxed max-w-lg">
                      {features[activeIndex].description}
                    </p>
                    <div className="flex items-center gap-2 text-white/50">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-sm font-medium">{features[activeIndex].stats}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Auto-advancing in</span>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {isPlaying ? 'Pause' : 'Play'}
                    </button>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${features[activeIndex].gradient} transition-all duration-75 ease-linear rounded-full`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Visual Display */}
              <div className="relative">
                <div className="relative w-full h-96 rounded-3xl overflow-hidden">
                  {/* Background Pattern */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${features[activeIndex].gradient} opacity-20`}
                  ></div>
                  
                  {/* Geometric Shapes */}
                  <div className="absolute inset-0">
                    <div 
                      className="absolute top-8 right-8 w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm transform rotate-12 animate-pulse"
                      style={{ animationDelay: '0s' }}
                    ></div>
                    <div 
                      className="absolute bottom-12 left-12 w-32 h-32 rounded-full bg-white/5 backdrop-blur-sm animate-pulse"
                      style={{ animationDelay: '1s' }}
                    ></div>
                    <div 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-3xl bg-white/10 backdrop-blur-sm animate-pulse"
                      style={{ animationDelay: '2s' }}
                    ></div>
                  </div>

                  {/* Central Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className={`w-32 h-32 rounded-3xl bg-gradient-to-r ${features[activeIndex].gradient} flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-500`}
                    >
                      {React.createElement(features[activeIndex].icon, { 
                        className: "w-16 h-16 text-white animate-bounce" 
                      })}
                    </div>
                  </div>

                  {/* Glow Effect */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-r ${features[activeIndex].gradient} opacity-30 blur-3xl`}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
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
      `}</style>
    </section>
  );
}
