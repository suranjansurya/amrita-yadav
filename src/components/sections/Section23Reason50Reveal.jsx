import React, { useEffect } from 'react';
import { PhotoFrame3D } from '../3d/PhotoFrame3D';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Section23Reason50Reveal() {
  useEffect(() => {
    // Grand confetti explosion for the 50th reason reveal
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4', '#FFB6C1', '#FAFAFA'],
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-5 py-2 rounded-full glass-panel border border-pink-300 shadow-lg mb-6">
            <Heart size={16} className="text-pink-600 fill-pink-300 animate-pulse" />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-950">
              The 50th & Biggest Reason
            </span>
            <Heart size={16} className="text-pink-600 fill-pink-300 animate-pulse" />
          </div>
        </MotionWrapper>

        {/* Large 50 Number */}
        <MotionWrapper delay={0.4} type="scaleUp">
          <div className="relative my-2 inline-block">
            <div className="absolute inset-0 bg-pink-300/70 rounded-full blur-3xl" />
            <h1 className="relative font-heading font-extrabold text-7xl sm:text-9xl md:text-[11rem] tracking-wider text-gradient-rose glow-text-title px-4">
              50
            </h1>
          </div>
        </MotionWrapper>

        {/* Reusable 3D Rotating Photo Frame Floating Beside Lotus Pedestal */}
        <MotionWrapper delay={0.8} type="scaleUp" className="w-full flex justify-center my-4">
          <PhotoFrame3D
            image="/images/amrita.jpg"
            autoRotate={true}
            frameStyle="rounded"
            rotationSpeed={0.15}
            showControls={true}
          />
        </MotionWrapper>

        {/* Climax Text Reveals */}
        <div className="space-y-6 max-w-2xl mx-auto w-full mt-6">
          <MotionWrapper delay={1.3} type="fadeInUp">
            <GlassCard className="py-6 px-10 border border-white/80">
              <span className="font-script text-3xl text-pink-600 block mb-1">
                Reason #50
              </span>
              <p className="font-heading text-3xl sm:text-5xl text-pink-950 font-bold leading-snug">
                "Because you're Amrita."
              </p>
            </GlassCard>
          </MotionWrapper>

          <MotionWrapper delay={1.9} type="scaleUp">
            <GlassCard className="py-8 px-10 border-2 border-pink-300/90 bg-white/85 shadow-2xl">
              <h2 className="font-heading font-extrabold text-4xl sm:text-6xl text-gradient-rose glow-text-title">
                “And that is reason enough.”
              </h2>
            </GlassCard>
          </MotionWrapper>
        </div>

      </div>
    </section>
  );
}
