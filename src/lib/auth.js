/**
 * Strictly Decoupled Authentication Architecture
 * Admin Auth: In-memory only (Resets on Refresh F5)
 * User Auth: Single Global User Session (First Page Login -> Full Website Access)
 * Role System: Admin PIN (sangam9534) vs Normal User role ('user')
 */

import { supabase, saveUserActivity } from './supabase';

async function hashPin(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

const DEFAULT_ADMIN_HASH = '1509eed4e626ad47a1887e0cc956a9f92b9e7bbae18418e80f47db19e1fd9425';
const DEFAULT_USER_PASS_HASH = '6e7368bb9914b14d8bd7bc1a1f0a200fdfc972edc4501a3577d33d995aa42d48';

/* ===================================================
   1. ADMIN AUTHENTICATION (IN-MEMORY ONLY)
   =================================================== */

export async function authenticateAdmin(credentialInput) {
  if (!credentialInput || typeof credentialInput !== 'string') return false;

  const trimmed = credentialInput.trim();
  const inputHash = await hashPin(trimmed);

  let isMatch = inputHash === DEFAULT_ADMIN_HASH;

  if (!isMatch && import.meta.env.VITE_ADMIN_PIN) {
    const envHash = await hashPin(import.meta.env.VITE_ADMIN_PIN.trim());
    isMatch = inputHash === envHash;
  }

  return isMatch;
}

export function logoutAdmin() {
  sessionStorage.removeItem('amrita_admin_token');
  localStorage.removeItem('amrita_admin_token');
}

/* ===================================================
   2. USER AUTHENTICATION & SINGLE GLOBAL SESSION
   =================================================== */

export async function loginUser({ userId, password, rememberMe = true }) {
  if (!userId || !password) {
    throw new Error('User ID ya password incorrect hai. ❤️');
  }

  const cleanUserId = userId.trim().toLowerCase();
  const allUsers = fetchManagedUsers();
  const foundUser = allUsers.find((u) => u.userId.toLowerCase() === cleanUserId);

  if (!foundUser) {
    throw new Error('User ID ya password incorrect hai. ❤️');
  }

  if (foundUser.status === 'disabled') {
    throw new Error('This user account has been disabled. Please contact admin. 🔒');
  }

  const inputPassHash = await hashPin(password.trim());
  let isPasswordValid = false;

  if (cleanUserId === 'amritayadav' && (!foundUser.passwordHash || foundUser.passwordHash === DEFAULT_USER_PASS_HASH)) {
    const defaultTargetHash = await hashPin('@amritay123');
    isPasswordValid = inputPassHash === defaultTargetHash || inputPassHash === DEFAULT_USER_PASS_HASH;
  } else {
    isPasswordValid = inputPassHash === foundUser.passwordHash;
  }

  if (!isPasswordValid) {
    throw new Error('User ID ya password incorrect hai. ❤️');
  }

  const userObj = {
    role: 'user', // STRICTLY USER ROLE ONLY
    id: foundUser.id || `usr-${cleanUserId}`,
    userId: foundUser.userId,
    displayName: foundUser.displayName || foundUser.userId,
    email: `${cleanUserId}@amritayadav.internal`,
    token: `user_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    authenticatedAt: new Date().toISOString(),
  };

  // Always persist user token to BOTH localStorage & sessionStorage for seamless navigation & refresh retention
  localStorage.setItem('amrita_user_token', JSON.stringify(userObj));
  sessionStorage.setItem('amrita_user_token', JSON.stringify(userObj));

  // Sync with Supabase Auth session if present
  if (supabase && supabase.auth) {
    try {
      await supabase.auth.setSession({
        access_token: userObj.token,
        refresh_token: userObj.token,
      });
    } catch (e) {
      // Ignore fallback Supabase mock token error
    }
  }

  // Record last login time
  adminRecordLastLogin(cleanUserId);

  // Activity Log: User Login
  saveUserActivity({
    event_type: 'login',
    title: '🔐 User Logged In',
    description: `User @${foundUser.userId} logged in on first page`,
    metadata: {
      action: 'login',
      username: foundUser.userId,
    },
    user_id: foundUser.id || `usr-${cleanUserId}`,
  });

  return userObj;
}

export function isUserAuthenticated() {
  const sess = localStorage.getItem('amrita_user_token') || sessionStorage.getItem('amrita_user_token');
  if (!sess) return false;
  try {
    const parsed = JSON.parse(sess);
    return Boolean(parsed && (parsed.role === 'user' || parsed.userId) && (parsed.token || parsed.id));
  } catch (e) {
    return false;
  }
}

export function getCurrentUser() {
  const sess = localStorage.getItem('amrita_user_token') || sessionStorage.getItem('amrita_user_token');
  if (!sess) return null;
  try {
    const parsed = JSON.parse(sess);
    if (parsed && (parsed.role === 'user' || parsed.userId)) {
      return parsed;
    }
  } catch (e) {
    return null;
  }
  return null;
}

export async function restoreUserSession() {
  // Check Supabase session first
  if (supabase && supabase.auth && typeof supabase.auth.getSession === 'function') {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (!error && data?.session?.user) {
        const uId = data.session.user.user_metadata?.username || 'amritayadav';
        const userObj = {
          role: 'user',
          id: data.session.user.id,
          userId: uId,
          displayName: data.session.user.user_metadata?.display_name || uId,
          email: data.session.user.email,
          token: data.session.access_token || `user_token_${Date.now()}`,
          authenticatedAt: new Date().toISOString(),
        };
        localStorage.setItem('amrita_user_token', JSON.stringify(userObj));
        sessionStorage.setItem('amrita_user_token', JSON.stringify(userObj));
        return userObj;
      }
    } catch (e) {
      console.warn('[Auth] Supabase session fetch warning:', e);
    }
  }

  // Fallback to robust local storage session
  const currentUser = getCurrentUser();
  if (currentUser) {
    localStorage.setItem('amrita_user_token', JSON.stringify(currentUser));
    sessionStorage.setItem('amrita_user_token', JSON.stringify(currentUser));
    return currentUser;
  }
  return null;
}

export async function logoutUser() {
  const usr = getCurrentUser();
  if (usr) {
    saveUserActivity({
      event_type: 'logout',
      title: '🔒 User Logged Out',
      description: `User @${usr.userId} logged out`,
      metadata: { action: 'logout', username: usr.userId },
      user_id: usr.id || `usr-${usr.userId}`,
    });
  }

  if (supabase && supabase.auth) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // Ignore fallback signOut
    }
  }

  localStorage.removeItem('amrita_user_token');
  sessionStorage.removeItem('amrita_user_token');
  localStorage.removeItem('amrita_user_session');
  sessionStorage.removeItem('amrita_user_session');
  localStorage.removeItem('amrita_heart_checkin_completed');
  sessionStorage.removeItem('amrita_heart_checkin_completed');
}

/* ===================================================
   3. PHASE 31 & 33: ADMIN USER ACCOUNT MANAGER
   =================================================== */

export function fetchManagedUsers() {
  const localUsers = JSON.parse(localStorage.getItem('amrita_registered_users') || '[]');
  const defaultUser = {
    id: 'usr-amritayadav',
    userId: 'amritayadav',
    displayName: 'Amrita Yadav',
    role: 'user',
    status: 'active',
    created_at: '2026-08-25T10:00:00.000Z',
    last_login: new Date().toISOString(),
  };

  const hasDefault = localUsers.some((u) => u.userId.toLowerCase() === 'amritayadav');
  if (!hasDefault) {
    return [defaultUser, ...localUsers];
  }
  return localUsers;
}

export async function adminCreateUser({ username, displayName, password }) {
  if (!username || !username.trim()) {
    throw new Error('Username is required.');
  }

  const cleanUsername = username.trim().toLowerCase();

  if (cleanUsername.length < 3) {
    throw new Error('Username must be at least 3 characters.');
  }

  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }

  const existingUsers = fetchManagedUsers();
  if (existingUsers.some((u) => u.userId.toLowerCase() === cleanUsername)) {
    throw new Error('Username already exists.');
  }

  const passwordHash = await hashPin(password);
  const newUser = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: cleanUsername,
    displayName: displayName?.trim() || cleanUsername,
    passwordHash,
    role: 'user', // FORCE ROLE = USER (NEVER ADMIN)
    status: 'active',
    created_at: new Date().toISOString(),
    last_login: null,
  };

  const localUsers = JSON.parse(localStorage.getItem('amrita_registered_users') || '[]');
  const updated = [newUser, ...localUsers];
  localStorage.setItem('amrita_registered_users', JSON.stringify(updated));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      await supabase.from('profiles').upsert([
        {
          id: newUser.id,
          username: newUser.userId,
          display_name: newUser.displayName,
          role: 'user',
          is_active: true,
          created_at: newUser.created_at,
        },
      ]);
    } catch (e) {
      console.warn('[Supabase] Profile creation sync error:', e);
    }
  }

  return newUser;
}

export async function adminEditUser({ userId, displayName, status }) {
  const localUsers = JSON.parse(localStorage.getItem('amrita_registered_users') || '[]');
  const updated = localUsers.map((u) => {
    if (u.userId.toLowerCase() === userId.toLowerCase()) {
      return {
        ...u,
        displayName: displayName || u.displayName,
        status: status || u.status,
      };
    }
    return u;
  });

  localStorage.setItem('amrita_registered_users', JSON.stringify(updated));
  return true;
}

export async function adminToggleUserStatus(userId) {
  const localUsers = JSON.parse(localStorage.getItem('amrita_registered_users') || '[]');
  const updated = localUsers.map((u) => {
    if (u.userId.toLowerCase() === userId.toLowerCase()) {
      return { ...u, status: u.status === 'disabled' ? 'active' : 'disabled' };
    }
    return u;
  });
  localStorage.setItem('amrita_registered_users', JSON.stringify(updated));
}

export async function adminChangeUserPassword(userId, newPassword) {
  if (!newPassword || newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }

  const passwordHash = await hashPin(newPassword);
  const localUsers = JSON.parse(localStorage.getItem('amrita_registered_users') || '[]');
  const updated = localUsers.map((u) => {
    if (u.userId.toLowerCase() === userId.toLowerCase()) {
      return { ...u, passwordHash };
    }
    return u;
  });
  localStorage.setItem('amrita_registered_users', JSON.stringify(updated));
}

export async function adminDeleteUser(userId) {
  if (userId.toLowerCase() === 'amritayadav') {
    throw new Error('Primary owner account (amritayadav) cannot be deleted.');
  }

  const localUsers = JSON.parse(localStorage.getItem('amrita_registered_users') || '[]');
  const updated = localUsers.filter((u) => u.userId.toLowerCase() !== userId.toLowerCase());
  localStorage.setItem('amrita_registered_users', JSON.stringify(updated));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      await supabase.from('profiles').delete().eq('username', userId);
    } catch (e) {
      console.warn('[Supabase] Profile delete sync error:', e);
    }
  }
}

function adminRecordLastLogin(userId) {
  const localUsers = JSON.parse(localStorage.getItem('amrita_registered_users') || '[]');
  const updated = localUsers.map((u) => {
    if (u.userId.toLowerCase() === userId.toLowerCase()) {
      return { ...u, last_login: new Date().toISOString() };
    }
    return u;
  });
  localStorage.setItem('amrita_registered_users', JSON.stringify(updated));
}