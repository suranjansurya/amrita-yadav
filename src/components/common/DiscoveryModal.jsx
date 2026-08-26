import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function DiscoveryModal({ secret, onClose }) {
  if (!secret) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/20 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-lg w-full glass-panel rounded-3xl p-6 sm:p-8 border border-white/90 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/60 text-pink-950 hover:bg-white transition-colors focus:outline-none"
          >
            <X size={18} />
          </button>

          <div className="flex items-center space-x-3 mb-4">
            <span className="text-4xl p-3 bg-pink-100/80 rounded-2xl shadow-inner">
              {secret.symbol}
            </span>
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-pink-700">
                {secret.tag}
              </span>
              <h3 className="text-2xl font-heading font-bold text-pink-950">
                {secret.name}
              </h3>
            </div>
          </div>

          <div className="my-6 p-4 rounded-2xl bg-white/70 border border-pink-100 shadow-sm">
            <p className="text-xl font-heading font-medium text-pink-900 italic leading-relaxed">
              "{secret.message}"
            </p>
          </div>

          <p className="text-sm font-body text-pink-800/90 leading-relaxed mb-6">
            {secret.details}
          </p>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="glass-button px-6 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase text-pink-950 flex items-center space-x-2"
            >
              <Sparkles size={14} className="text-pink-600" />
              <span>Keep Exploring</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
