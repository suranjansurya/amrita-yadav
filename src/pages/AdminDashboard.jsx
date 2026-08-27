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
  User,
} from 'lucide-react';

export function AdminDashboard({ onExit }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'responses' | 'justforyou' | 'constellation'
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const [usersList, setUsersList] = useState([]);
  const [responsesList, setResponsesList] = useState([]);
  const [dailyMsgsList, setDailyMsgsList] = useState([]);
  const [constList, setConstList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  // Create User Modal state
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [createUserError, setCreateUserError] = useState('');

  // Edit User Modal state
  const [editingUserTarget, setEditingUserTarget] = useState(null);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editStatus, setEditStatus] = useState('active');

  // Change Password Modal state
  const [changingPassTarget, setChangingPassTarget] = useState(null);
  const [changePassNew, setChangePassNew] = useState('');
  const [changePassConfirm, setChangePassConfirm] = useState('');
  const [changePassError, setChangePassError] = useState('');

  // Delete User Confirmation Modal state
  const [deletingUserTarget, setDeletingUserTarget] = useState(null);

  // Response Delete Confirmation Modal state
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

      if (activeTab === 'responses') {
        const rData = await fetchAllUserResponses(filter);
        setResponsesList(rData);
      } else if (activeTab === 'justforyou') {
        const dData = await fetchDailyMessages({ includeInactive: true });
        setDailyMsgsList(dData);
      } else if (activeTab === 'constellation') {
        const cData = await fetchConstellations({ includeInactive: true });
        setConstList(cData);
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
    setUsersList([]);
    setResponsesList([]);
    setDailyMsgsList([]);
    setConstList([]);
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
    if (!editingUserTarget) return;

    try {
      await adminEditUser({
        userId: editingUserTarget.userId,
        displayName: editDisplayName,
        status: editStatus,
      });

      setSuccessNotice('User updated successfully ✓');
      setTimeout(() => setSuccessNotice(''), 3000);
      setEditingUserTarget(null);
      loadDashboardData();
    } catch (err) {
      console.error('[AdminDashboard] Edit user error:', err);
    }
  };

  // Change Password Handler
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setChangePassError('');

    if (changePassNew !== changePassConfirm) {
      setChangePassError('Passwords do not match.');
      return;
    }

    try {
      await adminChangeUserPassword(changingPassTarget.userId, changePassNew);
      setSuccessNotice('Password updated successfully ✓');
      setTimeout(() => setSuccessNotice(''), 3000);
      setChangingPassTarget(null);
      setChangePassNew('');
      setChangePassConfirm('');
    } catch (err) {
      setChangePassError(err.message);
    }
  };

  // Toggle User Status Handler
  const handleToggleUserStatusClick = async (u) => {
    await adminToggleUserStatus(u.userId);
    setSuccessNotice(`User ${u.userId} status updated ✓`);
    setTimeout(() => setSuccessNotice(''), 3000);
    loadDashboardData();
  };

  // Delete User Handler
  const handleConfirmDeleteUser = async () => {
    if (!deletingUserTarget) return;

    try {
      await adminDeleteUser(deletingUserTarget.userId);
      setSuccessNotice(`User ${deletingUserTarget.userId} deleted permanently ✓`);
      setTimeout(() => setSuccessNotice(''), 3000);
      setDeletingUserTarget(null);
      loadDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Response Delete Handler
  const handleConfirmDeleteResponse = async () => {
    if (!deletingResponseTarget) return;

    try {
      await deleteUserResponse(deletingResponseTarget.responseType, deletingResponseTarget.id);
      setResponsesList((prev) => prev.filter((r) => r.id !== deletingResponseTarget.id));
      setSuccessNotice('Response deleted successfully. ✓');
      setTimeout(() => setSuccessNotice(''), 3000);
    } catch (err) {
      console.error('[AdminDashboard] Delete response error:', err);
    } finally {
      setDeletingResponseTarget(null);
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

  // Filter & Search Users
  const filteredUsers = usersList.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.userId.toLowerCase().includes(q) ||
      (u.displayName && u.displayName.toLowerCase().includes(q))
    );
  });

  const totalUsers = usersList.length;
  const activeUsers = usersList.filter((u) => u.status !== 'disabled').length;
  const disabledUsers = usersList.filter((u) => u.status === 'disabled').length;

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
              <p className="text-xs text-pink-700 font-semibold">User Account Management & System Controls</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Tab Navigation */}
            <div className="flex items-center bg-pink-100 p-1 rounded-full text-xs font-bold">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${
                  activeTab === 'users' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-800'
                }`}
              >
                <Users size={13} />
                <span>👥 User Management</span>
              </button>

              <button
                onClick={() => setActiveTab('responses')}
                className={`px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${
                  activeTab === 'responses' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-800'
                }`}
              >
                <MessageSquare size={13} />
                <span>👤 User Responses</span>
              </button>

              <button
                onClick={() => setActiveTab('justforyou')}
                className={`px-3.5 py-1.5 rounded-full transition-all flex items-center space-x-1.5 ${
                  activeTab === 'justforyou' ? 'bg-pink-500 text-white shadow-sm' : 'text-pink-800'
                }`}
              >
                <Mail size={13} />
                <span>💌 Just For You</span>
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

        {/* Tab 1: Phase 31 User Account Manager 👥 */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            
            {/* Top User Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-pink-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-pink-700 uppercase block">Total Users</span>
                  <span className="font-extrabold text-2xl text-pink-950 mt-1 block">{totalUsers}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                  <Users size={20} />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-pink-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase block">Active Users</span>
                  <span className="font-extrabold text-2xl text-emerald-950 mt-1 block">{activeUsers}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <UserCheck size={20} />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-pink-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-rose-700 uppercase block">Disabled Users</span>
                  <span className="font-extrabold text-2xl text-rose-950 mt-1 block">{disabledUsers}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <UserX size={20} />
                </div>
              </div>
            </div>

            {/* Controls Bar: Search & + Create User Button */}
            <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-pink-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-pink-50 border border-pink-200 text-xs font-bold text-pink-950 focus:outline-none"
                />
              </div>

              <button
                onClick={() => {
                  setCreateUserError('');
                  setIsCreateUserModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center space-x-1.5"
              >
                <UserPlus size={15} />
                <span>+ Create User</span>
              </button>
            </div>

            {/* Users Table / List */}
            <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm overflow-x-auto">
              {filteredUsers.length === 0 ? (
                <div className="py-12 text-center text-pink-600 font-semibold text-sm">
                  No users found.
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[600px]">
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
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-700 font-extrabold flex items-center justify-center text-xs">
                              {(u.displayName || u.userId)[0].toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-pink-950 block">{u.displayName || u.userId}</span>
                              <span className="text-[11px] text-pink-600 block">@{u.userId}</span>
                            </div>
                          </div>
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
                              setEditingUserTarget(u);
                              setEditDisplayName(u.displayName || u.userId);
                              setEditStatus(u.status || 'active');
                            }}
                            className="p-1.5 rounded-lg bg-pink-100 text-pink-800 hover:bg-pink-200"
                            title="Edit User"
                          >
                            <Edit size={14} />
                          </button>

                          <button
                            onClick={() => {
                              setChangingPassTarget(u);
                              setChangePassNew('');
                              setChangePassConfirm('');
                              setChangePassError('');
                            }}
                            className="p-1.5 rounded-lg bg-pink-100 text-pink-800 hover:bg-pink-200"
                            title="Change Password"
                          >
                            <KeyRound size={14} />
                          </button>

                          <button
                            onClick={() => handleToggleUserStatusClick(u)}
                            className={`p-1.5 rounded-lg ${
                              u.status === 'disabled' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                            title={u.status === 'disabled' ? 'Enable User' : 'Disable User'}
                          >
                            {u.status === 'disabled' ? <UserCheck size={14} /> : <UserX size={14} />}
                          </button>

                          {u.userId.toLowerCase() !== 'amritayadav' && (
                            <button
                              onClick={() => setDeletingUserTarget(u)}
                              className="p-1.5 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200"
                              title="Delete User"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Modal 1: Create User Modal */}
            {isCreateUserModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/30 backdrop-blur-md select-none">
                <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full bg-white border-2 border-pink-300 shadow-2xl space-y-4">
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

            {/* Modal 2: Edit User Modal */}
            {editingUserTarget && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/30 backdrop-blur-md select-none">
                <div className="glass-panel p-6 rounded-3xl max-w-md w-full bg-white border-2 border-pink-300 shadow-2xl space-y-4">
                  <h3 className="font-heading font-bold text-xl text-pink-950">
                    Edit User: @{editingUserTarget.userId}
                  </h3>

                  <form onSubmit={handleEditUserSubmit} className="space-y-4">
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
                      <label className="text-xs font-bold text-pink-900 uppercase block mb-1">Status</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="w-full p-3 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 text-xs font-bold focus:outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingUserTarget(null)}
                        className="w-1/2 py-3 rounded-full bg-pink-100 text-pink-950 font-bold text-xs uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 py-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-md"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal 3: Change Password Modal */}
            {changingPassTarget && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/30 backdrop-blur-md select-none">
                <div className="glass-panel p-6 rounded-3xl max-w-md w-full bg-white border-2 border-pink-300 shadow-2xl space-y-4">
                  <h3 className="font-heading font-bold text-xl text-pink-950">
                    🔑 Change Password: @{changingPassTarget.userId}
                  </h3>

                  <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-pink-900 uppercase block mb-1">New Password (min 8 chars)</label>
                      <input
                        type="password"
                        value={changePassNew}
                        onChange={(e) => setChangePassNew(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-3 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 text-sm font-bold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-pink-900 uppercase block mb-1">Confirm Password</label>
                      <input
                        type="password"
                        value={changePassConfirm}
                        onChange={(e) => setChangePassConfirm(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-3 rounded-2xl bg-pink-50 border border-pink-200 text-pink-950 text-sm font-bold focus:outline-none"
                      />
                    </div>

                    {changePassError && (
                      <p className="text-xs font-bold text-rose-600 animate-bounce">{changePassError}</p>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setChangingPassTarget(null)}
                        className="w-1/2 py-3 rounded-full bg-pink-100 text-pink-950 font-bold text-xs uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 py-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold text-xs uppercase tracking-wider shadow-md"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal 4: Delete User Confirmation Modal */}
            {deletingUserTarget && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/30 backdrop-blur-md select-none">
                <div className="glass-panel p-6 rounded-3xl max-w-md w-full bg-white text-center border-2 border-pink-300 shadow-2xl space-y-4">
                  <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
                    <Trash2 size={28} />
                  </div>

                  <h3 className="font-heading font-extrabold text-xl text-pink-950">
                    Delete this user permanently?
                  </h3>

                  <p className="text-xs text-pink-700 bg-pink-50 p-3 rounded-xl border border-pink-100">
                    This will remove user account <strong>@{deletingUserTarget.userId}</strong> and associated profile records.
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
                      className="w-1/2 py-3 rounded-full bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-rose-600 transition-all"
                    >
                      Delete Permanently
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Phase 30 Admin Response Management 👤 */}
        {activeTab === 'responses' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-72">
                  <Search size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-pink-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search user responses..."
                    className="w-full pl-10 pr-4 py-2 rounded-full bg-pink-50 border border-pink-200 text-xs font-bold text-pink-950 focus:outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-pink-800">Sort:</span>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="px-3 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-bold text-pink-950 focus:outline-none"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-pink-100">
                <button
                  onClick={() => setFilter('All')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    filter === 'All' ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-800'
                  }`}
                >
                  All Responses ({responsesList.length})
                </button>
                <button
                  onClick={() => setFilter('heart')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    filter === 'heart' ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-800'
                  }`}
                >
                  ❤️ Heart Check-ins
                </button>
                <button
                  onClick={() => setFilter('journal')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    filter === 'journal' ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-800'
                  }`}
                >
                  📖 Journal Entries
                </button>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm space-y-4">
              {responsesList.length === 0 ? (
                <div className="py-12 text-center text-pink-600 font-semibold text-sm">
                  No user responses found.
                </div>
              ) : (
                <div className="space-y-3">
                  {responsesList.map((r) => (
                    <div
                      key={r.id}
                      className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800 font-bold text-[11px]">
                            {r.type}
                          </span>
                          <span className="text-[11px] text-pink-600">User: <strong>{r.user_id}</strong></span>
                        </div>
                        <p className="text-xs text-pink-950 font-medium italic">"{r.text}"</p>
                      </div>

                      <button
                        onClick={() => setDeletingResponseTarget(r)}
                        className="px-3.5 py-2 rounded-xl bg-rose-100 text-rose-700 font-bold text-xs flex items-center space-x-1"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Phase 29 Just For You Manager 💌 */}
        {activeTab === 'justforyou' && (
          <div className="glass-panel p-6 rounded-3xl bg-white border border-pink-200 shadow-sm">
            <h3 className="font-heading font-bold text-lg text-pink-950 mb-4">Daily Messages ({dailyMsgsList.length})</h3>
            <div className="space-y-3">
              {dailyMsgsList.map((m) => (
                <div key={m.id} className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-pink-950 block">{m.title}</span>
                    <p className="text-xs text-pink-800 italic">"{m.message}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
