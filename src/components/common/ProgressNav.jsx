import React from 'react';

export function ProgressNav({ currentSection = 0, totalSections = 52 }) {
  const labels = [
    'Opening',
    'Welcome',
    'Why This Exists',
    'The Feeling',
    "You're Different",
    'The Little Things',
    '3D Amrita Frame',
    'What You Mean',
    'Our Connection',
    'Soulmate',
    'Two Souls',
    'Soulbound',
    'Soulmate × Soulbound',
    'Amrita Connection',
    'Serendipity',
    'Two Paths',
    'The Moment',
    'Destiny',
    'Amrita Serendipity',
    'Serendipity Final',
    '50 Reasons Intro',
    '50 Reasons Discovery',
    'Reason 50 Reveal',
    'Secret Door',
    'Secret Garden',
    'Garden Center',
    'Final Secret Reveal',
    'Letter Entrance',
    'The Letter',
    'Words I Never Said',
    'Unsent Cards',
    'Amrita Letter Photo',
    'Final Letter Page',
    'After The Letter',
    'The Path',
    'The Place That Stays',
    'Memory Lights',
    'Amrita Tree Photo',
    'The Promise',
    'One Special Place',
    'The Final Path',
    'Journey Recap',
    'Everything Leads Here',
    'Final Amrita Photo',
    'Final Message',
    'Most Important Message',
    'Soulmate Callback',
    'Lotus Finale',
    'Final Dedication',
    'Final Controls',
    'Footer',
  ];

  const scrollToSection = (index) => {
    const windowH = window.innerHeight;
    window.scrollTo({
      top: index * windowH,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden 2xl:flex flex-col items-center space-y-1">
      {Array.from({ length: totalSections }).map((_, idx) => {
        const isActive = currentSection === idx;

        return (
          <button
            key={idx}
            onClick={() => scrollToSection(idx)}
            className="group relative flex items-center justify-end focus:outline-none"
            title={labels[idx] || `Section ${idx + 1}`}
          >
            <span className="absolute right-7 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-pink-950 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-md border border-pink-200">
              {labels[idx]}
            </span>

            <div
              className={`rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-3.5 h-3.5 bg-gradient-to-r from-pink-400 to-rose-400 ring-4 ring-pink-200/80 shadow-md'
                  : 'w-2 h-2 bg-pink-300/60 hover:bg-pink-400'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
