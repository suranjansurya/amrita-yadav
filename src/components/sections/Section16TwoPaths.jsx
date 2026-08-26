import React, { useState, useEffect, useRef } from 'react';
import { SerendipityPaths3D } from '../3d/SerendipityPaths3D';
import { MotionWrapper } from '../animations/MotionWrapper';
import { GlassCard } from '../common/GlassCard';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Section16TwoPaths() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0.2);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (windowH - rect.top) / (windowH + rect.height)));
      setScrollProgress(progress);

      // Trigger particle burst when paths cross near progress 0.5
      if (progress > 0.45 && progress < 0.7 && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true;
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4', '#FFB6C1'],
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const lines = [
    { text: 'Out of billions of people...', delay: 0.3 },
    { text: '...somehow our paths crossed.', delay: 0.8 },
    { text: 'Maybe coincidence.', delay: 1.3 },
    { text: 'Maybe serendipity.', delay: 1.8 },
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
              THE CROSSING OF PATHS
            </span>
          </div>

          <h2 className="font-heading font-bold text-4xl sm:text-6xl text-pink-950 mb-4">
            Two Journeys Converging
          </h2>
        </MotionWrapper>

        {/* 3D Curved Paths Convergence Canvas */}
        <MotionWrapper delay={0.4} type="scaleUp" className="my-4">
          <SerendipityPaths3D progress={scrollProgress} />
        </MotionWrapper>

        {/* Sequential Text Reveals */}
        <div className="space-y-5 max-w-2xl mx-auto w-full">
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
