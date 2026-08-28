import React, { useState } from 'react';
import { User, LogOut, Menu, X, Sparkles, Heart, Compass } from 'lucide-react';

export function SidebarNav({ currentUser, onOpenFeature, onLogout }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const userName = currentUser?.displayName || currentUser?.userId || 'Amrita Yadav';

  const NAV_ITEMS = [
    { id: 'justforyou', label: 'Just For You', icon: '💌', color: 'from-rose-400 to-pink-500' },
    { id: 'sky', label: 'Constellation Sky', icon: '🌌', color: 'from-indigo-400 to-purple-500' },
    { id: 'secrets', label: 'Secrets', icon: '🔐', color: 'from-amber-400 to-pink-500' },
    { id: 'hug', label: 'Digital Hug', icon: '🤗', color: 'from-pink-400 to-rose-400' },
    { id: 'surprise', label: 'Surprise Me', icon: '🎁', color: 'from-purple-400 to-pink-500' },
    { id: 'jar', label: 'Memory Jar', icon: '🫙', color: 'from-rose-400 to-pink-400' },
    { id: 'memories', label: 'Memory Timeline', icon: '💗', color: 'from-pink-500 to-rose-500' },
    { id: 'moods', label: 'Daily Moods', icon: '🌸', color: 'from-pink-400 to-purple-400' },
  ];

  const handleSelectNav = (id) => {
    onOpenFeature(id);
    setIsMobileOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Floating Button */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <button
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="glass-panel px-4 py-2.5 rounded-full border border-pink-300 shadow-lg bg-white/90 text-pink-900 text-xs font-extrabold flex items-center space-x-2 active:scale-95 transition-all"
        >
          {isMobileOpen ? <X size={18} className="text-pink-600" /> : <Menu size={18} className="text-pink-600" />}
          <span>{isMobileOpen ? 'Close Menu' : '🌸 Menu'}</span>
        </button>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-pink-950/40 backdrop-blur-sm md:hidden animate-fadeIn"
        />
      )}

      {/* Main Vertical Sidebar Container */}
      <aside
        className={`fixed top-4 md:top-6 left-4 md:left-6 z-40 w-64 max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-3rem)] glass-panel rounded-3xl border-2 border-pink-200/80 shadow-2xl bg-white/90 backdrop-blur-xl flex flex-col justify-between p-4 transition-all duration-300 select-none ${
          isMobileOpen
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full md:translate-x-0 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto'
        }`}
      >
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

        {/* Middle Navigation Column (Scrollable if screen height is constrained) */}
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
