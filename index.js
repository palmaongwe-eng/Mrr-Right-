const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('session');
  const sock = makeWASocket({ auth: state, logger: pino({ level: 'silent' }), browser: ["Mrr-Right V8.1", "Chrome", "1.0"] });
  sock.ev.on('creds.update', saveCreds);
  if (!sock.authState.creds.registered) {
    setTimeout(async () => {
      const phone = process.env.PHONE_NUMBER || "254700000000";
      const code = await sock.requestPairingCode(phone);
      console.log(`PAIR CODE: ${code}`);
    }, 3000);
  }
  sock.ev.on('connection.update', (u) => {
    if (u.connection === 'open') console.log('✅ MRR-RIGHT ONLINE');
    if (u.connection === 'close' && u.lastDisconnect?.error?.output?.statusCode!== DisconnectReason.loggedOut) startBot();
  });
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]; if (!m?.message) return;
    const jid = m.key.remoteJid;
    const body = m.message.conversation || m.message.extendedTextMessage?.text || "";
    if (!body.startsWith('.')) return;
    const cmd = body.slice(1).split(/ +/)[0].toLowerCase();
    const reply = (t) => sock.sendMessage(jid, { text: t }, { quoted: m });
    if (cmd === 'ping') reply('Pong! MRR-RIGHT V8.1 Active ⚡');
    if (cmd === 'menu') reply('*MRR-RIGHT V8.1*\n\n.ping\n.menu\n.owner\n.ai');
    if (cmd === 'owner') reply('Owner: palmaongwe-eng\nBot: MRR-RIGHT V8.1 🔥');
    if (cmd === 'ai') reply('AI: Poa boss, niko active!');
  });
}
startBot();
