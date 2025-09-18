import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import gsap from 'gsap';
import { Sparkles, Target, Rocket, Shield, Cpu, Brain, Users, Zap, BookOpen, Globe } from 'lucide-react';

// Custom hook for responsive dimensions
const useResponsiveDimensions = () => {
  const [dimensions, setDimensions] = useState({ width: 500, height: 400, cardDistance: 60, verticalDistance: 70 });

  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      
      if (screenWidth < 380) {
        setDimensions({ width: 280, height: 220, cardDistance: 35, verticalDistance: 40 });
      } else if (screenWidth < 480) {
        setDimensions({ width: 320, height: 260, cardDistance: 40, verticalDistance: 50 });
      } else if (screenWidth < 640) {
        setDimensions({ width: 380, height: 300, cardDistance: 50, verticalDistance: 60 });
      } else if (screenWidth < 768) {
        setDimensions({ width: 450, height: 360, cardDistance: 55, verticalDistance: 65 });
      } else {
        setDimensions({ width: 500, height: 400, cardDistance: 60, verticalDistance: 70 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return dimensions;
};

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 rounded-xl border border-white/20 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] shadow-2xl backdrop-blur-sm 
    hover:shadow-purple-500/25 transition-shadow duration-300 ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  />
));
Card.displayName = 'Card';

type CardRef = RefObject<HTMLDivElement>;
interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  children
}) => {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        };

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const refs = useMemo<CardRef[]>(() => childArr.map(() => React.createRef<HTMLDivElement>()), [childArr.length]);

  const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>();
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => placeNow(r.current!, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current!;
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current!;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    swap();
    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current!;
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      return () => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        clearInterval(intervalRef.current);
      };
    }
    return () => clearInterval(intervalRef.current);
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: e => {
            child.props.onClick?.(e as React.MouseEvent<HTMLDivElement>);
            onCardClick?.(i);
          }
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child
  );

  return (
    <div
      ref={container}
      className="absolute bottom-0 right-0 transform translate-x-[5%] translate-y-[20%] origin-bottom-right perspective-[900px] overflow-visible 
      max-md:relative max-md:left-1/2 max-md:-translate-x-1/2 max-md:translate-y-0 max-md:scale-[0.8]
      max-sm:scale-[0.65] max-[480px]:scale-[0.5] max-[380px]:scale-[0.4]"
      style={{ 
        width: typeof window !== 'undefined' && window.innerWidth < 768 ? Math.min(400, window.innerWidth * 0.8) : width, 
        height: typeof window !== 'undefined' && window.innerWidth < 768 ? Math.min(320, window.innerHeight * 0.4) : height 
      }}
    >
      {rendered}
    </div>
  );
};

