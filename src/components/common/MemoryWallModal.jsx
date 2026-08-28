import React, { useState, useEffect } from 'react';
import {
  fetchMemories,
  fetchUserFavorites,
  toggleMemoryFavorite,
  saveUserActivity,
} from '../../lib/supabase';
import {
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Sparkles,
  Calendar,
  Tag,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';

export function MemoryWallModal({ isOpen, onClose, currentUser }) {
  const [memories, setMemories] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [activeMemoryIndex, setActiveMemoryIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [failedImages, setFailedImages] = useState({});

  const userId = currentUser?.userId || 'amritayadav';

  useEffect(() => {
    if (isOpen) {
      loadMemoriesData();
      saveUserActivity({
        event_type: 'memory_wall_opened',
        title: '💗 Opened Memory Wall',
        description: 'User opened the Photo & Memory Wall',
        user_id: userId,
      });
    }
  }, [isOpen, userId]);

  // ESC Key listener to close modal or detail viewer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (activeMemoryIndex !== null) {
          setActiveMemoryIndex(null);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeMemoryIndex, onClose]);

  const loadMemoriesData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const [mRecords, favs] = await Promise.all([
        fetchMemories({ user_id: userId, includeHidden: false }),
        fetchUserFavorites(userId),
      ]);
      setMemories(mRecords || []);
      setFavorites(favs || []);
    } catch (e) {
      console.error('[MemoryWallModal] Fetch error:', e);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFav = async (e, memId) => {
    e.stopPropagation();
    try {
      const updatedFavs = await toggleMemoryFavorite(userId, memId);
      setFavorites(updatedFavs);
    } catch (err) {
      console.warn('[MemoryWallModal] Favorite toggle error:', err);
    }
  };

  const handleOpenDetail = (index) => {
    setActiveMemoryIndex(index);
    const targetMem = filteredMemories[index];
    if (targetMem) {
      saveUserActivity({
        event_type: 'memory_opened',
        title: '🖼️ Opened Memory',
        description: `Viewed memory: ${targetMem.title}`,
        metadata: { memory_id: targetMem.id },
        user_id: userId,
      });
    }
  };

  const handlePrevMemory = () => {
    if (activeMemoryIndex === null || filteredMemories.length === 0) return;
    const prevIdx = (activeMemoryIndex - 1 + filteredMemories.length) % filteredMemories.length;
    setActiveMemoryIndex(prevIdx);
  };

  const handleNextMemory = () => {
    if (activeMemoryIndex === null || filteredMemories.length === 0) return;
    const nextIdx = (activeMemoryIndex + 1) % filteredMemories.length;
    setActiveMemoryIndex(nextIdx);
  };

  if (!isOpen) return null;

  // Categories list
  const categories = ['All', '💗 Special', '🌸 Beautiful Moments', '🎉 Celebration', '✈️ Journey', '😊 Happy', '✨ Favorite'];

  // Filter memories
  const filteredMemories = memories.filter((m) => {
    if (showFavoritesOnly && !favorites.includes(m.id)) return false;
    if (selectedCategory !== 'All' && selectedCategory !== '✨ Favorite' && m.category !== selectedCategory) return false;
    if (selectedCategory === '✨ Favorite' && !favorites.includes(m.id)) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (m.title && m.title.toLowerCase().includes(q)) ||
      (m.short_description && m.short_description.toLowerCase().includes(q)) ||
      (m.full_description && m.full_description.toLowerCase().includes(q)) ||
      (m.category && m.category.toLowerCase().includes(q))
    );
  });

  const activeMemory = activeMemoryIndex !== null ? filteredMemories[activeMemoryIndex] : null;

  // Default romantic fallback placeholder SVG data URL
  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-pink-950/40 backdrop-blur-md select-none">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-6xl w-full bg-white/95 border-2 border-pink-300 shadow-2xl space-y-6 text-left max-h-[92vh] overflow-y-auto relative">
        
        {/* Top Bar Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-pink-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 text-white flex items-center justify-center shadow-md">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-2xl text-pink-950">
                💗 Our Memories Wall
              </h2>
              <p className="text-xs text-pink-700 font-semibold">
                A gallery of beautiful moments, precious photos & timeless thoughts
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${
                showFavoritesOnly ? 'bg-rose-500 text-white shadow-md' : 'bg-pink-100 text-pink-900 hover:bg-pink-200'
              }`}
            >
              <Heart size={14} className={showFavoritesOnly ? 'fill-white' : 'fill-pink-400 text-pink-400'} />
              <span>{showFavoritesOnly ? 'Favorites Only ♥' : 'Favorites ♡'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-pink-100 text-pink-900 hover:bg-pink-200 transition-colors"
              title="Close Memory Wall (ESC)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat ? 'bg-pink-500 text-white shadow-sm' : 'bg-white text-pink-900 hover:bg-pink-100 border border-pink-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memories..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-pink-200 text-pink-950 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-pink-400" />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-20 text-center space-y-3">
            <RefreshCw size={28} className="animate-spin text-pink-500 mx-auto" />
            <p className="text-pink-700 font-bold text-xs">Loading precious memories... 🌸</p>
          </div>
        )}

        {/* Error State */}
        {hasError && !isLoading && (
          <div className="py-16 text-center space-y-3 bg-rose-50 rounded-3xl border border-rose-200 p-8">
            <p className="text-rose-900 font-bold text-sm">Memories couldn't be loaded right now.</p>
            <button
              onClick={loadMemoriesData}
              className="px-5 py-2.5 rounded-full bg-pink-500 text-white font-bold text-xs uppercase shadow-md hover:bg-pink-600 flex items-center space-x-1.5 mx-auto"
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !hasError && filteredMemories.length === 0 && (
          <div className="py-20 text-center space-y-3 bg-pink-50/50 rounded-3xl border border-pink-200 p-8">
            <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center mx-auto text-2xl">
              ✨
            </div>
            <h3 className="font-heading font-extrabold text-lg text-pink-950">No memories yet</h3>
            <p className="text-xs text-pink-700 font-medium">Beautiful moments will appear here soon ❤️</p>
          </div>
        )}

        {/* Memory Grid (Desktop: 3 cols, Tablet: 2 cols, Mobile: 1 col) */}
        {!isLoading && !hasError && filteredMemories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemories.map((mem, idx) => {
              const isFav = favorites.includes(mem.id);
              const imgSrc = failedImages[mem.id] ? FALLBACK_IMAGE : (mem.image_url || FALLBACK_IMAGE);

              return (
                <div
                  key={mem.id || idx}
                  onClick={() => handleOpenDetail(idx)}
                  className="group glass-panel rounded-3xl bg-white border border-pink-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between hover:-translate-y-1.5"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-pink-100">
                    {/* Lazy-loaded Image */}
                    <img
                      src={imgSrc}
                      alt={mem.title}
                      loading="lazy"
                      onError={() => setFailedImages((prev) => ({ ...prev, [mem.id]: true }))}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Favorite Heart Button */}
                    <button
                      onClick={(e) => handleToggleFav(e, mem.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-xs text-rose-500 shadow-md hover:scale-110 transition-transform"
                      title={isFav ? 'Remove from Favorites' : 'Add to Favorites'}
                    >
                      <Heart size={16} className={isFav ? 'fill-rose-500 text-rose-500' : 'text-rose-400'} />
                    </button>

                    {/* Category Badge */}
                    <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-pink-950 text-[10px] font-bold shadow-xs">
                      {mem.category || '💗 Special'}
                    </span>
                  </div>

                  {/* Memory Card Info */}
                  <div className="p-5 space-y-2">
                    <h3 className="font-heading font-extrabold text-base text-pink-950 group-hover:text-pink-600 transition-colors">
                      💗 {mem.title}
                    </h3>

                    {mem.short_description && (
                      <p className="text-xs text-pink-800 line-clamp-2 italic font-body">
                        "{mem.short_description}"
                      </p>
                    )}

                    <div className="pt-2 border-t border-pink-100 flex items-center justify-between text-[11px] font-bold text-pink-600">
                      <span className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{mem.memory_date || new Date(mem.created_at).toLocaleDateString()}</span>
                      </span>
                      <span className="text-pink-500 group-hover:translate-x-1 transition-transform">
                        View Photo →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =========================================================
            FULL MEMORY DETAIL VIEWER MODAL (WITH PREV / NEXT & ESC)
            ========================================================= */}
        {activeMemory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-pink-950/70 backdrop-blur-lg animate-fadeIn select-none">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-4xl w-full bg-white border-2 border-pink-300 shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto relative">
              
              {/* Top Controls */}
              <div className="flex items-center justify-between border-b border-pink-200 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-950 font-bold text-xs">
                    {activeMemory.category || '💗 Special'}
                  </span>
                  <span className="text-xs font-bold text-pink-700">
                    Memory {activeMemoryIndex + 1} of {filteredMemories.length}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => handleToggleFav(e, activeMemory.id)}
                    className="p-2 rounded-full bg-pink-100 text-rose-500 hover:bg-pink-200 transition-colors"
                  >
                    <Heart size={18} className={favorites.includes(activeMemory.id) ? 'fill-rose-500' : ''} />
                  </button>

                  <button
                    onClick={() => setActiveMemoryIndex(null)}
                    className="p-2 rounded-full bg-pink-100 text-pink-900 hover:bg-pink-200 transition-colors"
                    title="Close Photo Viewer"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Memory Photo Display */}
              <div className="relative rounded-2xl overflow-hidden bg-pink-950/10 max-h-[50vh] flex items-center justify-center">
                <img
                  src={failedImages[activeMemory.id] ? FALLBACK_IMAGE : (activeMemory.image_url || FALLBACK_IMAGE)}
                  alt={activeMemory.title}
                  onError={() => setFailedImages((prev) => ({ ...prev, [activeMemory.id]: true }))}
                  className="max-h-[50vh] w-auto object-contain mx-auto rounded-2xl shadow-md"
                />

                {/* Left / Right Carousel Controls */}
                {filteredMemories.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevMemory}
                      className="absolute left-3 p-3 rounded-full bg-white/80 backdrop-blur-xs text-pink-950 shadow-lg hover:scale-110 transition-transform"
                      title="Previous Memory (←)"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={handleNextMemory}
                      className="absolute right-3 p-3 rounded-full bg-white/80 backdrop-blur-xs text-pink-950 shadow-lg hover:scale-110 transition-transform"
                      title="Next Memory (→)"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Memory Details Description */}
              <div className="space-y-3">
                <h3 className="font-heading font-black text-2xl text-pink-950">
                  💗 {activeMemory.title}
                </h3>

                <p className="text-sm font-body text-pink-900 leading-relaxed bg-pink-50/60 p-4 rounded-2xl border border-pink-100">
                  {activeMemory.full_description || activeMemory.short_description}
                </p>

                <div className="flex items-center justify-between text-xs font-bold text-pink-600 pt-2 border-t border-pink-100">
                  <span>📅 Date: {activeMemory.memory_date || new Date(activeMemory.created_at).toLocaleDateString()}</span>
                  <span>Category: {activeMemory.category}</span>
                </div>
              </div>

              {/* Bottom Carousel Bar */}
              {filteredMemories.length > 1 && (
                <div className="flex items-center justify-between pt-2 border-t border-pink-100">
                  <button
                    onClick={handlePrevMemory}
                    className="px-4 py-2 rounded-full bg-pink-100 text-pink-950 font-bold text-xs hover:bg-pink-200 transition-colors flex items-center space-x-1"
                  >
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={handleNextMemory}
                    className="px-4 py-2 rounded-full bg-pink-100 text-pink-950 font-bold text-xs hover:bg-pink-200 transition-colors flex items-center space-x-1"
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
