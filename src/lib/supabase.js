import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'amrita_supabase_auth_token',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

export const ALLOWED_MOODS = ['Bahut achchi', 'Happy', 'Theek-thaak', 'Thodi sad'];

export const MOOD_DETAILS = {
  'Bahut achchi': {
    emoji: '😊',
    title: 'Bahut achchi',
    response: 'Ye smile hamesha bani rahe, Amrita. ❤️',
  },
  Happy: {
    emoji: '🥰',
    title: 'Happy',
    response: 'Keep that beautiful happiness with you. ✨',
  },
  'Theek-thaak': {
    emoji: '😌',
    title: 'Theek-thaak',
    response: 'Thoda sa smile bhi chalega. Everything will be okay. 🌸',
  },
  'Thodi sad': {
    emoji: '😔',
    title: 'Thodi sad',
    response: 'Take a little breath... better moments are coming. 🌙',
  },
};

export const MEMORY_CATEGORIES = [
  '❤️ Special',
  '🌸 Cute',
  '✨ Beautiful',
  '🥰 Favorite',
  '🌙 Late Night',
  '💭 Memory',
  '🎉 Celebration',
];

export const JAR_CATEGORIES = [
  '❤️ Love',
  '🌸 Cute',
  '✨ Beautiful',
  '🥰 Favorite',
  '😂 Funny',
  '🌙 Late Night',
  '💭 Thought',
  '🎁 Surprise',
];

export const DEFAULT_SECRET_UNLOCKS = [
  { id: 'sec-1', name: '🌱 First Visit', reqType: 'first_visit', reqVal: 1, title: 'Welcome Special Note 🌸', message: 'Thank you for stepping into this little dream world made just for you. ❤️', is_active: true },
  { id: 'sec-2', name: '❤️ First Mood Check-in', reqType: 'mood_checkin', reqVal: 1, title: 'Heart Connection ✨', message: 'Sharing how you feel makes every day a little warmer. 🌸', is_active: true },
  { id: 'sec-3', name: '🌸 3-Day Streak', reqType: 'checkin_streak', reqVal: 3, title: '3-Day Friendship 🌸', message: 'Three days of checking in... you make this little space bloom. ✨', is_active: true },
  { id: 'sec-4', name: '✨ 7-Day Streak', reqType: 'checkin_streak', reqVal: 7, title: '7-Day Memory ✨', message: 'A whole week of memories. There is something truly special about you. ❤️', is_active: true },
  { id: 'sec-5', name: '💕 10-Day Streak', reqType: 'checkin_streak', reqVal: 10, title: '10-Day Master Milestone 💕', message: 'Ten days together! Thank you for making this world part of your routine. 🥰', is_active: true },
  { id: 'sec-6', name: '🫙 Save 3 Memories', reqType: 'saved_memories', reqVal: 3, title: 'Treasure Keeper 🫙', message: 'You have saved 3 memories to your heart collection. ❤️', is_active: true },
  { id: 'sec-7', name: '🎁 Open 5 Surprises', reqType: 'surprise_count', reqVal: 5, title: 'Surprise Explorer 🎁', message: 'Curiosity looks beautiful on you. Always keep discovering! ✨', is_active: true },
  { id: 'sec-8', name: '🤗 Use Digital Hug 5 times', reqType: 'hug_count', reqVal: 5, title: 'Warm Embrace Hug 🤗', message: 'Sending you the biggest digital hug imaginable. Stay cozy! ❤️', is_active: true },
  { id: 'sec-9', name: '📖 Write 3 Journal Entries', reqType: 'journal_count', reqVal: 3, title: 'Secret Diary Note 📖', message: 'Your written words hold pure magic. Keep expressing your heart. 🌸', is_active: true },
  { id: 'sec-10', name: '🌙 Night Check-in', reqType: 'night_checkin', reqVal: 1, title: 'Late Night Moon 🌙', message: 'Late night thoughts are the gentlest ones. Have a peaceful sleep tonight. 🌙❤️', is_active: true },
];

