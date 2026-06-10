import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Groq from 'groq-sdk'
import { buildSystemPrompt, PERSONA_PROMPTS } from './personas.js'
import { detectLanguage, analyzeIntent } from './nlp.js'

const app  = express()
const PORT = process.env.PORT || 4000
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '20mb' }))

const groq    = new Groq({ apiKey: process.env.GROQ_API_KEY || '' })
const SUNO_KEY = process.env.SUNO_API_KEY || ''
const MODELS  = [process.env.GROQ_MODEL||'llama-3.3-70b-versatile','llama-3.1-8b-instant','gemma2-9b-it','mixtral-8x7b-32768']
const VISION_MODEL = 'llama-4-scout-17b-16e-instruct'
const sleep = ms => new Promise(r => setTimeout(r, ms))

const userRequests = new Map()
function isUserRateLimited(ip) {
  const now = Date.now()
  const times = (userRequests.get(ip)||[]).filter(t => now-t < 60000)
  if (times.length >= 10) return true
  times.push(now); userRequests.set(ip, times); return false
}

async function callGroq(messages, isVision=false) {
  if (isVision) {
    const c = await groq.chat.completions.create({ model: VISION_MODEL, messages, max_tokens:2048, temperature:0.9 })
    return { result:c, model:VISION_MODEL }
  }
  let lastErr=null
  for (const model of MODELS) {
    try {
      const c = await groq.chat.completions.create({ model, messages, max_tokens:2048, temperature:0.9 })
      return { result:c, model }
    } catch(err) {
      const m = err?.message||''
      if (m.includes('429')||m.includes('rate_limit')||m.includes('Too Many Requests')) { lastErr=err; await sleep(1000); continue }
      throw err
    }
  }
  throw lastErr
}

const SONG_TRIGGERS = ['song','gaana','gana','geet','music','melody','tune','beat','banao','bana do','compose','create song','make song','generate song','vocal','human voice','singing','awaaz','sad song','happy song','motivational song','hindi song','inspirational song','ek song']
const isSongRequest = msg => SONG_TRIGGERS.some(t => (msg||'').toLowerCase().includes(t))

async function generateLyrics(userMessage, language) {
  const isHindi = language === 'hindi' || language === 'hinglish'
  const res = await groq.chat.completions.create({
    model: MODELS[0], max_tokens:800, temperature:0.9,
    messages: [{ role:'user', content: isHindi
      ? `Ek emotional Hindi motivational song likho: "${userMessage}"\nFormat: [Verse 1] [Chorus] [Verse 2] [Bridge] [Outro]\nSirf lyrics likho.`
      : `Write emotional song for: "${userMessage}"\nFormat: [Verse 1] [Chorus] [Verse 2] [Bridge] [Outro]\nWrite only lyrics.`
    }]
  })
  return res.choices[0]?.message?.content?.trim() || userMessage
}

// ── sunoapi.org — FIXED endpoints ────────────────────────────────────────────
async function sunoGenerate(lyrics, language) {
  if (!SUNO_KEY) throw new Error('SUNO_API_KEY not set in .env')

  const isHindi = language === 'hindi' || language === 'hinglish'
  const style = isHindi
    ? 'hindi pop emotional male vocals piano cinematic'
    : 'inspirational pop emotional male vocals piano cinematic'

  console.log('[suno] Submitting to sunoapi.org...')

  const res = await fetch('https://api.sunoapi.org/api/v1/generate', // ✅ FIXED path
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUNO_KEY}`,
      },
      body: JSON.stringify({
        customMode: true,
        prompt: lyrics,
        style: style,
        title: 'My Song',
        instrumental: false,
        model: 'V4_5',
        callBackUrl: 'https://httpbin.org/post', // ✅ required by sunoapi.org (we use polling anyway)
      }),
    })

  const text = await res.text()
  console.log('[suno] Status:', res.status, '| Response:', text.slice(0, 300))

  if (!res.ok) throw new Error(`sunoapi.org ${res.status}: ${text.slice(0, 200)}`)

  const data = JSON.parse(text)
  const taskId = data?.data?.taskId || data?.taskId  // ✅ camelCase taskId
  if (!taskId) throw new Error(`No task ID: ${JSON.stringify(data).slice(0, 200)}`)
  console.log('[suno] Task ID:', taskId)
  return taskId
}

async function sunoPoll(taskId) {
  console.log('[suno] Polling task:', taskId)
  const maxAttempts = 40
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(6000)
    try {
      const res = await fetch(
        `https://api.sunoapi.org/api/v1/generate/record-info?taskId=${taskId}`, // ✅ FIXED path
        { headers: { 'Authorization': `Bearer ${SUNO_KEY}` } }
      )
      if (!res.ok) { console.warn('[suno poll] status:', res.status); continue }
      const data = await res.json()

      const status = data?.data?.status
      const sunoData = data?.data?.response?.sunoData || []
      console.log('[suno poll] status:', status)

      if (status === 'SUCCESS' && Array.isArray(sunoData) && sunoData.some(s => s.audioUrl)) {
        return sunoData.filter(s => s.audioUrl).map(s => ({
          id: s.id || taskId,
          title: s.title || 'My Song',
          audioUrl: s.audioUrl,        // ✅ camelCase (was audio_url)
          imageUrl: s.imageUrl || null, // ✅ camelCase (was image_url)
          status: 'complete',
        }))
      }
      if (status === 'FAILED') throw new Error('Song generation failed on server')
    } catch (e) {
      if (e.message.includes('failed on server')) throw e
      console.warn('[suno poll] error:', e.message)
    }
  }
  throw new Error('Song timed out after 4 minutes')
}

