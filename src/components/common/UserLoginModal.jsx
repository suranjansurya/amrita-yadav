import React, { useState } from 'react';
import { loginUser } from '../../lib/auth';
import { Heart, Lock, User, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export function UserLoginModal({ onLoginSuccess, onOpenAdmin }) {
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
      console.warn('[UserLoginModal] Authorization failed');
      setErrorMessage('User ID ya password incorrect hai. ❤️');
      setIsLoggingIn(false);
    }
  };

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
        <p className="font-script text-xl text-pink-700 mb-6">
          Enter credentials to unlock your little dream world... ✨
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

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between text-xs text-pink-800 font-semibold px-1 pt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-pink-300 text-pink-500 focus:ring-pink-300"
              />
              <span>Remember me</span>
            </label>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-xs font-semibold text-rose-600 animate-bounce pt-1">
              {errorMessage}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-4 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-bold text-sm uppercase tracking-widest shadow-xl hover:scale-102 active:scale-98 transition-all flex items-center justify-center space-x-2 focus:outline-none cursor-pointer mt-2"
          >
            <Sparkles size={16} />
            <span>{isLoggingIn ? 'Logging in...' : 'Login ❤️'}</span>
          </button>
        </form>

        {/* Discreet Admin Login Shortcut Link */}
        {onOpenAdmin && (
          <div className="pt-4 border-t border-pink-100 mt-4">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-xs font-semibold text-pink-500 hover:text-pink-800 transition-colors focus:outline-none block mx-auto underline tracking-wider cursor-pointer"
            >
              Admin Login 🔐
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