export const DEFAULT_CONSTELLATIONS = [
  {
    id: 'cst-1',
    name: '❤️ Heart Constellation',
    description: 'A constellation formed by pure warmth and gentleness.',
    is_active: true,
    rewardTitle: '✨ A constellation has come alive!',
    rewardMessage: 'Your kindness lights up even the darkest skies. Thank you for being you. ✨❤️',
    stars: [
      { id: 'str-1', name: '⭐ Star of the Day', x: 20, y: 30, type: 'daily', message: 'Every single day brings a fresh little reason to smile. ✨' },
      { id: 'str-2', name: '🌸 Gentle Smile Star', x: 40, y: 20, type: 'quote', message: 'Your smile makes everything feel a little lighter. ❤️' },
      { id: 'str-3', name: '🌙 Quiet Rest Star', x: 65, y: 25, type: 'comfort', message: 'Take a quiet breath and let the night hold your worries. 🌙' },
      { id: 'str-4', name: '✨ Sparkle Star', x: 50, y: 45, type: 'surprise', message: 'You are capable of creating magic wherever you go! 🌸' },
      { id: 'str-5', name: '💌 Open When Star', x: 25, y: 55, type: 'sweet', message: 'Whenever you feel lost, remember this little world is always here for you. ❤️' },
    ],
  },
  {
    id: 'cst-2',
    name: '🌸 Lotus Constellation',
    description: 'Blooming softly in the quiet night air.',
    is_active: true,
    rewardTitle: '✨ A constellation has come alive!',
    rewardMessage: 'Like a lotus in bloom, your grace remains steady through every season. 🌸✨',
    stars: [
      { id: 'str-6', name: '🫙 Memory Note Star', x: 15, y: 75, type: 'jar', message: 'Some moments are meant to be kept forever in glass. ❤️' },
      { id: 'str-7', name: '🤗 Warm Hug Star', x: 35, y: 80, type: 'hug', message: 'Sending you a warm, cozy embrace under the stars. 🤗' },
      { id: 'str-8', name: '🌸 Memory Timeline Star', x: 60, y: 70, type: 'memory', message: 'Remember when we first opened this little place? Moments stay forever. 🌸' },
      { id: 'str-9', name: '🔐 Streak Locked Star', x: 80, y: 80, type: 'locked', reqType: 'checkin_streak', reqVal: 3, message: 'Unlocked with a 3-day check-in streak! You are amazing. ✨' },
      { id: 'str-10', name: '🎁 Surprise Burst Star', x: 85, y: 60, type: 'surprise', message: 'Surprise! A little extra love just for you today. ❤️' },
    ],
  },
  {
    id: 'cst-3',
    name: '✨ Serendipity Constellation',
    description: 'Where beautiful coincidences find their home.',
    is_active: true,
    rewardTitle: '✨ A constellation has come alive!',
    rewardMessage: 'Meeting you was not chance—it was serendipity in its purest form. ✨🥰',
    stars: [
      { id: 'str-11', name: '💫 Coincidence Star', x: 75, y: 15, type: 'sweet', message: 'Some people enter your life and suddenly everything makes sense. ❤️' },
      { id: 'str-12', name: '🌙 Night Wish Star', x: 88, y: 30, type: 'comfort', message: 'May your night be filled with soft dreams and quiet peace. 🌙' },
      { id: 'str-13', name: '🔐 Favorite Locked Star', x: 70, y: 45, type: 'locked', reqType: 'saved_memories', reqVal: 3, message: 'Unlocked by saving 3 memories! Keep treasuring moments. 🫙' },
      { id: 'str-14', name: '🌸 Soft Heart Star', x: 92, y: 45, type: 'quote', message: 'Soft hearts are the strongest things in the universe. 🌸' },
      { id: 'str-15', name: '🤗 Comfort Hug Star', x: 82, y: 10, type: 'hug', message: 'A gentle little hug across the sky. 🤗❤️' },
    ],
  },
  {
    id: 'cst-4',
    name: '🌙 Moonlit Dream Constellation',
    description: 'Guiding quiet thoughts through the late hours.',
    is_active: true,
    rewardTitle: '✨ A constellation has come alive!',
    rewardMessage: 'Even on the darkest nights, your light shines bright. 🌙✨',
    stars: [
      { id: 'str-16', name: '🌙 Moonbeam Star', x: 10, y: 15, type: 'comfort', message: 'The moon is watching over you tonight. Rest well. 🌙' },
      { id: 'str-17', name: '💌 Letter Note Star', x: 30, y: 10, type: 'sweet', message: 'You have a gentle way of bringing warmth into every room. ❤️' },
      { id: 'str-18', name: '🔐 Journal Locked Star', x: 12, y: 40, type: 'locked', reqType: 'journal_count', reqVal: 3, message: 'Unlocked by writing 3 journal entries! Your heart speaks poetry. 📖' },
      { id: 'str-19', name: '🎁 Gift Star', x: 45, y: 35, type: 'surprise', message: 'Here is a little sprinkle of happiness for your day! ✨' },
      { id: 'str-20', name: '🫙 Memory Jar Star', x: 28, y: 45, type: 'jar', message: 'Picked straight from the memory jar of sweet thoughts. 🫙❤️' },
    ],
  },
  {
    id: 'cst-5',
    name: '💕 Soulmate Constellation',
    description: 'Connecting two hearts across every distance.',
    is_active: true,
    rewardTitle: '✨ A constellation has come alive!',
    rewardMessage: 'Two souls bound by warmth, respect, and eternal care. 💕✨',
    stars: [
      { id: 'str-21', name: '💕 Connection Star', x: 40, y: 88, type: 'sweet', message: 'True connection never fades—it only grows deeper with time. ❤️' },
      { id: 'str-22', name: '🌸 Eternal Flower Star', x: 55, y: 92, type: 'quote', message: 'You bloom with grace in every moment. 🌸' },
      { id: 'str-23', name: '🔐 Hugs Locked Star', x: 70, y: 90, type: 'locked', reqType: 'hug_count', reqVal: 5, message: 'Unlocked by receiving 5 digital hugs! Warmth forever. 🤗' },
      { id: 'str-24', name: '✨ Final Crown Star', x: 85, y: 92, type: 'surprise', message: 'You have explored the highest stars! Stay radiant. ✨' },
      { id: 'str-25', name: '🌙 Peaceful Night Star', x: 18, y: 90, type: 'comfort', message: 'Sleep peacefully knowing you are deeply cared for. 🌙❤️' },
    ],
  },
];

export const DEFAULT_DAILY_MESSAGES = [
  { id: 'msg-1', category: 'General', title: 'Daily Warmth 💌', message: 'You make ordinary moments feel a little more special. Never forget how much you matter. ❤️', is_active: true },
  { id: 'msg-2', category: 'General', title: 'A Gentle Reminder 🌸', message: 'Don\'t forget to appreciate yourself too. You are doing wonderfully. 🌷', is_active: true },
  { id: 'msg-3', category: 'Night', title: 'Sweet Dreams 🌙', message: 'Leave the heavy parts of today behind. Tomorrow is a brand new little beginning. 🌙❤️', is_active: true },
];

export async function saveMoodCheckIn({ mood, message = '', day_feeling = '', heart_word = '', shared_message = '' }) {
  if (!ALLOWED_MOODS.includes(mood)) {
    throw new Error('Invalid mood value selected');
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const entry = {
    id: `mood-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    mood,
    message: message.trim(),
    created_at: now.toISOString(),
    date: dateStr,
    time: timeStr,
  };

  const localHistory = JSON.parse(localStorage.getItem('amrita_mood_history') || '[]');
  const updatedLocal = [entry, ...localHistory];
  localStorage.setItem('amrita_mood_history', JSON.stringify(updatedLocal));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      const { error } = await supabase.from('mood_checkins').insert([
        {
          mood: entry.mood,
          message: entry.message,
          created_at: entry.created_at,
          date: entry.date,
          time: entry.time,
        },
      ]);

      if (error) {
        console.warn('[Supabase] Insert error, saved to local cache:', error.message);
      }
    } catch (e) {
      console.warn('[Supabase] Connection exception, saved to local cache:', e);
    }
  }

  // Phase 32: Log user activity for Mood Check-in
  saveUserActivity({
    event_type: 'mood_checkin',
    title: '❤️ Mood Check-in',
    description: `Mood: ${mood}`,
    metadata: {
      question: 'How are you feeling today?',
      answer: `${mood}${day_feeling ? ' • ' + day_feeling : ''}${heart_word ? ' • ' + heart_word : ''}${shared_message ? ' • ' + shared_message : ''}`,
    },
  });

  return entry;
}

export async function fetchMoodCheckIns(filter = 'All') {
  let records = [];

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase
        .from('mood_checkins')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        records = data;
      }
    } catch (e) {
      console.warn('[Supabase] Fetch failed, falling back to local storage');
    }
  }

  if (records.length === 0) {
    records = JSON.parse(localStorage.getItem('amrita_mood_history') || '[]');
  }

  const now = new Date();
  return records.filter((rec) => {
    if (filter === 'All') return true;
    const recDate = new Date(rec.created_at || Date.now());

    if (filter === 'Today') {
      return recDate.toDateString() === now.toDateString();
    }

    if (filter === 'This Week') {
      const diffTime = Math.abs(now - recDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }

    if (filter === 'This Month') {
      return (
        recDate.getMonth() === now.getMonth() && recDate.getFullYear() === now.getFullYear()
      );
    }

    return true;
  });
}

export async function saveJournalEntry({ mood = '', journal_text }) {
  if (!journal_text || !journal_text.trim()) {
    throw new Error('Journal entry cannot be empty');
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const entry = {
    id: `journal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    mood,
    journal_text: journal_text.trim().substring(0, 500),
    created_at: now.toISOString(),
    date: dateStr,
    time: timeStr,
  };

  const localJournal = JSON.parse(localStorage.getItem('amrita_journal_history') || '[]');
  const updatedLocal = [entry, ...localJournal];
  localStorage.setItem('amrita_journal_history', JSON.stringify(updatedLocal));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      const { error } = await supabase.from('journal_entries').insert([
        {
          mood: entry.mood,
          journal_text: entry.journal_text,
          created_at: entry.created_at,
          date: entry.date,
          time: entry.time,
        },
      ]);

      if (error) {
        console.warn('[Supabase] Journal insert error, saved to local cache:', error.message);
      }
    } catch (e) {
      console.warn('[Supabase] Journal connection exception, saved to local cache:', e);
    }
  }

  // Phase 32: Log user activity for Journal Entry
  saveUserActivity({
    event_type: 'journal_created',
    title: '📖 Created Journal Entry',
    description: `Journal: ${entry.journal_text.substring(0, 40)}...`,
    metadata: {
      question: 'Your personal thought / journal entry',
      answer: entry.journal_text,
    },
  });

  return entry;
}

