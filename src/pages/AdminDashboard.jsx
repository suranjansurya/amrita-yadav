import React, { useState, useEffect } from 'react';
import {
  ALLOWED_MOODS,
  MOOD_DETAILS,
  MEMORY_CATEGORIES,
  JAR_CATEGORIES,
  fetchMoodCheckIns,
  fetchJournalEntries,
  fetchHeartCheckIns,
  fetchMemories,
  saveMemory,
  deleteMemory,
  toggleMemoryVisibility,
  fetchJarMemories,
  saveJarMemory,
  deleteJarMemory,
  toggleJarMemoryActive,
  fetchComfortMessages,
  saveComfortMessage,
  deleteComfortMessage,
  fetchSecretUnlocks,
  saveSecretUnlock,
  deleteSecretUnlock,
  fetchConstellations,
  saveConstellation,
  deleteConstellation,
  fetchDailyMessages,
  saveDailyMessage,
  deleteDailyMessage,
  fetchAllUserResponses,
  deleteUserResponse,
  fetchUserActivityTimeline,
  exportUserAnswersCSV,
} from '../lib/supabase';
import {
  authenticateAdmin,
  logoutAdmin,
  fetchManagedUsers,
  adminCreateUser,
  adminEditUser,
  adminToggleUserStatus,
  adminChangeUserPassword,
  adminDeleteUser,
} from '../lib/auth';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Calendar,
  MessageSquare,
  Heart,
  RefreshCw,
  BookOpen,
  Users,
  UserPlus,
  KeyRound,
  UserCheck,
  UserX,
  Smile,
  BarChart3,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  PlusCircle,
  Archive,
  Gift,
  Sparkles,
  Moon,
  Unlock,
  Compass,
  Star,
  Mail,
  Search,
  CheckCircle,
  Download,
  Activity,
  HelpCircle,
} from 'lucide-react';

