export const sweetMessagesData = [
  { id: 1, text: "You're someone's favorite person. ❤️", category: 'warm', time: 'any' },
  { id: 2, text: "Keep smiling, Amrita. It suits you. 🌸", category: 'cheerful', time: 'morning' },
  { id: 3, text: "Some people make ordinary moments feel special. ✨", category: 'warm', time: 'any' },
  { id: 4, text: "Just a little reminder: you're precious. 💗", category: 'gentle', time: 'any' },
  { id: 5, text: "Your smile can make a whole day better. 🌷", category: 'cheerful', time: 'morning' },
  { id: 6, text: "Take a breath. You're doing okay. 🌙", category: 'comforting', time: 'night' },
  { id: 7, text: "Somewhere in this little world, someone is thinking of you. ❤️", category: 'warm', time: 'evening' },
  { id: 8, text: "Today deserves one beautiful smile from you. ✨", category: 'cheerful', time: 'morning' },
  { id: 9, text: "You're more special than you realize. 💕", category: 'warm', time: 'any' },
  { id: 10, text: "Never forget how beautifully you are you. 🌸", category: 'gentle', time: 'any' },
  { id: 11, text: "Start your day with a soft smile. 🌅", category: 'cheerful', time: 'morning' },
  { id: 12, text: "Hope your day is going as beautifully as your heart. ☀️", category: 'cheerful', time: 'afternoon' },
  { id: 13, text: "Hope your evening feels peaceful and gentle. 🌇", category: 'comforting', time: 'evening' },
  { id: 14, text: "Let the stars keep you company tonight. 🌙", category: 'gentle', time: 'night' },
  { id: 15, text: "You bring a quiet warmth wherever you go. 🪷", category: 'warm', time: 'any' },
  { id: 16, text: "A little kindness looks wonderful on you. 💗", category: 'gentle', time: 'any' },
  { id: 17, text: "Everything will unfold nicely in its own time. 🌸", category: 'comforting', time: 'any' },
  { id: 18, text: "You deserve all the peaceful moments today. ✨", category: 'comforting', time: 'afternoon' },
  { id: 19, text: "Some conversations are like warm tea on a chilly day. 🍵", category: 'warm', time: 'evening' },
  { id: 20, text: "Rest your mind. Tomorrow will be bright. 🌙", category: 'gentle', time: 'night' },
  { id: 21, text: "Your gentle nature is a superpower. ❤️", category: 'warm', time: 'any' },
  { id: 22, text: "Sending a little extra sunshine your way. ☀️", category: 'cheerful', time: 'afternoon' },
  { id: 23, text: "You make this world feel a little softer. 🌷", category: 'gentle', time: 'any' },
  { id: 24, text: "Always remember: you matter. 💫", category: 'warm', time: 'any' },
  { id: 25, text: "Small steps still lead to wonderful places. 🐾", category: 'comforting', time: 'any' },
  { id: 26, text: "You are a joy to know. 💕", category: 'cheerful', time: 'any' },
  { id: 27, text: "May your heart feel light and happy today. 🌸", category: 'cheerful', time: 'morning' },
  { id: 28, text: "A quiet moment of care, just for you. ❤️", category: 'warm', time: 'evening' },
  { id: 29, text: "Sleep peacefully. Sweet dreams ahead. 🌙", category: 'gentle', time: 'night' },
  { id: 30, text: "You make ordinary days feel memorable. ✨", category: 'warm', time: 'any' },
  { id: 31, text: "Keep being your sweet, genuine self. 💗", category: 'cheerful', time: 'any' },
  { id: 32, text: "One little reminder: you are truly cherished. ❤️", category: 'warm', time: 'any' },
];

/**
 * Get Today's Special Message consistently for current calendar date
 */
export function getTodaysMessage() {
  const dateKey = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = dateKey.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % sweetMessagesData.length;
  return sweetMessagesData[index];
}

/**
 * Get a Random Sweet Message avoiding recent IDs and preferring mood/time tags
 */
export function getRandomSweetMessage({ recentIds = [], mood = null, hour = new Date().getHours() }) {
  let timeTag = 'any';
  if (hour >= 5 && hour < 12) timeTag = 'morning';
  else if (hour >= 12 && hour < 17) timeTag = 'afternoon';
  else if (hour >= 17 && hour < 20) timeTag = 'evening';
  else timeTag = 'night';

  let moodCategory = null;
  if (mood === 'Bahut achchi') moodCategory = 'cheerful';
  else if (mood === 'Happy') moodCategory = 'warm';
  else if (mood === 'Theek-thaak') moodCategory = 'comforting';
  else if (mood === 'Thodi sad') moodCategory = 'gentle';

  // Filter unshown messages
  let candidates = sweetMessagesData.filter((m) => !recentIds.includes(m.id));
  if (candidates.length === 0) {
    candidates = [...sweetMessagesData];
  }

  // Score candidates based on mood and time match
  const scored = candidates.map((m) => {
    let score = 1;
    if (moodCategory && m.category === moodCategory) score += 2;
    if (m.time === timeTag || m.time === 'any') score += 1;
    return { message: m, score };
  });

  scored.sort((a, b) => b.score - a.score + (Math.random() - 0.5));
  return scored[0].message;
}