export async function fetchJournalEntries(filter = 'All') {
  let records = [];

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        records = data;
      }
    } catch (e) {
      console.warn('[Supabase] Fetch journal failed, falling back to local storage');
    }
  }

  if (records.length === 0) {
    records = JSON.parse(localStorage.getItem('amrita_journal_history') || '[]');
  }

  const now = new Date();
  return records.filter((rec) => {
    if (filter === 'All') return true;
    const recDate = new Date(rec.created_at || Date.now());

    if (filter === 'Today') {
      return recDate.toDateString() === now.toDateString();
    }

    if (filter === 'This Week') {
      const diffTime = Math.abs(now - recDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }

    if (filter === 'This Month') {
      return (
        recDate.getMonth() === now.getMonth() && recDate.getFullYear() === now.getFullYear()
      );
    }

    return true;
  });
}

export function getTodayDateKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function hasCompletedDailyCheckIn(user_id = 'usr-amritayadav') {
  if (!user_id) return false;
  const cleanId = String(user_id).replace(/^usr-/, '');
  const todayKey = getTodayDateKey();

  const isFlagDone = Boolean(
    localStorage.getItem(`amrita_daily_checkin_completed_${cleanId}_${todayKey}`) ||
    sessionStorage.getItem(`amrita_daily_checkin_completed_${cleanId}_${todayKey}`)
  );
  if (isFlagDone) return true;

  const localHistory = JSON.parse(localStorage.getItem('amrita_heart_checkins_history') || '[]');
  const todayStr = new Date().toDateString();
  const match = localHistory.find(
    (e) => (e.user_id === cleanId || e.user_id === `usr-${cleanId}` || e.user_id === user_id) && new Date(e.created_at).toDateString() === todayStr
  );

  if (match) {
    localStorage.setItem(`amrita_daily_checkin_completed_${cleanId}_${todayKey}`, 'true');
    return true;
  }

  return false;
}

export async function getTodayHeartCheckIn(user_id = 'usr-amritayadav') {
  const localHistory = JSON.parse(localStorage.getItem('amrita_heart_checkins_history') || '[]');
  const todayStr = new Date().toDateString();
  const todayEntry = localHistory.find(
    (e) => (e.user_id === user_id || e.user_id === String(user_id).replace(/^usr-/, '')) && new Date(e.created_at).toDateString() === todayStr
  );
  return todayEntry || null;
}

