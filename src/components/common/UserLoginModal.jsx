import React, { useState } from 'react';
import { loginUser } from '../../lib/auth';
import { Heart, Lock, User, Sparkles, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

export function UserLoginModal({ entryPoint = 'world', onLoginSuccess, onOpenAdmin }) {
  const [userIdInput, setUserIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userIdInput.trim() || !passwordInput.trim()) {
      setErrorMessage('User ID ya password incorrect hai. ❤️');
      return;
    }

    setIsLoggingIn(true);
    setErrorMessage('');

    try {
      const user = await loginUser({
        userId: userIdInput,
        password: passwordInput,
        entryPoint: entryPoint,
        rememberMe: rememberMe,
      });

      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#FFF0F5', '#FFD1DC', '#F5E1A4', '#FFB6C1'],
      });

      setTimeout(() => {
        setIsLoggingIn(false);
        onLoginSuccess(user);
      }, 500);
    } catch (err) {
      console.warn('[UserLoginModal] Authorization failed:', err.message);
      setErrorMessage(err.message || 'User ID ya password incorrect hai. ❤️');
      setIsLoggingIn(false);
    }
  };

  const formattedEntryPoint = (entryPoint || 'world').toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/40 backdrop-blur-lg animate-fadeIn select-none">
      <div className="glass-panel p-8 rounded-3xl max-w-md w-full border-2 border-pink-300 shadow-2xl bg-white/95 text-center relative">
        
        {/* Header Icon */}
        <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <Heart size={32} className="fill-pink-400" />
        </div>

        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gradient-rose mb-1">
          Welcome to Amrita's World
        </h2>

        {/* Entry Point Badge */}
        <div className="my-2">
          <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-bold uppercase tracking-wider inline-flex items-center space-x-1">
            <Lock size={12} className="text-pink-600" />
            <span>Entry Gate: {formattedEntryPoint}</span>
          </span>
        </div>

        <p className="font-script text-xl text-pink-700 mb-6">
          Enter User credentials to unlock this protected entry point... ✨
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* User ID Field */}
          <div className="relative text-left">
            <label className="font-heading font-semibold text-xs text-pink-900 uppercase tracking-wider block mb-1">
              User ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                placeholder="Enter User ID..."
                className="w-full p-3.5 pl-10 rounded-2xl bg-white border border-pink-200 text-pink-950 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-inner"
              />
              <User size={16} className="absolute left-3.5 top-4 text-pink-400" />
            </div>
          </div>

          {/* Password Field */}
          <div className="relative text-left">
            <label className="font-heading font-semibold text-xs text-pink-900 uppercase tracking-wider block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter Password..."
                className="w-full p-3.5 pl-10 rounded-2xl bg-white border border-pink-200 text-pink-950 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-inner"
              />
              <Lock size={16} className="absolute left-3.5 top-4 text-pink-400" />
            </div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <p className="text-xs font-semibold text-rose-600 animate-bounce">
              {errorMessage}
            </p>
          )}

          {/* Remember Me Toggle */}
          <div className="flex items-center justify-between text-xs text-pink-900 font-semibold px-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-pink-300 text-pink-500 focus:ring-pink-400"
              />
              <span>Keep entry point unlocked</span>
            </label>

            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-pink-600 hover:text-pink-950 underline focus:outline-none font-bold"
              >
                Admin PIN Login →
              </button>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles size={18} />
            <span>{isLoggingIn ? 'Authenticating...' : `Unlock ${formattedEntryPoint}`}</span>
          </button>

        </form>
      </div>
    </div>
  );
}
