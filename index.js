const express = require('express');
const app = express();
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');

app.get('/', (req,res)=>{
 res.send(`
<html><head><title>Boston Pair</title><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body{background:#000;color:#fff;font-family:sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0}
.box{background:#111;padding:25px;border-radius:20px;width:90%;max-width:360px;text-align:center;border:1px solid #d4af37;box-shadow:0 0 30px #d4af3744}
input{width:92%;padding:14px;border-radius:12px;border:1px solid #333;background:#000;color:#fff;margin:12px 0;text-align:center;font-size:16px}
button{padding:14px;width:100%;background:#d4af37;color:#000;border:none;border-radius:12px;font-weight:bold;cursor:pointer;font-size:16px}
#codeBox{display:none;margin-top:20px;background:#000;padding:15px;border-radius:12px;border:1px dashed #d4af37}
#code{color:#d4af37;letter-spacing:6px;font-size:30px;font-weight:bold;margin:10px 0}
.copyBtn{background:#fff;color:#000;margin-top:10px}
.notif{background:#d4af3720;color:#d4af37;padding:12px;border-radius:10px;margin-top:15px;font-size:13px;display:none;text-align:left;line-height:1.5}
h2{color:#d4af37;margin:0}
</style></head><body>
<div class="box">
<h2>BOSTON OFFICIAL 👑</h2>
<p>Pair Code Generator</p>
<input id="num" placeholder="2547XXXXXXXX">
<button onclick="pair()" id="btn">PATA PAIR CODE</button>
<div id="codeBox">
<h3 style="color:#d4af37">CODE YAKO:</h3>
<div id="code"></div>
<button class="copyBtn" onclick="copyCode()">📋 COPY CODE</button>
<div id="notif" class="notif">
<b>✅ JINSI YA KU-LINK:</b><br>
1. Fungua WhatsApp<br>
2. Bonyeza ⋮ > Linked Devices<br>
3. Link with phone number<br>
4. Weka code hapo! 👆<br><br>
⏰ Code ina-expire baada ya 60 sec!
</div>
</div>
<p id="info" style="margin-top:15px;color:#aaa"></p>
</div>
<script>
let cur='';
async function pair(){
 const n=document.getElementById('num').value.trim();
 const b=document.getElementById('btn');
 if(!n) return alert('Weka namba 2547...');
 b.innerText='Subiri...'; b.disabled=true;
 document.getElementById('info').innerText='Inatengeneza code... 10s';
 try{
  const r=await fetch('/code?number='+n);
  const d=await r.json();
  if(d.code){
   cur=d.code;
   document.getElementById('code').innerText=d.code;
   document.getElementById('codeBox').style.display='block';
   document.getElementById('notif').style.display='block';
   document.getElementById('info').innerText='✅ Code tayari!';
   if(Notification){ Notification.requestPermission().then(p=>{ if(p==='granted') new Notification('Boston Code: '+d.code, {body:'Weka WhatsApp > Linked Devices'}); }); }
  }else document.getElementById('info').innerText='❌ '+(d.error||'failed');
 }catch(e){ document.getElementById('info').innerText='❌ '+e.message; }
 b.innerText='PATA PAIR CODE'; b.disabled=false;
}
function copyCode(){
 if(!cur) return;
 navigator.clipboard.writeText(cur).then(()=>{
  const x=document.querySelector('.copyBtn');
  x.innerText='✅ COPIED!';
  setTimeout(()=>x.innerText='📋 COPY CODE',2000);
 });
}
</script></body></html>
`);
});

async function getPairCode(phone){
 const { state, saveCreds } = await useMultiFileAuthState('session');
 const sock = makeWASocket({auth:state,logger:pino({level:'silent'}),browser:["Boston","Chrome","1.0"]});
 sock.ev.on