export async function saveOrUpdateHeartCheckIn({
  mood,
  day_feeling,
  current_need,
  heart_word = '',
  shared_message = '',
  user_id = 'usr-amritayadav',
}) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const localHistory = JSON.parse(localStorage.getItem('amrita_heart_checkins_history') || '[]');
  const todayStr = now.toDateString();
  const existingIdx = localHistory.findIndex(
    (e) => e.user_id === user_id && new Date(e.created_at).toDateString() === todayStr
  );

  let updatedEntry;

  if (existingIdx >= 0) {
    updatedEntry = {
      ...localHistory[existingIdx],
      mood,
      day_feeling,
      current_need,
      heart_word: heart_word.trim(),
      shared_message: shared_message.trim(),
      updated_at: now.toISOString(),
      date: dateStr,
      time: timeStr,
    };
    localHistory[existingIdx] = updatedEntry;
  } else {
    updatedEntry = {
      id: `heart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id,
      mood,
      day_feeling,
      current_need,
      heart_word: heart_word.trim(),
      shared_message: shared_message.trim(),
      created_at: now.toISOString(),
      date: dateStr,
      time: timeStr,
    };
    localHistory.unshift(updatedEntry);
  }

  localStorage.setItem('amrita_heart_checkins_history', JSON.stringify(localHistory));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      const { error } = await supabase.from('heart_checkins').upsert([
        {
          user_id: updatedEntry.user_id,
          mood: updatedEntry.mood,
          day_feeling: updatedEntry.day_feeling,
          current_need: updatedEntry.current_need,
          heart_word: updatedEntry.heart_word,
          shared_message: updatedEntry.shared_message,
          created_at: updatedEntry.created_at,
          date: updatedEntry.date,
          time: updatedEntry.time,
        },
      ]);

      if (error) {
        console.warn('[Supabase] Heart check-in upsert error:', error.message);
      }
    } catch (e) {
      console.warn('[Supabase] Upsert exception:', e);
    }
  }

  // Phase 32: Log user activity for Heart Check-in
  saveUserActivity({
    event_type: 'mood_checkin',
    title: '❤️ Heart Check-in',
    description: `Mood: ${mood}`,
    metadata: {
      question: 'How are you feeling today?',
      answer: `${mood} • ${day_feeling}${heart_word ? ' • ' + heart_word : ''}${shared_message ? ' • ' + shared_message : ''}`,
    },
    user_id,
  });

  return updatedEntry;
}

export async function fetchUserHeartHistory(user_id = 'usr-amritayadav') {
  let records = [];

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase
        .from('heart_checkins')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        records = data;
      }
    } catch (e) {
      console.warn('[Supabase] Fetch user heart history failed, using local cache');
    }
  }

  if (records.length === 0) {
    const local = JSON.parse(localStorage.getItem('amrita_heart_checkins_history') || '[]');
    records = local.filter((e) => e.user_id === user_id);
  }

  return records;
}

export async function fetchHeartCheckIns(filter = 'All') {
  let records = [];

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase
        .from('heart_checkins')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        records = data;
      }
    } catch (e) {
      console.warn('[Supabase] Fetch heart check-ins failed, falling back to local storage');
    }
  }

  if (records.length === 0) {
    records = JSON.parse(localStorage.getItem('amrita_heart_checkins_history') || '[]');
  }

  const now = new Date();
  return records.filter((rec) => {
    if (filter === 'All') return true;
    const recDate = new Date(rec.created_at || Date.now());

    if (filter === 'Today') {
      return recDate.toDateString() === now.toDateString();
    }

    if (filter === 'This Week' || filter === 'Last 7 days') {
      const diffTime = Math.abs(now - recDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }

    if (filter === 'This Month') {
      return (
        recDate.getMonth() === now.getMonth() && recDate.getFullYear() === now.getFullYear()
      );
    }

    return true;
  });
}

const MOOD_SCORE_MAP = {
  '😊 Happy': 5,
  '😌 Peaceful': 4,
  '😐 Okay': 3,
  '😴 Tired': 2,
  '😔 Low': 1,
};

export async function fetchMoodAnalytics({ dateFilter = 'All Time', userFilter = 'All' } = {}) {
  const allRecords = await fetchHeartCheckIns('All');
  const now = new Date();

  let filtered = allRecords.filter((rec) => {
    if (userFilter === 'All') return true;
    const cleanFilter = String(userFilter).replace(/^usr-/, '').toLowerCase();
    const recUser = String(rec.user_id || '').replace(/^usr-/, '').toLowerCase();
    return recUser === cleanFilter;
  });

  filtered = filtered.filter((rec) => {
    if (dateFilter === 'All Time') return true;
    const recDate = new Date(rec.created_at || Date.now());

    if (dateFilter === 'Today') {
      return recDate.toDateString() === now.toDateString();
    }

    if (dateFilter === 'Last 7 Days') {
      const diffDays = (now - recDate) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    }

    if (dateFilter === 'Last 30 Days') {
      const diffDays = (now - recDate) / (1000 * 60 * 60 * 24);
      return diffDays <= 30;
    }

    return true;
  });

  filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  const currentMood = filtered.length > 0 ? (filtered[0].mood || '😊 Happy') : 'No Check-ins';
  const todayEntry = filtered.find((r) => new Date(r.created_at || 0).toDateString() === now.toDateString());
  const isTodayCompleted = Boolean(todayEntry);

  const distribution = {
    '😊 Happy': 0,
    '😌 Peaceful': 0,
    '😐 Okay': 0,
    '😔 Low': 0,
    '😴 Tired': 0,
  };

  filtered.forEach((r) => {
    if (r.mood && distribution[r.mood] !== undefined) {
      distribution[r.mood] += 1;
    } else if (r.mood) {
      const matchedKey = Object.keys(distribution).find((k) => k.includes(r.mood) || r.mood.includes(k.replace(/^[^\s]+\s*/, '')));
      if (matchedKey) distribution[matchedKey] += 1;
      else distribution['😊 Happy'] += 1;
    }
  });

  let mostCommonMood = filtered.length > 0 ? '😊 Happy' : 'None';
  let maxCount = -1;
  Object.entries(distribution).forEach(([m, count]) => {
    if (count > maxCount && count > 0) {
      maxCount = count;
      mostCommonMood = m;
    }
  });

  const uniqueDates = Array.from(new Set(filtered.map((r) => new Date(r.created_at || 0).toDateString())));
  const streak = uniqueDates.length;

  const trendRecords = [...filtered].reverse();
  const trendSeries = trendRecords.map((r) => {
    const d = new Date(r.created_at || Date.now());
    const score = MOOD_SCORE_MAP[r.mood] || 3;
    return {
      id: r.id,
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      mood: r.mood || '😊 Happy',
      score,
      user_id: r.user_id,
      created_at: r.created_at,
    };
  });

  return {
    totalCheckIns: filtered.length,
    currentMood,
    isTodayCompleted,
    mostCommonMood,
    streak,
    distribution,
    history: filtered,
    trendSeries,
  };
}

export async function fetchMemories({ includeHidden = false } = {}) {
  let records = [];

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      let query = supabase.from('memories').select('*').order('memory_date', { ascending: false });
      if (!includeHidden) {
        query = query.eq('is_visible', true);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        records = data;
      }
    } catch (e) {
      console.warn('[Supabase] Fetch memories failed, falling back to local cache');
    }
  }

  if (records.length === 0) {
    const local = JSON.parse(localStorage.getItem('amrita_memories_data') || '[]');
    records = includeHidden ? local : local.filter((m) => m.is_visible !== false);
  }

  return records;
}

export async function saveMemory(memoryData) {
  const now = new Date();
  const id = memoryData.id || `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  
  const record = {
    id,
    title: memoryData.title.trim(),
    memory_date: memoryData.memory_date || now.toISOString().split('T')[0],
    category: memoryData.category || '❤️ Special',
    short_description: memoryData.short_description.trim(),
    full_description: (memoryData.full_description || '').trim(),
    image_url: (memoryData.image_url || '').trim(),
    is_visible: memoryData.is_visible !== false,
    created_at: memoryData.created_at || now.toISOString(),
    updated_at: now.toISOString(),
  };

  const local = JSON.parse(localStorage.getItem('amrita_memories_data') || '[]');
  const existingIdx = local.findIndex((m) => m.id === id);

  if (existingIdx >= 0) {
    local[existingIdx] = record;
  } else {
    local.unshift(record);
  }
  localStorage.setItem('amrita_memories_data', JSON.stringify(local));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      const { error } = await supabase.from('memories').upsert([record]);
      if (error) {
        console.warn('[Supabase] Memory upsert error:', error.message);
      }
    } catch (e) {
      console.warn('[Supabase] Memory save exception:', e);
    }
  }

  return record;
}

export async function deleteMemory(memoryId) {
  const local = JSON.parse(localStorage.getItem('amrita_memories_data') || '[]');
  const updated = local.filter((m) => m.id !== memoryId);
  localStorage.setItem('amrita_memories_data', JSON.stringify(updated));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      await supabase.from('memories').delete().eq('id', memoryId);
    } catch (e) {
      console.warn('[Supabase] Memory delete exception:', e);
    }
  }
}

