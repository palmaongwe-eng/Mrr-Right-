const express = require('express');
const app = express();
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res)=>{
 res.send(`
 <html><head><title>Mrr-Right Pair Site</title>
 <meta name="viewport" content="width=device-width,initial-scale=1">
 <style>
 body{background:#111;color:#fff;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0}
 .box{background:#222;padding:25px;border-radius:15px;width:90%;max-width:350px;text-align:center}
 input{width:90%;padding:12px;border-radius:8px;border:none;margin:10px 0;text-align:center;font-size:16px}
 button{padding:12px 20px;background:#25D366;color:#000;border:none;border-radius:8px;font-weight:bold;width:95%;font-size:16px}
 h2{color:#25D366}
 #code{color:#25D366}
 </style></head><body>
 <div class="box">
 <h2>MRR-RIGHT BOT</h2>
 <p>Weka Namba Yako<br>mfano 2547XXXXXXXX</p>
 <input id="num" placeholder="2547XXXXXXXX" />
 <button onclick="pair()">PATA PAIR CODE</button>
 <h1 id="code" style="letter-spacing:4px;margin-top:20px"></h1>
 <p id="info" style="font-size:13px;color:#aaa"></p>
 </div>
 <script>
 async function pair(){
  const number=document.getElementById('num').value.trim();
  if(!number) return alert('Weka number!');
  document.getElementById('info').innerText='Subiri...';
  const res=await fetch('/code?number='+number);
  const data=await res.json();
  if(data.code){
   document.getElementById('code').innerText=data.code;
   document.getElementById('info').innerText='Weka WhatsApp > Linked Devices > Link with phone number';
  }else{
   document.getElementById('info').innerText='Error: '+data.error;
  }
 }
 </script>
 </body></html>
 `);
});

async function getPairCode(phone){
  const { state, saveCreds } = await useMultiFileAuthState('temp_session');
  const sock = makeWASocket({ auth: state, logger: pino({level:'silent'}), browser: ["Mrr-Right","Chrome","1.0"] });
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
    res.json({code});
  }catch(e){
    res.json({error: e.message});
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log('Site Live on '+PORT));