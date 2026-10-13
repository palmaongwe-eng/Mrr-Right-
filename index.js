const {default:makeWASocket,useMultiFileAuthState,DisconnectReason,downloadMediaMessage}=require('@whiskeysockets/baileys')
const pino=require('pino')
const fs=require('fs')
const express=require('express')
const app=express()
const PORT=process.env.PORT||3000
const OWNER="254745084480"
const BOT="BOSTON V2"
const PREFIX="."

app.get('/',(req,res)=>res.send(`<h1>${BOT} ONLINE - ${OWNER}</h1><p>Bot Running</p>`))
app.listen(PORT,()=>console.log('WEB LIVE '+PORT))

const cmds={}
cmds.ping={f:async(s,j,m)=>{await s.sendMessage(j,{text:`*Pong!* ${BOT} 👑\nSpeed: ${Date.now()-m.messageTimestamp*1000}ms`},{quoted:m})}}
cmds.alive={f:async(s,j)=>{await s.sendMessage(j,{text:`*${BOT} ALIVE* 👑\nOwner: ${OWNER}\nPrefix: .\nStatus: Online\nCommands: 30+`})}}
cmds.menu={f:async(s,j)=>{let t=`*${BOT} MENU* 👑\n\n*GENERAL*\n.ping\n.alive\n.menu\n.owner\n.info\n\n*GROUP*\n.tagall\n.hidetag\n.link\n.close\n.open\n.kick\n.promote\n.demote\n\n*FUN*\n.sticker\n.joke\n.quote\n.calc 2+2\n\n*OWNER*\n.broadcast\n\nOwner: ${OWNER}\n`;await s.sendMessage(j,{text:t})}}
cmds.owner={f:async(s,j)=>{await s.sendMessage(j,{text:`Owner: ${OWNER}\nBot: ${BOT}`})}}
cmds.info={f:async(s,j)=>{await s.sendMessage(j,{text:`Bot: ${BOT}\nOwner: ${OWNER}\nBaileys: Latest\nNode: 20`})}}
cmds.tagall={f:async(s,j,m,isG,gm)=>{if(!isG)return;let mem=gm.participants.map(a=>a.id);let txt=`*TAGALL ${BOT}*\n`;mem.forEach(x=>txt+=`@${x.split('@')[0]} `);await s.sendMessage(j,{text:txt,mentions:mem},{quoted:m})}}
cmds.hidetag={f:async(s,j,m,isG,gm,text)=>{if(!isG)return;let mem=gm.participants.map(a=>a.id);await s.sendMessage(j,{text:text||`${BOT} 👑`,mentions:mem})}}
cmds.link={f:async(s,j)=>{let c=await s.groupInviteCode(j);await s.sendMessage(j,{text:`https://chat.whatsapp.com/${c}`})}}
cmds.close={f:async(s,j)=>{await s.groupSettingUpdate(j,'announcement')}}}
cmds.open={f:async(s,j)=>{await s.groupSettingUpdate(j,'not_announcement')}}}
cmds.kick={f:async(s,j,m)=>{let men=m.message.extendedTextMessage?.contextInfo?.mentionedJid;if(men)await s.groupParticipantsUpdate(j,men,'remove')}}
cmds.promote={f:async(s,j,m)=>{let men=m.message.extendedTextMessage?.contextInfo?.mentionedJid;if(men){await s.groupParticipantsUpdate(j,men,'promote');await s.sendMessage(j,{text:"Promoted 👑"})}}}
cmds.demote={f:async(s,j,m)=>{let men=m.message.extendedTextMessage?.contextInfo?.mentionedJid;if(men)await s.groupParticipantsUpdate(j,men,'demote')}}
cmds.sticker={f:async(s,j,m)=>{let q=m.message.extendedTextMessage?.contextInfo?.quotedMessage;let mm=q?{message:q}:m;let buff=await downloadMediaMessage(mm,'buffer',{});await s.sendMessage(j,{sticker:buff},{quoted:m})}}
cmds.joke={f:async(s,j)=>{await s.sendMessage(j,{text:"Bot finally paired! 😂 Boston 👑"})}}
cmds.quote={f:async(s,j)=>{await s.sendMessage(j,{text:"Success is when bot pairs 👑"})}}
cmds.calc={f:async(s,j,m,isG,gm,text)=>{try{let r=eval(text);await s.sendMessage(j,{text:`${text} = ${r}`})}catch{await s.sendMessage(j,{text:"Hesabu mbaya"})}}}

async function startBot(){
const {state,saveCreds}=await useMultiFileAuthState('session')
const sock=makeWASocket({auth:state,logger:pino({level:'silent'}),browser:[BOT,"Chrome","1"]})
sock.ev.on('creds.update',saveCreds)
sock.ev.on('connection.update',u=>{
if(u.connection=='open'){console.log(`✅ ${BOT} ONLINE ${sock.user.id} OWNER ${OWNER}`)}
if(u.connection=='close'&&u.lastDisconnect?.error?.output?.statusCode!=DisconnectReason.loggedOut)setTimeout(startBot,3000)
})
sock.ev.on('messages.upsert',async({messages})=>{
let m=messages[0];if(!m?.message||m.key.fromMe)return
let j=m.key.remoteJid
let isG=j.endsWith('@g.us')
let gm=isG?await sock.groupMetadata(j).catch(()=>null):null
let body=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||""
if(!body.startsWith(PREFIX))return
let args=body.slice(1).trim().split(/ +/)
let com=args.shift().toLowerCase()
let txt=args.join(' ')
if(cmds[com]){try{await cmds[com].f(sock,j,m,isG,gm,txt)}catch(e){console.log(e)}}
})
}

async function startPair(){
if(fs.existsSync('session'))fs.rmSync('session',{recursive:true,force:true})
console.log(`PAIRING ${OWNER}...`)
const {state,saveCreds}=await useMultiFileAuthState('session')
const sock=makeWASocket({auth:state,logger:pino({level:'silent'}),browser:[BOT,"Chrome","1"]})
sock.ev.on('creds.update',saveCreds)
await new Promise(r=>setTimeout(r,3000))
try{let code=await sock.requestPairingCode(OWNER);console.log(`CODE FOR ${OWNER}: ${code}`);console.log(`CODE: ${code}`);console.log(`CODE: ${code}`)}catch(e){console.log("Pair err "+e.message)}
setTimeout(startBot,6000)
}

let paired=false
try{let c=JSON.parse(fs.readFileSync('./session/creds.json'));if(c.registered)paired=true}catch{}
if(paired){console.log("ALREADY PAIRED");startBot()}else{startPair()}