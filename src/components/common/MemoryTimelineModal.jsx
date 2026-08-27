import React, { useState, useEffect } from 'react';
import { fetchMemories, MEMORY_CATEGORIES } from '../../lib/supabase';
import { Heart, Search, X, Calendar, ArrowLeft, RefreshCw, Sparkles, Filter, Clock } from 'lucide-react';

export function MemoryTimelineModal({ isOpen, onClose }) {
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

  const [selectedMemory, setSelectedMemory] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadMemories();
    }
  }, [isOpen]);

  const loadMemories = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMemories({ includeHidden: false });
      setMemories(data);
    } catch (e) {
      console.warn('[MemoryTimelineModal] Error loading memories:', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Filter & Search Logic
  const filteredMemories = memories
    .filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.short_description && item.short_description.toLowerCase().includes(q)) ||
        (item.full_description && item.full_description.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.memory_date || a.created_at).getTime();
      const dateB = new Date(b.memory_date || b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/40 backdrop-blur-lg animate-fadeIn select-none">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-3xl w-full border-2 border-pink-300 shadow-2xl bg-white/95 text-center relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-pink-100/80 text-pink-950 hover:bg-pink-200 focus:outline-none transition-colors"
          title="Close Timeline"
        >
          <X size={18} />
        </button>

        {/* Detail Modal View */}
        {selectedMemory ? (
          <div className="space-y-6 text-left animate-scaleUp">
            <button
              onClick={() => setSelectedMemory(null)}
              className="px-4 py-2 rounded-full bg-pink-100 text-pink-950 text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 hover:bg-pink-200 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Memories</span>
            </button>

            {/* Image Preview */}
            {selectedMemory.image_url ? (
              <div className="rounded-2xl overflow-hidden shadow-md max-h-72 w-full bg-pink-50">
                <img
                  src={selectedMemory.image_url}
                  alt={selectedMemory.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-40 rounded-2xl bg-gradient-to-r from-pink-200 via-rose-200 to-pink-300 flex items-center justify-center shadow-inner">
                <Heart size={48} className="fill-pink-400 text-pink-300 animate-pulse" />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-bold">
                  {selectedMemory.category || '❤️ Special'}
                </span>
                <span className="text-xs text-pink-600 font-semibold flex items-center space-x-1">
                  <Calendar size={12} />
                  <span>{selectedMemory.memory_date}</span>
                </span>
              </div>

              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-pink-950 pt-1">
                {selectedMemory.title}
              </h2>

              <p className="font-heading font-bold text-base text-pink-800 leading-relaxed pt-2">
                "{selectedMemory.short_description}"
              </p>

              {selectedMemory.full_description && (
                <p className="font-body text-sm text-pink-950 leading-relaxed pt-3 border-t border-pink-100 italic">
                  {selectedMemory.full_description}
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Main Timeline Overview Screen */
          <div className="space-y-6">
            
            {/* Header */}
            <div className="space-y-1 text-center">
              <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider mb-1">
                <Heart size={13} className="fill-pink-400" />
                <span>Memory Collection</span>
              </div>

              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-gradient-rose">
                Our Little Memories ❤️
              </h2>
              <p className="font-script text-xl text-pink-700">
                Some moments deserve to stay forever.
              </p>
            </div>

            {/* Search & Sort Bar */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-2/3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search memories..."
                    className="w-full p-3 pl-10 rounded-2xl bg-pink-50/70 border border-pink-200 text-pink-950 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                  <Search size={15} className="absolute left-3.5 top-3.5 text-pink-400" />
                </div>

                <button
                  onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                  className="w-full sm:w-1/3 py-3 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Clock size={14} />
                  <span>{sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}</span>
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
                {['All', ...MEMORY_CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-pink-500 text-white shadow-xs'
                        : 'bg-pink-50 text-pink-800 hover:bg-pink-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="py-12 text-center text-pink-600 font-semibold text-sm animate-pulse flex flex-col items-center space-y-3">
                <RefreshCw size={24} className="animate-spin text-pink-500" />
                <span>Loading our memories... ❤️</span>
              </div>
            ) : filteredMemories.length === 0 ? (
              /* Empty State */
              <div className="py-12 space-y-3 text-center">
                <span className="text-4xl block">🌱</span>
                <p className="font-heading font-bold text-lg text-pink-950">
                  Our little timeline is waiting for its first memory. 🌱❤️
                </p>
              </div>
            ) : (
              /* Vertical Timeline Grid */
              <div className="relative py-4 space-y-8 text-left before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:-ml-px before:w-0.5 before:bg-pink-200">
                {filteredMemories.map((mem, idx) => {
                  const isEven = idx % 2 === 0;

                  return (
                    <div
                      key={mem.id || idx}
                      onClick={() => setSelectedMemory(mem)}
                      className={`relative flex items-center justify-between sm:justify-normal group cursor-pointer ${
                        isEven ? 'sm:flex-row-reverse' : ''
                      }`}
                    >
                      {/* Timeline Center Heart Marker */}
                      <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-md group-hover:scale-125 transition-transform z-10">
                        <Heart size={14} className="fill-white" />
                      </div>

                      {/* Timeline Content Card */}
                      <div className={`w-[calc(100%-3rem)] sm:w-[calc(50%-2rem)] ml-12 sm:ml-0 p-5 rounded-3xl bg-white border border-pink-200 shadow-sm group-hover:shadow-md group-hover:border-pink-300 transition-all ${
                        isEven ? 'sm:mr-auto' : 'sm:ml-auto'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-full">
                            {mem.category || '❤️ Special'}
                          </span>
                          <span className="text-xs text-pink-600 font-semibold flex items-center space-x-1">
                            <Calendar size={11} />
                            <span>{mem.memory_date}</span>
                          </span>
                        </div>

                        <h3 className="font-heading font-bold text-lg text-pink-950 group-hover:text-pink-600 transition-colors mb-1">
                          {mem.title}
                        </h3>

                        <p className="font-body text-xs text-pink-900/90 leading-relaxed line-clamp-2">
                          "{mem.short_description}"
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
