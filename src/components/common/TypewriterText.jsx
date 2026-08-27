import React, { useState, useEffect } from 'react';

export function TypewriterText({ text = "Welcome to your little dream world, Amrita. ❤️", speed = 45, className = '' }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayedText('');

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={`inline-block font-script text-2xl sm:text-4xl text-pink-900 leading-relaxed ${className}`}>
      {displayedText}
      <span className="animate-pulse text-pink-600 font-bold ml-0.5">|</span>
    </span>
  );
}
