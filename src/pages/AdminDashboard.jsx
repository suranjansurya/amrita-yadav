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
  fetchAdminAuditLogs,
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
  FileText,
  Clock,
  Filter,
} from 'lucide-react';

export function AdminDashboard({ onExit }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState('activity'); // 'activity' | 'audit' | 'answers' | 'users' | 'justforyou'
  const [filter, setFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All Time'); // 'All Time' | 'Today' | 'Yesterday' | 'Last 7 Days' | 'Last 30 Days'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState('All');

  const [activityTimeline, setActivityTimeline] = useState([]);
  const [adminAuditLogs, setAdminAuditLogs] = useState([]);
  const [userAnswersList, setUserAnswersList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [dailyMsgsList, setDailyMsgsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  // Selected User Profile details
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);

  // Edit / Password Reset / Delete Modal states
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [createUserError, setCreateUserError] = useState('');

  const [editingUser, setEditingUser] = useState(null);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editStatus, setEditStatus] = useState('active');

  const [passwordResetUser, setPasswordResetUser] = useState(null);
  const [resetPasswordInput, setResetPasswordInput] = useState('');
  const [resetPasswordError, setResetPasswordError] = useState('');

  const [deletingUserTarget, setDeletingUserTarget] = useState(null);
  const [deletingResponseTarget, setDeletingResponseTarget] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, filter, dateFilter, selectedUserFilter, activeTab]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const managedUsers = fetchManagedUsers();
      setUsersList(managedUsers);

      const [rData, actData, auditData] = await Promise.all([
        fetchAllUserResponses('All'),
        fetchUserActivityTimeline('usr-amritayadav', 'All'),
        fetchAdminAuditLogs(),
      ]);
      
      setUserAnswersList(rData || []);
      setActivityTimeline(actData || []);
      setAdminAuditLogs(auditData || []);

      if (activeTab === 'justforyou') {
        const dData = await fetchDailyMessages({ includeInactive: true });
        setDailyMsgsList(dData || []);
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
    setAdminAuditLogs([]);
    setUserAnswersList([]);
    setUsersList([]);
    if (onExit) onExit();
  };

  // Create User Handler
  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    setCreateUserError('');

    if (newPassword !== confirmPassword) {
      setCreateUserError('Passwords do not match.');
      return;
    }

    try {
      await adminCreateUser({
        username: newUsername,
        displayName: newDisplayName,
        password: newPassword,
      });

      setSuccessNotice('User created successfully ✓');
      setTimeout(() => setSuccessNotice(''), 3500);

      setIsCreateUserModalOpen(false);
      setNewUsername('');
      setNewDisplayName('');
      setNewPassword('');
      setConfirmPassword('');
      loadDashboardData();
    } catch (err) {
      setCreateUserError(err.message);
    }
  };

  // Edit User Handler
  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await adminEditUser({
        userId: editingUser.userId,
        displayName: editDisplayName,
        status: editStatus,
      });
      setSuccessNotice('User account updated successfully ✓');
      setTimeout(() => setSuccessNotice(''), 3000);
      setEditingUser(null);
      loadDashboardData();
    } catch (err) {
      console.error('[Admin] Edit user error:', err);
    }
  };

  // Status Toggle Handler
  const handleToggleStatus = async (userId) => {
    try {
      await adminToggleUserStatus(userId);
      setSuccessNotice('User status updated ✓');
      setTimeout(() => setSuccessNotice(''), 3000);
      loadDashboardData();
    } catch (err) {
      console.error('[Admin] Toggle status error:', err);
    }
  };

  // Password Reset Handler
  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    if (!passwordResetUser) return;
    setResetPasswordError('');

    try {
      await adminChangeUserPassword(passwordResetUser.userId, resetPasswordInput);
      setSuccessNotice('Password reset successfully ✓');
      setTimeout(() => setSuccessNotice(''), 3000);
      setPasswordResetUser(null);
      setResetPasswordInput('');
      loadDashboardData();
    } catch (err) {
      setResetPasswordError(err.message);
    }
  };

  // Delete User Handler
  const handleConfirmDeleteUser = async () => {
    if (!deletingUserTarget) return;

    try {
      await adminDeleteUser(deletingUserTarget.userId);
      setSuccessNotice('User account deleted ✓');
      setTimeout(() => setSuccessNotice(''), 3000);
      loadDashboardData();
    } catch (err) {
      console.error('[Admin] Delete user error:', err);
    } finally {
      setDeletingUserTarget(null);
    }
  };

  // Response Delete Handler
  const handleConfirmDeleteResponse = async () => {
    if (!deletingResponseTarget) return;

    try {
      await deleteUserResponse(deletingResponseTarget.responseType, deletingResponseTarget.id);
      setUserAnswersList((prev) => prev.filter((r) => r.id !== deletingResponseTarget.id));
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

  // Filter & Search
  const filteredUsers = usersList.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.userId.toLowerCase().includes(q) ||
      (u.displayName && u.displayName.toLowerCase().includes(q))
    );
  });

  const filteredAnswers = userAnswersList.filter((r) => {
    if (selectedUserFilter !== 'All' && r.user_id !== selectedUserFilter) return false;
    if (filter === 'onboarding') {
      const isActOnboarding = activityTimeline.some((a) => a.metadata?.source === 'login_onboarding' && a.metadata?.answer === r.text);
      if (!isActOnboarding) return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (r.question && r.question.toLowerCase().includes(q)) ||
      (r.answer && r.answer.toLowerCase().includes(q)) ||
      (r.user_id && r.user_id.toLowerCase().includes(q))
    );
  });

  const filteredActivity = activityTimeline.filter((act) => {
    if (selectedUserFilter !== 'All' && act.user_id !== selectedUserFilter) return false;
    if (filter !== 'All' && filter !== 'onboarding' && act.event_type !== filter) return false;
    if (filter === 'onboarding' && act.metadata?.source !== 'login_onboarding') return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (act.title && act.title.toLowerCase().includes(q)) ||
      (act.description && act.description.toLowerCase().includes(q)) ||
      (act.user_id && act.user_id.toLowerCase().includes(q))
    );
  });

  const filteredAuditLogs = adminAuditLogs.filter((log) => {
    if (selectedUserFilter !== 'All' && log.target_user_id !== selectedUserFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (log.action && log.action.toLowerCase().includes(q)) ||
      (log.target_user_id && log.target_user_id.toLowerCase().includes(q)) ||
      (log.details && log.details.toLowerCase().includes(q))
    );
  });

  const isUserActiveNow = (uId) => {
    const userActs = activityTimeline.filter((a) => a.user_id === uId);
    if (userActs.length === 0) return false;
    const latest = new Date(userActs[0].created_at || Date.now()).getTime();
    return Date.now() - latest < 5 * 60 * 1000;
  };

  return (
    <div className="min-h-screen bg-pink-50/50 text-pink-950 font-body p-4 sm:p-8 select-none overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <header className="glass-panel p-6 rounded-3xl bg-white/90 border-2 border-pink-200 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 text-white flex items-center justify-center shadow-md">
              <ShieldCheck size={24} />
            </div>
            <div className="text-left">
              <h1 className="font-heading font-extrabold text-2xl text-pink-950">
                Admin Control Center
              </h1>
              <p className="text-xs text-pink-700 font-semibold">
                Protected User Management, Responses & Live Activity Monitoring
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setCreateUserError('');
                setIsCreateUserModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <UserPlus size={15} />
              <span>+ CREATE USER</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-full bg-rose-100 text-rose-800 font-bold text-xs hover:bg-rose-200 transition-colors flex items-center space-x-1.5"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {successNotice && (
          <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold text-center animate-fadeIn">
            {successNotice}
          </div>
        )}

        {/* Search & User Selection Bar */}
        <div className="glass-panel p-4 rounded-2xl bg-white border border-pink-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user, response, question..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-pink-50/60 border border-pink-200 text-pink-950 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <Search size={14} className="absolute left-3 top-3 text-pink-400" />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter size={14} className="text-pink-600" />
            <span className="text-xs font-bold text-pink-900">User:</span>
            <select
              value={selectedUserFilter}
              onChange={(e) => setSelectedUserFilter(e.target.value)}
              className="p-2 rounded-xl bg-pink-50/60 border border-pink-200 text-pink-950 text-xs font-bold focus:outline-none"
            >
              <option value="All">All Users ({usersList.length})</option>
              {usersList.map((u) => (
                <option key={u.userId} value={u.userId}>
                  @{u.userId} ({u.displayName || u.userId})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex flex-wrap items-center gap-2 border-b border-pink-200 pb-3">
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-5 py-2.5 rounded-2xl font-heading font-extrabold text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              activeTab === 'activity' ? 'bg-pink-500 text-white shadow-md' : 'bg-white text-pink-900 hover:bg-pink-100'
            }`}
          >
            <Activity size={15} />
            <span>📊 Live User Activity ({filteredActivity.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-5 py-2.5 rounded-2xl font-heading font-extrabold text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              activeTab === 'audit' ? 'bg-pink-500 text-white shadow-md' : 'bg-white text-pink-900 hover:bg-pink-100'
            }`}
          >
            <ShieldCheck size={15} />
            <span>👑 Admin Audit Logs ({filteredAuditLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('answers')}
            className={`px-5 py-2.5 rounded-2xl font-heading font-extrabold text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              activeTab === 'answers' ? 'bg-pink-500 text-white shadow-md' : 'bg-white text-pink-900 hover:bg-pink-100'
            }`}
          >
            <MessageSquare size={15} />
            <span>💬 All Responses ({filteredAnswers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 rounded-2xl font-heading font-extrabold text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              activeTab === 'users' ? 'bg-pink-500 text-white shadow-md' : 'bg-white text-pink-900 hover:bg-pink-100'
            }`}
          >
            <Users size={15} />
            <span>👥 User Management ({usersList.length})</span>
          </button>
        </div>

        {/* Tab 1: 📊 LIVE USER ACTIVITY */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            
            {/* Filter Pills */}
            <div className="glass-panel p-4 rounded-2xl bg-white border border-pink-200 shadow-sm flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-pink-900">Activity Category Filter:</span>
              <div className="flex flex-wrap gap-1.5">
                {['All', 'onboarding', 'login', 'daily_question_answered', 'daily_checkin_completed', 'mood_checkin', 'journal_created', 'hug_sent', 'star_discovered'].map((fKey) => (
                  <button
                    key={fKey}
                    onClick={() => setFilter(fKey)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      filter === fKey ? 'bg-pink-500 text-white shadow-sm' : 'bg-pink-50 text-pink-800 hover:bg-pink-100'
                    }`}
                  >
                    {fKey === 'onboarding' ? '📋 5 Login Answers' : fKey.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                <h3 className="font-heading font-extrabold text-lg text-pink-950 flex items-center space-x-2">
                  <Activity size={18} className="text-pink-500" />
                  <span>📊 LIVE USER ACTIVITY TIMELINE</span>
                </h3>

                <div className="flex items-center space-x-2 text-xs font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  <span className="text-emerald-700">Live Monitor Active</span>
                </div>
              </div>

              {filteredActivity.length === 0 ? (
                <div className="py-12 text-center text-pink-600 font-semibold text-sm">
                  No user activity recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredActivity.map((act) => (
                    <div
                      key={act.id}
                      className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-1.5 hover:bg-pink-50 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-heading font-extrabold text-pink-950">
                            👤 @{act.user_id || 'amritayadav'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isUserActiveNow(act.user_id) ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {isUserActiveNow(act.user_id) ? '🟢 Active' : '⚪ Offline'}
                          </span>
                        </div>

                        <span className="text-[11px] font-bold text-pink-600 flex items-center space-x-1">
                          <Clock size={12} />
                          <span>{act.time}</span>
                        </span>
                      </div>

                      <div className="font-heading font-bold text-sm text-pink-900 pt-0.5">
                        {act.title}
                      </div>

                      {act.metadata?.question && (
                        <p className="text-xs font-bold text-pink-900">
                          ❓ Question: <span className="font-normal italic">"{act.metadata.question}"</span>
                        </p>
                      )}

                      {act.metadata?.answer && (
                        <p className="text-xs font-bold text-pink-950 bg-white p-2.5 rounded-xl border border-pink-100">
                          💬 Answer: <span className="font-normal italic text-rose-900">"{act.metadata.answer}"</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: 👑 ADMIN AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-pink-100 shadow-sm text-left">
              <div className="flex items-center space-x-2">
                <ShieldCheck size={20} className="text-pink-600" />
                <h3 className="font-heading font-extrabold text-lg text-pink-950">
                  Admin User-Management Audit Trail ({filteredAuditLogs.length})
                </h3>
              </div>
              <span className="text-xs font-bold text-pink-700 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                Audited Actions
              </span>
            </div>

            {filteredAuditLogs.length === 0 ? (
              <div className="glass-panel p-12 text-center text-pink-700 font-bold text-sm bg-white/80 rounded-3xl">
                No admin audit events found. Actions performed on user accounts will appear here. 👑
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAuditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-5 rounded-2xl bg-white border border-pink-200 shadow-sm hover:shadow-md transition-all text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 ${
                        log.status === 'Failed'
                          ? 'bg-rose-500'
                          : log.action.includes('DELETE')
                          ? 'bg-red-500'
                          : log.action.includes('CREATE')
                          ? 'bg-emerald-500'
                          : log.action.includes('PASSWORD')
                          ? 'bg-amber-500'
                          : 'bg-pink-500'
                      }`}>
                        {log.action.includes('DELETE') ? (
                          <Trash2 size={18} />
                        ) : log.action.includes('CREATE') ? (
                          <UserPlus size={18} />
                        ) : log.action.includes('PASSWORD') ? (
                          <KeyRound size={18} />
                        ) : (
                          <ShieldCheck size={18} />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-heading font-extrabold text-sm text-pink-950">
                            {log.action}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            log.status === 'Failed'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {log.status || 'Success'}
                          </span>
                        </div>

                        <p className="text-xs font-bold text-pink-900">
                          Target User: <span className="text-pink-700 font-extrabold">@{log.target_user_id}</span> {log.target_user_display_name && log.target_user_display_name !== log.target_user_id ? `(${log.target_user_display_name})` : ''}
                        </p>

                        <p className="text-xs text-pink-700 font-medium">
                          {log.details}
                        </p>

                        <p className="text-[11px] font-semibold text-pink-500 flex items-center space-x-2 pt-1">
                          <span>👑 Admin: {log.admin_id || 'admin'}</span>
                          <span>•</span>
                          <span>📅 {log.date || new Date(log.created_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>⏰ {log.time || new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: 💬 ALL USER RESPONSES */}
        {activeTab === 'answers' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-pink-950">
                  💬 ALL USER RESPONSES ({filteredAnswers.length})
                </h3>
                <p className="text-xs text-pink-700">Actual questions and exact user answers</p>
              </div>

              <button
                onClick={handleExportCSV}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center space-x-1.5"
              >
                <Download size={15} />
                <span>📥 Export Responses</span>
              </button>
            </div>

            {/* Response Cards Grid */}
            <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm space-y-4">
              {filteredAnswers.length === 0 ? (
                <div className="py-12 text-center text-pink-600 font-semibold text-sm">
                  No user responses found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredAnswers.map((ans) => (
                    <div
                      key={ans.id}
                      className="p-5 rounded-2xl bg-pink-50/60 border border-pink-100 space-y-3 flex flex-col justify-between text-left"
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
                            ❓ Question: <span className="font-semibold italic text-pink-950">"{ans.question || 'User Prompt'}"</span>
                          </p>
                          <p className="text-xs font-bold text-pink-950 bg-white p-3 rounded-xl border border-pink-100">
                            💬 Answer: <span className="font-semibold italic text-rose-900">"{ans.answer || ans.text}"</span>
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

        {/* Tab 4: 👥 USER MANAGEMENT (WITH FULL ACTIONS & AUDIT LOGGING) */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            
            {/* Header Controls Bar with + Create User */}
            <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-bold text-lg text-pink-950">
                  👥 USER MANAGEMENT ({usersList.length} accounts)
                </h3>
                <p className="text-xs text-pink-700">Create, edit, reset password, disable, and delete User accounts</p>
              </div>

              <button
                onClick={() => {
                  setCreateUserError('');
                  setIsCreateUserModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <UserPlus size={16} />
                <span>+ CREATE USER</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-pink-100 text-[11px] font-bold text-pink-700 uppercase tracking-wider">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50 text-xs font-semibold">
                  {filteredUsers.map((u) => (
                    <tr key={u.id || u.userId} className="hover:bg-pink-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-pink-950 block">
                          {u.displayName || u.userId} (@{u.userId})
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800 text-[11px] font-bold uppercase">
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          u.status === 'disabled' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {u.status || 'active'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-pink-700">
                        {new Date(u.created_at || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setEditDisplayName(u.displayName || u.userId);
                            setEditStatus(u.status || 'active');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-pink-100 text-pink-900 font-bold text-[11px] hover:bg-pink-200"
                          title="Edit User Details"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() => {
                            setPasswordResetUser(u);
                            setResetPasswordInput('');
                            setResetPasswordError('');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold text-[11px] hover:bg-amber-200"
                          title="Reset User Password"
                        >
                          🔑 Reset Pass
                        </button>

                        <button
                          onClick={() => handleToggleStatus(u.userId)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                            u.status === 'disabled' ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                          title={u.status === 'disabled' ? 'Enable User' : 'Disable User'}
                        >
                          {u.status === 'disabled' ? '🟢 Enable' : '🔒 Disable'}
                        </button>

                        {u.userId.toLowerCase() !== 'amritayadav' && (
                          <button
                            onClick={() => setDeletingUserTarget(u)}
                            className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-bold text-[11px] hover:bg-rose-200"
                            title="Delete User"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal 1: Create User Modal */}
            {isCreateUserModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/30 backdrop-blur-md select-none">
                <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full bg-white border-2 border-pink-300 shadow-2xl space-y-4 text-left">
                  <h3 className="font-heading font-extrabold text-xl text-pink-950">
                    + Create New User Account 👤
                  </h3>

                  <form onSubmit={handleCreateUserSubmit} className="space-y-3.5">
                    <div>
                      <label className="text-xs font-bold text-pink-900 uppercase block mb-1">Username *</label>
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="e.g. amritayadav"
                        className="w-full p-3 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 text-sm font-bold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-pink-900 uppercase block mb-1">Display Name (Optional)</label>
                      <input
                        type="text"
                        value={newDisplayName}
                        onChange={(e) => setNewDisplayName(e.target.value)}
                        placeholder="e.g. Amrita Yadav"
                        className="w-full p-3 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 text-sm font-bold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-pink-900 uppercase block mb-1">Password (min 8 chars) *</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-3 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 text-sm font-bold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-pink-900 uppercase block mb-1">Confirm Password *</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-3 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 text-sm font-bold focus:outline-none"
                      />
                    </div>

                    {createUserError && (
                      <p className="text-xs font-bold text-rose-600 animate-bounce">{createUserError}</p>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsCreateUserModalOpen(false)}
                        className="w-1/2 py-3 rounded-full bg-pink-100 text-pink-950 font-bold text-xs uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 py-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all"
                      >
                        Create User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal 2: Edit User Details */}
            {editingUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/30 backdrop-blur-md select-none">
                <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full bg-white border-2 border-pink-300 shadow-2xl space-y-4 text-left">
                  <h3 className="font-heading font-extrabold text-xl text-pink-950">
                    ✏️ Edit User Details (@{editingUser.userId})
                  </h3>

                  <form onSubmit={handleEditUserSubmit} className="space-y-3.5">
                    <div>
                      <label className="text-xs font-bold text-pink-900 uppercase block mb-1">Display Name</label>
                      <input
                        type="text"
                        value={editDisplayName}
                        onChange={(e) => setEditDisplayName(e.target.value)}
                        className="w-full p-3 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 text-sm font-bold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-pink-900 uppercase block mb-1">Account Status</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="w-full p-3 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 text-sm font-bold focus:outline-none"
                      >
                        <option value="active">Active 🟢</option>
                        <option value="disabled">Disabled 🔒</option>
                      </select>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingUser(null)}
                        className="w-1/2 py-3 rounded-full bg-pink-100 text-pink-950 font-bold text-xs uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 py-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal 3: Change/Reset Password */}
            {passwordResetUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/30 backdrop-blur-md select-none">
                <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full bg-white border-2 border-pink-300 shadow-2xl space-y-4 text-left">
                  <h3 className="font-heading font-extrabold text-xl text-pink-950">
                    🔑 Reset Password for @{passwordResetUser.userId}
                  </h3>

                  <form onSubmit={handlePasswordResetSubmit} className="space-y-3.5">
                    <div>
                      <label className="text-xs font-bold text-pink-900 uppercase block mb-1">New Password (min 8 chars) *</label>
                      <input
                        type="password"
                        value={resetPasswordInput}
                        onChange={(e) => setResetPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-3 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 text-sm font-bold focus:outline-none"
                      />
                    </div>

                    {resetPasswordError && (
                      <p className="text-xs font-bold text-rose-600 animate-bounce">{resetPasswordError}</p>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setPasswordResetUser(null)}
                        className="w-1/2 py-3 rounded-full bg-pink-100 text-pink-950 font-bold text-xs uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 py-3 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all"
                      >
                        Reset Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal 4: Delete User Confirmation */}
            {deletingUserTarget && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/30 backdrop-blur-md select-none">
                <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full bg-white border-2 border-pink-300 shadow-2xl space-y-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
                    <Trash2 size={28} />
                  </div>

                  <h3 className="font-heading font-extrabold text-xl text-pink-950">
                    Delete User Account @{deletingUserTarget.userId}?
                  </h3>

                  <p className="text-xs text-pink-700 font-semibold bg-rose-50 p-3 rounded-2xl border border-rose-100">
                    This action will permanently delete user account details. Audit history will be safely preserved.
                  </p>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setDeletingUserTarget(null)}
                      className="w-1/2 py-3 rounded-full bg-pink-100 text-pink-950 font-bold text-xs uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDeleteUser}
                      className="w-1/2 py-3 rounded-full bg-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-rose-700 transition-all"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