export async function toggleMemoryVisibility(memoryId) {
  const local = JSON.parse(localStorage.getItem('amrita_memories_data') || '[]');
  const item = local.find((m) => m.id === memoryId);
  if (item) {
    item.is_visible = !item.is_visible;
    localStorage.setItem('amrita_memories_data', JSON.stringify(local));

    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      try {
        await supabase.from('memories').update({ is_visible: item.is_visible }).eq('id', memoryId);
      } catch (e) {
        console.warn('[Supabase] Visibility update exception:', e);
      }
    }
  }
}

export async function fetchJarMemories({ includeInactive = false } = {}) {
  let records = [];

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      let query = supabase.from('memory_jar').select('*').order('created_at', { ascending: false });
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        records = data;
      }
    } catch (e) {
      console.warn('[Supabase] Fetch jar memories failed, using local cache');
    }
  }

  if (records.length === 0) {
    const local = JSON.parse(localStorage.getItem('amrita_memory_jar_data') || '[]');
    records = includeInactive ? local : local.filter((j) => j.is_active !== false);
  }

  return records;
}

export async function saveJarMemory(jarData) {
  const now = new Date();
  const id = jarData.id || `jar-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  
  const record = {
    id,
    title: jarData.title.trim(),
    message: jarData.message.trim(),
    category: jarData.category || '❤️ Love',
    memory_date: jarData.memory_date || now.toISOString().split('T')[0],
    is_active: jarData.is_active !== false,
    created_at: jarData.created_at || now.toISOString(),
    updated_at: now.toISOString(),
  };

  const local = JSON.parse(localStorage.getItem('amrita_memory_jar_data') || '[]');
  const existingIdx = local.findIndex((j) => j.id === id);

  if (existingIdx >= 0) {
    local[existingIdx] = record;
  } else {
    local.unshift(record);
  }
  localStorage.setItem('amrita_memory_jar_data', JSON.stringify(local));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      await supabase.from('memory_jar').upsert([record]);
    } catch (e) {
      console.warn('[Supabase] Jar memory save exception:', e);
    }
  }

  return record;
}

export async function deleteJarMemory(jarId) {
  const local = JSON.parse(localStorage.getItem('amrita_memory_jar_data') || '[]');
  const updated = local.filter((j) => j.id !== jarId);
  localStorage.setItem('amrita_memory_jar_data', JSON.stringify(updated));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      await supabase.from('memory_jar').delete().eq('id', jarId);
    } catch (e) {
      console.warn('[Supabase] Jar memory delete exception:', e);
    }
  }
}

export async function toggleJarMemoryActive(jarId) {
  const local = JSON.parse(localStorage.getItem('amrita_memory_jar_data') || '[]');
  const item = local.find((j) => j.id === jarId);
  if (item) {
    item.is_active = !item.is_active;
    localStorage.setItem('amrita_memory_jar_data', JSON.stringify(local));

    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      try {
        await supabase.from('memory_jar').update({ is_active: item.is_active }).eq('id', jarId);
      } catch (e) {
        console.warn('[Supabase] Jar active update exception:', e);
      }
    }
  }
}

export async function saveUserFavoriteMemory({ user_id = 'usr-amritayadav', memory_id, memory_data }) {
  const now = new Date();
  const favEntry = {
    id: `fav-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    user_id,
    memory_id: memory_id || memory_data.id,
    title: memory_data.title,
    message: memory_data.message || memory_data.short_description || '',
    category: memory_data.category || '❤️ Love',
    memory_date: memory_data.memory_date || now.toISOString().split('T')[0],
    created_at: now.toISOString(),
  };

  const localFavs = JSON.parse(localStorage.getItem('amrita_user_favorites') || '[]');
  const updatedFavs = [favEntry, ...localFavs];
  localStorage.setItem('amrita_user_favorites', JSON.stringify(updatedFavs));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      await supabase.from('user_memory_favorites').insert([favEntry]);
    } catch (e) {
      console.warn('[Supabase] Save favorite exception:', e);
    }
  }

  // Phase 32: Log user activity for Favorite Saved
  saveUserActivity({
    event_type: 'favorite_saved',
    title: '🫙 Saved Favorite',
    description: `Saved: ${favEntry.title}`,
    metadata: {
      question: 'Favorite Saved',
      answer: `${favEntry.title} • ${favEntry.message}`,
    },
    user_id,
  });

  return favEntry;
}

export async function fetchUserFavoriteMemories(user_id = 'usr-amritayadav') {
  let records = [];

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase
        .from('user_memory_favorites')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        records = data;
      }
    } catch (e) {
      console.warn('[Supabase] Fetch favorites failed, using local cache');
    }
  }

  if (records.length === 0) {
    const local = JSON.parse(localStorage.getItem('amrita_user_favorites') || '[]');
    records = local.filter((f) => f.user_id === user_id);
  }

  return records;
}

export async function deleteUserFavoriteMemory(user_id = 'usr-amritayadav', favoriteId) {
  const local = JSON.parse(localStorage.getItem('amrita_user_favorites') || '[]');
  const updated = local.filter((f) => f.id !== favoriteId);
  localStorage.setItem('amrita_user_favorites', JSON.stringify(updated));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      await supabase.from('user_memory_favorites').delete().eq('id', favoriteId);
    } catch (e) {
      console.warn('[Supabase] Delete favorite exception:', e);
    }
  }
}

export async function fetchSurprisePool(user_id = 'usr-amritayadav') {
  const [jData, tData, hData] = await Promise.all([
    fetchJarMemories({ includeInactive: false }),
    fetchMemories({ includeHidden: false }),
    fetchUserHeartHistory(user_id),
  ]);

  const latestHeart = hData[0] || null;

  return {
    jarMemories: jData,
    timelineMemories: tData,
    latestHeart,
  };
}

export async function getUserHugCount(user_id = 'usr-amritayadav') {
  const localHugs = JSON.parse(localStorage.getItem('amrita_user_hugs_count') || '{}');
  return localHugs[user_id] || 0;
}

