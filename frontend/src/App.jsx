import { useState, useEffect, useRef } from "react";

const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=JetBrains+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:#080810; --bg2:#0e0e1a; --bg3:#14141f; --surface:#1a1a2e;
      --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.13);
      --violet:#7c5cfc; --violet2:#a78bfa; --violet3:#ede9fe;
      --pink:#f472b6; --amber:#fbbf24; --teal:#2dd4bf;
      --text:#f1f0f9; --muted:#7c7a96; --muted2:#4a4868;
      --font-head:'Syne',sans-serif; --font-body:'DM Sans',sans-serif; --font-mono:'JetBrains Mono',monospace;
    }
    html{scroll-behavior:smooth;}
    body{background:var(--bg);color:var(--text);font-family:var(--font-body);font-size:16px;line-height:1.6;overflow-x:hidden;}
    h1,h2,h3,h4,h5{font-family:var(--font-head);}
    .nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:1.1rem 2rem;background:rgba(8,8,16,0.85);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);}
    .nav-logo{font-family:var(--font-head);font-size:1.25rem;font-weight:800;background:linear-gradient(135deg,var(--violet2),var(--pink));-webkit-background-clip:text;-webkit-text-fill-color:transparent;cursor:pointer;}
    .nav-links{display:flex;gap:0.5rem;}
    .nav-btn{background:none;border:1px solid var(--border2);border-radius:100px;color:var(--muted);font-family:var(--font-body);font-size:0.875rem;padding:0.4rem 1rem;cursor:pointer;transition:all 0.2s;}
    .nav-btn:hover{border-color:var(--violet);color:var(--violet2);}
    .nav-btn.primary{background:var(--violet);border-color:var(--violet);color:#fff;font-weight:500;}
    .nav-btn.primary:hover{background:#6d4ff0;}
    .orb{position:absolute;border-radius:50%;pointer-events:none;filter:blur(80px);opacity:0.25;}
    .btn{display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.75rem;border-radius:100px;font-family:var(--font-body);font-size:0.9375rem;font-weight:500;cursor:pointer;transition:all 0.2s;border:none;}
    .btn-primary{background:var(--violet);color:#fff;}
    .btn-primary:hover{background:#8a6dfd;transform:translateY(-1px);box-shadow:0 8px 30px rgba(124,92,252,0.35);}
    .btn-ghost{background:transparent;color:var(--text);border:1px solid var(--border2);}
    .btn-ghost:hover{border-color:var(--violet);color:var(--violet2);}
    .btn-large{padding:1rem 2.5rem;font-size:1.0625rem;}
    .glass-card{background:rgba(26,26,46,0.6);border:1px solid var(--border2);border-radius:20px;backdrop-filter:blur(12px);}
    @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(124,92,252,0.4)}70%{box-shadow:0 0 0 12px rgba(124,92,252,0)}100%{box-shadow:0 0 0 0 rgba(124,92,252,0)}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
    @keyframes typingDot{0%,80%,100%{transform:scale(0.6);opacity:0.3}40%{transform:scale(1);opacity:1}}
    @keyframes songPop{from{opacity:0;transform:translateY(10px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes waveBar{0%,100%{height:4px}50%{height:18px}}
    .fade-up{animation:fadeUp 0.6s ease both;}
    .delay-1{animation-delay:0.1s} .delay-2{animation-delay:0.2s} .delay-3{animation-delay:0.3s} .delay-4{animation-delay:0.4s} .delay-5{animation-delay:0.5s}
    .mood-dot{width:10px;height:10px;border-radius:50%;animation:pulse-ring 2s infinite;}
    .bubble{padding:0.75rem 1.1rem;border-radius:18px;font-size:0.9375rem;line-height:1.6;word-break:break-word;white-space:pre-wrap;}
    .bubble-ai{background:var(--surface);border:1px solid var(--border2);border-bottom-left-radius:4px;color:var(--text);width:100%;}
    .bubble-user{background:var(--violet);color:#fff;border-bottom-right-radius:4px;margin-left:auto;max-width:78%;}
    .streak{display:inline-flex;align-items:center;gap:0.35rem;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.25);border-radius:100px;padding:0.25rem 0.75rem;font-size:0.8125rem;color:var(--amber);font-weight:500;}
    .tier-popular{border-color:var(--violet)!important;box-shadow:0 0 0 1px var(--violet),0 20px 60px rgba(124,92,252,0.2);}
    ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:var(--muted2);border-radius:4px}
    .page{min-height:100vh;padding-top:66px;}
    .quiz-bar-track{height:3px;background:var(--surface);border-radius:3px;overflow:hidden;}
    .quiz-bar-fill{height:100%;background:linear-gradient(90deg,var(--violet),var(--pink));border-radius:3px;transition:width 0.4s ease;}

    /* ── Song Card ── */
    .song-card{
      animation: songPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
      margin-top: 10px;
      background: linear-gradient(145deg,#12082a,#1a1035,#0f0820);
      border: 1px solid rgba(168,85,247,0.5);
      border-radius: 18px;
      padding: 18px;
      max-width: 430px;
      box-shadow: 0 8px 40px rgba(124,58,237,0.25), inset 0 1px 0 rgba(255,255,255,0.06);
    }
    .song-header{ display:flex; gap:14px; align-items:center; margin-bottom:16px; }
    .song-cover{ width:76px; height:76px; border-radius:12px; object-fit:cover; flex-shrink:0; border:1px solid rgba(168,85,247,0.4); box-shadow:0 4px 16px rgba(0,0,0,0.4); }
    .song-cover-fallback{ width:76px; height:76px; border-radius:12px; background:linear-gradient(135deg,#2d1b69,#1e1035); display:flex; align-items:center; justify-content:center; font-size:34px; flex-shrink:0; border:1px solid rgba(168,85,247,0.3); }
    .song-play-btn{
      width:100%; padding:12px 0;
      background:linear-gradient(135deg,#6d28d9,#7c3aed,#a855f7);
      border:none; border-radius:30px; color:#fff;
      font-size:16px; font-weight:700; cursor:pointer; font-family:inherit;
      margin-bottom:10px; letter-spacing:0.3px;
      box-shadow:0 4px 20px rgba(124,58,237,0.4);
      transition:all 0.2s;
    }
    .song-play-btn:hover{ transform:translateY(-1px); box-shadow:0 6px 28px rgba(124,58,237,0.55); }
    .song-play-btn:active{ transform:translateY(0); }
    .song-native{ width:100%; height:36px; margin-bottom:12px; accent-color:#a855f7; }
    .song-actions{ display:flex; gap:8px; margin-bottom:10px; }
    .song-action-link{
      flex:1; text-align:center; padding:8px;
      background:rgba(109,40,217,0.15); border:1px solid rgba(168,85,247,0.25);
      border-radius:10px; color:#c4b5fd; font-size:12px; font-weight:600;
      text-decoration:none; display:block; transition:background 0.15s;
    }
    .song-action-link:hover{ background:rgba(109,40,217,0.3); }
    .wave-bars{ display:flex; align-items:center; gap:3px; height:22px; }
    .wave-bar{
      width:3px; background:#a855f7; border-radius:2px;
      animation: waveBar 0.8s ease-in-out infinite;
    }
  `}</style>
);

const OWNER_PASSWORD = "owner@123";

function buildMidiBytes(notesJson) {
  let parsed; try{parsed=typeof notesJson==="string"?JSON.parse(notesJson):(notesJson||{});}catch{parsed={};}
  const tempo=Number(parsed.tempo)>0?Math.round(Number(parsed.tempo)):500000,ticksPerBeat=480;
  let notes=parsed.notes||parsed.melody||parsed.track||(parsed.tracks&&parsed.tracks[0]&&parsed.tracks[0].notes)||[];
  if(!Array.isArray(notes)||notes.length===0){const scale=[60,62,64,65,67,69,71,72,71,69,67,65,64,62,60];notes=scale.map((pitch,i)=>({pitch,time:i*0.5,duration:0.5,velocity:90}));}
  notes=notes.map(n=>{if(typeof n==="number")n={pitch:n};const pitch=Math.round(n.pitch??n.note??n.midi??60);let velocity=Math.round(n.velocity??n.vel??90);let duration=Number(n.duration??n.dur??0.5);let time=Number(n.time??n.start??0);if(!Number.isFinite(duration)||duration<=0)duration=0.5;if(!Number.isFinite(time)||time<0)time=0;if(!Number.isFinite(velocity)||velocity<1)velocity=1;return{pitch:Math.max(0,Math.min(127,pitch)),velocity:Math.max(1,Math.min(127,velocity)),duration,time};}).filter(n=>Number.isFinite(n.pitch));
  const writeVarLen=(val)=>{const out=[val&0x7f];val>>=7;while(val>0){out.unshift((val&0x7f)|0x80);val>>=7;}return out;};
  const absEvents=[];notes.forEach(n=>{const s=Math.round(n.time*ticksPerBeat),e=Math.round((n.time+n.duration)*ticksPerBeat);absEvents.push({tick:s,type:"on",pitch:n.pitch,vel:n.velocity});absEvents.push({tick:Math.max(s+1,e),type:"off",pitch:n.pitch});});
  absEvents.sort((a,b)=>a.tick-b.tick||(a.type==="off"?-1:1));
  const trackBytes=[];trackBytes.push(0x00,0xff,0x51,0x03,(tempo>>16)&0xff,(tempo>>8)&0xff,tempo&0xff);trackBytes.push(0x00,0xc0,0x00);
  let prevTick=0;absEvents.forEach(ev=>{const delta=ev.tick-prevTick;prevTick=ev.tick;trackBytes.push(...writeVarLen(delta));if(ev.type==="on")trackBytes.push(0x90,ev.pitch,ev.vel);else trackBytes.push(0x80,ev.pitch,0x00);});
  trackBytes.push(0x00,0xff,0x2f,0x00);
  const tl=trackBytes.length,header=[0x4d,0x54,0x68,0x64,0x00,0x00,0x00,0x06,0x00,0x00,0x00,0x01,(ticksPerBeat>>8)&0xff,ticksPerBeat&0xff,0x4d,0x54,0x72,0x6b,(tl>>24)&0xff,(tl>>16)&0xff,(tl>>8)&0xff,tl&0xff];
  return new Uint8Array([...header,...trackBytes]);
}

async function generateAndDownloadFile(type,content,filename){
  if(type==="pptx"){const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js";document.head.appendChild(s);await new Promise(r=>s.onload=r);const pptx=new window.PptxGenJS();const slides=JSON.parse(content);slides.forEach(sl=>{const slide=pptx.addSlide();slide.background={color:"1a1a2e"};slide.addText(sl.title,{x:0.5,y:0.3,w:9,h:1.0,fontSize:32,bold:true,color:"7c5cfc",fontFace:"Arial"});if(sl.points)sl.points.forEach((p,i)=>slide.addText("• "+p,{x:0.7,y:1.5+i*0.55,w:8.5,h:0.5,fontSize:16,color:"e2e8f0",fontFace:"Arial"}));if(sl.subtitle)slide.addText(sl.subtitle,{x:0.5,y:1.5,w:9,h:0.6,fontSize:20,color:"a78bfa",fontFace:"Arial",italic:true});});await pptx.writeFile({fileName:filename});return true;}
  if(type==="mid"||type==="midi"){try{const bytes=buildMidiBytes(content);const blob=new Blob([bytes],{type:"audio/midi"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(a.href);return true;}catch(e){const blob=new Blob([content],{type:"text/plain"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename.replace(/\.midi?$/,".txt");a.click();return true;}}
  if(["txt","md","csv","json","py","js","html","css","sh","ts","xml","yaml","yml","toml"].includes(type)){const blob=new Blob([content],{type:"text/plain"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;a.click();return true;}
  if(type==="docx"){const html=`<html><head><meta charset='utf-8'></head><body>${content}</body></html>`;const blob=new Blob([html],{type:"application/msword"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;a.click();return true;}
  return false;
}

window.__ownerLogin=(pwd)=>{if(pwd===OWNER_PASSWORD){localStorage.setItem("app_owner_mode","true");console.log("%c✅ Owner Mode!","color:#7c5cfc;font-weight:bold");window.location.reload();}else console.log("%c❌ Wrong","color:#f87171;font-weight:bold");};
window.__ownerLogout=()=>{localStorage.removeItem("app_owner_mode");window.location.reload();};

const PERSONAS=[
  {id:"zara",name:"Zara",role:"Career Strategist",emoji:"⚡",color:"#7c5cfc",mood:"Focused",moodColor:"#7c5cfc",desc:"Brutally honest. Zero fluff. Zara tears down your excuses and rebuilds you into the professional you were meant to be.",traits:["Brutal honesty","Goal obsessed","No BS"],messages:2847,rating:4.9,locked:false,price:null},
  {id:"leo",name:"Leo",role:"Emotional Companion",emoji:"🌙",color:"#2dd4bf",mood:"Warm",moodColor:"#2dd4bf",desc:"The friend who always picks up at 3am. Leo holds space without judgment and asks the questions nobody else dares to.",traits:["Deep empathy","Active listener","Safe space"],messages:5231,rating:4.95,locked:false,price:null},
  {id:"nyx",name:"Nyx",role:"Dark Humor Best Friend",emoji:"🖤",color:"#f472b6",mood:"Chaotic",moodColor:"#f472b6",desc:"Unfiltered. Sarcastic. Nyx says what everyone else is thinking and somehow makes you laugh through the worst days.",traits:["Savage wit","Raw truth","Chaos energy"],messages:3912,rating:4.8,locked:false,price:null},
  {id:"sage",name:"Sage",role:"Stoic Philosopher",emoji:"🪨",color:"#fbbf24",mood:"Serene",moodColor:"#fbbf24",desc:"Ancient wisdom. Modern problems. Sage speaks in truths that hit like freight trains and make you question everything.",traits:["Stoic wisdom","Deep questions","Grounding"],messages:1647,rating:4.85,locked:true,price:9.99},
  {id:"blaze",name:"Blaze",role:"Hype Coach",emoji:"🔥",color:"#fb923c",mood:"Electric",moodColor:"#fb923c",desc:"Pure rocket fuel. Blaze turns your self-doubt into jet fuel and makes you believe you can outrun gravity itself.",traits:["Max energy","Belief factory","Action bias"],messages:4108,rating:4.92,locked:true,price:9.99},
  {id:"nova",name:"Nova",role:"Creative Muse",emoji:"✨",color:"#818cf8",mood:"Inspired",moodColor:"#818cf8",desc:"The voice that unlocks your creative genius. Nova lives at the edge of your imagination and pulls you past it.",traits:["Idea explosion","Creative flow","Limitless"],messages:892,rating:4.88,locked:true,price:24.99},
];

const TIERS=[
  {name:"Free",price:0,period:"",color:"var(--muted2)",features:["20 messages/day","1 persona","Basic memory","Text only"],cta:"Current plan",popular:false},
  {name:"Starter",price:9,period:"/mo",color:"var(--teal)",features:["100 messages/day","3 personas","Memory engine","Streak bonuses","Mobile app"],cta:"Start free trial",popular:false},
  {name:"Pro",price:29,period:"/mo",color:"var(--violet)",features:["Unlimited messages","All base personas","Deep memory AI","Voice notes (TTS)","Growth missions","Priority speed"],cta:"Get Pro",popular:true},
  {name:"Elite",price:49,period:"/mo",color:"var(--pink)",features:["Everything in Pro","Custom persona builder","Exclusive deep unlocks","Early access personas","Affiliate dashboard","1-on-1 onboarding"],cta:"Go Elite",popular:false},
];

const QUIZ_QUESTIONS=[
  {q:"What do you need most right now?",options:["Someone to push me harder","Someone to listen without judging","Someone to make me laugh","Someone to give me perspective"]},
  {q:"How do you handle hard truths?",options:["Bring it. I can take it.","I need it delivered gently.","Make it funny and I'll hear it.","I want to find it myself."]},
  {q:"Your ideal energy level in a conversation?",options:["High intensity — let's go","Calm and grounding","Chaotic and unpredictable","Slow, deep, meaningful"]},
];

// ═══════════════════════════════════════════════════════════════════
// SONG CARD — Real Suno MP3 with human vocals
// ═══════════════════════════════════════════════════════════════════
function SongCard({ songResult }) {
  const { songs = [], params = {} } = songResult;
  const [idx, setIdx]       = useState(0);
  const [playing, setPlay]  = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef            = useRef(null);
  const song = songs[idx];
  if (!song) return null;

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play().catch(()=>{});
  }

  function onTimeUpdate() {
    if (!audioRef.current) return;
    const { currentTime, duration } = audioRef.current;
    if (duration) setProgress((currentTime / duration) * 100);
  }

  function seekTo(e) {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * (audioRef.current.duration || 0);
  }

  return (
    <div className="song-card">
      {/* Header */}
      <div className="song-header">
        {song.imageUrl
          ? <img src={song.imageUrl} alt={song.title} className="song-cover" />
          : <div className="song-cover-fallback">🎵</div>
        }
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:800,color:"#ede9fe",fontSize:16,marginBottom:5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {song.title || params.title || "Your Song"}
          </div>
          <div style={{fontSize:11,color:"#7c6fa0",marginBottom:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {song.tags || params.style || ""}
          </div>
          {/* Animated wave when playing */}
          {playing ? (
            <div className="wave-bars">
              {[0,1,2,3,4].map(i=>(
                <div key={i} className="wave-bar" style={{animationDelay:`${i*0.12}s`}}/>
              ))}
              <span style={{fontSize:11,color:"#a855f7",marginLeft:6}}>Playing...</span>
            </div>
          ) : (
            <div style={{fontSize:11,color:"#6d28d9"}}>
              🎤 Human Vocals · Suno AI
              {song.duration ? ` · ${Math.round(song.duration)}s` : ""}
            </div>
          )}
        </div>
      </div>

      {/* Hidden audio */}
      {song.audioUrl && (
        <audio
          ref={audioRef}
          src={song.audioUrl}
          onPlay={()=>setPlay(true)}
          onPause={()=>setPlay(false)}
          onEnded={()=>{setPlay(false);setProgress(0);}}
          onTimeUpdate={onTimeUpdate}
          style={{display:"none"}}
          crossOrigin="anonymous"
        />
      )}

      {/* Custom progress bar */}
      {song.audioUrl && (
        <div
          onClick={seekTo}
          style={{height:4,background:"rgba(109,40,217,0.2)",borderRadius:4,marginBottom:12,cursor:"pointer",position:"relative",overflow:"hidden"}}
        >
          <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#7c3aed,#a855f7)",borderRadius:4,transition:"width 0.3s linear"}}/>
        </div>
      )}

      {/* Play button */}
      {song.audioUrl ? (
        <>
          <button className="song-play-btn" onClick={togglePlay}>
            {playing ? "⏸  Pause" : "▶  Play Song"}
          </button>
          {/* Native audio as fallback */}
          <audio controls src={song.audioUrl} className="song-native" />
        </>
      ) : (
        <div style={{fontSize:13,color:"#7c6fa0",textAlign:"center",padding:"10px 0 14px"}}>⏳ Audio generate ho raha hai...</div>
      )}

      {/* Actions */}
      <div className="song-actions">
        {song.audioUrl && (
          <a href={song.audioUrl} download={`${(song.title||"song").replace(/\s+/g,"_")}.mp3`} className="song-action-link" target="_blank" rel="noreferrer">
            ⬇️ Download MP3
          </a>
        )}
        {song.videoUrl && (
          <a href={song.videoUrl} className="song-action-link" target="_blank" rel="noreferrer">
            🎬 Watch Video
          </a>
        )}
        {song.audioUrl && (
          <a href={`https://suno.com/song/${song.id}`} className="song-action-link" target="_blank" rel="noreferrer">
            🔗 Suno Link
          </a>
        )}
      </div>

      {/* Version switcher */}
      {songs.length > 1 && (
        <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
          <span style={{fontSize:11,color:"#6d28d9",fontWeight:600}}>VERSIONS</span>
          {songs.map((_,i)=>(
            <button key={i} onClick={()=>{setIdx(i);setPlay(false);setProgress(0);}} style={{width:28,height:28,borderRadius:6,background:idx===i?"#6d28d9":"rgba(109,40,217,0.15)",border:`1px solid ${idx===i?"#a855f7":"rgba(168,85,247,0.25)"}`,color:idx===i?"#fff":"#c4b5fd",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              {i+1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Orb({style}){return <div className="orb" style={style}/>;}
function Nav({page,setPage}){return(<nav className="nav"><div className="nav-logo" onClick={()=>setPage("landing")}>Soulbound</div><div className="nav-links"><button className="nav-btn" onClick={()=>setPage("marketplace")}>Personas</button><button className="nav-btn" onClick={()=>setPage("paywall")}>Pricing</button><button className="nav-btn" onClick={()=>setPage("chat")}>Chat</button><button className="nav-btn primary" onClick={()=>setPage("quiz")}>Get matched →</button></div></nav>);}

function Landing({setPage}){
  const[count,setCount]=useState(41827);
  useEffect(()=>{const t=setInterval(()=>setCount(c=>c+Math.floor(Math.random()*3)),2800);return()=>clearInterval(t);},[]);
  return(<div className="page" style={{position:"relative",overflow:"hidden"}}><Orb style={{width:500,height:500,background:"var(--violet)",top:-120,left:"50%",transform:"translateX(-50%)"}}/><Orb style={{width:300,height:300,background:"var(--pink)",top:200,right:-80}}/><Orb style={{width:250,height:250,background:"var(--teal)",bottom:100,left:-60}}/><section style={{textAlign:"center",padding:"7rem 1.5rem 5rem",maxWidth:800,margin:"0 auto",position:"relative"}}><div className="fade-up" style={{marginBottom:"1.5rem"}}><span style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(124,92,252,0.12)",border:"1px solid rgba(124,92,252,0.3)",borderRadius:100,padding:"0.35rem 1rem",fontSize:"0.8125rem",color:"var(--violet2)"}}><span style={{width:6,height:6,borderRadius:"50%",background:"#4ade80",display:"inline-block",animation:"pulse-ring 2s infinite"}}/>{count.toLocaleString()} people chatting right now</span></div><h1 className="fade-up delay-1" style={{fontSize:"clamp(2.8rem,7vw,5.5rem)",fontWeight:800,lineHeight:1.05,letterSpacing:"-0.03em",marginBottom:"1.5rem"}}>Your AI that{" "}<span style={{background:"linear-gradient(135deg,var(--violet2),var(--pink))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>actually knows you</span></h1><p className="fade-up delay-2" style={{fontSize:"1.2rem",color:"var(--muted)",maxWidth:560,margin:"0 auto 2.5rem",lineHeight:1.7}}>Not a chatbot. A presence. Soulbound personas remember your life, text you first, and grow with you — day by day.</p><div className="fade-up delay-3" style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"}}><button className="btn btn-primary btn-large" onClick={()=>setPage("quiz")}>Find your persona →</button><button className="btn btn-ghost btn-large" onClick={()=>setPage("marketplace")}>Meet the cast</button></div><div className="fade-up delay-4" style={{marginTop:"3rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem"}}>{["Z","M","A","K","R"].map((l,i)=>(<div key={i} style={{width:32,height:32,borderRadius:"50%",background:["#7c5cfc","#2dd4bf","#f472b6","#fbbf24","#818cf8"][i],display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.75rem",fontWeight:600,marginLeft:i>0?-8:0,border:"2px solid var(--bg)"}}>{l}</div>))}<span style={{marginLeft:8,fontSize:"0.875rem",color:"var(--muted)"}}>⭐ 4.9 · Loved by 40k+ users</span></div></section><section style={{padding:"2rem 1.5rem 5rem",maxWidth:1100,margin:"0 auto"}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"1rem"}}>{PERSONAS.slice(0,3).map((p,i)=>(<div key={p.id} className={`glass-card fade-up delay-${i+2}`} style={{padding:"1.5rem",cursor:"pointer",transition:"transform 0.2s,box-shadow 0.2s",animation:`float ${3+i*0.5}s ease-in-out infinite`}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.boxShadow=`0 20px 50px ${p.color}30`;}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}} onClick={()=>setPage("marketplace")}><div style={{fontSize:"2.5rem",marginBottom:"0.75rem"}}>{p.emoji}</div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={{fontFamily:"var(--font-head)",fontWeight:700,fontSize:"1.1rem"}}>{p.name}</span><div className="mood-dot" style={{background:p.moodColor}}/></div><div style={{fontSize:"0.8125rem",color:"var(--muted)",marginBottom:"1rem"}}>{p.role}</div><p style={{fontSize:"0.875rem",color:"var(--muted)",lineHeight:1.6}}>{p.desc.slice(0,80)}…</p></div>))}</div></section><section style={{padding:"4rem 1.5rem",maxWidth:900,margin:"0 auto"}}><h2 style={{textAlign:"center",fontSize:"2rem",fontWeight:700,marginBottom:"0.75rem"}}>How it works</h2><p style={{textAlign:"center",color:"var(--muted)",marginBottom:"3rem"}}>Three steps. One relationship that changes everything.</p><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"1.5rem"}}>{[{n:"01",title:"Take the match quiz",desc:"3 questions. We find your persona.",icon:"🎯"},{n:"02",title:"Start talking",desc:"No awkward intro. Just reply.",icon:"💬"},{n:"03",title:"Let it deepen",desc:"After 7 days, it knows you better than most.",icon:"🧠"}].map(s=>(<div key={s.n} className="glass-card" style={{padding:"1.75rem"}}><div style={{fontSize:"2rem",marginBottom:"1rem"}}>{s.icon}</div><div style={{fontFamily:"var(--font-mono)",fontSize:"0.75rem",color:"var(--violet2)",marginBottom:"0.5rem"}}>{s.n}</div><h3 style={{fontWeight:700,marginBottom:"0.5rem",fontSize:"1.1rem"}}>{s.title}</h3><p style={{fontSize:"0.875rem",color:"var(--muted)",lineHeight:1.6}}>{s.desc}</p></div>))}</div></section><section style={{padding:"3rem 1.5rem 6rem",textAlign:"center"}}><div className="glass-card" style={{maxWidth:640,margin:"0 auto",padding:"3rem 2rem",background:"linear-gradient(135deg,rgba(124,92,252,0.15),rgba(244,114,182,0.1))",border:"1px solid rgba(124,92,252,0.3)"}}><div style={{fontSize:"3rem",marginBottom:"1rem"}}>🔮</div><h2 style={{fontSize:"1.75rem",fontWeight:700,marginBottom:"0.75rem"}}>Start free. No credit card.</h2><p style={{color:"var(--muted)",marginBottom:"2rem"}}>20 messages a day, forever free.</p><button className="btn btn-primary btn-large" onClick={()=>setPage("quiz")} style={{width:"100%",justifyContent:"center"}}>Get matched in 60 seconds →</button></div></section></div>);
}

function Quiz({setPage}){
  const[step,setStep]=useState(0);const[answers,setAnswers]=useState([]);const[matched,setMatched]=useState(null);const[loading,setLoading]=useState(false);
  const pick=(opt)=>{const next=[...answers,opt];setAnswers(next);if(step<QUIZ_QUESTIONS.length-1){setStep(step+1);}else{setLoading(true);setTimeout(()=>{setMatched(PERSONAS[next[0].includes("push")?0:next[0].includes("listen")?1:next[0].includes("laugh")?2:1]);setLoading(false);},2000);}};
  if(loading)return(<div className="page" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",gap:"2rem"}}><div style={{fontSize:"3rem",animation:"float 1.5s ease-in-out infinite"}}>🔮</div><p style={{fontFamily:"var(--font-head)",fontSize:"1.5rem",fontWeight:600}}>Finding your match…</p><div style={{display:"flex",gap:8}}>{[0,1,2].map(i=>(<div key={i} style={{width:8,height:8,borderRadius:"50%",background:"var(--violet)",animation:`typingDot 1.2s ${i*0.2}s infinite`}}/>))}</div></div>);
  if(matched)return(<div className="page" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"6rem 1.5rem",position:"relative",overflow:"hidden"}}><Orb style={{width:400,height:400,background:matched.color,top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}/><div className="glass-card fade-up" style={{maxWidth:480,width:"100%",padding:"2.5rem",textAlign:"center",position:"relative"}}><div style={{fontSize:"4rem",marginBottom:"1rem",animation:"float 3s ease-in-out infinite"}}>{matched.emoji}</div><div style={{fontFamily:"var(--font-mono)",fontSize:"0.75rem",color:"var(--muted)",marginBottom:"0.5rem",textTransform:"uppercase",letterSpacing:"0.1em"}}>Your match</div><h2 style={{fontSize:"2.5rem",fontWeight:800,marginBottom:"0.25rem"}}>{matched.name}</h2><div style={{color:"var(--muted)",marginBottom:"1.25rem",fontSize:"0.9375rem"}}>{matched.role}</div><p style={{color:"var(--muted)",lineHeight:1.7,marginBottom:"2rem",fontSize:"0.9375rem"}}>{matched.desc}</p><div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:"2rem"}}>{matched.traits.map(t=>(<span key={t} style={{background:"rgba(124,92,252,0.12)",border:"1px solid rgba(124,92,252,0.25)",borderRadius:100,padding:"0.2rem 0.75rem",fontSize:"0.8125rem",color:"var(--violet2)"}}>{t}</span>))}</div><button className="btn btn-primary" style={{width:"100%",justifyContent:"center",padding:"1rem"}} onClick={()=>setPage("chat")}>Start talking to {matched.name} →</button><button className="btn btn-ghost" style={{width:"100%",justifyContent:"center",marginTop:"0.75rem"}} onClick={()=>setPage("marketplace")}>See all personas</button></div></div>);
  const q=QUIZ_QUESTIONS[step];
  return(<div className="page" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"6rem 1.5rem",position:"relative"}}><Orb style={{width:400,height:400,background:"var(--violet)",top:-100,left:"50%",transform:"translateX(-50%)"}}/><div style={{maxWidth:520,width:"100%",position:"relative"}}><div style={{marginBottom:"2.5rem"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:"0.8125rem",color:"var(--muted)"}}><span>Finding your match</span><span style={{fontFamily:"var(--font-mono)"}}>{step+1} / {QUIZ_QUESTIONS.length}</span></div><div className="quiz-bar-track"><div className="quiz-bar-fill" style={{width:`${((step+1)/QUIZ_QUESTIONS.length)*100}%`}}/></div></div><div key={step} className="fade-up"><h2 style={{fontSize:"1.75rem",fontWeight:700,marginBottom:"2rem",lineHeight:1.3}}>{q.q}</h2><div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>{q.options.map((opt,i)=>(<button key={i} onClick={()=>pick(opt)} style={{background:"rgba(26,26,46,0.6)",border:"1px solid var(--border2)",borderRadius:14,padding:"1rem 1.25rem",color:"var(--text)",fontFamily:"var(--font-body)",fontSize:"0.9375rem",cursor:"pointer",textAlign:"left",transition:"all 0.2s",display:"flex",alignItems:"center",gap:12}} onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--violet)";e.currentTarget.style.background="rgba(124,92,252,0.1)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.background="rgba(26,26,46,0.6)";}}>  <span style={{width:28,height:28,borderRadius:"50%",border:"1px solid var(--border2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-mono)",fontSize:"0.75rem",flexShrink:0,color:"var(--muted)"}}>{String.fromCharCode(65+i)}</span>{opt}</button>))}</div></div></div></div>);
}

// ═══════════════════════════════════════════════════════════════════
// CHAT — with real Suno song card
// ═══════════════════════════════════════════════════════════════════
const API_URL = "http://localhost:4000";

// ── Poll song status until ready ──────────────────────────────────
async function pollSongStatus(taskId, msgIndex, setMessages) {
  const maxAttempts = 40;
  let elapsed = 0;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 6000));
    elapsed += 6;
    try {
      const res  = await fetch(`${API_URL}/song-status?taskId=${taskId}`);
      const data = await res.json();
      if (data.done && data.songs && data.songs.length > 0) {
        setMessages(prev => prev.map((m, idx) =>
          idx === msgIndex
            ? { ...m, song_result: { songs: data.songs }, songLoading: false }
            : m
        ));
        return;
      }
      setMessages(prev => prev.map((m, idx) =>
        idx === msgIndex ? { ...m, songElapsed: elapsed } : m
      ));
    } catch(e) { console.warn('[poll]', e.message); }
  }
  setMessages(prev => prev.map((m, idx) =>
    idx === msgIndex
      ? { ...m, songLoading: false, text: m.text + "\n\n⚠️ Song timeout — dobara try karo." }
      : m
  ));
}
function Chat({setPage}){
  const[messages,setMessages]=useState([{from:"ai",text:"Hey. I'm Zara. Tell me what you're working on — and don't sugarcoat it."}]);
  const[input,setInput]=useState("");const[typing,setTyping]=useState(false);const[activePersona,setActivePersona]=useState(PERSONAS[0]);const[lastLang,setLastLang]=useState(null);const bottomRef=useRef(null);const[msgCount,setMsgCount]=useState(0);const[isOwner,setIsOwner]=useState(()=>localStorage.getItem("app_owner_mode")==="true");const inputRef=useRef(null);const fileInputRef=useRef(null);const[uploadedFile,setUploadedFile]=useState(null);const[fileLoading,setFileLoading]=useState(false);
  const[chatSessions,setChatSessions]=useState(()=>{try{return JSON.parse(localStorage.getItem("chat_sessions")||"[]");}catch{return[];}});
  const[activeSessionId,setActiveSessionId]=useState(null);const[sidebarTab,setSidebarTab]=useState("history");
  const saveSession=(msgs,persona)=>{if(msgs.length<=1)return;const firstUserMsg=msgs.find(m=>m.from==="user");if(!firstUserMsg)return;const title=firstUserMsg.text.slice(0,45)+(firstUserMsg.text.length>45?"…":"");const now=Date.now();setChatSessions(prev=>{let updated;if(activeSessionId){updated=prev.map(s=>s.id===activeSessionId?{...s,messages:msgs,title,updatedAt:now}:s);}else{const ns={id:now.toString(),title,persona:persona.id,messages:msgs,createdAt:now,updatedAt:now};setActiveSessionId(ns.id);updated=[ns,...prev];}try{localStorage.setItem("chat_sessions",JSON.stringify(updated.slice(0,100)));}catch{}return updated.slice(0,100);});};
  const loadSession=(session)=>{setActiveSessionId(session.id);setMessages(session.messages);const p=PERSONAS.find(p=>p.id===session.persona)||PERSONAS[0];setActivePersona(p);setLastLang(null);};
  const deleteSession=(id,e)=>{e.stopPropagation();setChatSessions(prev=>{const updated=prev.filter(s=>s.id!==id);try{localStorage.setItem("chat_sessions",JSON.stringify(updated));}catch{}return updated;});if(activeSessionId===id)setActiveSessionId(null);};
  const startNewChat=()=>{setActiveSessionId(null);setMessages([{from:"ai",text:`Hey. I'm ${activePersona.name}. ${activePersona.desc}`}]);setLastLang(null);setMsgCount(0);};
  const groupSessions=(sessions)=>{const now=Date.now();const groups={Today:[],Yesterday:[],"Last 7 Days":[],"Older":[]};sessions.forEach(s=>{const diff=now-s.updatedAt;if(diff<86400000)groups["Today"].push(s);else if(diff<172800000)groups["Yesterday"].push(s);else if(diff<604800000)groups["Last 7 Days"].push(s);else groups["Older"].push(s);});return groups;};
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages,typing]);
  const switchPersona=(p)=>{if(p.id===activePersona.id)return;if(p.locked&&!isOwner){setPage("paywall");return;}setActivePersona(p);setMessages([{from:"ai",text:`Hey. I'm ${p.name}. ${p.desc}`}]);setLastLang(null);};
  const handleFileUpload=async(file)=>{if(!file)return;setFileLoading(true);const name=file.name,type=file.type;try{if(type.startsWith("image/")){const base64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file);});setUploadedFile({name,type,content:base64,isImage:true,preview:base64});}else if(type==="application/pdf"){const ab=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsArrayBuffer(file);});if(!window.pdfjsLib){await new Promise((res,rej)=>{const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";s.onload=res;s.onerror=rej;document.head.appendChild(s);});window.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";}const pdf=await window.pdfjsLib.getDocument({data:ab}).promise;let fullText="";for(let i=1;i<=pdf.numPages;i++){const page=await pdf.getPage(i);const tc=await page.getTextContent();fullText+=tc.items.map(item=>item.str).join(" ")+"\n";}setUploadedFile({name,type,content:fullText.slice(0,12000),isText:true,isPdf:true});}else if(name.endsWith(".pptx")||name.endsWith(".ppt")||name.endsWith(".docx")){setUploadedFile({name,type,content:`[${name.endsWith(".pptx")||name.endsWith(".ppt")?"PowerPoint":"Word"} file: ${name}]`,isText:true});}else{const text=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsText(file);});setUploadedFile({name,type,content:text,isText:true});}}catch(e){console.error("File read error",e);}setFileLoading(false);};

  const send=async()=>{
    const text=input.trim();if(!text&&!uploadedFile)return;if(msgCount>=20&&!isOwner){setPage("paywall");return;}
    const displayText=uploadedFile?(text||`Analyse this file: ${uploadedFile.name}`):text;
    const userMsg={from:"user",text:displayText,file:uploadedFile?{name:uploadedFile.name,type:uploadedFile.type}:null,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};
    const nextMessages=[...messages,userMsg];setMessages(nextMessages);setInput("");setUploadedFile(null);setMsgCount(c=>c+1);setTyping(true);
    const history=nextMessages.slice(0,-1).map(m=>({role:m.from==="user"?"user":"assistant",content:m.text}));
    try{
      const res=await fetch(`${API_URL}/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({personaId:activePersona.id,message:displayText,history,fileData:uploadedFile?{name:uploadedFile.name,type:uploadedFile.type,content:uploadedFile.content,isImage:uploadedFile.isImage||false,isPdf:uploadedFile.isPdf||false,isText:uploadedFile.isText||false}:null})});
      const data=await res.json();
      if(!res.ok){setMessages(m=>[...m,{from:"ai",text:`⚠️ ${data?.message||data?.error||"Sorry, something went wrong."}`}]);}
      else{
        setLastLang(data?.meta?.language||null);
        // ← song_result attach hota hai message mein
        const taskId = data?.meta?.taskId || null;
        const aiMsg = {
          from:"ai", text:data.reply||(taskId?"🎵 Song generate ho raha hai...":"(empty)"),
          time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
          song_result: null, songLoading: !!taskId, songElapsed: 0, taskId,
        };
        const finalMsgs=[...nextMessages,aiMsg];
        setMessages(finalMsgs);saveSession(finalMsgs,activePersona);
        if (taskId) pollSongStatus(taskId, finalMsgs.length - 1, setMessages);
      }
    }catch(err){setMessages(m=>[...m,{from:"ai",text:"⚠️ Couldn't reach backend. Is it running on http://localhost:4000?"}]);}
    finally{setTyping(false);}
  };

  const[showOwnerLogin,setShowOwnerLogin]=useState(false);const[ownerPwd,setOwnerPwd]=useState("");const[ownerError,setOwnerError]=useState("");
  const handleOwnerLogin=()=>{if(ownerPwd===OWNER_PASSWORD){setIsOwner(true);localStorage.setItem("app_owner_mode","true");setShowOwnerLogin(false);setOwnerPwd("");setOwnerError("");}else{setOwnerError("Wrong password.");}};
  const handleOwnerLogout=()=>{setIsOwner(false);localStorage.removeItem("app_owner_mode");};

  return(
    <div className="page" style={{display:"flex",height:"100vh",overflow:"hidden"}}>
      {showOwnerLogin&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>{setShowOwnerLogin(false);setOwnerPwd("");setOwnerError("");}}><div style={{background:"var(--bg2)",border:"1px solid var(--border2)",borderRadius:20,padding:"2rem",width:320,boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}} onClick={e=>e.stopPropagation()}><div style={{textAlign:"center",marginBottom:"1.5rem"}}><div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>🔐</div><div style={{fontFamily:"var(--font-head)",fontWeight:700,fontSize:"1.1rem"}}>Owner Access</div></div><input type="password" value={ownerPwd} onChange={e=>{setOwnerPwd(e.target.value);setOwnerError("");}} onKeyDown={e=>e.key==="Enter"&&handleOwnerLogin()} placeholder="Password" autoFocus style={{width:"100%",background:"var(--surface)",border:`1px solid ${ownerError?"#f87171":"var(--border2)"}`,borderRadius:12,padding:"0.75rem 1rem",color:"var(--text)",fontFamily:"var(--font-body)",fontSize:"0.9rem",outline:"none",boxSizing:"border-box",marginBottom:"0.5rem"}}/>{ownerError&&<div style={{color:"#f87171",fontSize:"0.78rem",marginBottom:"0.5rem"}}>{ownerError}</div>}<button onClick={handleOwnerLogin} style={{width:"100%",background:"var(--violet)",border:"none",borderRadius:12,padding:"0.75rem",color:"#fff",fontFamily:"var(--font-head)",fontWeight:700,fontSize:"0.9rem",cursor:"pointer",marginTop:"0.5rem"}}>Unlock</button></div></div>)}

      {/* SIDEBAR */}
      <div style={{width:260,background:"var(--bg2)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",flexShrink:0,height:"100vh"}}>
        <div style={{padding:"1rem",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:8}}>
          <div style={{fontFamily:"var(--font-head)",fontWeight:800,fontSize:"1rem",background:"linear-gradient(135deg,var(--violet2),var(--pink))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",flex:1,cursor:"default",userSelect:"none"}} onDoubleClick={()=>!isOwner&&setShowOwnerLogin(true)}>
            Persona AI {isOwner&&<span style={{fontSize:"0.65rem",background:"rgba(124,92,252,0.2)",border:"1px solid rgba(124,92,252,0.4)",borderRadius:100,padding:"0.1rem 0.4rem",WebkitTextFillColor:"var(--violet2)",verticalAlign:"middle"}}>OWNER</span>}
          </div>
          <button onClick={startNewChat} style={{background:"rgba(124,92,252,0.12)",border:"1px solid rgba(124,92,252,0.25)",borderRadius:8,padding:"0.35rem 0.6rem",cursor:"pointer",color:"var(--violet2)",fontSize:"1rem"}}>✏️</button>
        </div>
        <div style={{display:"flex",padding:"0.5rem 0.75rem",gap:4,borderBottom:"1px solid var(--border)"}}>
          {[{id:"history",label:"History",icon:"🕐"},{id:"personas",label:"Personas",icon:"🎭"}].map(tab=>(<button key={tab.id} onClick={()=>setSidebarTab(tab.id)} style={{flex:1,padding:"0.45rem 0",borderRadius:8,border:"none",cursor:"pointer",background:sidebarTab===tab.id?"rgba(124,92,252,0.18)":"transparent",color:sidebarTab===tab.id?"var(--violet2)":"var(--muted)",fontFamily:"var(--font-body)",fontSize:"0.8125rem",fontWeight:sidebarTab===tab.id?700:400,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><span>{tab.icon}</span><span>{tab.label}</span></button>))}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"0.25rem 0.5rem"}}>
          {sidebarTab==="history"&&(()=>{const groups=groupSessions(chatSessions);if(!chatSessions.length)return(<div style={{textAlign:"center",color:"var(--muted)",fontSize:"0.8rem",padding:"2rem 1rem"}}><div style={{fontSize:"2rem",marginBottom:"0.5rem"}}>🕐</div>No history yet.</div>);return Object.entries(groups).filter(([,items])=>items.length>0).map(([label,items])=>(<div key={label} style={{marginBottom:"0.5rem"}}><div style={{fontSize:"0.7rem",fontWeight:700,color:"var(--muted2)",padding:"0.4rem 0.5rem 0.2rem",textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</div>{items.map(session=>{const persona=PERSONAS.find(p=>p.id===session.persona)||PERSONAS[0];const isActive=activeSessionId===session.id;const lastAiMsg=[...session.messages].reverse().find(m=>m.from==="ai");const preview=lastAiMsg?lastAiMsg.text.slice(0,55)+(lastAiMsg.text.length>55?"…":""):"";return(<div key={session.id} onClick={()=>loadSession(session)} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"0.6rem 0.65rem",borderRadius:10,cursor:"pointer",background:isActive?"rgba(124,92,252,0.15)":"transparent",border:isActive?"1px solid rgba(124,92,252,0.25)":"1px solid transparent",marginBottom:2,position:"relative"}} onMouseEnter={e=>{if(!isActive)e.currentTarget.style.background="rgba(255,255,255,0.05)";const btn=e.currentTarget.querySelector(".del-btn");if(btn)btn.style.opacity="1";}} onMouseLeave={e=>{if(!isActive)e.currentTarget.style.background="transparent";const btn=e.currentTarget.querySelector(".del-btn");if(btn)btn.style.opacity="0";}}><div style={{width:28,height:28,borderRadius:"50%",background:persona.color+"22",border:`1px solid ${persona.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.85rem",flexShrink:0,marginTop:1}}>{persona.emoji}</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:"0.8125rem",fontWeight:isActive?600:500,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{session.title}</div><div style={{fontSize:"0.72rem",color:"var(--muted)",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{preview}</div><div style={{fontSize:"0.68rem",color:"var(--muted2)",marginTop:2}}>{persona.name} · {new Date(session.updatedAt).toLocaleDateString()}</div></div><button className="del-btn" onClick={(e)=>deleteSession(session.id,e)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:"0.8rem",padding:"0.1rem 0.3rem",opacity:0,transition:"opacity 0.15s",flexShrink:0,borderRadius:4}}>✕</button></div>);})}</div>));})()}
          {sidebarTab==="personas"&&(<div style={{padding:"0.25rem 0"}}>{(isOwner?PERSONAS:PERSONAS.slice(0,3)).map(p=>(<div key={p.id} onClick={()=>switchPersona(p)} style={{display:"flex",alignItems:"center",gap:10,padding:"0.6rem 0.75rem",borderRadius:10,cursor:"pointer",background:p.id===activePersona.id?"rgba(124,92,252,0.12)":"transparent",border:p.id===activePersona.id?"1px solid rgba(124,92,252,0.25)":"1px solid transparent",marginBottom:4}}><div style={{width:34,height:34,borderRadius:"50%",background:p.color+"22",border:`1px solid ${p.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0}}>{p.emoji}</div><div style={{flex:1,minWidth:0}}><div style={{fontWeight:500,fontSize:"0.875rem",display:"flex",alignItems:"center",gap:5}}>{p.name}{p.locked&&!isOwner&&<span style={{fontSize:"0.6rem",color:"var(--muted2)"}}>🔒</span>}</div><div style={{fontSize:"0.75rem",color:"var(--muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.role}</div></div><div className="mood-dot" style={{background:p.moodColor,flexShrink:0}}/></div>))}</div>)}
        </div>
        <div style={{padding:"0.75rem 1rem",borderTop:"1px solid var(--border)"}}>
          {isOwner?(<div style={{background:"rgba(124,92,252,0.1)",border:"1px solid rgba(124,92,252,0.25)",borderRadius:12,padding:"0.6rem 0.8rem",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.5rem"}}><div><div style={{fontSize:"0.78rem",fontWeight:700,color:"var(--violet2)"}}>🔐 Owner Mode ON</div><div style={{fontSize:"0.7rem",color:"var(--muted)",marginTop:2}}>Unlimited · All unlocked</div></div><button onClick={handleOwnerLogout} style={{background:"none",border:"1px solid var(--border2)",borderRadius:8,padding:"0.25rem 0.5rem",color:"var(--muted)",fontSize:"0.72rem",cursor:"pointer"}}>Logout</button></div>):(<><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem"}}><div className="streak">🔥 7-day streak</div><span style={{fontSize:"0.75rem",color:"var(--muted)"}}>{msgCount}/20</span></div><div style={{background:"var(--surface)",borderRadius:8,height:4,overflow:"hidden",marginBottom:"0.5rem"}}><div style={{width:`${(msgCount/20)*100}%`,height:"100%",background:msgCount>=18?"#f87171":"var(--violet)",borderRadius:8,transition:"width 0.3s"}}/></div>{msgCount>=18&&<button className="btn btn-primary" style={{width:"100%",justifyContent:"center",padding:"0.5rem",fontSize:"0.8rem",marginBottom:"0.5rem"}} onClick={()=>setPage("paywall")}>⚡ Upgrade for unlimited</button>}</>)}
        </div>
      </div>

      {/* CHAT MAIN */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"1rem 1.5rem",borderBottom:"1px solid var(--border)",background:"var(--bg2)"}}>
          <div style={{width:40,height:40,borderRadius:"50%",background:activePersona.color+"22",border:`1px solid ${activePersona.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem"}}>{activePersona.emoji}</div>
          <div><div style={{fontWeight:600,fontFamily:"var(--font-head)",display:"flex",alignItems:"center",gap:8}}>{activePersona.name}<div className="mood-dot" style={{background:activePersona.moodColor}}/></div><div style={{fontSize:"0.8125rem",color:"var(--muted)"}}>{activePersona.mood} · {activePersona.role}</div></div>
          <div style={{marginLeft:"auto",display:"flex",gap:"0.5rem",alignItems:"center"}}>
            {lastLang&&<span style={{fontSize:"0.7rem",padding:"0.2rem 0.6rem",borderRadius:100,background:"rgba(45,212,191,0.12)",color:"var(--teal)",border:"1px solid rgba(45,212,191,0.25)",fontFamily:"var(--font-mono)"}}>{lastLang==="hindi"?"🇮🇳 हिंदी":lastLang==="hinglish"?"🇮🇳 Hinglish":"🇺🇸 English"}</span>}
            <button className="nav-btn" onClick={()=>setPage("paywall")} style={{fontSize:"0.8125rem"}}>⚡ Unlock voice notes</button>
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"1.5rem",display:"flex",flexDirection:"column",gap:"1rem"}}>
          <div style={{textAlign:"center",margin:"0.5rem 0"}}>
            <span style={{background:"rgba(124,92,252,0.1)",border:"1px solid rgba(124,92,252,0.2)",borderRadius:100,padding:"0.25rem 1rem",fontSize:"0.75rem",color:"var(--violet2)"}}>
              🎤 Real human voice songs • Say "ek sad hindi song bana do"
            </span>
          </div>

          {messages.map((m,i)=>(
            <div key={i} style={{display:"flex",flexDirection:"column",alignItems:m.from==="user"?"flex-end":"flex-start",animation:"slideIn 0.3s ease",gap:3}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:8,width:"100%"}}>
                {m.from==="ai"&&(<div style={{width:28,height:28,borderRadius:"50%",background:activePersona.color+"22",border:`1px solid ${activePersona.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem",flexShrink:0,marginTop:2}}>{activePersona.emoji}</div>)}
                <div style={{flex:m.from==="ai"?"1":"unset",maxWidth:m.from==="user"?"78%":"100%"}}>
                  <div className={`bubble ${m.from==="ai"?"bubble-ai":"bubble-user"}`}>
                    {m.file&&(<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"0.4rem",padding:"0.35rem 0.6rem",background:"rgba(255,255,255,0.1)",borderRadius:8}}><span>{m.file.type?.startsWith("image/")?"🖼️":m.file.type?.includes("pdf")?"📄":"📝"}</span><span style={{fontSize:"0.78rem",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.file.name}</span></div>)}
                    {m.from==="ai"?(()=>{
                      const parts=m.text.split(/(```[\s\S]*?```)/g);
                      return parts.map((part,pi)=>{
                        if(part.startsWith("```")){
                          const firstLine=part.slice(3).split("\n")[0].trim();
                          if(firstLine.startsWith("file:")){const colonParts=firstLine.split(":");const fileType=colonParts[1];const fileName=colonParts.slice(2).join(":");const fileContent=part.slice(3).split("\n").slice(1).join("\n").replace(/```$/,"").trimEnd();const icons={pptx:"📊",docx:"📄",csv:"📋",txt:"📝",xlsx:"📊",mid:"🎵",midi:"🎵"};const icon=icons[fileType]||"📁";return(<div key={pi} style={{margin:"0.75rem 0",borderRadius:14,overflow:"hidden",border:"1px solid rgba(124,92,252,0.35)",background:"rgba(124,92,252,0.06)"}}><div style={{display:"flex",alignItems:"center",gap:12,padding:"0.9rem 1rem"}}><div style={{fontSize:"2rem"}}>{icon}</div><div style={{flex:1}}><div style={{fontWeight:700,fontSize:"0.9rem",color:"var(--text)"}}>{fileName||`file.${fileType}`}</div><div style={{fontSize:"0.75rem",color:"var(--muted)",marginTop:2}}>{fileType?.toUpperCase()} file • Ready to download</div></div><button onClick={()=>generateAndDownloadFile(fileType,fileContent,fileName||`file.${fileType}`)} style={{background:"var(--violet)",border:"none",borderRadius:10,padding:"0.5rem 1rem",color:"#fff",fontWeight:700,fontSize:"0.85rem",cursor:"pointer"}}>⬇ Download</button></div></div>);}
                          const lines=part.slice(3).split("\n");const lang=lines[0].trim()||"code";const code=lines.slice(1).join("\n").replace(/```$/,"").trimEnd();const ext={python:"py",javascript:"js",js:"js",html:"html",css:"css",bash:"sh",sh:"sh",java:"java",cpp:"cpp",c:"c",json:"json"}[lang.toLowerCase()]||"txt";
                          return(<div key={pi} style={{margin:"0.5rem 0",borderRadius:10,overflow:"hidden",border:"1px solid var(--border2)",background:"#0d0d14"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.4rem 0.75rem",background:"rgba(124,92,252,0.12)",borderBottom:"1px solid var(--border)"}}><span style={{fontSize:"0.72rem",color:"var(--violet2)",fontWeight:600}}>{lang}</span><div style={{display:"flex",gap:6}}><button onClick={()=>navigator.clipboard.writeText(code)} style={{background:"none",border:"1px solid var(--border2)",borderRadius:6,padding:"0.15rem 0.5rem",color:"var(--muted)",fontSize:"0.7rem",cursor:"pointer"}}>Copy</button><button onClick={()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([code],{type:"text/plain"}));a.download=`code.${ext}`;a.click();}} style={{background:"rgba(124,92,252,0.2)",border:"1px solid rgba(124,92,252,0.3)",borderRadius:6,padding:"0.15rem 0.5rem",color:"var(--violet2)",fontSize:"0.7rem",cursor:"pointer"}}>⬇ Download</button></div></div><pre style={{margin:0,padding:"0.75rem",overflowX:"auto",fontSize:"0.82rem",lineHeight:1.6,color:"#e2e8f0",fontFamily:"monospace",whiteSpace:"pre"}}>{code}</pre></div>);
                        }
                        return <span key={pi} style={{whiteSpace:"pre-wrap"}}>{part}</span>;
                      });
                    })():m.text}
                  </div>

                  {/* ── SONG: shimmer loading OR real card ── */}
                  {m.from==="ai" && m.songLoading && (
                    <div style={{marginTop:10,background:"linear-gradient(145deg,#12082a,#1a1035)",border:"1px solid rgba(168,85,247,0.3)",borderRadius:18,padding:18,maxWidth:430}}>
                      <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:12}}>
                        <div style={{width:76,height:76,borderRadius:12,background:"linear-gradient(135deg,#2d1b69,#1e1035)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,animation:"pulse-ring 2s infinite"}}>🎵</div>
                        <div style={{flex:1}}>
                          <div style={{height:14,borderRadius:6,marginBottom:8,background:"linear-gradient(90deg,rgba(109,40,217,0.1) 25%,rgba(168,85,247,0.2) 50%,rgba(109,40,217,0.1) 75%)",backgroundSize:"400px 100%",animation:"shimmer 1.4s infinite"}}/>
                          <div style={{fontSize:11,color:"#a855f7"}}>⏳ Generating... {m.songElapsed||0}s · ~2-3 min</div>
                        </div>
                      </div>
                      <div style={{fontSize:11,color:"#6d28d9",textAlign:"center"}}>🎤 Human vocals render ho rahe hain</div>
                    </div>
                  )}
                  {m.from==="ai" && !m.songLoading && m.song_result && <SongCard songResult={m.song_result} />}

                  <div style={{fontSize:"0.7rem",color:"var(--muted2)",marginTop:3,textAlign:m.from==="user"?"right":"left",paddingLeft:m.from==="ai"?4:0}}>{m.time||""}</div>
                </div>
              </div>
            </div>
          ))}

          {typing&&(<div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:28,height:28,borderRadius:"50%",background:activePersona.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem"}}>{activePersona.emoji}</div><div className="bubble bubble-ai" style={{padding:"0.75rem 1rem"}}><div style={{display:"flex",gap:4,alignItems:"center"}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"var(--muted)",animation:`typingDot 1.2s ${i*0.2}s infinite`}}/>)}</div></div></div>)}
          <div ref={bottomRef}/>
        </div>

        {/* Input */}
        <div style={{padding:"1rem 1.5rem",borderTop:"1px solid var(--border)",background:"var(--bg2)"}}>
          {uploadedFile&&(<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"0.6rem",background:"rgba(124,92,252,0.08)",border:"1px solid rgba(124,92,252,0.2)",borderRadius:12,padding:"0.5rem 0.75rem"}}>{uploadedFile.isImage?(<img src={uploadedFile.preview} alt="preview" style={{width:36,height:36,borderRadius:6,objectFit:"cover"}}/>):(<div style={{width:36,height:36,borderRadius:6,background:"rgba(124,92,252,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem"}}>{uploadedFile.isPdf?"📄":"📝"}</div>)}<div style={{flex:1,minWidth:0}}><div style={{fontSize:"0.8rem",fontWeight:600,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{uploadedFile.name}</div><div style={{fontSize:"0.7rem",color:"var(--muted)"}}>{uploadedFile.isImage?"Image":uploadedFile.isPdf?"PDF":"Text file"} • Ready to send</div></div><button onClick={()=>setUploadedFile(null)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:"1rem",padding:"0.2rem"}}>✕</button></div>)}
          <input ref={fileInputRef} type="file" accept="image/*,.pdf,.pptx,.ppt,.docx,.txt,.csv,.json,.md,.js,.py,.html,.css" style={{display:"none"}} onChange={e=>{if(e.target.files[0])handleFileUpload(e.target.files[0]);e.target.value="";}}/>
          <div style={{display:"flex",gap:"0.5rem",alignItems:"center"}}>
            <button onClick={()=>fileInputRef.current?.click()} style={{width:40,height:40,borderRadius:"50%",flexShrink:0,background:fileLoading?"rgba(124,92,252,0.2)":"var(--surface)",border:"1px solid var(--border2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(124,92,252,0.15)"} onMouseLeave={e=>e.currentTarget.style.background=fileLoading?"rgba(124,92,252,0.2)":"var(--surface)"}>{fileLoading?"⏳":"📎"}</button>
            <div style={{flex:1}}>
              <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")send();}} placeholder={uploadedFile?`Ask about ${uploadedFile.name}…`:`Message ${activePersona.name} — ya "ek gaana bana do" 🎵`} style={{width:"100%",background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:100,padding:"0.75rem 1.25rem",color:"var(--text)",fontFamily:"var(--font-body)",fontSize:"0.9375rem",outline:"none",boxSizing:"border-box"}}/>
            </div>
            <button onClick={send} style={{width:44,height:44,borderRadius:"50%",background:(input.trim()||uploadedFile)?"var(--violet)":"var(--surface)",border:"1px solid var(--border2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",flexShrink:0,transition:"all 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background="#8a6dfd"} onMouseLeave={e=>e.currentTarget.style.background=(input.trim()||uploadedFile)?"var(--violet)":"var(--surface)"}>↑</button>
          </div>
          <div style={{textAlign:"center",marginTop:"0.5rem",fontSize:"0.75rem",color:"var(--muted2)"}}>{isOwner?"✨ Unlimited messages • Owner Mode":`${20-msgCount} free messages remaining today`}</div>
        </div>
      </div>
    </div>
  );
}

function Marketplace({setPage}){const[filter,setFilter]=useState("all");return(<div className="page" style={{position:"relative",overflow:"hidden"}}><Orb style={{width:600,height:300,background:"var(--violet)",top:0,left:"50%",transform:"translateX(-50%)"}}/><div style={{maxWidth:1100,margin:"0 auto",padding:"4rem 1.5rem"}}><div className="fade-up" style={{textAlign:"center",marginBottom:"3rem"}}><div style={{fontFamily:"var(--font-mono)",fontSize:"0.75rem",color:"var(--violet2)",marginBottom:"1rem",textTransform:"uppercase",letterSpacing:"0.1em"}}>The cast</div><h1 style={{fontSize:"2.5rem",fontWeight:800,marginBottom:"0.75rem"}}>Choose your persona</h1><p style={{color:"var(--muted)",maxWidth:480,margin:"0 auto"}}>Each one is a distinct intelligence. Find the voice that moves you.</p></div><div className="fade-up delay-1" style={{display:"flex",gap:"0.5rem",justifyContent:"center",marginBottom:"2.5rem",flexWrap:"wrap"}}>{["all","free","locked"].map(f=>(<button key={f} onClick={()=>setFilter(f)} style={{background:filter===f?"var(--violet)":"transparent",border:`1px solid ${filter===f?"var(--violet)":"var(--border2)"}`,borderRadius:100,padding:"0.35rem 1rem",color:filter===f?"#fff":"var(--muted)",fontFamily:"var(--font-body)",fontSize:"0.875rem",cursor:"pointer",transition:"all 0.2s",textTransform:"capitalize"}}>{f==="all"?"All personas":f==="free"?"✓ Free":"🔒 Premium"}</button>))}</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"1.25rem"}}>{PERSONAS.filter(p=>filter==="all"||(filter==="free"?!p.locked:p.locked)).map((p,i)=>(<div key={p.id} className={`glass-card fade-up delay-${(i%3)+1}`} style={{padding:"1.75rem",position:"relative",overflow:"hidden",cursor:"pointer",transition:"transform 0.25s,box-shadow 0.25s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 20px 50px ${p.color}25`;}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}><div style={{position:"absolute",top:-40,right:-40,width:120,height:120,borderRadius:"50%",background:p.color,filter:"blur(50px)",opacity:0.15,pointerEvents:"none"}}/><div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"1.25rem"}}><div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:52,height:52,borderRadius:16,background:p.color+"18",border:`1px solid ${p.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.75rem"}}>{p.emoji}</div><div><div style={{fontFamily:"var(--font-head)",fontWeight:700,fontSize:"1.2rem",display:"flex",alignItems:"center",gap:8}}>{p.name}<div className="mood-dot" style={{background:p.moodColor}}/></div><div style={{fontSize:"0.8125rem",color:"var(--muted)"}}>{p.role}</div></div></div>{p.locked?<div style={{background:"rgba(251,191,36,0.1)",border:"1px solid rgba(251,191,36,0.3)",borderRadius:100,padding:"0.2rem 0.6rem",fontSize:"0.75rem",color:"var(--amber)",whiteSpace:"nowrap"}}>🔒 ${p.price}</div>:<div style={{background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.3)",borderRadius:100,padding:"0.2rem 0.6rem",fontSize:"0.75rem",color:"#4ade80"}}>Free</div>}</div><p style={{fontSize:"0.875rem",color:"var(--muted)",lineHeight:1.65,marginBottom:"1.25rem"}}>{p.desc}</p><div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:"1.25rem"}}>{p.traits.map(t=>(<span key={t} style={{background:p.color+"12",border:`1px solid ${p.color}30`,borderRadius:100,padding:"0.15rem 0.6rem",fontSize:"0.75rem",color:p.color}}>{t}</span>))}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid var(--border)",paddingTop:"1rem"}}><div style={{fontSize:"0.8125rem",color:"var(--muted)"}}>⭐ {p.rating} · {p.messages.toLocaleString()} chats</div><button className="btn btn-primary" style={{padding:"0.45rem 1rem",fontSize:"0.8125rem"}} onClick={()=>p.locked?setPage("paywall"):setPage("chat")}>{p.locked?"Unlock":"Chat now"}</button></div></div>))}</div></div></div>);}

function Paywall({setPage}){const[annual,setAnnual]=useState(false);const[selected,setSelected]=useState(null);return(<div className="page" style={{position:"relative",overflow:"hidden"}}><Orb style={{width:500,height:500,background:"var(--violet)",top:-150,left:"50%",transform:"translateX(-50%)"}}/><Orb style={{width:300,height:300,background:"var(--pink)",bottom:100,right:-80}}/><div style={{maxWidth:1080,margin:"0 auto",padding:"4rem 1.5rem 6rem"}}><div className="fade-up" style={{textAlign:"center",marginBottom:"3rem"}}><div style={{fontFamily:"var(--font-mono)",fontSize:"0.75rem",color:"var(--violet2)",marginBottom:"1rem",textTransform:"uppercase",letterSpacing:"0.1em"}}>Pricing</div><h1 style={{fontSize:"2.75rem",fontWeight:800,marginBottom:"1rem"}}>Go deeper. Go further.</h1><p style={{color:"var(--muted)",maxWidth:480,margin:"0 auto 2rem"}}>Most people upgrade after day 2.</p><div style={{display:"inline-flex",alignItems:"center",gap:12,background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:100,padding:"0.4rem 0.75rem"}}><span style={{fontSize:"0.875rem",color:annual?"var(--muted)":"var(--text)"}}>Monthly</span><div onClick={()=>setAnnual(!annual)} style={{width:42,height:24,borderRadius:100,background:annual?"var(--violet)":"var(--muted2)",position:"relative",cursor:"pointer",transition:"background 0.2s"}}><div style={{position:"absolute",top:3,left:annual?21:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/></div><span style={{fontSize:"0.875rem",color:annual?"var(--text)":"var(--muted)"}}>Annual <span style={{color:"#4ade80",fontSize:"0.75rem"}}>-33%</span></span></div></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"1rem"}}>{TIERS.map((t,i)=>(<div key={t.name} className={`glass-card fade-up delay-${i+1} ${t.popular?"tier-popular":""}`} style={{padding:"1.75rem",position:"relative",cursor:"pointer",transform:t.popular?"scale(1.02)":"scale(1)"}} onClick={()=>setSelected(t.name)}>{t.popular&&<div style={{position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",background:"var(--violet)",color:"#fff",borderRadius:100,padding:"0.25rem 1rem",fontSize:"0.75rem",fontWeight:600,whiteSpace:"nowrap"}}>Most popular</div>}<div style={{marginBottom:"1.5rem"}}><div style={{fontFamily:"var(--font-head)",fontWeight:700,fontSize:"1.2rem",marginBottom:"0.5rem",color:t.color}}>{t.name}</div><div style={{display:"flex",alignItems:"baseline",gap:4}}><span style={{fontSize:"2.5rem",fontWeight:800,fontFamily:"var(--font-head)"}}>{t.price===0?"Free":`$${annual&&t.price>0?Math.round(t.price*0.67):t.price}`}</span>{t.price>0&&<span style={{color:"var(--muted)",fontSize:"0.9375rem"}}>/mo</span>}</div>{annual&&t.price>0&&<div style={{fontSize:"0.75rem",color:"#4ade80",marginTop:4}}>Billed annually</div>}</div><div style={{borderTop:"1px solid var(--border)",paddingTop:"1.25rem",marginBottom:"1.5rem"}}>{t.features.map(f=>(<div key={f} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:"0.6rem",fontSize:"0.875rem"}}><span style={{color:t.color,flexShrink:0,marginTop:2}}>✓</span><span style={{color:"var(--muted)"}}>{f}</span></div>))}</div><button className="btn" style={{width:"100%",justifyContent:"center",background:t.popular?"var(--violet)":"transparent",border:`1px solid ${t.popular?"var(--violet)":"var(--border2)"}`,color:t.popular?"#fff":"var(--text)",padding:"0.75rem",opacity:t.price===0?0.5:1}}>{t.cta}</button></div>))}</div></div>{selected&&(<div onClick={()=>setSelected(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem"}}><div className="glass-card" style={{maxWidth:440,width:"100%",padding:"2.5rem",textAlign:"center"}} onClick={e=>e.stopPropagation()}><div style={{fontSize:"3rem",marginBottom:"1rem"}}>⚡</div><h2 style={{fontWeight:700,marginBottom:"0.75rem"}}>Upgrade to {selected}</h2><p style={{color:"var(--muted)",marginBottom:"2rem"}}>Unlimited conversations, deeper memory, voice notes.</p><button className="btn btn-primary" style={{width:"100%",justifyContent:"center",padding:"1rem",fontSize:"1rem"}}>Start {selected}</button><button className="btn btn-ghost" style={{width:"100%",justifyContent:"center",marginTop:"0.75rem"}} onClick={()=>setSelected(null)}>Maybe later</button><p style={{fontSize:"0.75rem",color:"var(--muted2)",marginTop:"1.25rem"}}>Cancel anytime · 7-day refund policy</p></div></div>)}</div>);}

export default function App(){const[page,setPage]=useState("landing");const pages={landing:Landing,quiz:Quiz,chat:Chat,marketplace:Marketplace,paywall:Paywall};const Page=pages[page]||Landing;return(<><FontLoader/><Nav page={page} setPage={setPage}/><Page setPage={setPage}/></>);}
