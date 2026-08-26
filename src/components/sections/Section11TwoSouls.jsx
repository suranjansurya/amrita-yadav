import React, { useState, useEffect, useRef } from 'react';
import { SoulboundParticles3D } from '../3d/SoulboundParticles3D';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Sparkles } from 'lucide-react';

export function Section11TwoSouls() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0.2);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (windowH - rect.top) / (windowH + rect.height)));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const lines = [
    { text: 'Some connections simply happen.', delay: 0.3 },
    { text: 'Some feel meant to happen.', delay: 0.8 },
    { text: 'Some are impossible to explain.', delay: 1.3 },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center"
    >
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-4">
            <Sparkles size={14} className="text-pink-600 animate-spin" style={{ animationDuration: '5s' }} />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-950">
              TWO SOULS IN MOTION
            </span>
          </div>

          <h2 className="font-heading font-bold text-4xl sm:text-6xl text-pink-950 mb-4">
            Independent Paths Converging
          </h2>
        </MotionWrapper>

        {/* 3D Dual Particle Converging Orbit */}
        <MotionWrapper delay={0.4} type="scaleUp" className="my-4">
          <SoulboundParticles3D progress={scrollProgress} />
        </MotionWrapper>

        {/* Sequential Text Reveals */}
        <div className="space-y-6 max-w-2xl mx-auto w-full">
          {lines.map((line, idx) => (
            <MotionWrapper key={idx} delay={line.delay} type="fadeInUp">
              <GlassCard className="py-5 px-8 border border-white/80">
                <p className="font-heading text-2xl sm:text-3xl text-pink-950 font-semibold leading-relaxed">
                  "{line.text}"
                </p>
              </GlassCard>
            </MotionWrapper>
          ))}
        </div>

      </div>
    </section>
  );
}
