/**
 * Strictly Decoupled Authentication Architecture
 * Admin Auth: In-memory only (Resets on Refresh F5)
 * User Auth: Isolated amrita_user_token session
 */

// Generate SHA-256 hash string for password checks
async function hashPin(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Expected admin hash for fallback (sangam9534)
const DEFAULT_ADMIN_HASH = '1509eed4e626ad47a1887e0cc956a9f92b9e7bbae18418e80f47db19e1fd9425';

// Expected user credentials: amritayadav & @amritay123
const AUTHORIZED_USER_ID = 'amritayadav';
const DEFAULT_USER_PASS_HASH = '6e7368bb9914b14d8bd7bc1a1f0a200fdfc972edc4501a3577d33d995aa42d48';

/* ===================================================
   1. ADMIN AUTHENTICATION (IN-MEMORY ONLY)
   DOES NOT PERSIST ACROSS REFRESH
   DOES NOT TOUCH USER AUTH
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

  // Purely returns verification result. Zero storage persistence!
  return isMatch;
}

export function logoutAdmin() {
  // Purely clean up in-memory references. Does NOT log out User!
  sessionStorage.removeItem('amrita_admin_token');
  localStorage.removeItem('amrita_admin_token');
}

/* ===================================================
   2. USER AUTHENTICATION (ISOLATED ROLE)
   Storage Key: amrita_user_token
   Authorized User ID: amritayadav
   Password: @amritay123
   =================================================== */

export async function loginUser({ userId, password, rememberMe = false }) {
  if (!userId || !password) {
    throw new Error('User ID ya password incorrect hai. ❤️');
  }

  const cleanUserId = userId.trim().toLowerCase();

  // STRICT AUTHORIZATION CHECK: User ID MUST be "amritayadav"
  if (cleanUserId !== AUTHORIZED_USER_ID) {
    throw new Error('User ID ya password incorrect hai. ❤️');
  }

  const inputPassHash = await hashPin(password.trim());
  let isPasswordValid = false;

  if (import.meta.env.VITE_USER_PASSWORD) {
    const envUserHash = await hashPin(import.meta.env.VITE_USER_PASSWORD.trim());
    isPasswordValid = inputPassHash === envUserHash;
  } else {
    const targetHash = await hashPin('@amritay123');
    isPasswordValid = inputPassHash === targetHash || inputPassHash === DEFAULT_USER_PASS_HASH;
  }

  if (!isPasswordValid) {
    throw new Error('User ID ya password incorrect hai. ❤️');
  }

  const userObj = {
    role: 'user',
    id: 'usr-amritayadav',
    userId: AUTHORIZED_USER_ID,
    displayName: 'Amrita Yadav',
    email: `${AUTHORIZED_USER_ID}@amritayadav.internal`,
    token: `user_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    authenticatedAt: new Date().toISOString(),
  };

  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('amrita_user_token', JSON.stringify(userObj));
  return userObj;
}

export function isUserAuthenticated() {
  const sess = sessionStorage.getItem('amrita_user_token') || localStorage.getItem('amrita_user_token');
  if (!sess) return false;
  try {
    const parsed = JSON.parse(sess);
    return Boolean(
      parsed &&
      parsed.role === 'user' &&
      parsed.userId === AUTHORIZED_USER_ID &&
      parsed.token &&
      parsed.token.startsWith('user_token_')
    );
  } catch (e) {
    return false;
  }
}

export function getCurrentUser() {
  if (!isUserAuthenticated()) return null;
  const sess = sessionStorage.getItem('amrita_user_token') || localStorage.getItem('amrita_user_token');
  try {
    return JSON.parse(sess);
  } catch (e) {
    return null;
  }
}

export function logoutUser() {
  // Purge ONLY User session storage. Does NOT touch Admin!
  sessionStorage.removeItem('amrita_user_token');
  localStorage.removeItem('amrita_user_token');
  sessionStorage.removeItem('amrita_user_session');
  localStorage.removeItem('amrita_user_session');
}

/* ===================================================
   3. ADMIN USER MANAGEMENT HELPERS
   =================================================== */

export async function adminCreateUser({ userId, displayName, password }) {
  if (!userId || !password) {
    throw new Error('User ID and password are required');
  }

  const cleanUserId = userId.trim().toLowerCase();
  const passwordHash = await hashPin(password);
  const newUser = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: cleanUserId,
    displayName: displayName || cleanUserId,
    passwordHash,
    status: 'active',
    created_at: new Date().toISOString(),
  };

  const localUsers = JSON.parse(localStorage.getItem('amrita_registered_users') || '[]');
  const updated = [newUser, ...localUsers];
  localStorage.setItem('amrita_registered_users', JSON.stringify(updated));

  return newUser;
}

export function fetchManagedUsers() {
  const localUsers = JSON.parse(localStorage.getItem('amrita_registered_users') || '[]');
  const defaultUser = {
    id: 'usr-amritayadav',
    userId: AUTHORIZED_USER_ID,
    displayName: 'Amrita Yadav',
    status: 'active',
    created_at: new Date().toISOString(),
  };

  if (!localUsers.some((u) => u.userId === AUTHORIZED_USER_ID)) {
    return [defaultUser, ...localUsers];
  }
  return localUsers;
}

export async function adminToggleUserStatus(userId) {
  const localUsers = JSON.parse(localStorage.getItem('amrita_registered_users') || '[]');
  const updated = localUsers.map((u) => {
    if (u.userId === userId) {
      return { ...u, status: u.status === 'disabled' ? 'active' : 'disabled' };
    }
    return u;
  });
  localStorage.setItem('amrita_registered_users', JSON.stringify(updated));
}

export async function adminResetUserPassword(userId, newPassword) {
  const passwordHash = await hashPin(newPassword);
  const localUsers = JSON.parse(localStorage.getItem('amrita_registered_users') || '[]');
  const updated = localUsers.map((u) => {
    if (u.userId === userId) {
      return { ...u, passwordHash };
    }
    return u;
  });
  localStorage.setItem('amrita_registered_users', JSON.stringify(updated));
}