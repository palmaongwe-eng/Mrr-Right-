const express = require('express');
const app = express();
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res)=>{
 res.send(`
 <html><head><title>Mrr-Right Pair Site</title>
 <meta name="viewport" content="width=device-width,initial-scale=1">
 <style>
 body{background:#111;color:#fff;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh}
 .box{background:#222;padding:25px;border-radius:15px;width:90%;max-width:350px;text-align:center}
 input{width:90%;padding:12px;border-radius:8px;border:none;margin:10px 0}
 button{padding:12px 20px;background:#25D366;color:#000;border:none;border-radius:8px;font-weight:bold;width:100%}
 h2{color:#25D366}
 </style></head><body>
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log('Site Live on '+PORT));

// Anza bot
async function startBot(){
  const { state, saveCreds } = await useMultiFileAuthState('session');
  const sock = makeWASocket({ auth: state, logger: pino({level:'silent'}) });
  sock.ev.on('creds.update', saveCreds);
}

startBot();
 <div class="box">
 <h2>MRR-RIGHT BOT</h2>
 <p>Weka Namba Yako Na Nchi Code<br>mfano 2547XXXXXXXX</p>
 <input id="num" placeholder="2547XXXXXXXX" />
 <button onclick="pair()">PATA PAIR CODE</button>
 <h1 id="code" style="letter