export function AdminDashboard({ onExit }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState('activity'); // 'activity' | 'answers' | 'users' | 'responses' | 'justforyou'
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const [activityTimeline, setActivityTimeline] = useState([]);
  const [userAnswersList, setUserAnswersList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [responsesList, setResponsesList] = useState([]);
  const [dailyMsgsList, setDailyMsgsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  // Delete confirmation modal state
  const [deletingResponseTarget, setDeletingResponseTarget] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, filter, activeTab]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const managedUsers = fetchManagedUsers();
      setUsersList(managedUsers);

      if (activeTab === 'activity') {
        const actData = await fetchUserActivityTimeline('usr-amritayadav', filter);
        setActivityTimeline(actData);
      } else if (activeTab === 'answers' || activeTab === 'responses') {
        const rData = await fetchAllUserResponses(filter);
        setUserAnswersList(rData);
        setResponsesList(rData);
      } else if (activeTab === 'justforyou') {
        const dData = await fetchDailyMessages({ includeInactive: true });
        setDailyMsgsList(dData);
      }
    } catch (e) {
      console.error('[AdminDashboard] Fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!pinInput.trim()) return;

    setIsLoggingIn(true);
    setLoginError('');

    const success = await authenticateAdmin(pinInput);
    if (success) {
      setIsAuthenticated(true);
      setLoginError('');
      setPinInput('');
    } else {
      setLoginError('Invalid Admin Authentication PIN');
    }
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setActivityTimeline([]);
    setUserAnswersList([]);
    setResponsesList([]);
    setUsersList([]);
    if (onExit) onExit();
  };

  // Response Delete Handler
  const handleConfirmDeleteResponse = async () => {
    if (!deletingResponseTarget) return;

    try {
      await deleteUserResponse(deletingResponseTarget.responseType, deletingResponseTarget.id);
      setUserAnswersList((prev) => prev.filter((r) => r.id !== deletingResponseTarget.id));
      setResponsesList((prev) => prev.filter((r) => r.id !== deletingResponseTarget.id));
      setSuccessNotice('Response deleted successfully. ✓');
      setTimeout(() => setSuccessNotice(''), 3000);
    } catch (err) {
      console.error('[AdminDashboard] Delete response error:', err);
    } finally {
      setDeletingResponseTarget(null);
    }
  };

  const handleExportCSV = () => {
    exportUserAnswersCSV(userAnswersList);
    setSuccessNotice('Exported user answers CSV successfully ✓');
    setTimeout(() => setSuccessNotice(''), 3000);
  };

  // Unauthenticated Login Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/40 backdrop-blur-lg select-none">
        <div className="glass-panel p-8 rounded-3xl max-w-md w-full border-2 border-pink-300 shadow-2xl bg-white/95 text-center">
          <div className="w-14 h-14 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Lock size={28} />
          </div>

          <h2 className="font-heading font-extrabold text-2xl text-pink-950 mb-1">
            Private Admin Login
          </h2>
          <p className="font-body text-xs text-pink-700 mb-6">
            Enter Owner Admin PIN to access protected System Management
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter Admin PIN"
              className="w-full p-3.5 rounded-2xl bg-white border border-pink-200 text-pink-950 text-center font-bold text-base focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-inner"
            />

            {loginError && (
              <p className="text-xs font-semibold text-rose-600 animate-bounce">
                {loginError}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onExit}
                className="w-1/2 py-3 rounded-full bg-pink-100 text-pink-950 font-bold text-xs tracking-wider hover:bg-pink-200 transition-colors"
              >
                ← Back to User Login
              </button>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-1/2 py-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
              >
                {isLoggingIn ? 'Verifying...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Filter & Search Activity / Answers
  const filteredAnswers = userAnswersList.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (r.question && r.question.toLowerCase().includes(q)) ||
      (r.answer && r.answer.toLowerCase().includes(q)) ||
      (r.user_id && r.user_id.toLowerCase().includes(q))
    );
  });

  const filteredActivity = activityTimeline.filter((act) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      act.title.toLowerCase().includes(q) ||
      (act.description && act.description.toLowerCase().includes(q)) ||
      (act.metadata?.answer && act.metadata.answer.toLowerCase().includes(q))
    );
  });

  const totalUsers = usersList.length;
  const totalResponses = userAnswersList.length;
  const todayStr = new Date().toLocaleDateString();
  const todayResponses = userAnswersList.filter((r) => r.date === todayStr).length;

  return (
    <div className="fixed inset-0 z-50 bg-pink-50 overflow-y-auto p-4 sm:p-8 text-pink-950 font-body select-none">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-pink-200 shadow-md bg-white/90">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shadow-inner">
              <ShieldCheck size={26} />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-2xl text-pink-950">
                Amrita's Private Admin
              </h1>
              <p className="text-xs text-pink-700 font-semibold">Activity Tracking & Question/Answer Management</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Tab Navigation */}
            <div className="flex items-center bg-pink-100 p-1 rounded-full text-xs font-bold">
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-3 py-1.5 rounded-full transition-all flex items-center space-x-1 ${
                  activeTab === 'activity' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-800'
                }`}
              >
                <Activity size={13} />
                <span>📊 Activity</span>
              </button>

              <button
                onClick={() => setActiveTab('answers')}
                className={`px-3 py-1.5 rounded-full transition-all flex items-center space-x-1 ${
                  activeTab === 'answers' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-800'
                }`}
              >
                <HelpCircle size={13} />
                <span>💬 User Answers</span>
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`px-3 py-1.5 rounded-full transition-all flex items-center space-x-1 ${
                  activeTab === 'users' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-800'
                }`}
              >
                <Users size={13} />
                <span>👥 Users</span>
              </button>
            </div>

            <button
              onClick={loadDashboardData}
              className="p-2.5 rounded-full bg-pink-100 text-pink-800 hover:bg-pink-200"
              title="Refresh Data"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-rose-500 text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-md hover:bg-rose-600 transition-colors"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {successNotice && (
          <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
            <CheckCircle size={16} className="text-emerald-600" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Top Summary Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-pink-200 shadow-sm text-center">
            <span className="text-xs font-bold text-pink-700 uppercase block">Total Users</span>
            <span className="font-extrabold text-xl text-pink-950 mt-1 block">{totalUsers}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-pink-200 shadow-sm text-center">
            <span className="text-xs font-bold text-pink-700 uppercase block">Total Responses</span>
            <span className="font-extrabold text-xl text-pink-950 mt-1 block">{totalResponses}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-pink-200 shadow-sm text-center">
            <span className="text-xs font-bold text-pink-700 uppercase block">Today's Responses</span>
            <span className="font-extrabold text-xl text-pink-950 mt-1 block">{todayResponses}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-pink-200 shadow-sm text-center">
            <span className="text-xs font-bold text-pink-700 uppercase block">Total Activities</span>
            <span className="font-extrabold text-xl text-pink-950 mt-1 block">{activityTimeline.length}</span>
          </div>
        </div>

        {/* Tab 1: Phase 32 User Activity Timeline 📊 */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-72">
                  <Search size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-pink-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search activity timeline..."
                    className="w-full pl-10 pr-4 py-2 rounded-full bg-pink-50 border border-pink-200 text-xs font-bold text-pink-950 focus:outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-pink-800">Filter:</span>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-bold text-pink-950 focus:outline-none"
                  >
                    <option value="All">All Activities</option>
                    <option value="mood_checkin">❤️ Mood Check-ins</option>
                    <option value="journal_created">📖 Journal Entries</option>
                    <option value="surprise_opened">🎁 Surprises</option>
                    <option value="digital_hug">🤗 Digital Hugs</option>
                    <option value="star_discovered">🌌 Sky Stars</option>
                    <option value="favorite_saved">🫙 Saved Favorites</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Timeline View */}
            <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm space-y-4">
              {filteredActivity.length === 0 ? (
                <div className="py-12 text-center text-pink-600 font-semibold text-sm">
                  No activity logged yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredActivity.map((act) => (
                    <div
                      key={act.id}
                      className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 relative space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-sm text-pink-950 flex items-center space-x-2">
                          <Activity size={14} className="text-pink-500" />
                          <span>{act.title}</span>
                        </span>
                        <span className="text-[11px] font-bold text-pink-600">
                          {act.date} • {act.time}
                        </span>
                      </div>

                      {act.metadata?.question && (
                        <p className="text-xs font-bold text-pink-900">
                          Question: <span className="font-normal italic">"{act.metadata.question}"</span>
                        </p>
                      )}

                      {act.metadata?.answer && (
                        <p className="text-xs font-bold text-pink-950 bg-white p-2.5 rounded-xl border border-pink-100">
                          Answer: <span className="font-normal italic">"{act.metadata.answer}"</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Phase 32 User Answers 💬 (CRITICAL REQUIREMENT) */}
        {activeTab === 'answers' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-pink-950">
                  User Questions & Answers ({filteredAnswers.length})
                </h3>
                <p className="text-xs text-pink-700">Actual question and exact user answer history</p>
              </div>

              <button
                onClick={handleExportCSV}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center space-x-1.5"
              >
                <Download size={15} />
                <span>📥 Export Responses</span>
              </button>
            </div>

            <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm space-y-4">
              {filteredAnswers.length === 0 ? (
                <div className="py-12 text-center text-pink-600 font-semibold text-sm">
                  No user answers recorded yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredAnswers.map((ans) => (
                    <div
                      key={ans.id}
                      className="p-5 rounded-2xl bg-pink-50/60 border border-pink-100 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-pink-600">
                          <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 uppercase">
                            {ans.type}
                          </span>
                          <span>{ans.date} • {ans.time}</span>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-bold text-pink-900">
                            Q: <span className="font-semibold italic text-pink-950">"{ans.question || 'User Prompt'}"</span>
                          </p>
                          <p className="text-xs font-bold text-pink-950 bg-white p-3 rounded-xl border border-pink-100">
                            A: <span className="font-semibold italic text-rose-900">"{ans.answer || ans.text}"</span>
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-pink-100 flex items-center justify-between text-xs">
                        <span className="text-pink-600 font-bold">User: @{ans.user_id}</span>
                        <button
                          onClick={() => setDeletingResponseTarget(ans)}
                          className="px-3 py-1 rounded-xl bg-rose-100 text-rose-700 font-bold hover:bg-rose-200 transition-colors flex items-center space-x-1"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Confirmation Modal for Response Deletion */}
        {deletingResponseTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/30 backdrop-blur-md select-none">
            <div className="glass-panel p-6 rounded-3xl max-w-md w-full bg-white text-center border-2 border-pink-300 shadow-2xl space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
                <Trash2 size={28} />
              </div>

              <h3 className="font-heading font-extrabold text-xl text-pink-950">
                Delete this response?
              </h3>

              <p className="text-xs text-pink-700 bg-pink-50 p-3 rounded-xl border border-pink-100 italic">
                "{deletingResponseTarget.answer || deletingResponseTarget.text}"
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setDeletingResponseTarget(null)}
                  className="w-1/2 py-3 rounded-full bg-pink-100 text-pink-950 font-bold text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteResponse}
                  className="w-1/2 py-3 rounded-full bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-rose-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Users List */}
        {activeTab === 'users' && (
          <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm">
            <h3 className="font-heading font-bold text-lg text-pink-950 mb-4">Registered Users ({usersList.length})</h3>
            <div className="space-y-3">
              {usersList.map((u) => (
                <div key={u.id || u.userId} className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 flex items-center justify-between">
                  <span className="font-heading font-bold text-sm text-pink-950">{u.displayName || u.userId} (@{u.userId})</span>
                  <span className="text-xs text-pink-600 font-bold uppercase">{u.status || 'active'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
