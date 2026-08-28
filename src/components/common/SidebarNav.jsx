import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, X, Sparkles, Heart, MoreVertical } from 'lucide-react';

export function SidebarNav({ currentUser, onOpenFeature, onLogout }) {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isManualExpanded, setIsManualExpanded] = useState(false);
  const sidebarRef = useRef(null);

  const userName = currentUser?.displayName || currentUser?.userId || 'Amrita Yadav';

  const NAV_ITEMS = [
    { id: 'notifications', label: 'Notifications', icon: '🔔', color: 'from-amber-400 to-pink-500' },
    { id: 'justforyou', label: 'Just For You', icon: '💌', color: 'from-rose-400 to-pink-500' },
    { id: 'memorywall', label: 'Photo & Memory Wall', icon: '🖼️', color: 'from-pink-400 to-rose-500' },
    { id: 'sky', label: 'Constellation Sky', icon: '🌌', color: 'from-indigo-400 to-purple-500' },
    { id: 'secrets', label: 'Secrets', icon: '🔐', color: 'from-amber-400 to-pink-500' },
    { id: 'hug', label: 'Digital Hug', icon: '🤗', color: 'from-pink-400 to-rose-400' },
    { id: 'surprise', label: 'Surprise Me', icon: '🎁', color: 'from-purple-400 to-pink-500' },
    { id: 'jar', label: 'Memory Jar', icon: '🫙', color: 'from-rose-400 to-pink-400' },
    { id: 'memories', label: 'Memory Timeline', icon: '💗', color: 'from-pink-500 to-rose-500' },
    { id: 'moods', label: 'Daily Moods', icon: '🌸', color: 'from-pink-400 to-purple-400' },
  ];

  // Passive scroll listener with rAF throttling & 60px threshold
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || document.documentElement.scrollTop;
          // Threshold of 60px to prevent flickering on micro-scrolls
          if (scrollY <= 60) {
            setIsAtTop(true);
          } else {
            setIsAtTop(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ESC key listener to close temporary expanded menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isManualExpanded) {
        setIsManualExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isManualExpanded]);

  // Click outside listener when manually expanded
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isManualExpanded &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setIsManualExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isManualExpanded]);

  const handleSelectNav = (id) => {
    onOpenFeature(id);
    setIsManualExpanded(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsManualExpanded(false);
  };

  const showFullMenu = isAtTop || isManualExpanded;

  return (
    <>
      {/* Collapsed Mode Floating Three-Dot Button (Shown when user has scrolled away & menu is closed) */}
      {!showFullMenu && (
        <div className="fixed top-4 left-4 z-40 animate-fadeIn">
          <button
            onClick={() => setIsManualExpanded(true)}
            aria-label="Open navigation menu"
            className="glass-panel w-12 h-12 rounded-full border-2 border-pink-300 shadow-xl bg-white/95 text-pink-900 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group"
            title="Open Navigation Menu"
          >
            <MoreVertical size={22} className="text-pink-600 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      {/* Backdrop overlay when menu is manually expanded away from top */}
      {!isAtTop && isManualExpanded && (
        <div
          onClick={() => setIsManualExpanded(false)}
          className="fixed inset-0 z-40 bg-pink-950/30 backdrop-blur-xs animate-fadeIn transition-opacity duration-300"
          aria-label="Close navigation menu"
        />
      )}

      {/* Main Vertical Sidebar Container */}
      <aside
        ref={sidebarRef}
        aria-label={showFullMenu ? 'Navigation Menu' : 'Collapsed Navigation'}
        className={`fixed top-4 md:top-6 left-4 md:left-6 z-50 w-64 max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-3rem)] glass-panel rounded-3xl border-2 border-pink-200/80 shadow-2xl bg-white/95 backdrop-blur-xl flex flex-col justify-between p-4 transition-all duration-300 ease-in-out select-none ${
          showFullMenu
            ? 'translate-x-0 opacity-100 scale-100 pointer-events-auto shadow-2xl'
            : '-translate-x-full md:-translate-x-[120%] opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* Close Button when manually expanded away from top */}
        {!isAtTop && (
          <button
            onClick={() => setIsManualExpanded(false)}
            aria-label="Close navigation menu"
            className="absolute top-3 right-3 p-1.5 rounded-full bg-pink-100 text-pink-800 hover:bg-pink-200 transition-colors z-20"
          >
            <X size={16} />
          </button>
        )}

        {/* Subtle Vertical Background Accent Glow */}
        <div className="absolute left-6 top-16 bottom-16 w-0.5 bg-gradient-to-b from-pink-300 via-rose-200 to-pink-300 opacity-40 pointer-events-none rounded-full" />

        {/* Top Header Card: User Profile */}
        <div className="relative z-10 bg-gradient-to-br from-pink-50/90 to-rose-50/90 p-3.5 rounded-2xl border border-pink-200/60 shadow-sm text-center mb-3">
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 p-0.5 mx-auto mb-2 shadow-md">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-pink-600">
              <User size={22} className="fill-pink-200" />
            </div>
            <Sparkles size={12} className="absolute -top-1 -right-1 text-amber-400 animate-spin" />
          </div>

          <h3 className="font-heading font-extrabold text-sm text-pink-950 truncate px-1">
            {userName}
          </h3>
          <p className="font-script text-xs text-pink-700 font-semibold mt-0.5">
            My Little World ❤️
          </p>
        </div>

        {/* Middle Navigation Column */}
        <nav className="relative z-10 space-y-1.5 overflow-y-auto pr-1 flex-1 scrollbar-thin scrollbar-thumb-pink-200">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectNav(item.id)}
              className="w-full p-2.5 rounded-2xl bg-white/70 hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 border border-pink-100/80 hover:border-pink-300 text-pink-950 font-bold text-xs flex items-center justify-between shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-base group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="group-hover:text-pink-900 transition-colors">
                  {item.label}
                </span>
              </div>
              <Heart size={12} className="text-pink-300 opacity-0 group-hover:opacity-100 group-hover:fill-pink-400 transition-all" />
            </button>
          ))}
        </nav>

        {/* Bottom Section: Logout Action */}
        <div className="relative z-10 pt-3 border-t border-pink-100 mt-2">
          <button
            onClick={handleLogoutClick}
            className="w-full py-2.5 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 hover:text-rose-900 font-bold text-xs flex items-center justify-center space-x-2 shadow-inner hover:scale-[1.01] transition-all cursor-pointer"
          >
            <LogOut size={14} className="text-rose-600" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