export async function incrementUserHugCount(user_id = 'usr-amritayadav') {
  const localHugs = JSON.parse(localStorage.getItem('amrita_user_hugs_count') || '{}');
  const current = (localHugs[user_id] || 0) + 1;
  localHugs[user_id] = current;
  localStorage.setItem('amrita_user_hugs_count', JSON.stringify(localHugs));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      await supabase.from('user_hugs').upsert([{ user_id, hug_count: current, updated_at: new Date().toISOString() }]);
    } catch (e) {
      console.warn('[Supabase] Hug count update exception:', e);
    }
  }

  // Phase 32: Log user activity for Digital Hug
  saveUserActivity({
    event_type: 'digital_hug',
    title: '🤗 Received Digital Hug',
    description: `Total hugs received: ${current}`,
    metadata: {
      question: 'Digital Hug Requested',
      answer: 'Sending you the biggest digital hug imaginable. ❤️',
    },
    user_id,
  });

  return current;
}

export async function fetchComfortMessages({ includeInactive = false } = {}) {
  let records = [];

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      let query = supabase.from('comfort_messages').select('*').order('created_at', { ascending: false });
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        records = data;
      }
    } catch (e) {
      console.warn('[Supabase] Fetch comfort messages failed, using local cache');
    }
  }

  if (records.length === 0) {
    const local = JSON.parse(localStorage.getItem('amrita_comfort_messages_data') || '[]');
    records = includeInactive ? local : local.filter((c) => c.is_active !== false);
  }

  return records;
}

export async function saveComfortMessage(msgData) {
  const now = new Date();
  const id = msgData.id || `cmf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const record = {
    id,
    title: msgData.title.trim(),
    message: msgData.message.trim(),
    mood: msgData.mood || 'All',
    is_active: msgData.is_active !== false,
    created_at: msgData.created_at || now.toISOString(),
  };

  const local = JSON.parse(localStorage.getItem('amrita_comfort_messages_data') || '[]');
  const existingIdx = local.findIndex((c) => c.id === id);
  if (existingIdx >= 0) {
    local[existingIdx] = record;
  } else {
    local.unshift(record);
  }
  localStorage.setItem('amrita_comfort_messages_data', JSON.stringify(local));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      await supabase.from('comfort_messages').upsert([record]);
    } catch (e) {
      console.warn('[Supabase] Save comfort msg exception:', e);
    }
  }

  return record;
}

export async function deleteComfortMessage(msgId) {
  const local = JSON.parse(localStorage.getItem('amrita_comfort_messages_data') || '[]');
  const updated = local.filter((c) => c.id !== msgId);
  localStorage.setItem('amrita_comfort_messages_data', JSON.stringify(updated));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      await supabase.from('comfort_messages').delete().eq('id', msgId);
    } catch (e) {
      console.warn('[Supabase] Delete comfort msg exception:', e);
    }
  }
}

export async function fetchSecretUnlocks({ includeInactive = false } = {}) {
  let records = [];

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      let query = supabase.from('secret_unlocks').select('*').order('created_at', { ascending: true });
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        records = data;
      }
    } catch (e) {
      console.warn('[Supabase] Fetch secret unlocks failed, using local cache');
    }
  }

  if (records.length === 0) {
    const local = JSON.parse(localStorage.getItem('amrita_secret_unlocks_data') || '[]');
    records = local.length > 0 ? local : DEFAULT_SECRET_UNLOCKS;
    if (!includeInactive) {
      records = records.filter((s) => s.is_active !== false);
    }
  }

  return records;
}

export async function saveSecretUnlock(unlockData) {
  const now = new Date();
  const id = unlockData.id || `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const record = {
    id,
    name: unlockData.name.trim(),
    reqType: unlockData.reqType,
    reqVal: Number(unlockData.reqVal) || 1,
    title: unlockData.title.trim(),
    message: unlockData.message.trim(),
    image: (unlockData.image || '').trim(),
    is_active: unlockData.is_active !== false,
    created_at: unlockData.created_at || now.toISOString(),
  };

  const local = JSON.parse(localStorage.getItem('amrita_secret_unlocks_data') || '[]');
  const existingIdx = local.findIndex((s) => s.id === id);
  if (existingIdx >= 0) {
    local[existingIdx] = record;
  } else {
    local.push(record);
  }
  localStorage.setItem('amrita_secret_unlocks_data', JSON.stringify(local));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      await supabase.from('secret_unlocks').upsert([record]);
    } catch (e) {
      console.warn('[Supabase] Save secret unlock exception:', e);
    }
  }

  return record;
}

export async function deleteSecretUnlock(unlockId) {
  const local = JSON.parse(localStorage.getItem('amrita_secret_unlocks_data') || '[]');
  const updated = local.filter((s) => s.id !== unlockId);
  localStorage.setItem('amrita_secret_unlocks_data', JSON.stringify(updated));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      await supabase.from('secret_unlocks').delete().eq('id', unlockId);
    } catch (e) {
      console.warn('[Supabase] Delete secret unlock exception:', e);
    }
  }
}

export async function evaluateUserProgress(user_id = 'usr-amritayadav') {
  const [hData, fData, jData, hugCount] = await Promise.all([
    fetchUserHeartHistory(user_id),
    fetchUserFavoriteMemories(user_id),
    fetchJournalEntries('All'),
    getUserHugCount(user_id),
  ]);

  const visitCount = Number(localStorage.getItem(`amrita_visit_count_${user_id}`) || '1');
  const moodCheckinCount = hData.length;

  let streak = 0;
  if (hData.length > 0) {
    const dates = Array.from(new Set(hData.map((h) => new Date(h.created_at).toDateString())));
    streak = dates.length;
  }

  const savedMemoriesCount = fData.length;
  const surpriseCount = Number(localStorage.getItem(`amrita_surprise_count_${user_id}`) || '0');
  const journalCount = jData.length;

  const hasNightCheckin = hData.some((h) => {
    const hour = new Date(h.created_at).getHours();
    return hour >= 21 || hour < 5;
  });

  return {
    first_visit: visitCount,
    mood_checkin: moodCheckinCount,
    checkin_streak: streak,
    saved_memories: savedMemoriesCount,
    surprise_count: surpriseCount,
    hug_count: hugCount,
    journal_count: journalCount,
    night_checkin: hasNightCheckin ? 1 : 0,
  };
}

export async function fetchConstellations({ includeInactive = false } = {}) {
  let records = [];

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      let query = supabase.from('constellations').select('*').order('created_at', { ascending: true });
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        records = data;
      }
    } catch (e) {
      console.warn('[Supabase] Fetch constellations failed, using local cache');
    }
  }

  if (records.length === 0) {
    const local = JSON.parse(localStorage.getItem('amrita_constellations_data') || '[]');
    records = local.length > 0 ? local : DEFAULT_CONSTELLATIONS;
    if (!includeInactive) {
      records = records.filter((c) => c.is_active !== false);
    }
  }

  return records;
}

