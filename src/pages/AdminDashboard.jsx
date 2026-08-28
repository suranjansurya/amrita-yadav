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
  fetchMoodAnalytics,
  fetchUser360Profile,
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
  X,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Trophy,
} from 'lucide-react';

export function AdminDashboard({ onExit }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'activity' | 'memories' | 'audit' | 'answers' | 'users' | 'justforyou'
  const [filter, setFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All Time'); // 'All Time' | 'Today' | 'Last 7 Days' | 'Last 30 Days'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState('All');

  const [moodAnalyticsData, setMoodAnalyticsData] = useState({
    totalCheckIns: 0,
    currentMood: '😊 Happy',
    isTodayCompleted: false,
    mostCommonMood: '😊 Happy',
    streak: 0,
    distribution: { '😊 Happy': 0, '😌 Peaceful': 0, '😐 Okay': 0, '😔 Low': 0, '😴 Tired': 0 },
    history: [],
    trendSeries: [],
  });

  const [activityTimeline, setActivityTimeline] = useState([]);
  const [adminAuditLogs, setAdminAuditLogs] = useState([]);
  const [userAnswersList, setUserAnswersList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [memoriesList, setMemoriesList] = useState([]);
  const [dailyMsgsList, setDailyMsgsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  // Selected User 360° Profile details
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);
  const [user360Data, setUser360Data] = useState(null);
  const [isLoading360, setIsLoading360] = useState(false);
  const [profileFeatureFilter, setProfileFeatureFilter] = useState('All');
  const [expandedCheckInDate, setExpandedCheckInDate] = useState(null);

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

  // Memory Management Modal states
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [memTitle, setMemTitle] = useState('');
  const [memCategory, setMemCategory] = useState('💗 Special');
  const [memShortDesc, setMemShortDesc] = useState('');
  const [memFullDesc, setMemFullDesc] = useState('');
  const [memImageUrl, setMemImageUrl] = useState('');
  const [memTargetUser, setMemTargetUser] = useState('All');
  const [memDate, setMemDate] = useState('');
  const [memIsVisible, setMemIsVisible] = useState(true);
  const [deletingMemoryTarget, setDeletingMemoryTarget] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, filter, dateFilter, selectedUserFilter, activeTab]);

  useEffect(() => {
    if (selectedProfileUser) {
      loadUser360Profile(selectedProfileUser.userId);
    } else {
      setUser360Data(null);
    }
  }, [selectedProfileUser]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const managedUsers = fetchManagedUsers();
      setUsersList(managedUsers);

      const [rData, actData, auditData, analyticsData, mems] = await Promise.all([
        fetchAllUserResponses('All'),
        fetchUserActivityTimeline('usr-amritayadav', 'All'),
        fetchAdminAuditLogs(),
        fetchMoodAnalytics({ dateFilter, userFilter: selectedUserFilter }),
        fetchMemories({ includeHidden: true }),
      ]);
      
      setUserAnswersList(rData || []);
      setActivityTimeline(actData || []);
      setAdminAuditLogs(auditData || []);
      setMoodAnalyticsData(analyticsData);
      setMemoriesList(mems || []);

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

  const loadUser360Profile = async (uId) => {
    setIsLoading360(true);
    try {
      const data = await fetchUser360Profile(uId);
      setUser360Data(data);
    } catch (e) {
      console.error('[AdminDashboard] Load 360 profile error:', e);
    } finally {
      setIsLoading360(false);
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
    setMemoriesList([]);
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

  // Memory Submit Handler (Add / Edit)
  const handleSaveMemorySubmit = async (e) => {
    e.preventDefault();
    if (!memTitle.trim()) return;

    try {
      await saveMemory({
        id: editingMemory?.id,
        title: memTitle,
        category: memCategory,
        short_description: memShortDesc,
        full_description: memFullDesc,
        image_url: memImageUrl,
        target_user_id: memTargetUser,
        memory_date: memDate || new Date().toISOString().split('T')[0],
        is_visible: memIsVisible,
      });

      setSuccessNotice(`Memory ${editingMemory ? 'updated' : 'created'} successfully ✓`);
      setTimeout(() => setSuccessNotice(''), 3000);

      setIsMemoryModalOpen(false);
      setEditingMemory(null);
      setMemTitle('');
      setMemShortDesc('');
      setMemFullDesc('');
      setMemImageUrl('');
      setMemTargetUser('All');
      setMemDate('');
      loadDashboardData();
    } catch (err) {
      console.error('[Admin] Memory save error:', err);
    }
  };

  // Memory Delete Handler
  const handleConfirmDeleteMemory = async () => {
    if (!deletingMemoryTarget) return;
    try {
      await deleteMemory(deletingMemoryTarget.id);
      setSuccessNotice('Memory deleted permanently ✓');
      setTimeout(() => setSuccessNotice(''), 3000);
      loadDashboardData();
    } catch (err) {
      console.error('[Admin] Delete memory error:', err);
    } finally {
      setDeletingMemoryTarget(null);
    }
  };

  // Memory Toggle Visibility (Publish / Unpublish)
  const handleToggleMemoryVisibility = async (memId) => {
    try {
      await toggleMemoryVisibility(memId);
      setSuccessNotice('Memory visibility toggled ✓');
      setTimeout(() => setSuccessNotice(''), 3000);
      loadDashboardData();
    } catch (err) {
      console.error('[Admin] Toggle visibility error:', err);
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
      if (selectedProfileUser) loadUser360Profile(selectedProfileUser.userId);
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
      if (selectedProfileUser) loadUser360Profile(selectedProfileUser.userId);
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
      if (selectedProfileUser) loadUser360Profile(selectedProfileUser.userId);
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
      if (selectedProfileUser?.userId === deletingUserTarget.userId) {
        setSelectedProfileUser(null);
      }
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
      if (selectedProfileUser) loadUser360Profile(selectedProfileUser.userId);
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

  const filteredMemories = memoriesList.filter((m) => {
    if (selectedUserFilter !== 'All' && m.target_user_id !== 'All' && m.target_user_id !== selectedUserFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (m.title && m.title.toLowerCase().includes(q)) ||
      (m.category && m.category.toLowerCase().includes(q)) ||
      (m.short_description && m.short_description.toLowerCase().includes(q))
    );
  });

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
                Photo & Memory Wall, User 360° Profile & System Management
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

        {/* Filter Controls Bar (Date Filter & User Filter) */}
        <div className="glass-panel p-4 rounded-2xl bg-white border border-pink-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user, memory, question..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-pink-50/60 border border-pink-200 text-pink-950 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <Search size={14} className="absolute left-3 top-3 text-pink-400" />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center space-x-1.5">
              <Calendar size={14} className="text-pink-600" />
              <span className="text-xs font-bold text-pink-900">Period:</span>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="p-2 rounded-xl bg-pink-50/60 border border-pink-200 text-pink-950 text-xs font-bold focus:outline-none"
              >
                <option value="All Time">All Time</option>
                <option value="Today">Today</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5">
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
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex flex-wrap items-center gap-2 border-b border-pink-200 pb-3">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-2.5 rounded-2xl font-heading font-extrabold text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              activeTab === 'analytics' ? 'bg-pink-500 text-white shadow-md' : 'bg-white text-pink-900 hover:bg-pink-100'
            }`}
          >
            <Heart size={15} className="fill-pink-200" />
            <span>💗 Mood Analytics</span>
          </button>

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
            onClick={() => setActiveTab('memories')}
            className={`px-5 py-2.5 rounded-2xl font-heading font-extrabold text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              activeTab === 'memories' ? 'bg-pink-500 text-white shadow-md' : 'bg-white text-pink-900 hover:bg-pink-100'
            }`}
          >
            <ImageIcon size={15} />
            <span>🖼️ Memory Management ({filteredMemories.length})</span>
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

        {/* Tab 0: 💗 MOOD ANALYTICS DASHBOARD */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="glass-panel p-4 rounded-3xl bg-white border border-pink-200 shadow-sm text-left space-y-1">
                <span className="text-[11px] font-bold text-pink-600 uppercase tracking-wider block">Current Mood</span>
                <div className="font-heading font-extrabold text-xl sm:text-2xl text-pink-950 truncate">
                  {moodAnalyticsData.currentMood}
                </div>
              </div>
              <div className="glass-panel p-4 rounded-3xl bg-white border border-pink-200 shadow-sm text-left space-y-1">
                <span className="text-[11px] font-bold text-pink-600 uppercase tracking-wider block">Today's Check-in</span>
                <div className="font-heading font-extrabold text-xl sm:text-2xl text-pink-950">
                  {moodAnalyticsData.isTodayCompleted ? 'Completed ✅' : 'Pending ⏳'}
                </div>
              </div>
              <div className="glass-panel p-4 rounded-3xl bg-white border border-pink-200 shadow-sm text-left space-y-1">
                <span className="text-[11px] font-bold text-pink-600 uppercase tracking-wider block">Most Common</span>
                <div className="font-heading font-extrabold text-xl sm:text-2xl text-pink-950 truncate">
                  {moodAnalyticsData.mostCommonMood}
                </div>
              </div>
              <div className="glass-panel p-4 rounded-3xl bg-white border border-pink-200 shadow-sm text-left space-y-1">
                <span className="text-[11px] font-bold text-pink-600 uppercase tracking-wider block">Current Streak</span>
                <div className="font-heading font-extrabold text-xl sm:text-2xl text-pink-950">
                  🔥 {moodAnalyticsData.streak} Days
                </div>
              </div>
              <div className="glass-panel p-4 rounded-3xl bg-white border border-pink-200 shadow-sm text-left space-y-1">
                <span className="text-[11px] font-bold text-pink-600 uppercase tracking-wider block">Total Check-ins</span>
                <div className="font-heading font-extrabold text-xl sm:text-2xl text-pink-950">
                  {moodAnalyticsData.totalCheckIns}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: 📊 LIVE USER ACTIVITY */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm space-y-4">
              <h3 className="font-heading font-extrabold text-lg text-pink-950 flex items-center space-x-2">
                <Activity size={18} className="text-pink-500" />
                <span>📊 LIVE USER ACTIVITY TIMELINE</span>
              </h3>
              <div className="space-y-3">
                {filteredActivity.map((act) => (
                  <div key={act.id} className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 text-left">
                    <div className="flex items-center justify-between text-xs font-bold text-pink-950">
                      <span>👤 @{act.user_id || 'amritayadav'}</span>
                      <span className="text-pink-600">{act.time}</span>
                    </div>
                    <p className="font-heading font-bold text-sm text-pink-900 pt-1">{act.title}</p>
                    {act.description && <p className="text-xs text-pink-700 italic">{act.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 🖼️ MEMORY MANAGEMENT */}
        {activeTab === 'memories' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-pink-950">
                  🖼️ MEMORY MANAGEMENT ({filteredMemories.length} items)
                </h3>
                <p className="text-xs text-pink-700">Add, edit, publish/unpublish, and manage Memory Wall items</p>
              </div>

              <button
                onClick={() => {
                  setEditingMemory(null);
                  setMemTitle('');
                  setMemCategory('💗 Special');
                  setMemShortDesc('');
                  setMemFullDesc('');
                  setMemImageUrl('');
                  setMemTargetUser('All');
                  setMemDate(new Date().toISOString().split('T')[0]);
                  setMemIsVisible(true);
                  setIsMemoryModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <PlusCircle size={16} />
                <span>+ ADD MEMORY</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMemories.map((mem) => (
                <div key={mem.id} className="p-5 rounded-3xl bg-white border border-pink-200 shadow-sm space-y-3 flex flex-col justify-between text-left">
                  <div className="space-y-2">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-pink-100">
                      <img
                        src={mem.image_url || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80'}
                        alt={mem.title}
                        className="w-full h-full object-cover"
                      />
                      <span className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        mem.is_visible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {mem.is_visible ? '🟢 Published' : '🔴 Hidden'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold text-pink-600">
                      <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-800">{mem.category}</span>
                      <span>Target: @{mem.target_user_id || 'All'}</span>
                    </div>

                    <h4 className="font-heading font-extrabold text-base text-pink-950">{mem.title}</h4>
                    <p className="text-xs text-pink-800 italic line-clamp-2">"{mem.short_description || mem.full_description}"</p>
                  </div>

                  <div className="pt-3 border-t border-pink-100 flex items-center justify-between text-xs font-bold">
                    <button
                      onClick={() => handleToggleMemoryVisibility(mem.id)}
                      className={`px-3 py-1 rounded-xl font-bold text-[11px] ${
                        mem.is_visible ? 'bg-rose-100 text-rose-800 hover:bg-rose-200' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                    >
                      {mem.is_visible ? '🔴 Unpublish' : '🟢 Publish'}
                    </button>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => {
                          setEditingMemory(mem);
                          setMemTitle(mem.title || '');
                          setMemCategory(mem.category || '💗 Special');
                          setMemShortDesc(mem.short_description || '');
                          setMemFullDesc(mem.full_description || '');
                          setMemImageUrl(mem.image_url || '');
                          setMemTargetUser(mem.target_user_id || 'All');
                          setMemDate(mem.memory_date || '');
                          setMemIsVisible(mem.is_visible !== false);
                          setIsMemoryModalOpen(true);
                        }}
                        className="px-3 py-1 rounded-xl bg-pink-100 text-pink-900 font-bold hover:bg-pink-200"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => setDeletingMemoryTarget(mem)}
                        className="px-3 py-1 rounded-xl bg-rose-100 text-rose-700 font-bold hover:bg-rose-200"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: 👑 ADMIN AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-pink-100 shadow-sm text-left">
              <h3 className="font-heading font-extrabold text-lg text-pink-950">
                Admin User-Management Audit Trail ({filteredAuditLogs.length})
              </h3>
            </div>
            <div className="space-y-3">
              {filteredAuditLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-white border border-pink-200 text-left">
                  <span className="font-bold text-pink-950 text-sm">{log.action}</span>
                  <p className="text-xs text-pink-700">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: 💬 ALL USER RESPONSES */}
        {activeTab === 'answers' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-pink-950">
                💬 ALL USER RESPONSES ({filteredAnswers.length})
              </h3>
              <button onClick={handleExportCSV} className="px-4 py-2 rounded-full bg-pink-500 text-white font-bold text-xs uppercase">
                📥 Export Responses
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: 👥 USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-pink-950">
                👥 USER MANAGEMENT ({usersList.length} accounts)
              </h3>
              <button onClick={() => setIsCreateUserModalOpen(true)} className="px-4 py-2 rounded-full bg-pink-500 text-white font-bold text-xs uppercase">
                + CREATE USER
              </button>
            </div>

            <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-pink-100 text-[11px] font-bold text-pink-700 uppercase">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.userId} className="border-b border-pink-50">
                      <td className="py-3 px-4 font-bold">{u.displayName || u.userId} (@{u.userId})</td>
                      <td className="py-3 px-4">{u.status || 'active'}</td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => setSelectedProfileUser(u)} className="px-3 py-1 rounded-xl bg-pink-100 text-pink-900 font-bold text-xs">
                          View 360° Profile 👤
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Add / Edit Memory */}
        {isMemoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/30 backdrop-blur-md text-left">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full bg-white border-2 border-pink-300 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <h3 className="font-heading font-extrabold text-xl text-pink-950">
                {editingMemory ? '✏️ Edit Memory' : '➕ Add New Memory'}
              </h3>

              <form onSubmit={handleSaveMemorySubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-pink-900 uppercase block mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={memTitle}
                    onChange={(e) => setMemTitle(e.target.value)}
                    placeholder="e.g. A Beautiful Walk in the Park"
                    className="w-full p-3 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-pink-900 uppercase block mb-1">Category</label>
                  <select
                    value={memCategory}
                    onChange={(e) => setMemCategory(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 text-xs font-bold"
                  >
                    {['💗 Special', '🌸 Beautiful Moments', '🎉 Celebration', '✈️ Journey', '😊 Happy', '✨ Favorite'].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-pink-900 uppercase block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={memImageUrl}
                    onChange={(e) => setMemImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-3 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-pink-900 uppercase block mb-1">Target User</label>
                  <select
                    value={memTargetUser}
                    onChange={(e) => setMemTargetUser(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 text-xs font-bold"
                  >
                    <option value="All">All Users 🌐</option>
                    {usersList.map((u) => (
                      <option key={u.userId} value={u.userId}>@{u.userId} ({u.displayName || u.userId})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-pink-900 uppercase block mb-1">Short Caption</label>
                  <input
                    type="text"
                    value={memShortDesc}
                    onChange={(e) => setMemShortDesc(e.target.value)}
                    placeholder="Short summary for card view..."
                    className="w-full p-3 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-pink-900 uppercase block mb-1">Full Description</label>
                  <textarea
                    rows={3}
                    value={memFullDesc}
                    onChange={(e) => setMemFullDesc(e.target.value)}
                    placeholder="Detailed memory thoughts and story..."
                    className="w-full p-3 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 text-xs font-bold"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="memIsVisible"
                    checked={memIsVisible}
                    onChange={(e) => setMemIsVisible(e.target.checked)}
                    className="w-4 h-4 rounded text-pink-600 focus:ring-pink-400"
                  />
                  <label htmlFor="memIsVisible" className="text-xs font-bold text-pink-900">Publish immediately to Memory Wall 🟢</label>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsMemoryModalOpen(false)}
                    className="w-1/2 py-3 rounded-full bg-pink-100 text-pink-950 font-bold text-xs uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase shadow-md hover:scale-105"
                  >
                    {editingMemory ? 'Save Memory' : 'Add Memory'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Confirm Delete Memory */}
        {deletingMemoryTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/30 backdrop-blur-md text-center">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full bg-white border-2 border-pink-300 shadow-2xl space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
                <Trash2 size={28} />
              </div>

              <h3 className="font-heading font-extrabold text-xl text-pink-950">
                Delete this memory permanently?
              </h3>

              <p className="text-xs text-pink-700 font-semibold bg-rose-50 p-3 rounded-2xl border border-rose-100">
                "{deletingMemoryTarget.title}" will be permanently removed from the Memory Wall.
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setDeletingMemoryTarget(null)}
                  className="w-1/2 py-3 rounded-full bg-pink-100 text-pink-950 font-bold text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteMemory}
                  className="w-1/2 py-3 rounded-full bg-rose-600 text-white font-bold text-xs uppercase shadow-md hover:bg-rose-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
