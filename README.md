# Soulbound Persona Platform

AI persona chat app with daily message limits and subscription system.

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

**.env file mein apni Gemini API key daalo:**
```
GEMINI_API_KEY=AIzaSy_YOUR_KEY_HERE
```

Get your free key: https://aistudio.google.com/apikey

**Backend start karo:**
```bash
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. App open karo

http://localhost:5173

---

## API Limits

| Model | Free Limit |
|-------|-----------|
| gemini-1.5-flash ✅ (this app) | 1500 req/day |
| gemini-2.5-flash-lite ❌ (old) | 20 req/day |

## Daily Message Limit System

- Free users: 20 messages/day (resets midnight)
- Subscribed users: unlimited
- Stored in browser localStorage

## Test Limits (Browser Console F12)

```js
// Check current usage
JSON.parse(localStorage.getItem("soulbound_daily"))

// Set to limit (to test paywall)
localStorage.setItem("soulbound_daily", JSON.stringify({ date: new Date().toISOString().slice(0,10), count: 20 }))

// Reset everything
localStorage.removeItem("soulbound_daily")
localStorage.removeItem("soulbound_subscribed")

// Activate subscription
localStorage.setItem("soulbound_subscribed", "true")
```