export async function saveConstellation(constData) {
  const now = new Date();
  const id = constData.id || `cst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const record = {
    id,
    name: constData.name.trim(),
    description: (constData.description || '').trim(),
    rewardTitle: (constData.rewardTitle || '').trim(),
    rewardMessage: (constData.rewardMessage || '').trim(),
    is_active: constData.is_active !== false,
    stars: constData.stars || [],
    created_at: constData.created_at || now.toISOString(),
  };

  const local = JSON.parse(localStorage.getItem('amrita_constellations_data') || '[]');
  const existingIdx = local.findIndex((c) => c.id === id);
  if (existingIdx >= 0) {
    local[existingIdx] = record;
  } else {
    local.push(record);
  }
  localStorage.setItem('amrita_constellations_data', JSON.stringify(local));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      await supabase.from('constellations').upsert([record]);
    } catch (e) {
      console.warn('[Supabase] Save constellation exception:', e);
    }
  }

  return record;
}

export async function deleteConstellation(constId) {
  const local = JSON.parse(localStorage.getItem('amrita_constellations_data') || '[]');
  const updated = local.filter((c) => c.id !== constId);
  localStorage.setItem('amrita_constellations_data', JSON.stringify(updated));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      await supabase.from('constellations').delete().eq('id', constId);
    } catch (e) {
      console.warn('[Supabase] Delete constellation exception:', e);
    }
  }
}

export async function getUserStarDiscoveries(user_id = 'usr-amritayadav') {
  const local = JSON.parse(localStorage.getItem(`amrita_star_discoveries_${user_id}`) || '[]');
  return local;
}

export async function saveUserStarDiscovery(user_id = 'usr-amritayadav', starId) {
  const local = JSON.parse(localStorage.getItem(`amrita_star_discoveries_${user_id}`) || '[]');
  if (!local.includes(starId)) {
    local.push(starId);
    localStorage.setItem(`amrita_star_discoveries_${user_id}`, JSON.stringify(local));

    // Phase 32: Log user activity for Star Discovery
    saveUserActivity({
      event_type: 'star_discovered',
      title: '🌌 Discovered Star',
      description: `Discovered star: ${starId}`,
      metadata: {
        question: 'Star Discovered',
        answer: `Star ID: ${starId}`,
      },
      user_id,
    });
  }
  return local;
}

export async function saveAdminAuditLog({
  action,
  target_user_id,
  target_user_display_name = '',
  details = '',
  status = 'Success',
  admin_id = 'admin',
}) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const cleanDetails = (details || '').replace(/password[:=]\s*\S+/gi, 'password:[REDACTED]');

  const record = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    admin_id,
    action,
    target_user_id: target_user_id || 'unknown',
    target_user_display_name: target_user_display_name || target_user_id || 'unknown',
    details: cleanDetails,
    status: status || 'Success',
    created_at: now.toISOString(),
    date: dateStr,
    time: timeStr,
  };

  const localLogs = JSON.parse(localStorage.getItem('amrita_admin_audit_logs') || '[]');
  localLogs.unshift(record);
  localStorage.setItem('amrita_admin_audit_logs', JSON.stringify(localLogs));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      await supabase.from('admin_audit_logs').upsert([
        {
          id: record.id,
          admin_id: record.admin_id,
          action: record.action,
          target_user_id: record.target_user_id,
          target_user_display_name: record.target_user_display_name,
          details: record.details,
          status: record.status,
          created_at: record.created_at,
        },
      ]);
    } catch (e) {
      console.warn('[Supabase] Audit log save exception:', e);
    }
  }

  return record;
}

export async function fetchAdminAuditLogs() {
  let records = [];

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        records = data;
      }
    } catch (e) {
      console.warn('[Supabase] Fetch admin audit logs exception, using local cache');
    }
  }

  if (records.length === 0) {
    records = JSON.parse(localStorage.getItem('amrita_admin_audit_logs') || '[]');
  }

  return records;
}

export async function fetchDailyMessages({ includeInactive = false } = {}) {
  let records = [];

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      let query = supabase.from('daily_messages').select('*').order('created_at', { ascending: false });
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        records = data;
      }
    } catch (e) {
      console.warn('[Supabase] Fetch daily messages failed, using local cache');
    }
  }

  if (records.length === 0) {
    const local = JSON.parse(localStorage.getItem('amrita_daily_messages_data') || '[]');
    records = local.length > 0 ? local : DEFAULT_DAILY_MESSAGES;
    if (!includeInactive) {
      records = records.filter((m) => m.is_active !== false);
    }
  }

  return records;
}

export async function saveDailyMessage(msgData) {
  const now = new Date();
  const id = msgData.id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const record = {
    id,
    title: msgData.title.trim(),
    message: msgData.message.trim(),
    category: msgData.category || 'General',
    is_active: msgData.is_active !== false,
    created_at: msgData.created_at || now.toISOString(),
  };

  const local = JSON.parse(localStorage.getItem('amrita_daily_messages_data') || '[]');
  const existingIdx = local.findIndex((m) => m.id === id);
  if (existingIdx >= 0) {
    local[existingIdx] = record;
  } else {
    local.unshift(record);
  }
  localStorage.setItem('amrita_daily_messages_data', JSON.stringify(local));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      await supabase.from('daily_messages').upsert([record]);
    } catch (e) {
      console.warn('[Supabase] Save daily message exception:', e);
    }
  }

  return record;
}

export async function deleteDailyMessage(msgId) {
  const local = JSON.parse(localStorage.getItem('amrita_daily_messages_data') || '[]');
  const updated = local.filter((m) => m.id !== msgId);
  localStorage.setItem('amrita_daily_messages_data', JSON.stringify(updated));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      await supabase.from('daily_messages').delete().eq('id', msgId);
    } catch (e) {
      console.warn('[Supabase] Delete daily message exception:', e);
    }
  }
}

export async function fetchJustForYouData(user_id = 'usr-amritayadav') {
  const [hData, fData, jData, dMsgs, secUnlocks, consts, starDiscoveries, hugCount] = await Promise.all([
    fetchUserHeartHistory(user_id),
    fetchUserFavoriteMemories(user_id),
    fetchJournalEntries('All'),
    fetchDailyMessages({ includeInactive: false }),
    fetchSecretUnlocks({ includeInactive: false }),
    fetchConstellations({ includeInactive: false }),
    getUserStarDiscoveries(user_id),
    getUserHugCount(user_id),
  ]);

  const latestHeart = hData[0] || null;
  const latestJournal = jData[0] || null;
  const userProgress = await evaluateUserProgress(user_id);

  const todayStr = new Date().toDateString();
  let dayHash = 0;
  for (let i = 0; i < todayStr.length; i++) {
    dayHash = (dayHash << 5) - dayHash + todayStr.charCodeAt(i);
    dayHash |= 0;
  }
  const msgIdx = Math.abs(dayHash) % (dMsgs.length || 1);
  const todayMessage = dMsgs[msgIdx] || DEFAULT_DAILY_MESSAGES[0];

  const nextSecret = secUnlocks.find((s) => (userProgress[s.reqType] || 0) < (s.reqVal || 1)) || null;

  return {
    latestHeart,
    latestJournal,
    favorites: fData,
    todayMessage,
    nextSecret,
    stats: {
      checkinCount: hData.length,
      savedCount: fData.length,
      surpriseCount: Number(localStorage.getItem(`amrita_surprise_count_${user_id}`) || '0'),
      hugCount,
      starCount: starDiscoveries.length,
      secretCount: secUnlocks.filter((s) => (userProgress[s.reqType] || 0) >= (s.reqVal || 1)).length,
      journalCount: jData.length,
    },
    constellationStats: {
      discoveredStars: starDiscoveries.length,
      totalStars: consts.flatMap((c) => c.stars).length,
      completedConstellations: consts.filter((c) => c.stars.map((s) => s.id).every((id) => starDiscoveries.includes(id))).length,
      totalConstellations: consts.length,
    },
  };
}

export async function fetchAllUserResponses(filter = 'All') {
  const [hData, jData, fData] = await Promise.all([
    fetchHeartCheckIns('All'),
    fetchJournalEntries('All'),
    fetchUserFavoriteMemories('usr-amritayadav'),
  ]);

  const heartItems = hData.map((h) => ({
    id: h.id,
    type: '❤️ Heart Check-in',
    responseType: 'heart',
    question: 'How are you feeling today?',
    answer: h.shared_message || h.heart_word || h.day_feeling || h.mood,
    text: h.shared_message || h.heart_word || h.day_feeling || h.mood,
    mood: h.mood,
    user_id: h.user_id || 'amritayadav',
    created_at: h.created_at || new Date().toISOString(),
    date: h.date || new Date(h.created_at || Date.now()).toLocaleDateString(),
    time: h.time || '7:42 PM',
  }));

  const journalItems = jData.map((j) => ({
    id: j.id,
    type: '📖 Journal Entry',
    responseType: 'journal',
    question: 'Your personal thought / journal entry',
    answer: j.journal_text,
    text: j.journal_text,
    mood: j.mood || 'Thoughtful',
    user_id: j.user_id || 'amritayadav',
    created_at: j.created_at || new Date().toISOString(),
    date: j.date || new Date(j.created_at || Date.now()).toLocaleDateString(),
    time: j.time || '8:15 PM',
  }));

  const favItems = fData.map((f) => ({
    id: f.id,
    type: '🫙 Saved Favorite',
    responseType: 'favorite',
    question: 'Favorite Saved',
    answer: f.title + ': ' + (f.message || ''),
    text: f.title + ': ' + (f.message || ''),
    user_id: f.user_id || 'amritayadav',
    created_at: f.created_at || new Date().toISOString(),
    date: new Date(f.created_at || Date.now()).toLocaleDateString(),
    time: '9:00 PM',
  }));

  let combined = [...heartItems, ...journalItems, ...favItems];

  if (filter !== 'All') {
    if (filter === 'heart') combined = combined.filter((i) => i.responseType === 'heart');
    if (filter === 'journal') combined = combined.filter((i) => i.responseType === 'journal');
    if (filter === 'favorite') combined = combined.filter((i) => i.responseType === 'favorite');
  }

  return combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function deleteUserResponse(responseType, responseId) {
  if (responseType === 'heart') {
    const local = JSON.parse(localStorage.getItem('amrita_heart_checkins_history') || '[]');
    const updated = local.filter((h) => h.id !== responseId);
    localStorage.setItem('amrita_heart_checkins_history', JSON.stringify(updated));

    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      try {
        await supabase.from('heart_checkins').delete().eq('id', responseId);
      } catch (e) {
        console.warn('[Supabase] Delete heart checkin exception:', e);
      }
    }
  } else if (responseType === 'journal') {
    const local = JSON.parse(localStorage.getItem('amrita_journal_history') || '[]');
    const updated = local.filter((j) => j.id !== responseId);
    localStorage.setItem('amrita_journal_history', JSON.stringify(updated));

    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      try {
        await supabase.from('journal_entries').delete().eq('id', responseId);
      } catch (e) {
        console.warn('[Supabase] Delete journal entry exception:', e);
      }
    }
  } else if (responseType === 'favorite') {
    await deleteUserFavoriteMemory('usr-amritayadav', responseId);
  }

  return true;
}

/* ===================================================
   PHASE 32: CENTRAL USER ACTIVITY TRACKING HELPERS
   =================================================== */

export async function saveUserActivity({
  event_type,
  title,
  description = '',
  metadata = {},
  user_id = 'usr-amritayadav',
}) {
  const now = new Date();
  const id = `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const record = {
    id,
    user_id,
    event_type,
    title,
    description,
    metadata,
    created_at: now.toISOString(),
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const localActivities = JSON.parse(localStorage.getItem('amrita_user_activities') || '[]');
  const updatedLocal = [record, ...localActivities];
  localStorage.setItem('amrita_user_activities', JSON.stringify(updatedLocal));

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      await supabase.from('user_activity').insert([record]);
    } catch (e) {
      console.warn('[Supabase] Activity insert exception:', e);
    }
  }

  return record;
}

export async function fetchUserActivityTimeline(user_id = 'usr-amritayadav', filter = 'All') {
  let records = [];

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        records = data;
      }
    } catch (e) {
      console.warn('[Supabase] Fetch activity timeline failed, using local cache');
    }
  }

  if (records.length === 0) {
    records = JSON.parse(localStorage.getItem('amrita_user_activities') || '[]');
  }

  if (filter !== 'All') {
    records = records.filter((r) => r.event_type === filter || r.title.includes(filter));
  }

  return records.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export function exportUserAnswersCSV(responses) {
  const headers = ['User', 'Question', 'Answer', 'Date', 'Time'];
  const rows = responses.map((r) => [
    `"${r.user_id || 'amritayadav'}"`,
    `"${(r.question || 'User Response').replace(/"/g, '""')}"`,
    `"${(r.answer || r.text || '').replace(/"/g, '""')}"`,
    `"${r.date || ''}"`,
    `"${r.time || ''}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `user_answers_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