app.get('/health', (_req, res) => res.json({ status:'ok', sunoKey: !!SUNO_KEY, groqKey: !!process.env.GROQ_API_KEY }))
app.get('/personas', (_req, res) => res.json({ personas: Object.keys(PERSONA_PROMPTS) }))

app.get('/song-status', async (req, res) => {
  try {
    const { taskId } = req.query
    if (!taskId) return res.status(400).json({ error: 'taskId required' })

    const r = await fetch(
      `https://api.sunoapi.org/api/v1/generate/record-info?taskId=${taskId}`, // ✅ FIXED path
      { headers: { 'Authorization': `Bearer ${SUNO_KEY}` } }
    )
    if (!r.ok) return res.status(r.status).json({ error: 'sunoapi error' })

    const data = await r.json()
    const status = data?.data?.status
    const sunoData = data?.data?.response?.sunoData || []

    res.json({
      done: status === 'SUCCESS',
      songs: sunoData.filter(s => s.audioUrl).map(s => ({
        id: s.id,
        title: s.title || 'My Song',
        audioUrl: s.audioUrl,        // ✅ camelCase
        imageUrl: s.imageUrl || null, // ✅ camelCase
        status: 'complete',
      }))
    })
  } catch(err) { res.status(500).json({ error: err.message }) }
})

app.post('/chat', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
    if (isUserRateLimited(ip)) return res.status(429).json({ error:'rate_limited', message:'Thodi slow down karo! 30 seconds ruko.' })

    const { personaId, message, history=[], fileData=null } = req.body || {}
    if (!personaId || !PERSONA_PROMPTS[personaId]) return res.status(400).json({ error:'invalid personaId' })
    if (!message && !fileData) return res.status(400).json({ error:'message required' })

    const language = detectLanguage(message||'')
    const intents  = analyzeIntent(message||'')

    // ── SONG ──
    if (message && isSongRequest(message)) {
      console.log('[song] Request detected!')
      if (!SUNO_KEY) {
        return res.json({ reply:'⚠️ SUNO_API_KEY .env mein nahi hai!\n\nAdd karo:\nSUNO_API_KEY=tumhari_key\n\nKey yahan se lo: sunoapi.org', meta:{language,intents,personaId} })
      }
      try {
        const lyrics = await generateLyrics(message, language)
        const taskId = await sunoGenerate(lyrics, language)

        return res.json({
          reply: `🎵 Tera song generate ho raha hai!\n\n📝 Lyrics:\n\n${lyrics}\n\n⏳ ~2-3 minute wait karo — audio player aayega!`,
          meta: { language, intents, personaId, isSong:true, taskId },
        })
      } catch(songErr) {
        const m = songErr.message||''
        console.error('[song] Error:', m)
        if (m.includes('401')||m.includes('403')||m.includes('Unauthorized')) {
          return res.json({ reply:'❌ SUNO_API_KEY invalid hai!\n\nsunoapi.org pe jao → login karo → nayi key lo → .env update karo', meta:{language,intents,personaId} })
        }
        if (m.includes('402')||m.includes('credit')||m.includes('insufficient')) {
          return res.json({ reply:'💳 Suno credits khatam! sunoapi.org pe account top-up karo.', meta:{language,intents,personaId} })
        }
        return res.json({ reply:`😔 Song error: ${m.slice(0,100)}\n\nThodi der baad try karo!`, meta:{language,intents,personaId} })
      }
    }

    // ── NORMAL CHAT ──
    const systemPrompt = buildSystemPrompt(personaId, language)
    const cleanHistory = (Array.isArray(history)?history:[]).filter(m=>(m.role==='user'||m.role==='assistant')&&typeof m.content==='string').slice(-20)
    const groqMessages = [{ role:'system', content:systemPrompt }, ...cleanHistory]

    if (fileData?.isImage) groqMessages.push({ role:'user', content:[{type:'image_url',image_url:{url:fileData.content}},{type:'text',text:message||`Describe: ${fileData.name}`}] })
    else if (fileData?.isPdf||fileData?.isText) groqMessages.push({ role:'user', content:`File "${fileData.name}":\n\n---\n${fileData.content.slice(0,10000)}\n---\n\n${message||'Explain this.'}` })
    else groqMessages.push({ role:'user', content:message })

    const { result, model:usedModel } = await callGroq(groqMessages, fileData?.isImage)
    res.json({ reply:result.choices[0]?.message?.content||'(empty)', meta:{language,intents,personaId,model:usedModel} })

  } catch(err) {
    const msg = err?.message||''
    if (msg.includes('429')||msg.includes('rate_limit')) return res.status(429).json({ error:'rate_limited', message:'Groq limit. 1-2 min baad try karo.' })
    if (msg.includes('401')||msg.includes('invalid_api_key')) return res.status(401).json({ error:'invalid_key', message:'Groq key galat hai.' })
    res.status(500).json({ error:'chat_failed', message:'Kuch galat hua.' })
  }
})

app.use((_req, res) => res.status(404).json({ error:'Not found' }))
app.listen(PORT, () => console.log(`\n  🔮 Soulbound → http://localhost:${PORT}\n  🎵 SunoAPI Key: ${SUNO_KEY?'✅':'❌ Missing'}\n`))