export default function CreativeFeatureSlider() {
  const responsiveDimensions = useResponsiveDimensions();
  
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden py-10 sm:py-20 landscape-mobile">
      {/* Animated Background - Mobile Optimized */}
      <div className="absolute inset-0 opacity-20 sm:opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 sm:w-72 sm:h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse retina-optimized"></div>
        <div className="absolute top-20 right-10 w-32 h-32 sm:w-72 sm:h-72 bg-yellow-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000 retina-optimized"></div>
        <div className="absolute -bottom-8 left-1/4 w-32 h-32 sm:w-72 sm:h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000 retina-optimized"></div>
      </div>

      {/* Container - Mobile First Design */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Section - Mobile Optimized */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-[28px] sm:text-[40px] md:text-[60px] lg:text-[70px] font-bold text-white mb-4 sm:mb-6 leading-[1.1] tracking-tight mobile-text-shadow">
            <span className="block">Card stacks have never</span>
            <span className="block">looked so good</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4 ultra-small-adjust">
            Just look at it go!
          </p>
        </div>

        {/* Main Slider Container - Responsive Height */}
        <div className="w-full max-w-7xl mx-auto mb-10 sm:mb-16 relative flex items-center justify-center" 
             style={{ 
               height: 'clamp(350px, 50vh, 600px)',
               minHeight: '300px'
             }}>
          <CardSwap
            width={responsiveDimensions.width}
            height={responsiveDimensions.height}
            cardDistance={responsiveDimensions.cardDistance}
            verticalDistance={responsiveDimensions.verticalDistance}
            delay={4000}
            pauseOnHover={false}
            easing="elastic"
            skewAmount={6}
          >
            <Card>
              <div className="p-4 sm:p-6 h-full flex flex-col justify-between">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-white bg-white/20 backdrop-blur-sm border border-white/30">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"></div>
                      <span>Smooth</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">Interactive Learning</h3>
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed">Engage with modern tools and cutting-edge educational experiences.</p>
                  </div>
                </div>
                <div className="flex items-center justify-center mt-3 sm:mt-4">
                  <div className="text-5xl sm:text-6xl md:text-8xl font-bold text-white/10 select-none">1</div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4 sm:p-6 h-full flex flex-col justify-between">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-white bg-white/20 backdrop-blur-sm border border-white/30">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white flex items-center justify-center">
                        <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-black rounded-full"></div>
                      </div>
                      <span>Customizable</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">Personalized Education</h3>
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed">AI-driven insights tailored to each student's unique learning needs.</p>
                  </div>
                </div>
                <div className="flex items-center justify-center mt-3 sm:mt-4">
                  <div className="text-5xl sm:text-6xl md:text-8xl font-bold text-white/10 select-none">2</div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4 sm:p-6 h-full flex flex-col justify-between">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-white bg-white/20 backdrop-blur-sm border border-white/30">
                      <div className="flex flex-col gap-0.5">
                        <div className="w-2.5 sm:w-3 h-0.5 bg-white rounded"></div>
                        <div className="w-1.5 sm:w-2 h-0.5 bg-white/60 rounded"></div>
                        <div className="w-2.5 sm:w-3 h-0.5 bg-white rounded"></div>
                      </div>
                      <span>Responsive</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">Seamless Collaboration</h3>
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed">Connect and learn together with real-time collaboration tools.</p>
                  </div>
                </div>
                <div className="flex items-center justify-center mt-3 sm:mt-4">
                  <div className="text-5xl sm:text-6xl md:text-8xl font-bold bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text text-transparent select-none">3</div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-4 sm:p-6 h-full flex flex-col justify-between">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-white bg-white/20 backdrop-blur-sm border border-white/30">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded bg-white transform rotate-45"></div>
                      <span>Modern</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">Future-Ready Skills</h3>
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed">Prepare for tomorrow with advanced learning technologies.</p>
                  </div>
                </div>
                <div className="flex items-center justify-center mt-3 sm:mt-4">
                  <div className="text-5xl sm:text-6xl md:text-8xl font-bold text-white/10 select-none">4</div>
                </div>
              </div>
            </Card>
          </CardSwap>
        </div>
        
        {/* Mobile Touch Indicator - Creative Enhancement */}
        <div className="block sm:hidden text-center mt-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"></div>
            <span className="text-xs text-white/60">Cards auto-rotate every 4 seconds</span>
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

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4); }
          50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.6); }
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

        .shadow-glow {
          animation: glow-pulse 3s ease-in-out infinite;
        }

        /* Enhanced Mobile Optimizations */
        @media (max-width: 640px) {
          .shadow-float {
            box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.3);
          }
          
          /* Improve touch targets */
          .touch-target {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Better text readability on mobile */
          .mobile-text-shadow {
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }
        }

        /* Ultra-small screens */
        @media (max-width: 380px) {
          .ultra-small-adjust {
            font-size: 0.75rem;
            line-height: 1.2;
          }
        }

        /* Landscape mobile optimization */
        @media screen and (max-height: 500px) and (orientation: landscape) {
          .landscape-mobile {
            padding-top: 1rem;
            padding-bottom: 1rem;
          }
        }

        /* High DPI screens */
        @media (-webkit-min-device-pixel-ratio: 2) {
          .retina-optimized {
            transform: translateZ(0);
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
          }
        }
      `}</style>
    </section>
  );
}