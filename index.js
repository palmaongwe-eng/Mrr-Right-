const {default:makeWASocket,useMultiFileAuthState,DisconnectReason,downloadMediaMessage}=require('@whiskeysockets/baileys')
const pino=require('pino')
const fs=require('fs')
const express=require('express')
const app=express()
const OWNER="254745084480"
const BOT="BOSTON V2"
app.get('/',(r,s)=>s.send('BOSTON ONLINE'))
app.listen(process.env.PORT||3000,()=>console.log('WEB LIVE'))
const cmds={}
cmds.ping={f:async(s,j,m)=>{await s.sendMessage(j,{text:`Pong ${BOT}`},{quoted:m})}}
cmds.alive={f:async(s,j)=>{await s.sendMessage(j,{text:`${BOT} ALIVE Owner ${OWNER}`})}}
cmds.menu={f:async(s,j)=>{await s.sendMessage(j,{text:`*${BOT} MENU*\n.ping\n.alive\n.menu\n.owner\n.tagall\n.hidetag\n.link\n.close\n.open\n.kick\n.promote\n.demote\n.sticker\n.joke\n.calc\nOwner ${OWNER}`})}}
cmds.owner={f:async(s,j)=>{await s.sendMessage(j,{text:`Owner ${OWNER}`})}}
cmds.tagall={f:async(s,j,m,g,gm)=>{if(!g)return;let me=gm.participants.map(a=>a.id);let t="";me.forEach(x=>t+=`@${x.split('@')[0]} `);await s.sendMessage(j,{text:t,mentions:me})}}
cmds.hidetag={f:async(s,j,m,g,gm,txt)=>{let me=gm.participants.map(a=>a.id);await s.sendMessage(j,{text:txt||"Boston",mentions:me})}}
cmds.link={f:async(s,j)=>{let c=await s.groupInviteCode(j);await s.sendMessage(j,{text:"https://chat.whatsapp.com/"+c})}}
cmds.close={f:async(s,j)=>{await s.groupSettingUpdate(j,'announcement')}}
cmds.open={f:async(s,j)=>{await s.groupSettingUpdate(j,'not_announcement')}}
cmds.kick={f:async(s,j,m)=>{let me=m.message.extendedTextMessage?.contextInfo?.mentionedJid;if(me)await s.groupParticipantsUpdate(j,me,'remove')}}
cmds.promote={f:async(s,j,m)=>{let me=m.message.extendedTextMessage?.contextInfo?.mentionedJid;if(me)await s.groupParticipantsUpdate(j,me,'promote')}}
cmds.demote={f:async(s,j,m)=>{let me=m.message.extendedTextMessage?.contextInfo?.mentionedJid;if(me)await s.groupParticipantsUpdate(j,me,'demote')}}
cmds.sticker={f:async(s,j,m)=>{let q=m.message.extendedTextMessage?.contextInfo?.quotedMessage;let mm=q?{message:q}:m;let b=await downloadMediaMessage(mm,'buffer',{});await s.sendMessage(j,{sticker:b})}}
cmds.joke={f:async(s,j)=>{await s.sendMessage(j,{text:"Bot paired 😂"})}}
cmds.calc={f:async(s,j,m,g,gm,t)=>{try{await s.sendMessage(j,{text:t+"="+(eval(t))})}catch{await s.sendMessage(j,{text:"bad calc"})}}}
async function startBot(){const {state,saveCreds}=await useMultiFileAuthState('session');const sock=makeWASocket({auth:state,logger:pino({level:'silent'}),browser:[BOT,"Chrome","1"]});sock.ev.on('creds.update',saveCreds);sock.ev.on('connection.update',u=>{if(u.connection=='open')console.log(`✅ ${BOT} ONLINE ${sock.user.id}`);if(u.connection=='close'&&u.lastDisconnect?.error?.output?.statusCode!=DisconnectReason.loggedOut)setTimeout(startBot,3000)});sock.ev.on('messages.upsert',async({messages})=>{let m=messages[0];if(!m?.message||m.key.fromMe)return;let j=m.key.remoteJid;let isG=j.endsWith('@g.us');let gm=isG?await sock.groupMetadata(j).catch(()=>null):null;let body=m.message.conversation||m.message.extendedTextMessage?.text||"";if(!body.startsWith("."))return;let a=body.slice(1).split(/ +/);let c=a.shift().toLowerCase();let txt=a.join(' ');if(cmds[c])await cmds[c].f(sock,j,m,isG,gm,txt)})}
async function startPair(){if(fs.existsSync('session'))fs.rmSync('session',{recursive:true,force:true});const {state,saveCreds}=await useMultiFileAuthState('session');const sock=makeWASocket({auth:state,logger:pino({level:'silent'}),browser:[BOT,"Chrome","1"]});sock.ev.on('creds.update',saveCreds);await new Promise(r=>setTimeout(r,3000));let code=await sock.requestPairingCode(OWNER);console.log("CODE FOR "+OWNER+": "+code);console.log("CODE: "+code);setTimeout(startBot,5000)}
let ok=false;try{let c=JSON.parse(fs.readFileSync('./session/creds.json'));if(c.registered)ok=true}catch{};if(ok)startBot();else startPair()