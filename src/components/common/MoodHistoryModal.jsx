import React, { useState, useEffect } from 'react';
import { fetchUserHeartHistory } from '../../lib/supabase';
import { Heart, Calendar, X, RefreshCw, Sparkles, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';

export function MoodHistoryModal({ isOpen, onClose, currentUser, onUpdateToday }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDayRecord, setSelectedDayRecord] = useState(null);
  const [viewMode, setViewMode] = useState('7days'); // '7days' | 'month'

  useEffect(() => {
    if (isOpen && currentUser) {
      loadHistory();
    }
  }, [isOpen, currentUser]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const records = await fetchUserHeartHistory(currentUser?.userId || 'usr-amritayadav');
      setHistory(records);
    } catch (e) {
      console.warn('[MoodHistoryModal] Error loading history:', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Find Today's record
  const todayStr = new Date().toDateString();
  const todayRecord = history.find((rec) => new Date(rec.created_at).toDateString() === todayStr);

  // Calculate Last 7 Days (Mon - Sun or last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dStr = d.toDateString();
    const match = history.find((rec) => new Date(rec.created_at).toDateString() === dStr);
    return {
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNumber: d.getDate(),
      dateStr: dStr,
      record: match || null,
    };
  });

  // Calculate 7-day summary stats
  const summaryStats = last7Days.reduce((acc, item) => {
    if (item.record && item.record.mood) {
      acc[item.record.mood] = (acc[item.record.mood] || 0) + 1;
    }
    return acc;
  }, {});

  // Monthly Calendar data calculation (Current Month)
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun

  const calendarDays = [];
  // Empty padding for first week
  for (let i = 0; i < (firstDayIndex === 0 ? 6 : firstDayIndex - 1); i++) {
    calendarDays.push(null);
  }
  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const d = new Date(year, month, dayNum);
    const dStr = d.toDateString();
    const match = history.find((rec) => new Date(rec.created_at).toDateString() === dStr);
    calendarDays.push({
      dayNum,
      dateStr: dStr,
      record: match || null,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/40 backdrop-blur-lg animate-fadeIn select-none">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-xl w-full border-2 border-pink-300 shadow-2xl bg-white/95 text-center relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-pink-100/80 text-pink-950 hover:bg-pink-200 focus:outline-none transition-colors"
          title="Close Mood History"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 mb-6 text-center">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Heart size={13} className="fill-pink-400" />
            <span>Personal Mood Story</span>
          </div>

          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gradient-rose">
            Your Little Mood Story ❤️
          </h2>
          <p className="font-script text-lg sm:text-xl text-pink-700">
            Every day tells a tiny piece of your story.
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="py-12 text-center text-pink-600 font-semibold text-sm animate-pulse flex flex-col items-center space-y-3">
            <RefreshCw size={24} className="animate-spin text-pink-500" />
            <span>Loading your mood story... 🌸</span>
          </div>
        ) : history.length === 0 ? (
          /* Empty State */
          <div className="py-12 space-y-4 text-center">
            <span className="text-4xl block">🌱</span>
            <p className="font-heading font-bold text-lg text-pink-950">
              Your little mood story hasn't started yet. 🌱
            </p>
            <p className="font-script text-xl text-pink-700">
              Come back tomorrow and tell me how your heart feels. ❤️
            </p>

            <button
              onClick={onUpdateToday}
              className="mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
            >
              Start Today's Check-in ❤️
            </button>
          </div>
        ) : (
          /* Main Content View */
          <div className="space-y-6 text-left">
            
            {/* 1. Today's Heart Card ❤️ */}
            <div className="p-5 rounded-2xl bg-pink-50/70 border border-pink-200 shadow-sm relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-pink-800 flex items-center space-x-1">
                  <Heart size={13} className="fill-pink-400" />
                  <span>Today's Heart ❤️</span>
                </span>

                <button
                  onClick={onUpdateToday}
                  className="px-3 py-1 rounded-full bg-white border border-pink-200 text-pink-800 text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1 hover:bg-pink-100 transition-colors"
                >
                  <Edit3 size={11} />
                  <span>{todayRecord ? 'Update Today' : 'Check In Today'}</span>
                </button>
              </div>

              {todayRecord ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{todayRecord.mood?.split(' ')[0]}</span>
                    <span className="font-heading font-extrabold text-xl text-pink-950">
                      {todayRecord.mood}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-pink-900 pt-1">
                    <div>Today was: <strong>{todayRecord.day_feeling}</strong></div>
                    <div>Need right now: <strong>{todayRecord.current_need}</strong></div>
                  </div>

                  {todayRecord.heart_word && (
                    <p className="text-xs italic text-pink-800 pt-1">
                      Your heart said: <strong>"{todayRecord.heart_word}"</strong>
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs font-semibold text-pink-700 italic">
                  You haven't checked in yet today. Tell me how your heart feels! ❤️
                </p>
              )}
            </div>

            {/* View Mode Toggle Button */}
            <div className="flex items-center justify-between border-b border-pink-100 pb-2">
              <span className="font-heading font-bold text-sm text-pink-950">
                {viewMode === '7days' ? 'Last 7 Days View' : 'Monthly View (August 2026)'}
              </span>

              <button
                onClick={() => setViewMode(viewMode === '7days' ? 'month' : '7days')}
                className="text-xs font-bold text-pink-600 hover:text-pink-900 underline focus:outline-none"
              >
                {viewMode === '7days' ? 'View This Month →' : '← View 7 Days'}
              </button>
            </div>

            {/* 2. Last 7 Days View */}
            {viewMode === '7days' && (
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {last7Days.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => item.record && setSelectedDayRecord(item.record)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        item.record
                          ? 'bg-white border-pink-200 hover:border-pink-400 shadow-xs'
                          : 'bg-pink-50/40 border-pink-100 opacity-60'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase text-pink-700 block mb-1">
                        {item.dayName}
                      </span>
                      <span className="text-xl block">
                        {item.record ? item.record.mood?.split(' ')[0] : '—'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 7-Day Summary Breakdown */}
                {Object.keys(summaryStats).length > 0 && (
                  <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-xs space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-pink-800 block">
                      7-Day Mood Summary
                    </span>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                      {Object.entries(summaryStats).map(([moodKey, count]) => (
                        <span key={moodKey} className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-950">
                          {moodKey}: <strong>{count} {count === 1 ? 'day' : 'days'}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. Monthly View Calendar */}
            {viewMode === 'month' && (
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-pink-700 mb-1">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>

                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {calendarDays.map((cDay, idx) => {
                    if (!cDay) return <div key={idx} className="p-2" />;

                    const hasRecord = Boolean(cDay.record);

                    return (
                      <div
                        key={idx}
                        onClick={() => hasRecord && setSelectedDayRecord(cDay.record)}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          hasRecord
                            ? 'bg-white border-pink-300 hover:border-pink-500 shadow-xs cursor-pointer'
                            : 'bg-pink-50/30 border-transparent text-pink-400'
                        }`}
                      >
                        <span className="text-[10px] font-bold block text-pink-900">{cDay.dayNum}</span>
                        <span className="text-lg block">{hasRecord ? cDay.record.mood?.split(' ')[0] : '—'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Day Details Card Modal */}
            {selectedDayRecord && (
              <div className="p-4 rounded-2xl bg-pink-100/80 border border-pink-300 relative space-y-2 animate-fadeIn">
                <button
                  onClick={() => setSelectedDayRecord(null)}
                  className="absolute top-3 right-3 text-pink-700 hover:text-pink-950 text-xs font-bold"
                >
                  ✕
                </button>

                <div className="text-xs font-bold uppercase text-pink-800">
                  {selectedDayRecord.date || 'Day Details'}
                </div>

                <div className="text-sm font-bold text-pink-950 flex items-center space-x-2">
                  <span>Mood: {selectedDayRecord.mood}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-pink-900">
                  <div>Day: <strong>{selectedDayRecord.day_feeling}</strong></div>
                  <div>Need: <strong>{selectedDayRecord.current_need}</strong></div>
                </div>

                {selectedDayRecord.heart_word && (
                  <div className="text-xs text-pink-950 italic">
                    Heart Word: <strong>"{selectedDayRecord.heart_word}"</strong>
                  </div>
                )}

                {selectedDayRecord.shared_message && (
                  <div className="p-2.5 rounded-xl bg-white text-xs italic text-pink-950">
                    "{selectedDayRecord.shared_message}"
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
