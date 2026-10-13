const express = require('express');
const app = express();
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
app.get('/', (req,res)=>{
 res.send(`<html><head><title>Mrr Right</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:#111;color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:sans-serif}.box{background:#222;padding:20px;border-radius:15px;width:90%;max-width:340px;text-align:center}input{width:90%;padding:12px;border-radius:8px;border:none;margin:10px 0}button{padding:12px;width:95%;background:#25D366;border:none;border-radius:8px;font-weight:bold}</style></head><body><div class="box"><h2 style="color:#25D366">MRR RIGHT 👑</h2><input id="num" placeholder="2547XXXXXXX"><button onclick="pair()">PATA CODE</button><h1 id="code" style="color:#25D366"></h1><p id="info"></p></div><script>async function pair(){const n=document.getElementById('num').value;if(!n)return alert('weka namba');document.getElementById('info').innerText='Subiri...';const r=await fetch('/code?number='+n);const d=await r.json();if(d.code){document.getElementById('code').innerText=d.code;document.getElementById('info').innerText='Weka WhatsApp > Linked Devices > Link with phone number';}else document.getElementById('info').innerText=d.error}</script></body></html>`);
});
let settings={};try{settings=JSON.parse(fs.readFileSync('./settings.json'))}catch{}
async function getPairCode(phone){
 const { state, saveCreds } = await useMultiFileAuthState('session');
 const sock = makeWASocket({auth:state,logger:pino({level:'silent'}),browser:["Mrr-Right","Chrome","1.0"]});
 sock.ev.on('creds.update',saveCreds);
 await new Promise(r=>setTimeout(r,1000));
 if(!state.creds.registered){ const code=await sock.requestPairingCode(phone); return code; } return null;
}
app.get('/code', async (req,res)=>{
 const phone=req.query.number; if(!phone) return res.json({error:'no number'});
 try{ const code=await getPairCode(phone); if(!code) return res.json({error:'Already paired'}); res.json({code}); }catch(e){ res.json({error:e.message}); }
});
async function startBot(){
 const { state, saveCreds } = await useMultiFileAuthState('session');
 const sock = makeWASocket({auth:state,logger:pino({level:'silent'}),browser:["Mrr Right","Chrome","20.0"]});
 sock.ev.on('creds.update',saveCreds);
 sock.ev.on('connection.update',u=>{if(u.connection==='open')console.log('✅ MRR RIGHT ONLINE: '+sock.user.id); if(u.connection==='close'&&u.lastDisconnect?.error?.output?.statusCode!==DisconnectReason.loggedOut)startBot()});
 sock.ev.on('messages.upsert',async({messages})=>{
  const m=messages[0]; if(!m?.message) return; const jid=m.key.remoteJid; if(!jid.endsWith('@g.us')) return;
  const body=m.message.conversation||m.message.extendedTextMessage?.text||""; if(!body.startsWith('.')) return;
  const cmd=body.slice(1).split(' ')[0].toLowerCase();
  if(cmd==='menu') await sock.sendMessage(jid,{text:'👑 MRR RIGHT - 200 CMDS LOADING...\n\nBot iko ONLINE! Pair Site inafanya kazi!\n\nBaada ya hii kuwa LIVE nitakurudishia cmds 200 zote!'},{quoted:m});
  if(cmd==='ping') await sock.sendMessage(jid,{text:'Pong 👑'},{quoted:m});
 });
}
startBot();
app.listen(process.env.PORT||3000,()=>console.log('LIVE'));