const {default:makeWASocket,useMultiFileAuthState,DisconnectReason} = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');

const PAIR_NUMBER = "254745084480"; // 👑 Namba yako fixed

async function startPair(){
  if(fs.existsSync('session')) fs.rmSync('session',{recursive:true,force:true});
  console.log("⏳ BOSTON pairing for 254745084480...");
  const {state,saveCreds} = await useMultiFileAuthState('session');
  const sock = makeWASocket({auth:state,logger:pino({level:'silent'}),browser:["Boston","Chrome","1.0"]});
  sock.ev.on('creds.update',saveCreds);
  await new Promise(r=>setTimeout(r,3000));
  try{
    let code = await sock.requestPairingCode(PAIR_NUMBER);
    console.log("======================================");
    console.log("🔔 CODE YA 254745084480: "+code);
    console.log("🔔 CODE: "+code);
    console.log("🔔 CODE: "+code);
    console.log("======================================");
    console.log("WhatsApp > Linked Devices > Link with phone number > Weka "+code);
  }catch(e){console.log("Error: "+e.message);}
}

async function startBot(){
  const {state,saveCreds} = await useMultiFileAuthState('session');
  const sock = makeWASocket({auth:state,logger:pino({level:'silent'}),browser:["Boston","Chrome","20"]});
  sock.ev.on('creds.update',saveCreds);
  sock.ev.on('connection.update',u=>{
    if(u.connection==='open'){
      console.log("✅✅ BOSTON PAIRED! 254745084480 ONLINE: "+sock.user.id);
      console.log("BOT IMEPAIR! Usifute session tena!");
    }
    if(u.connection==='close' && u.lastDisconnect?.error?.output?.statusCode!==DisconnectReason.loggedOut){
      setTimeout(startBot,3000);
    }
  });
  sock.ev.on('messages.upsert',async({messages})=>{
    let m=messages[0]; if(!m?.message) return;
    let j=m.key.remoteJid;
    let txt=m.message.conversation||m.message.extendedTextMessage?.text||"";
    if(txt=='.ping') await sock.sendMessage(j,{text:'Pong 👑 254745084480 Online!'},{quoted