// ─────────────────────────────────────────────────────────────────────────────
// NLP LAYER — Language Detection
//
// Detects whether the user is writing in:
//   - "hindi"    → Devanagari script  (e.g. "तुम कैसे हो")
//   - "hinglish" → Hindi in Roman letters (e.g. "tum kaise ho")
//   - "english"  → Plain English (e.g. "how are you")
//
// This is the NLP layer that lives between the user's message and the LLM.
// It picks up cues so we can tell Claude which language to respond in.
// ─────────────────────────────────────────────────────────────────────────────

// Common Hinglish marker words. When we see several of these in romanized text,
// we treat the message as Hinglish even though it uses English letters.
const HINGLISH_MARKERS = new Set([
  // pronouns
  'tum', 'tu', 'tujhe', 'tujhko', 'tumko', 'tumhe', 'aap', 'aapko', 'aapka',
  'mai', 'main', 'mein', 'mujhe', 'mujhko', 'mera', 'meri', 'mere',
  'hum', 'humko', 'hamara', 'hamari', 'hamare',
  'woh', 'wo', 'ye', 'yeh', 'unko', 'iska', 'uska', 'inka', 'unka',
  // common verbs/aux
  'hai', 'hain', 'tha', 'thi', 'the', 'hoga', 'hogi', 'honge', 'hota', 'hoti',
  'kar', 'karo', 'karta', 'karti', 'karte', 'kiya', 'karna', 'karenge',
  'raha', 'rahi', 'rahe', 'rahega', 'rahegi',
  'jao', 'jaa', 'jata', 'jati', 'jaate', 'gaya', 'gayi', 'gaye',
  'aaya', 'aayi', 'aaye', 'aata', 'aati', 'aate',
  'bolna', 'bola', 'boli', 'bolte', 'kehna', 'kaha', 'kahi',
  // question words
  'kya', 'kyu', 'kyun', 'kyon', 'kaise', 'kaisa', 'kaisi', 'kahan', 'kahaan',
  'kab', 'kaun', 'kitna', 'kitne', 'kitni',
  // common everyday words
  'nahi', 'nahin', 'nai', 'haan', 'han', 'haa', 'theek', 'thik', 'sahi',
  'accha', 'achha', 'achi', 'acche', 'bahut', 'bohot', 'bhot',
  'bhai', 'didi', 'yaar', 'yar', 'arre', 'arrey', 'are',
  'matlab', 'lekin', 'magar', 'phir', 'fir', 'aur', 'ya', 'agar',
  'kuch', 'kuchh', 'sab', 'sabhi', 'koi', 'kisi',
  'abhi', 'aaj', 'kal', 'parso', 'roz', 'kabhi',
  'chahiye', 'chahta', 'chahti', 'chahte', 'pasand', 'milega', 'mila', 'mili',
  'samajh', 'samjha', 'samjhi', 'pata', 'malum', 'maalum',
  'dosti', 'dost', 'pyar', 'pyaar', 'zindagi', 'jindagi',
  'kaam', 'naukri', 'paisa', 'paise', 'ghar', 'office',
  'problem', 'tension', 'dimaag', 'dimag',
  'bilkul', 'zaroor', 'zarur', 'shayad',
])

/**
 * Detect the language of a piece of text.
 * Returns one of: 'hindi' | 'hinglish' | 'english'
 */
export function detectLanguage(text) {
  if (!text || typeof text !== 'string') return 'english'

  const trimmed = text.trim()
  if (!trimmed) return 'english'

  // 1. Check for Devanagari characters (Unicode block U+0900–U+097F).
  // If the text contains any meaningful amount of Devanagari, it's Hindi.
  const devanagariMatches = trimmed.match(/[\u0900-\u097F]/g)
  if (devanagariMatches && devanagariMatches.length >= 2) {
    return 'hindi'
  }

  // 2. Check for Hinglish markers in romanized text.
  // We tokenize the message into lowercase words and see how many are
  // recognized Hinglish words.
  const words = trimmed
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, ' ')   // strip punctuation, keep letters from any script
    .split(/\s+/)
    .filter(w => w.length > 0)

  if (words.length === 0) return 'english'

  let hinglishHits = 0
  for (const w of words) {
    if (HINGLISH_MARKERS.has(w)) hinglishHits++
  }

  // If at least 2 marker words OR ≥25% of the words are Hinglish markers,
  // call it Hinglish. (Short messages need fewer hits.)
  const ratio = hinglishHits / words.length
  if (hinglishHits >= 2 || (words.length <= 4 && hinglishHits >= 1) || ratio >= 0.25) {
    return 'hinglish'
  }

  return 'english'
}

/**
 * Lightweight intent/sentiment hint — gives the model extra context
 * for very short or emotional messages.
 */
export function analyzeIntent(text) {
  const t = (text || '').toLowerCase()
  const intents = []

  // greeting
  if (/\b(hi|hello|hey|hola|namaste|namaskar|salaam|kaise ho|kaisi ho|kya haal)\b/.test(t)
      || /(नमस्ते|नमस्कार|हेलो|हाय)/.test(text || '')) {
    intents.push('greeting')
  }
  // question
  if (/[?]\s*$/.test(t) || /\b(what|why|how|when|where|who|kya|kyu|kyun|kaise|kab|kahan|kaun)\b/.test(t)) {
    intents.push('question')
  }
  // emotional distress
  if (/\b(sad|depressed|crying|hurt|anxious|stressed|alone|lonely|udaas|dukhi|pareshan|tension|akela|akeli)\b/.test(t)
      || /(दुखी|उदास|परेशान|अकेला|अकेली)/.test(text || '')) {
    intents.push('emotional_distress')
  }
  // gratitude
  if (/\b(thank|thanks|thx|dhanyavad|shukriya|shukria)\b/.test(t)
      || /(धन्यवाद|शुक्रिया)/.test(text || '')) {
    intents.push('gratitude')
  }

  return intents
}
