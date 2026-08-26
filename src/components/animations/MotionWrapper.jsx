import React from 'react';
import { motion } from 'framer-motion';

export function MotionWrapper({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  type = 'fadeInUp',
  onClick = null,
}) {
  const variants = {
    fadeInUp: {
      initial: { opacity: 0, y: 30, filter: 'blur(8px)' },
      animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    },
    fadeIn: {
      initial: { opacity: 0, filter: 'blur(6px)' },
      animate: { opacity: 1, filter: 'blur(0px)' },
    },
    scaleUp: {
      initial: { opacity: 0, scale: 0.85, filter: 'blur(10px)' },
      animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    },
  };

  const chosenVariant = variants[type] || variants.fadeInUp;

  return (
    <motion.div
      initial={chosenVariant.initial}
      whileInView={chosenVariant.animate}
      viewport={{ once: false, margin: '-50px' }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
