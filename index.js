// 👑 MRR RIGHT V8.2 - PAIR SITE + 200 CMDS - FINAL COMBINED
const express = require('express');
const app = express();
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, downloadMediaMessage } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');

app.use(express.json());

// ===== PAIR SITE HTML =====
app.get('/', (req,res)=>{
 res.send(`
 <html><head><title>Mrr-Right Pair</title><meta name="viewport" content="width=device-width,initial-scale=1">
 <style>
 body{background:#111;color:#fff;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0}
.box{background:#222;padding:25px;border-radius:15px;width:90%;max-width:350px;text-align:center;box-shadow:0 0 20px #25D36633}
 input{width:90%;padding:12px;border-radius:8px;border:none;margin:10px 0;text-align:center;font-size:16px}
 button{padding:12px 20px;background:#25D366;color:#000;border:none;border-radius:8px;font-weight:bold;width:95%;cursor:pointer;font-size:16px}
 h2{color:#25D366} #code{color:#25D366;letter-spacing:4px}
 </style></head><body>
 <div class="box">
 <h2>MRR-RIGHT BOT 👑</h2>
 <p>Weka Namba 2547XXXXXXXX</p>
 <input id="num" placeholder="2547XXXXXXXX" />
 <button onclick="pair()">PATA PAIR CODE</button>
 <h1 id="code"></h1>
 <p id="info" style="font-size:13px;color:#aaa"></p>
 <p style="font-size:11px;margin-top:20px">WhatsApp > Linked Devices > Link with phone number</p>
 <p style="font-size:12px;margin-top:10px;color:#25D366">Bot Commands 200 ✅</p>
 </div>
 <script>
 async function pair(){
  const number=document.getElementById('num').value.trim();
  if(!number) return alert('Weka number!');
  document.getElementById('info').innerText='Subiri 10 sec...';
  document.getElementById('code').innerText='';
  try{
   const res=await fetch('/code?number='+number);
   const data=await res.json();
   if(data.code){
    document.getElementById('code').innerText=data.code;
    document.getElementById('info').innerText='Weka code WhatsApp sasa!';
   }else{
    document.getElementById('info').innerText='Error: '+(data.error||'failed');
   }
  }catch(e){ document.getElementById('info').innerText=e.message; }
 }
 </script></body></html>
 `);
});

// ===== SETTINGS FILES =====
let settings = {}; let economy = {};
try { settings = JSON.parse(fs.readFileSync('./settings.json')); } catch { settings = {}; }
try { economy = JSON.parse(fs.readFileSync('./economy.json')); } catch { economy = {}; }
const saveSet = () => fs.writeFileSync('./settings.json', JSON.stringify(settings, null, 2));
const saveEco = () => fs.writeFileSync('./economy.json', JSON.stringify(economy, null, 2));
const isBug = (t) => t && (t.length > 5000 || /(.)\1{1000,}/.test(t) || (t.match(/[\u2000-\u3300]/g)||[]).length>200);
const getAI = (t) => { t=t.toLowerCase(); if(t.includes("mambo")) return "Poa sana! Mimi Mrr Right, niko fiti 👑"; if(t.includes("jina")) return "Mimi ni Mrr Right Official - 200 unique cmds"; if(t.includes("owner")) return "Owner ni yule alini-pair, dynamic!"; return ["Poa mzee 👑","Mrr Right hapa","Sema boss","Active 🔥","Niko rada"][Math.floor(Math.random()*5)]; };

// ===== PAIR CODE ROUTE =====
async function getPairCode(phone){
  const { state, saveCreds } = await useMultiFileAuthState('session');
  const sock = makeWASocket({ auth: state, logger: pino({level:'silent'}), browser:["Mrr-Right","Chrome","1.0"] });
  sock.ev.on('creds.update', saveCreds);
  if(!state.creds.registered){
    await new Promise(r=>setTimeout(r,1500));
    const code = await sock.requestPairingCode(phone);
    return code;
  }
  return null;
}
app.get('/code', async (req,res)=>{
  const phone = req.query.number;
  if(!phone) return res.json({error:'No number'});
  try{
    const code = await getPairCode(phone);
    if(!code) return res.json({error:'Already paired, delete session folder'});
    res.json({code});
  }catch(e){ res.json({error:e.message}); }
});

// ===== BOT START WITH YOUR 200 CMDS =====
async function startBot(){
const { state, saveCreds } = await useMultiFileAuthState('session');
const sock = makeWASocket({ auth: state, logger: pino({level:'silent'}), browser:["Mrr Right","Chrome","20.0"] });
sock.ev.on('creds.update', saveCreds);
sock.ev.on('connection.update', u=>{ if(u.connection==='open'){ console.log(`✅ MRR RIGHT ONLINE: ${sock.user.id} - 200 CMDS`);} if(u.connection==='close' && u.lastDisconnect?.error?.output?.statusCode!==DisconnectReason.loggedOut) startBot(); });
sock.ev.on('group-participants.update', async upd=>{
 if(settings[upd.id]?.welcome && upd.action==='add'){ for(let p of upd.participants) await sock.sendMessage(upd.id,{text:`Karibu @${p.split('@')[0]} 🎉 kwenye Mrr Right Official`,mentions:[p]}); }
 if(settings[upd.id]?.goodbye && upd.action==='remove'){ for(let p of upd.participants) await sock.sendMessage(upd.id,{text:`Kwaheri @${p.split('@')[0]} 👋`,mentions:[p]}); }
});
sock.ev.on('messages.upsert', async ({messages})=>{
 const m=messages[0]; if(!m?.message) return; const jid=m.key.remoteJid; if(jid==='status@broadcast') return;
 const sender=m.key.participant||jid; const isGroup=jid.endsWith('@g.us');
 const body=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||m.message.videoMessage?.caption||"";
 const OWNER_JID=sock.user?.id? sock.user.id.split(':')[0]+'@s.whatsapp.net':null;
 if(m.message.viewOnceMessageV2||m.message.viewOnceMessage){ try{ const b=await downloadMediaMessage(m,'buffer',{}, {logger:pino()}); const inner=m.message.viewOnceMessageV2?.message||m.message.viewOnceMessage?.message; const type=Object.keys(inner)[0]; if(OWNER_JID) await sock.sendMessage(OWNER_JID,{[type.replace('Message','')]:b,caption:`👑 Mrr Right VV AUTO\nFrom: @${sender.split('@')[0]}`,mentions:[sender]}); if