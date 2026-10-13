const express=require('express');const app=express();const fs=require('fs');
const {default:makeWASocket,useMultiFileAuthState,DisconnectReason}=require('@whiskeysockets/baileys');
const pino=require('pino');
let paired=false;try{let c=JSON.parse(fs.readFileSync('./session/creds.json'));if(c.registered)paired=true}catch{}
app.get('/',(req,res)=>{res.send(`
<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Boston Pair</title>
<style>
body{background:#000;color:#fff;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;font-family:sans-serif}
.b{background:#111;padding:22px;border-radius:20px;width:92%;max-width:350px;text-align:center;border:1px solid gold;position:relative}
input{width:90%;padding:14px;border-radius:10px;border:none;margin:10px;text-align:center;font-size:16px}
button{padding:14px;width:96%;background:gold;border:none;border-radius:12px;font-weight:bold;margin:6px 0;cursor:pointer;font-size:15px}
#c{color:gold;font-size:34px;letter-spacing:6px;margin:12px;font-weight:bold}
#n{background:#222;color:#d4af37;padding:12px;border-radius:10px;display:none;text-align:left;font-size:13px;margin-top:10px}
#popup{position:fixed;top:20px;left:50%;transform:translateX(-50%);background:gold;color:#000;padding:15px 20px;border-radius:12px;font-weight:bold;display:none;z-index:999;box-shadow:0 5px 20px #000;animation:slide 0.5s}
@keyframes slide{from{top:-50px}to{top:20px}}
#overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:#000d;display:none;justify-content:center;align-items:center;z-index:998}
#modal{background:#111;border:2px solid gold;padding:25px;border-radius:20px;text-align:center;width:85%;max-width:320px}
</style></head><body>
<div id="popup">🔔 CODE IMEPATIKANA!</div>
<div id="overlay"><div id="modal"><h2 style="color:gold">🔔 CODE TAYARI! 👑</h2><div id="mc" style="font-size:32px;color:gold;letter-spacing:5px;margin:15px;font-weight:bold"></div><p style="color:#fff;font-size:13px">Copy code na uende WhatsApp haraka!</p><p style="color:#aaa;font-size:11px">WhatsApp > Linked Devices > Link with phone number</p><button onclick="closePop()">📋 COPY & CLOSE</button></div></div>

<div class="b">
<h2 style="color:gold;margin:0">BOSTON 👑</h2><p style="color:#aaa;font-size:12px">${paired?'✅ BOT ONLINE':'PAIR YOUR BOT'}</p>
<input id="i" placeholder="2547XXXXXXXX">
<button onclick="p()" id="btn">PATA CODE</button>
<div id="c"></div>
<button onclick="copyIt()" style="background:#fff">📋 COPY CODE</button>
<div id="n">⚡ <b>LINK HARAKA 10sec:</b><br>WhatsApp > ⋮ > Linked Devices > Link with phone number > Weka code</div>
<p id="m" style="color:gold;margin-top:10px"></p>
<button onclick="clearS()" style="background:#222;color:#888;font-size:11px">🗑️ Clear Session</button>
</div>

<audio id="snd" preload="auto"><source src="https://www.soundjay.com/buttons/sounds/button-10.mp3" type="audio/mpeg"></audio>

<script>
function showPopup(code){
 document.getElementById('mc').innerText=code;
 document.getElementById('overlay').style.display='flex';
 document.getElementById('popup').style.display='block';
 document.getElementById('c').innerText=code;
 document.getElementById('n').style.display='block';
 // Vibrate
 if(navigator.vibrate) navigator.vibrate([200,100,200,100,300]);
 // Sound
 let a=document.getElementById('snd'); if(a) a.play().catch(()=>{});
 // Browser Notification
 if('Notification' in window){
  Notification.requestPermission().then(per=>{
   if(per==='granted'){
    let notif=new Notification('🔔 BOSTON CODE TAYARI!',{body:'Code yako: '+code+' - Bonyeza ku-copy na ulink haraka!',icon:'https://cdn-icons-png.flaticon.com/512/1384/1384055.png',requireInteraction:true});
    notif.onclick=function(){ window.focus(); copyIt(); this.close(); }
   }
  });
 }
 setTimeout(()=>{ document.getElementById('popup').style.display='none'; },4000);
}
function closePop(){ copyIt(); document.getElementById('overlay').style.display='none'; }
async function p(){
 let v=document.getElementById('i').value.replace(/\\D/g,'');
 if(v.length<10) return alert('Weka namba 2547...');
 let b=document.getElementById('btn'); b.innerText='⏳ Subiri  express=require('express');const app=express();const fs=require('fs');
const {default:makeWASocket,useMultiFileAuthState,DisconnectReason}=require('@whiskeysockets/baileys');
const pino=require('pino');
app.get('/',(req,res)=>{res.send(`<html><head><meta name="viewport" content="width=device-width"><style>body{background:#000;color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:sans-serif}.b{background:#111;padding:20px;border-radius:15px;width:90%;max-width:320px;text-align:center;border:1px solid gold}input{width:90%;padding:12px;border-radius:8px;border:none;margin:10px}button{padding:12px;width:95%;background:gold;border:none;border-radius:8px;font-weight:bold;margin:5px 0}#c{color:gold;font-size:28px;letter-spacing:5px;margin:10px}#n{background:#222;color:gold;padding:10px;border-radius:8px;display:none;text-align:left;font-size:12px}</style></head><body><div class="b"><h2 style="color:gold">BOSTON 👑</h2><input id="i" placeholder="2547XXXXXXXX"><button onclick="p()">PATA CODE</button><div id="c"></div><button onclick="navigator.clipboard.writeText(document.getElementById('c').innerText).then(()=>alert('Copied '+document.getElementById('c').innerText))">📋 COPY CODE</button><div id="n"><b>✅ LINK HARAKA (15sec):</b><br>WhatsApp > ⋮ > Linked Devices > Link with phone number > Weka code</div><p id="m"></p><button onclick="fetch('/clear').then(()=>alert('Session cleared! Request code mpya sasa'))" style="background:#333;color:#fff;font-size:11px;margin-top:10px">🗑️ Clear Session kama hailink</button></div><script>async function p(){let v=document.getElementById('i').value.trim();if(!v)return alert('weka namba 2547...');document.getElementById('m').innerText='Subiri 5sec...';let r=await fetch('/code?number='+v);let d=await r.json();if(d.code){document.getElementById('c').innerText=d.code;document.getElementById('n').style.display='block';document.getElementById('m').innerText='✅ HARAKA! Weka WhatsApp ndani ya 15sec!';}else document.getElementById('m').innerText='❌ '+d.error}</script></body></html>`)});
async function g(phone){if(fs.existsSync('session')&&fs.readdirSync('session').length>2){}const {state,saveCreds}=await useMultiFileAuthState('session');const s=makeWASocket({auth:state,logger:pino({level:'silent'}),browser:["Boston","Chrome","1.0"]});s.ev.on('creds.update',saveCreds);await new Promise(r=>setTimeout(r,1000));let code=null;try{if(!state.creds.registered){code=await s.requestPairingCode(phone)}}catch(e){console.log(e)}setTimeout(()=>{try{s.end()}catch{}},2000);return code}
app.get('/code',async(req,res)=>{let num=(req.query.number||'').replace(/[^0-9]/g,'');if(!num)return res.json({error:'weka namba'});try{let c=await g(num);if(!c)return res.json({error:'Iko paired tayari! Bonyeza Clear Session chini kisha jaribu tena'});res.json({code:c})}catch(e){res.json({error:e.message})}});
app.get('/clear',(req,res)=>{try{if(fs.existsSync('session')){fs.rmSync('session',{recursive:true,force:true})}res.json({ok:'cleared'})}catch(e){res.json({error:e.message})}});
async function b(){const {state,saveCreds}=await useMultiFileAuthState('session');const s=makeWASocket({auth:state,logger:pino({level:'silent'}),browser:["Boston","Chrome","20"]});s.ev.on('creds.update',saveCreds);s.ev.on('connection.update',u=>{if(u.connection==='open')console.log('✅ ONLINE '+s.user.id);if(u.connection==='close'&&u.lastDisconnect?.error?.output?.statusCode!==DisconnectReason.loggedOut)setTimeout(b,3000)});s.ev.on('messages.upsert',async({messages})=>{let m=messages[0];if(!m?.message)return;let j=m.key.remoteJid;if(!j.endsWith('@g.us'))return;let t=m.message.conversation||m.message.extendedTextMessage?.text||"";if(t=='.ping')await s.sendMessage(j,{text:'Pong 👑 Boston LIVE!'},{quoted:m});if(t=='.menu')await s.sendMessage(j,{text:'👑 BOSTON LIVE!'},{quoted:m})})}
b();app.listen(process.env.PORT||3000,()=>console.log('LIVE'));