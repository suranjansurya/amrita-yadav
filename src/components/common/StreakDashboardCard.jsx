import React, { useState, useEffect } from 'react';
import {
  getUserAchievements,
  getWeeklyStreakStatus,
  fetchUserHeartHistory,
} from '../../lib/supabase';
import { Flame, Trophy, Lock, Sparkles, CheckCircle2, Heart, Award, X } from 'lucide-react';

export function StreakDashboardCard({ userId = 'amritayadav', onOpenCheckIn }) {
  const [streakData, setStreakData] = useState({ currentStreak: 0, longestStreak: 0 });
  const [weeklyStatus, setWeeklyStatus] = useState([]);
  const [achievementsData, setAchievementsData] = useState({ achievements: [], unlockedCount: 0, totalCount: 0 });
  const [newUnlockedToast, setNewUnlockedToast] = useState(null);
  const [activeTab, setActiveTab] = useState('streak'); // 'streak' | 'achievements'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStreakAndAchievements();
  }, [userId]);

  const loadStreakAndAchievements = async () => {
    setIsLoading(true);
    try {
      const userHeart = await fetchUserHeartHistory(userId);
      const weekly = getWeeklyStreakStatus(userHeart);
      const ach = await getUserAchievements(userId);

      setStreakData(ach.streakData || { currentStreak: 0, longestStreak: 0 });
      setWeeklyStatus(weekly);
      setAchievementsData(ach);

      if (ach.newlyUnlocked && ach.newlyUnlocked.length > 0) {
        setNewUnlockedToast(ach.newlyUnlocked[0]);
      }
    } catch (e) {
      console.warn('[StreakDashboardCard] Load error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="glass-panel p-6 rounded-3xl bg-white/80 border border-pink-200 text-center text-pink-600 text-xs font-bold animate-pulse">
        Loading Streak & Achievements... 🌸
      </div>
    );
  }

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl bg-white/90 border-2 border-pink-200 shadow-xl space-y-5 text-left select-none relative overflow-hidden">
      
      {/* Decorative Top Ambient Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-pink-300/30 to-rose-400/20 blur-2xl pointer-events-none" />

      {/* Card Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-pink-100 pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('streak')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-heading font-extrabold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              activeTab === 'streak' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm' : 'bg-pink-50 text-pink-900 hover:bg-pink-100'
            }`}
          >
            <Flame size={14} />
            <span>🔥 Streak ({streakData.currentStreak}d)</span>
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-heading font-extrabold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              activeTab === 'achievements' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm' : 'bg-pink-50 text-pink-900 hover:bg-pink-100'
            }`}
          >
            <Trophy size={14} />
            <span>🏆 Badges ({achievementsData.unlockedCount}/{achievementsData.totalCount})</span>
          </button>
        </div>

        <span className="text-[11px] font-bold text-pink-700 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100 hidden sm:inline-block">
          Best: {streakData.longestStreak} Days
        </span>
      </div>

      {/* Tab 1: Streak & Weekly Overview */}
      {activeTab === 'streak' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Main Streak Counter Badge */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white shadow-lg text-center space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-center space-x-2">
              <Flame size={32} className="text-amber-300 animate-bounce" />
              <span className="font-heading font-black text-4xl sm:text-5xl tracking-tight">
                {streakData.currentStreak} DAYS
              </span>
            </div>
            <p className="font-heading font-extrabold text-sm text-pink-100 tracking-wide">
              Daily Heart Check-in Streak
            </p>
            <p className="text-xs text-pink-100/90 font-medium italic">
              {streakData.currentStreak > 0 ? 'Keep going ❤️ consistency builds true love!' : 'Start your daily streak today! ❤️'}
            </p>

            <div className="pt-1 flex items-center justify-center space-x-4 text-xs font-bold text-pink-100">
              <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
                🏆 Best Streak: {streakData.longestStreak} Days
              </span>
            </div>
          </div>

          {/* Weekly Streak View */}
          <div className="space-y-2 text-center bg-pink-50/50 p-4 rounded-2xl border border-pink-100">
            <span className="text-[11px] font-bold text-pink-800 uppercase tracking-wider block mb-2">
              This Week's Check-in Status
            </span>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {weeklyStatus.map((day) => (
                <div
                  key={day.dateKey}
                  className={`p-2 rounded-2xl flex flex-col items-center justify-center space-y-1 transition-all ${
                    day.isToday
                      ? 'bg-white border-2 border-pink-400 shadow-sm scale-105'
                      : day.isCompleted
                      ? 'bg-emerald-50 border border-emerald-200'
                      : 'bg-white/60 border border-pink-100'
                  }`}
                >
                  <span className="text-[10px] font-extrabold text-pink-900">{day.dayName}</span>
                  <span className="text-base sm:text-lg">{day.symbol}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center space-x-4 text-[10px] font-semibold text-pink-600 pt-2">
              <span className="flex items-center space-x-1">
                <span>✅</span>
                <span>Completed</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>❤️</span>
                <span>Today</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>○</span>
                <span>Pending</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Achievements Grid */}
      {activeTab === 'achievements' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-extrabold text-sm text-pink-950 flex items-center space-x-1.5">
              <Award size={16} className="text-pink-500" />
              <span>Personal Achievements & Milestones</span>
            </h4>
            <span className="text-xs font-bold text-pink-700">
              {achievementsData.unlockedCount} / {achievementsData.totalCount} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
            {achievementsData.achievements.map((ach) => {
              const pct = Math.round((ach.progress / ach.target) * 100);
              return (
                <div
                  key={ach.id}
                  className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                    ach.isUnlocked
                      ? 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-300 shadow-sm'
                      : 'bg-gray-50/70 border-gray-200 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-2xl">{ach.isUnlocked ? ach.icon : '🔒'}</span>
                      <div>
                        <h5 className="font-heading font-extrabold text-xs text-pink-950">
                          {ach.title}
                        </h5>
                        <p className="text-[10px] text-pink-700 font-medium">
                          {ach.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {ach.isUnlocked ? (
                    <div className="flex items-center justify-between text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
                      <span>✓ Unlocked</span>
                      <span>{new Date(ach.unlockedAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  ) : (
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-pink-900">
                        <span>Progress</span>
                        <span>{ach.progress} / {ach.target}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-pink-100 overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className="h-full rounded-full bg-pink-500 transition-all duration-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Celebratory Achievement Unlock Modal */}
      {newUnlockedToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/40 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel p-6 rounded-3xl max-w-sm w-full bg-white border-2 border-pink-400 shadow-2xl text-center space-y-4 relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-amber-300/30 blur-xl pointer-events-none" />

            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center text-3xl mx-auto shadow-lg animate-bounce">
              {newUnlockedToast.icon || '🏆'}
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-extrabold text-pink-600 uppercase tracking-widest block">
                ✨ ACHIEVEMENT UNLOCKED ✨
              </span>
              <h3 className="font-heading font-black text-xl text-pink-950">
                {newUnlockedToast.title}
              </h3>
              <p className="text-xs text-pink-700 font-semibold italic">
                "{newUnlockedToast.description}"
              </p>
            </div>

            <p className="text-xs text-rose-900 font-bold bg-pink-50 p-2.5 rounded-2xl border border-pink-200">
              Congratulations on reaching this milestone! ❤️
            </p>

            <button
              onClick={() => setNewUnlockedToast(null)}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all"
            >
              Celebrate & Continue ✨
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
