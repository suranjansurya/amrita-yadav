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
} from '../lib/supabase';
import {
  authenticateAdmin,
  logoutAdmin,
  fetchManagedUsers,
  adminCreateUser,
  adminToggleUserStatus,
  adminResetUserPassword,
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
} from 'lucide-react';

export function AdminDashboard({ onExit }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState('justforyou'); // 'justforyou' | 'constellation' | 'secrets' | 'comfort' | 'users'
  const [filter, setFilter] = useState('All');
  const [dailyMsgsList, setDailyMsgsList] = useState([]);
  const [constList, setConstList] = useState([]);
  const [secretsList, setSecretsList] = useState([]);
  const [comfortList, setComfortList] = useState([]);
  const [usersListManaged, setUsersListManaged] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form states for Just For You Manager
  const [isDailyMsgFormOpen, setIsDailyMsgFormOpen] = useState(false);
  const [editingDailyMsgId, setEditingDailyMsgId] = useState(null);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgMessage, setMsgMessage] = useState('');
  const [msgCategory, setMsgCategory] = useState('General');
  const [msgFormMsg, setMsgFormMsg] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, filter, activeTab]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const managedUsers = fetchManagedUsers();
      setUsersListManaged(managedUsers);

      if (activeTab === 'justforyou') {
        const dData = await fetchDailyMessages({ includeInactive: true });
        setDailyMsgsList(dData);
      } else if (activeTab === 'constellation') {
        const cData = await fetchConstellations({ includeInactive: true });
        setConstList(cData);
      } else if (activeTab === 'secrets') {
        const sData = await fetchSecretUnlocks({ includeInactive: true });
        setSecretsList(sData);
      } else if (activeTab === 'comfort') {
        const cmfData = await fetchComfortMessages({ includeInactive: true });
        setComfortList(cmfData);
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
    setDailyMsgsList([]);
    setConstList([]);
    setSecretsList([]);
    setComfortList([]);
    if (onExit) onExit();
  };

  // Daily Messages Handlers
  const handleOpenNewDailyMsgForm = () => {
    setEditingDailyMsgId(null);
    setMsgTitle('');
    setMsgMessage('');
    setMsgCategory('General');
    setMsgFormMsg('');
    setIsDailyMsgFormOpen(true);
  };

  const handleEditDailyMsgClick = (m) => {
    setEditingDailyMsgId(m.id);
    setMsgTitle(m.title);
    setMsgMessage(m.message);
    setMsgCategory(m.category || 'General');
    setMsgFormMsg('');
    setIsDailyMsgFormOpen(true);
  };

  const handleSaveDailyMsgSubmit = async (e) => {
    e.preventDefault();
    if (!msgTitle.trim() || !msgMessage.trim()) {
      setMsgFormMsg('Title and Message are required');
      return;
    }

    try {
      await saveDailyMessage({
        id: editingDailyMsgId,
        title: msgTitle,
        message: msgMessage,
        category: msgCategory,
      });

      setMsgFormMsg('Daily message saved! 💌');
      setTimeout(() => {
        setIsDailyMsgFormOpen(false);
        loadDashboardData();
      }, 1000);
    } catch (err) {
      setMsgFormMsg(`Error: ${err.message}`);
    }
  };

  const handleDeleteDailyMsgClick = async (id) => {
    if (window.confirm('Delete this daily message definition?')) {
      await deleteDailyMessage(id);
      loadDashboardData();
    }
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
              <p className="text-xs text-pink-700 font-semibold">Just For You Manager & Owner Controls</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Tab Navigation */}
            <div className="flex items-center bg-pink-100 p-1 rounded-full text-xs font-bold">
              <button
                onClick={() => setActiveTab('justforyou')}
                className={`px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${
                  activeTab === 'justforyou' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-800'
                }`}
              >
                <Mail size={13} />
                <span>💌 Just For You Manager</span>
              </button>

              <button
                onClick={() => setActiveTab('constellation')}
                className={`px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${
                  activeTab === 'constellation' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-800'
                }`}
              >
                <Compass size={13} />
                <span>Constellations</span>
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${
                  activeTab === 'users' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-800'
                }`}
              >
                <Users size={13} />
                <span>Users</span>
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

        {/* Tab 1: Phase 29 Just For You Manager 💌 */}
        {activeTab === 'justforyou' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-pink-950">
                  Daily Messages & Compliments ({dailyMsgsList.length})
                </h3>
                <p className="text-xs text-pink-700">Add or edit daily messages and compliments displayed in Just For You</p>
              </div>

              <button
                onClick={handleOpenNewDailyMsgForm}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center space-x-1.5"
              >
                <PlusCircle size={14} />
                <span>Add Daily Message 💌</span>
              </button>
            </div>

            <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm space-y-4">
              {dailyMsgsList.length === 0 ? (
                <div className="py-12 text-center text-pink-600 font-semibold text-sm">
                  No daily messages created yet. Click "Add Daily Message 💌" to create your first one!
                </div>
              ) : (
                <div className="space-y-3">
                  {dailyMsgsList.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-heading font-bold text-base text-pink-950">
                            {m.title}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800 font-bold text-[11px]">
                            {m.category || 'General'}
                          </span>
                        </div>
                        <p className="text-xs text-pink-900 italic">"{m.message}"</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditDailyMsgClick(m)}
                          className="px-3 py-1.5 rounded-full bg-pink-100 text-pink-800 text-xs font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDailyMsgClick(m.id)}
                          className="p-2 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Daily Message Form Modal */}
            {isDailyMsgFormOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/30 backdrop-blur-md select-none">
                <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full bg-white text-left border-2 border-pink-300 shadow-2xl space-y-4">
                  <h3 className="font-heading font-bold text-xl text-pink-950">
                    {editingDailyMsgId ? 'Edit Daily Message 💌' : 'Add Daily Message 💌'}
                  </h3>

                  <form onSubmit={handleSaveDailyMsgSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-pink-900 uppercase block mb-1">Title *</label>
                      <input
                        type="text"
                        value={msgTitle}
                        onChange={(e) => setMsgTitle(e.target.value)}
                        placeholder="Title..."
                        className="w-full p-3 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 text-sm font-bold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-pink-900 uppercase block mb-1">Message *</label>
                      <textarea
                        rows={3}
                        value={msgMessage}
                        onChange={(e) => setMsgMessage(e.target.value)}
                        placeholder="Message text..."
                        className="w-full p-3 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 text-sm font-bold focus:outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-pink-900 uppercase block mb-1">Category</label>
                      <select
                        value={msgCategory}
                        onChange={(e) => setMsgCategory(e.target.value)}
                        className="w-full p-3 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 text-xs font-bold focus:outline-none"
                      >
                        <option value="General">General</option>
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                        <option value="Night">Night</option>
                        <option value="Happy">Happy</option>
                        <option value="Peaceful">Peaceful</option>
                        <option value="Okay">Okay</option>
                        <option value="Low">Low</option>
                        <option value="Tired">Tired</option>
                      </select>
                    </div>

                    {msgFormMsg && <p className="text-xs font-bold text-pink-700">{msgFormMsg}</p>}

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsDailyMsgFormOpen(false)}
                        className="w-1/2 py-3 rounded-full bg-pink-100 text-pink-950 font-bold text-xs uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 py-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all"
                      >
                        Save Message 💌
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Other Admin Tabs */}
        {activeTab === 'users' && (
          <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm">
            <h3 className="font-heading font-bold text-lg text-pink-950 mb-4">Registered Users ({usersListManaged.length})</h3>
            <div className="space-y-3">
              {usersListManaged.map((u) => (
                <div key={u.id || u.userId} className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 flex items-center justify-between">
                  <span className="font-heading font-bold text-sm text-pink-950">{u.displayName || u.userId} ({u.userId})</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
