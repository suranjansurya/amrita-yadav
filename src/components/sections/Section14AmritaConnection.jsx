import React from 'react';
import { PhotoFrame3D } from '../3d/PhotoFrame3D';
import { MotionWrapper } from '../animations/MotionWrapper';
import { Sparkles, Heart } from 'lucide-react';

export function Section14AmritaConnection() {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24 z-10 text-center select-none">
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
        
        <MotionWrapper type="fadeInUp">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-pink-200 shadow-sm mb-4">
            <Heart size={15} className="text-pink-600 fill-pink-300" />
            <span className="text-xs uppercase font-bold tracking-widest text-pink-900">
              The Soul at the Heart of this World
            </span>
          </div>

          <h2 className="font-heading font-bold text-4xl sm:text-6xl text-gradient-rose glow-text-title mb-2">
            AMRITA YADAV
          </h2>

          <p className="font-body text-sm sm:text-base text-pink-800/80 max-w-md mx-auto mb-8">
            The lotus fully blooms as her 3D portrait rotates inside the soulbound space.
          </p>
        </MotionWrapper>

        {/* Reusable 3D Rotating Photo Frame */}
        <MotionWrapper delay={0.4} type="scaleUp" className="w-full flex justify-center">
          <PhotoFrame3D
            image="/images/amrita.jpg"
            autoRotate={true}
            frameStyle="rounded"
            rotationSpeed={0.15}
            showControls={true}
          />
        </MotionWrapper>

        <MotionWrapper delay={0.8} type="fadeIn">
          <div className="mt-8 flex flex-col items-center space-y-2">
            <span className="text-5xl animate-pulse-glow">🪷</span>
            <p className="font-script text-3xl text-pink-700">
              Soulmate × Soulbound
            </p>
          </div>
        </MotionWrapper>

      </div>
    </section>
  );
}
