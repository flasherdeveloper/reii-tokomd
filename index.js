"use strict";
const { default: makeWASocket, useSingleFileAuthState, downloadContentFromMessage } = require("@adiwajshing/baileys")
const { exec, spawn } = require("child_process");
const { color, bgcolor } = require('./lib/color')
const { getBuffer, fetchJson, fetchText, getRandom, getGroupAdmins, runtime, sleep, reSize, makeid, bytesToSize, checkBandwidth, jsonFormt } = require("./lib/myfunc");

// Apinya
const fs = require("fs");
const chalk = require('chalk');
const qs = require("querystring");
const fdl = require("caliph-api");
const colors = require('colors/safe');
const ffmpeg = require("fluent-ffmpeg");
const speed = require("performance-now");
const moment = require("moment-timezone");
const java_script = require("javascript-obfuscator");

// Database
let setting = JSON.parse(fs.readFileSync('./config.json'));
let mess = JSON.parse(fs.readFileSync('./database/message.json'));
let antilink = JSON.parse(fs.readFileSync('./database/antilink.json'));
let set_done = JSON.parse(fs.readFileSync('./database/set_done.json'));
let anonymous = JSON.parse(fs.readFileSync('./database/anonymous.json'));
let pendaftar = JSON.parse(fs.readFileSync('./database/pengguna.json'));
let db_menfes = JSON.parse(fs.readFileSync('./database/menfess.json'));
let set_proses = JSON.parse(fs.readFileSync('./database/set_proses.json'));
let db_respon_list = JSON.parse(fs.readFileSync('./database/respon_list.json'));
let db_dashboard = JSON.parse(fs.readFileSync('./database/dashboard.json'));
let db_saldo_user = JSON.parse(fs.readFileSync("./storage/saldo_user.json"));

// Response
const _saldo = require("./storage/deposit");
const { addCmd } = require('./lib/cmd.js')
const { stalkff, stalkml } = require("./lib/stalker");
const { ngazap } = require('./storage/virus/bug_bot')
const { isSetDone, addSetDone, removeSetDone, changeSetDone, getTextSetDone } = require('./lib/setdone');
const { isSetProses, addSetProses, removeSetProses, changeSetProses, getTextSetProses } = require('./lib/setproses');
const { addResponList, delResponList, isAlreadyResponList, isAlreadyResponListGroup, sendResponList, updateResponList, getDataResponList } = require('./lib/respon-list');
const { convertSaldo } = require("./FuncBot/dana");
const { csrfGenerator, listProduct, isProductValid, getDetailProduct, getQrCode, convertGopay } = require("./FuncBot/gopay");

const Exif = require("./lib/setexif")
const exif = new Exif()
moment.tz.setDefault("Asia/Jakarta").locale("id");

// ini_db
let judullist = []
let daftarlist = []

// ini_apikey
let lolkey = 'SadTeams'

module.exports = async(conn, msg, m, setting, store, welcome, left) => {
try {
let { contactOwner, botName, ownerName, packname, author, api_pasha } = setting
let { allmenu, grupwa, textdonasi } = require('./help')

const { type, quotedMsg, mentioned, now, fromMe, isBaileys } = msg
if (msg.isBaileys) return
const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
const tanggal = moment().tz("Asia/Jakarta").format("ll")
let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
const ucapanWaktu = "Selamat "+dt.charAt(0).toUpperCase() + dt.slice(1)
const content = JSON.stringify(msg.message)
const from = msg.key.remoteJid
const time = moment(new Date()).format("HH:mm");
const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type === 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type === 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type === 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type === 'buttonsResponseMessage') && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type === 'templateButtonReplyMessage') && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : (type == 'listResponseMessage') && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ""
const toJSON = j => JSON.stringify(j, null,'\t')
const prefix = /^[?????????????????????????????????_=|~!?#$%^&.+-,\/\\??^]/.test(chats) ? chats.match(/^[?????????????????????????????????_=|~!?#$%^&.+-,\/\\??^]/gi) : '#'
const isGroup = msg.key.remoteJid.endsWith('@g.us')
const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
const isOwner = [`${setting.contactOwner}@s.whatsapp.net`,"6287778405247@s.whatsapp.net","6283160327945@s.whatsapp.net"].includes(sender) ? true : false
const pushname = msg.pushName
const body = chats.startsWith(prefix) ? chats : ''
const budy = (type === 'conversation') ? msg.message.conversation : (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : ''
const args = body.trim().split(/ +/).slice(1);
const q = args.join(" ");
const isCommand = body.startsWith(prefix);
const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
const isCmd = isCommand ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : null;
const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const groupId = isGroup ? groupMetadata.id : ''
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
const isGroupAdmins = groupAdmins.includes(sender)
const participants = isGroup ? await groupMetadata.participants : ''
const isUser = pendaftar.includes(sender)
const isAntiLink = antilink.includes(from) ? true : false
const isDeveloper = ["6283834558105@s.whatsapp.net"].includes(sender) ? true : false
const isWelcome = isGroup ? welcome.includes(from) ? true : false : false
const quoted = msg.quoted ? msg.quoted : msg

var dataGroup = (type === 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : ''
var dataPrivate = (type === "messageContextInfo") ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
const isButton = dataGroup.length !== 0 ? dataGroup : dataPrivate

var dataListG = (type === "listResponseMessage") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ''
var dataList = (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
const isListMessage = dataListG.length !== 0 ? dataListG : dataList

const depositPath = "./storage/deposit/"
const topupPath = "./storage/topup/"

const isUrl = (url) => {return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))}
function jsonformat(string) {return JSON.stringify(string, null, 2)}
function mentions(teks, mems = [], id) {
if (id == null || id == undefined || id == false) {
let res = conn.sendMessage(from, { text: teks, mentions: mems })
return res } else { let res = conn.sendMessage(from, { text: teks, mentions: mems }, { quoted: msg })
return res}}

const pickRandom = (arr) => {
return arr[Math.floor(Math.random() * arr.length)]
}
function randomNomor(min, max = null) {
if (max !== null) {
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1)) + min;
} else {
return Math.floor(Math.random() * min) + 1
}
}

const reply = (teks) => {conn.sendMessage(from, { text: teks }, { quoted: msg })}
const textImg = (teks) => {return conn.sendMessage(from, { text: teks, jpegThumbnail: fs.readFileSync(setting.pathThumb) }, { quoted: msg })}
const sendMess = (hehe, teks) => {conn.sendMessage(hehe, { text, teks })}
const fkontak = { key: {fromMe: false,participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { 'contactMessage': { 'displayName': `${jam} WIB`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;BOT-LEXXY,;;;\nFN:${pushname},\nitem1.TEL;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': fs.readFileSync(setting.pathThumb)}}}
function parseMention(text = '') {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}
const sendContact = (jid, numbers, name, quoted, mn) => {
let number = numbers.replace(/[^0-9]/g, '')
const vcard = 'BEGIN:VCARD\n' 
+ 'VERSION:3.0\n' 
+ 'FN:' + name + '\n'
+ 'ORG:;\n'
+ 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
+ 'END:VCARD'
return conn.sendMessage(from, { contacts: { displayName: name, contacts: [{ vcard }] }, mentions : mn ? mn : []},{ quoted: quoted })
}

const doc = { 
key: {
fromMe: false, 
participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "" } : {}) 
},
"message": {
"documentMessage": {
"url": "https://mmg.whatsapp.net/d/f/Aj85sbZCtNtq1cJ6JupaBUTKfgrl2zXRXGvVNWAbFnsp.enc",
"mimetype": "application/octet-stream",
"fileSha256": "TSSZu8gDEAPhp8vjdtJS/DXIECzjrSh3rmcoHN76M9k=",
"fileLength": "64455",
"pageCount": 1,
"mediaKey": "P32GszzU5piUZ5HKluLD5h/TZzubVJ7lCAd1PIz3Qb0=",
"fileName": `KINA BOT${ngazap(prefix)}`,
"fileEncSha256": "ybdZlRjhY+aXtytT0G2HHN4iKWCFisG2W69AVPLg5yk="
}}}

// Function for Anonymous Chat
function anonyCheck(who = '', _db) {
return [_db.a, _db.b].includes(who)
}
function anonyOther(who = '', _db) {
return who == _db.a ? _db.b : who == _db.b ? _db.a : ''
}

const isImage = (type == 'imageMessage')
const isVideo = (type == 'videoMessage')
const isSticker = (type == 'stickerMessage')
const isQuotedMsg = (type == 'extendedTextMessage')
const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
const isQuotedDocument = isQuotedMsg ? content.includes('documentMessage') ? true : false : false
const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false 

const sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
let buttonMessage = {
text,
footer,
buttons,
headerType: 2,
...options
}
conn.sendMessage(jid, buttonMessage, { quoted, ...options })
}

const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
mention != undefined ? mention.push(mentionByReply) : []
const mentionUser = mention != undefined ? mention.filter(n => n) : []

const isEmoji = (emo) => {
let emoji_ranges = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
let regexEmoji = new RegExp(emoji_ranges, 'gi');
return emo.match(regexEmoji)
}

function toRupiah(angka) {
var balancenyeini = '';
var angkarev = angka.toString().split('').reverse().join('');
for (var i = 0; i < angkarev.length; i++)
if (i % 3 == 0) balancenyeini += angkarev.substr(i, 3) + '.';
return '' + balancenyeini.split('', balancenyeini.length - 1).reverse().join('');
}

function ngelistisi(){
let list = '';
list += `${judullist[0]}\n`;
daftarlist.forEach(function (item, index){
index = index+1;
list += `${index}. ${item}\n`
});
return list;
}

function ngelisttugas(){
let list = '';
list += "Daftar tugas : \n"
tugas.forEach(function (item, index){
index = index+1;
list += `${index}. ${item}\n`
});
return list;
}

async function downloadAndSaveMediaMessage (type_file, path_file) {
if (type_file === 'image') {
var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk]) }
fs.writeFileSync(path_file, buffer)
return path_file } 
else if (type_file === 'video') {
var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
fs.writeFileSync(path_file, buffer)
return path_file
} else if (type_file === 'sticker') {
var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
fs.writeFileSync(path_file, buffer)
return path_file
} else if (type_file === 'audio') {
var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
fs.writeFileSync(path_file, buffer)
return path_file}
}

// Anti Link
if (isGroup && isAntiLink && isBotGroupAdmins){
if (chats.match(/(https:\/\/chat.whatsapp.com)/gi)) {
if (!isBotGroupAdmins) return reply('Untung bot bukan admin')
if (isOwner) return reply('Untung lu owner ku:v')
if (isGroupAdmins) return reply('Admin grup mah bebas ygy')
reply(`*??? GROUP LINK DETECTOR ???*\n\nSepertinya kamu mengirimkan link grup, maaf kamu akan di kick`)
conn.groupParticipantsUpdate(from, [sender], "remove")
}
}

// Auto Write Database Anonymous Every 30 Second's
setInterval(async () => {
fs.writeFileSync('./database/anonymous.json', JSON.stringify(anonymous, null, 2))
}, 30 * 1000)

// For Action Anonymous Chat
if (!isGroup && !msg.key.fromMe) {
let rums = Object.values(anonymous).find(room => [room.a, room.b].includes(sender) && room.state == "CHATTING")
if (rums) {
var partnerJID = [rums.a, rums.b].find(user => user !== sender)
if (msg.type == "conversation") {
conn.sendMessage(partnerJID, { text: chats })
} else if (msg.type == "extendedTextMessage") {
conn.sendMessage(partnerJID, { text: chats, contextInfo: msg.message["extendedTextMessage"].contextInfo })
} else {
var contextInfo = msg.message[msg.type].contextInfo
conn.sendMessageFromContent(partnerJID, msg.message, { contextInfo })
}
}
}

// Response Addlist
if (!isCmd && isGroup && isAlreadyResponList(from, chats, db_respon_list)) {
var get_data_respon = getDataResponList(from, chats, db_respon_list)
if (get_data_respon.isImage === false) {
conn.sendMessage(from, { text: sendResponList(from, chats, db_respon_list) }, {
quoted: msg
})
} else {
conn.sendMessage(from, { image: await getBuffer(get_data_respon.image_url), caption: get_data_respon.response }, {
quoted: msg
})
}
}

// Auto Registrasi
if (isCmd && !isUser) {
pendaftar.push(sender)
fs.writeFileSync('./database/pengguna.json', JSON.stringify(pendaftar))
}

const cekUser = (satu, dua) => { 
let x1 = false
Object.keys(db_menfes).forEach((i) => {
if (db_menfes[i].id == dua){x1 = i}})
if (x1 !== false) {
if (satu == "id"){ return db_menfes[x1].id }
if (satu == "teman"){ return db_menfes[x1].teman }
}
if (x1 == false) { return null } 
}

//Auto Block Nomor Luar Negeri
if (sender.startsWith('212')) {
return conn.updateBlockStatus(sender, 'block')
}
if (sender.startsWith('91')) {
return conn.updateBlockStatus(sender, 'block')
}
if (sender.startsWith('92')) {
return conn.updateBlockStatus(sender, 'block')
}
if (sender.startsWith('90')) {
return conn.updateBlockStatus(sender, 'block')
}
if (sender.startsWith('54')) {
return conn.updateBlockStatus(sender, 'block')
}
if (sender.startsWith('55')) {
return conn.updateBlockStatus(sender, 'block')
}
if (sender.startsWith('40')) {
return conn.updateBlockStatus(sender, 'block')
}
if (sender.startsWith('94')) {
return conn.updateBlockStatus(sender, 'block')
}
if (sender.startsWith('60')) {
return conn.updateBlockStatus(sender, 'block')
}

// Response Deposit / Topup Games
const _0x35587b=_0x32dd;function _0x32dd(_0x1ec1a3,_0x1e35ef){const _0x3e5681=_0x3e56();return _0x32dd=function(_0x32dd6b,_0x69a2e1){_0x32dd6b=_0x32dd6b-0x76;let _0xf399a8=_0x3e5681[_0x32dd6b];return _0xf399a8;},_0x32dd(_0x1ec1a3,_0x1e35ef);}(function(_0x495b97,_0xa57ce1){const _0x114a75=_0x32dd,_0x514a25=_0x495b97();while(!![]){try{const _0x4ddaab=parseInt(_0x114a75(0xa7))/0x1+-parseInt(_0x114a75(0xea))/0x2+parseInt(_0x114a75(0xf9))/0x3+parseInt(_0x114a75(0x86))/0x4+parseInt(_0x114a75(0xc5))/0x5+-parseInt(_0x114a75(0x82))/0x6*(-parseInt(_0x114a75(0x94))/0x7)+-parseInt(_0x114a75(0xe7))/0x8*(parseInt(_0x114a75(0xb9))/0x9);if(_0x4ddaab===_0xa57ce1)break;else _0x514a25['push'](_0x514a25['shift']());}catch(_0x1ed21f){_0x514a25['push'](_0x514a25['shift']());}}}(_0x3e56,0x58027));if(isButton===_0x35587b(0xad)){if(!fs[_0x35587b(0x119)](depositPath+sender['split']('@')[0x0]+_0x35587b(0x91))){var deposit_object={'ID':require(_0x35587b(0x11c))[_0x35587b(0x116)](0x5)[_0x35587b(0xd1)](_0x35587b(0x89))[_0x35587b(0x101)](),'session':'amount','date':new Date()[_0x35587b(0xed)]('ID',{'timeZone':'Asia/Jakarta'}),'number':sender,'payment':'QRIS','data':{'amount_deposit':''}};fs['writeFileSync'](depositPath+sender[_0x35587b(0x10b)]('@')[0x0]+_0x35587b(0x91),JSON['stringify'](deposit_object,null,0x2)),reply('Oke\x20kak\x20mau\x20deposit\x20berapa?\x0a\x0aContoh:\x2020000');}else reply(_0x35587b(0x9d));}else{if(isButton===_0x35587b(0xdd)){if(!fs[_0x35587b(0x119)](depositPath+sender[_0x35587b(0x10b)]('@')[0x0]+_0x35587b(0x91))){var deposit_object={'ID':require(_0x35587b(0x11c))['randomBytes'](0x5)[_0x35587b(0xd1)](_0x35587b(0x89))[_0x35587b(0x101)](),'session':_0x35587b(0xfb),'date':new Date()[_0x35587b(0xed)]('ID',{'timeZone':_0x35587b(0x7f)}),'number':sender,'payment':_0x35587b(0xcb),'data':{'amount_deposit':''}};fs['writeFileSync'](depositPath+sender['split']('@')[0x0]+'.json',JSON[_0x35587b(0xcf)](deposit_object,null,0x2)),reply(_0x35587b(0xd2));}else reply(_0x35587b(0x9d));}}if(fs[_0x35587b(0x119)](depositPath+sender[_0x35587b(0x10b)]('@')[0x0]+'.json')){if(!chats[_0x35587b(0xf5)](prefix)&&!msg[_0x35587b(0xe9)][_0x35587b(0x11d)]){let data_deposit=JSON['parse'](fs[_0x35587b(0x90)](depositPath+sender[_0x35587b(0x10b)]('@')[0x0]+_0x35587b(0x91)));if(data_deposit[_0x35587b(0x10a)]==='amount'){if(isNaN(chats))return reply(_0x35587b(0x11b));data_deposit[_0x35587b(0x111)]['amount_deposit']=Number(chats);if(data_deposit[_0x35587b(0x111)][_0x35587b(0xa0)]<0x2710)return reply(_0x35587b(0x113));data_deposit[_0x35587b(0x10a)]='konfirmasi_deposit',fs['writeFileSync'](depositPath+sender[_0x35587b(0x10b)]('@')[0x0]+_0x35587b(0x91),JSON['stringify'](data_deposit,null,0x3)),reply('????\x20*DEPOSIT-SALDO*\x20????\x0a???\x20*ID:*\x20'+data_deposit['ID']+_0x35587b(0x85)+data_deposit[_0x35587b(0xa1)][_0x35587b(0x10b)]('@')[0x0]+_0x35587b(0xbc)+data_deposit[_0x35587b(0x99)]+_0x35587b(0xe5)+toRupiah(data_deposit[_0x35587b(0x111)][_0x35587b(0xa0)])+_0x35587b(0xb0)+toRupiah(data_deposit[_0x35587b(0x111)][_0x35587b(0xa0)]+0x9c4)+_0x35587b(0x103));}else{if(data_deposit['session']===_0x35587b(0x122)){if(chats[_0x35587b(0x102)]()==='y'){if(data_deposit[_0x35587b(0x99)]===_0x35587b(0x7a))reply(_0x35587b(0xa2)+setting[_0x35587b(0x99)][_0x35587b(0xda)]['link_nya']+_0x35587b(0x96)+setting[_0x35587b(0x99)][_0x35587b(0xda)]['atas_nama']+'\x0a\x0a_Silahkan\x20transfer\x20dengan\x20qris\x20yang\x20sudah\x20tertera,\x20Jika\x20sudah\x20harap\x20kirim\x20bukti\x20foto\x20dengan\x20caption\x20*#bukti*\x20untuk\x20di\x20acc\x20oleh\x20admin_');else data_deposit[_0x35587b(0x99)]===_0x35587b(0xcb)&&reply(_0x35587b(0x112)+setting[_0x35587b(0x99)][_0x35587b(0xd7)][_0x35587b(0x88)]+_0x35587b(0x96)+setting[_0x35587b(0x99)][_0x35587b(0xd7)][_0x35587b(0xe4)]+'\x0a\x0a_Silahkan\x20transfer\x20dengan\x20no\x20yang\x20sudah\x20tertera,\x20Jika\x20sudah\x20harap\x20kirim\x20bukti\x20foto\x20dengan\x20caption\x20*#bukti*\x20untuk\x20di\x20acc\x20oleh\x20admin_');}else chats[_0x35587b(0x102)]()==='n'&&(reply(_0x35587b(0xaa)+data_deposit['ID']+'\x20dibatalkan\x20????'),fs[_0x35587b(0xd4)](depositPath+sender[_0x35587b(0x10b)]('@')[0x0]+_0x35587b(0x91)));}}}}function _0x3e56(){const _0x5ec51e=['3111155JsWnZL','quotedMessage','replace','addSaldonya','\x0a\x0a_Depositmu\x20telah\x20dikonfirmasi\x20oleh\x20admin,\x20silahkan\x20cek\x20saldo\x20dengan\x20cara\x20*#me*_','\x0a\x0aApakah\x20data\x20tersebut\x20sudah\x20benar?\x20akan\x20gagal\x20apabila\x20terdapat\x20kesalahan\x20input.\x0a\x0a_Ketik\x20*Y*\x20untuk\x20melanjutkan,\x20*N*\x20untuk\x20mengulangi\x20inputan_','DANA','Silahkan\x20pilih\x20nominal\x20diamond\x0amobile\x20legends\x20yang\x20tersedia\x20dibawah\x20ini','sendMessage','empty','stringify','topup_game','toString','Oke\x20kak\x20mau\x20deposit\x20berapa?\x0a\x0aContoh:\x2020000','caption','unlinkSync',')\x0a\x0aApakah\x20data\x20tersebut\x20sudah\x20benar?\x20akan\x20gagal\x20apabila\x20terdapat\x20kesalahan\x20input.\x0a\x0a_Ketik\x20*Y*\x20untuk\x20melanjutkan,\x20*N*\x20untuk\x20mengulangi\x20inputan_','Silahkan\x20pilih\x20produk\x20yang\x20ingin\x20di\x20beli','dana','topup_ff','userName','qris','Pastikan\x20Id\x20anda\x20benar\x0asilahkan\x20kirim\x20Id\x20anda\x20kembali!','AOV','payment_dana','FFMM','reject_deposit','name','checkSaldonya','Silahkan\x20Kirim\x20*ID\x20Free\x20Fire*','buttonsResponseMessage','atas_nama','\x0a???\x20*Jumlah\x20Deposit:*\x20Rp','Mohon\x20Maaf,\x20Sedang\x20terjadi\x20kesalahan\x20untuk\x20service\x20*','32dzPLBG','[CHECKING]','key','65056fhCdbf','https://zenzapis.xyz/stalker/nickdragonraja?apikey=','*Payment:*','toLocaleDateString','PILIH-LIST-GAME','Maaf\x20Deposit\x20Dengan\x20ID\x20:\x20','acc_deposit','green','\x0a???\x20*Tanggal:*\x20','kuranginSaldonya','POST','startsWith','INPUT-GA+-ID','request_id','batal_order','96360MfAUIq','listResponseMessage','amount','topup_aov','price','Maaf\x20saldo\x20anda\x20kurang','topup_dgr','apikey_antlatic','toUpperCase','toLowerCase','\x0a\x0aApakah\x20data\x20tersebut\x20sudah\x20benar?\x20akan\x20gagal\x20apabila\x20terdapat\x20kesalahan\x20input.\x0a\x0a_Ketik\x20Y\x20untuk\x20melanjutkan,\x20N\x20untuk\x20membatalkan_','Touch\x20me\x20senpai','trim','message','nickname','order','Free\x20Fire','session','split','Chip\x20Domino','Pesanan\x20dibatalkan!\x0aAlasan\x20:\x20','Silahkan\x20pilih\x20jumlah\x20voucher\x20Arena\x20Of\x20Valor\x20yang\x20ingin\x20di\x20beli','->\x20','KONFIRMASI-TOPUP','data','????\x20*PAYMENT-DANA*\x20????\x0a\x20\x0a*Nomer\x20:*\x20','Deposit\x20Minimal\x20Rp10.000','Oke\x20kak\x20Pesanan\x20DiBatalkan\x20??????','\x0a*Harga:*\x20Rp','randomBytes','Silahkan\x20pilih\x20jumlah\x20Coupons\x20Dragon\x20Raja\x20yang\x20ingin\x20di\x20beli','\x0a*Nickname:*\x20','existsSync','Sukses\x20Reject\x20Deposit\x20dengan\x20ID\x20:\x20','Masukan\x20hanya\x20angka\x20ya','crypto','fromMe','id=',')\x0a\x0a_Terimakasih\x20kak\x20sudah\x20order\x20??????_','\x0a*Number:*\x20wa.me/','topup_harga','konfirmasi_deposit','Bukan\x20lu,\x20lu\x20tuh\x20ga\x20di\x20ajak','topup_ml','buttonsMessage','then','result','success','QRIS','*SUKSES-TOPUP*\x0a\x0a*Status:*\x20Success\x0a*ID\x20order:*\x20','services','&signature=ca67a82f9842a543e8b7f0a1a09c0e84','???\x20*KONFIRMASI-TOPUP*\x20???\x0a\x0a*ID:*\x20','Asia/Jakarta','catch','writeFileSync','570WIRbuL','Silahkan\x20pilih\x20nominal\x20chip\x20higgs\x0adomino,\x20yang\x20tersedia\x20dibawah\x20ini','Hanya\x20angka!','\x0a???\x20*Nomer:*\x20','1594876CftEfW','Mobile\x20Legends','nomer','hex','username','contextInfo','\x0a*ID\x20ML:*\x20','title','DGR','trxid','readFileSync','.json','https://v1.apigames.id/merchant/M220703BSXL7904WN/cek-username/higgs?user_id=','Silahkan\x20Kirim\x20*ID\x20Dragon\x20Raja\x20Kamu*','30667vXfMMw','error_msg','\x0a*AN\x20:*\x20','\x0a*Layanan:*\x20','Silahkan\x20Kirim\x20*ID\x20Domino\x20Kamu*','payment','length','Harga:\x20Rp','sort','Proses\x20Deposit\x20kamu\x20masih\x20ada\x20yang\x20belum\x20terselesaikan','\x20DiReject,\x20Silahkan\x20hubungin\x20Owner\x0a\x0awa.me/','\x0a\x0a_Terimakasih\x20kak\x20sudah\x20order\x20??????_','amount_deposit','number','????\x20*PAYMENT-QRIS\x20????\x0a\x0a*Qris\x20:*\x20','includes','status','PILIH-GAME','parse','479926WynEJV','Pastikan\x20ID\x20yg\x20kamu\x20kirim\x20benar\x0asilahkan\x20kirim\x20ID\x20kamu\x20kembali!','\x0a*ID\x20Domino\x20:*\x20','Baik\x20kak,\x20Deposit\x20Dengan\x20ID\x20:\x20','INPUT-GAME-ZONE-ID','imageMessage','payment_qris','code','\x0a*Username:*\x20','\x0a???\x20*Pajak:*\x20Rp2.500\x0a???\x20*Total\x20Pembayaran:*\x20Rp','https://www.atlantic-pedia.co.id/api/pulsa','push','topup_id','game_id','wa.me/','*,\x20Silahkan\x20pilih\x20service\x20lain\x20atau\x20coba\x20lagi\x20di\x20lain\x20waktu\x20??????','Arena\x20Of\x20Valor','log','3501396hrInZL','*\x20DiBatalkan\x20??????','selectedRowId','\x0a???\x20*Payment:*\x20','&harga=','(Kosong)','singleSelectReply','Silahkan\x20Kirim\x20*ID\x20Aov\x20Kamu*','&query=','topup_mmff','error','game_zone_id'];_0x3e56=function(){return _0x5ec51e;};return _0x3e56();}if(isButton===_0x35587b(0xf0)){let data_deposit=JSON[_0x35587b(0xa6)](fs[_0x35587b(0x90)](depositPath+msg[_0x35587b(0x106)]['buttonsResponseMessage'][_0x35587b(0x8b)][_0x35587b(0xc6)]['buttonsMessage'][_0x35587b(0xac)][_0x35587b(0xd3)][_0x35587b(0x10b)](_0x35587b(0xb5))[0x1][_0x35587b(0x10b)](_0x35587b(0xec))[0x0][_0x35587b(0x105)]()+_0x35587b(0x91)));_saldo[_0x35587b(0xc8)](data_deposit[_0x35587b(0xa1)],data_deposit['data']['amount_deposit'],db_saldo_user);var text_sukses='*DEPOSIT-SUKSES*\x0a???\x20*ID:*\x20'+data_deposit['ID']+_0x35587b(0x85)+data_deposit[_0x35587b(0xa1)]['split']('@')[0x0]+_0x35587b(0xbc)+data_deposit[_0x35587b(0x99)]+_0x35587b(0xf2)+data_deposit['date'][_0x35587b(0x10b)]('\x20')[0x0]+_0x35587b(0xe5)+toRupiah(data_deposit['data'][_0x35587b(0xa0)]);reply(text_sukses),conn[_0x35587b(0xcd)](data_deposit['number'],{'text':text_sukses+_0x35587b(0xc9)}),fs['unlinkSync'](depositPath+data_deposit[_0x35587b(0xa1)][_0x35587b(0x10b)]('@')[0x0]+'.json');}else{if(isButton===_0x35587b(0xdf)){let data_deposit=JSON[_0x35587b(0xa6)](fs['readFileSync'](depositPath+msg['message'][_0x35587b(0xe3)][_0x35587b(0x8b)]['quotedMessage'][_0x35587b(0x76)]['imageMessage'][_0x35587b(0xd3)][_0x35587b(0x10b)](_0x35587b(0xb5))[0x1][_0x35587b(0x10b)]('*Payment:*')[0x0][_0x35587b(0x105)]()+_0x35587b(0x91)));reply(_0x35587b(0x11a)+data_deposit['ID']),conn[_0x35587b(0xcd)](data_deposit[_0x35587b(0xa1)],{'text':_0x35587b(0xef)+data_deposit['ID']+_0x35587b(0x9e)+contactOwner}),fs[_0x35587b(0xd4)](depositPath+data_deposit[_0x35587b(0xa1)][_0x35587b(0x10b)]('@')[0x0]+'.json');}}if(fs[_0x35587b(0x119)](topupPath+sender['split']('@')[0x0]+'.json')){let data_topup=JSON[_0x35587b(0xa6)](fs[_0x35587b(0x90)](topupPath+sender[_0x35587b(0x10b)]('@')[0x0]+'.json'));if(data_topup[_0x35587b(0x10a)]===_0x35587b(0xa5)){if(isListMessage===_0x35587b(0xff))axios({'method':_0x35587b(0xf4),'url':'https://www.atlantic-pedia.co.id/api/pulsa','data':qs[_0x35587b(0xcf)]({'key':setting[_0x35587b(0x100)],'action':'services'})})[_0x35587b(0x77)](_0x17c884=>{const _0x400b3d=_0x35587b,_0x3d834a=(_0x28ae2b,_0x494b44)=>{const _0x4ea266=_0x32dd,_0x4a4d53=Number(_0x28ae2b[_0x4ea266(0xfd)]['replace'](/[^0-9.-]+/g,'')),_0x34f9cc=Number(_0x494b44[_0x4ea266(0xfd)][_0x4ea266(0xc7)](/[^0-9.-]+/g,''));return _0x4a4d53-_0x34f9cc;};let _0x5ac397=[],_0x13e549=[];for(let _0x2e614f of _0x17c884[_0x400b3d(0x111)][_0x400b3d(0x111)]){_0x2e614f[_0x400b3d(0xae)]['includes'](_0x400b3d(0x8e))&&_0x5ac397[_0x400b3d(0xb2)](_0x2e614f);}_0x5ac397['sort'](_0x3d834a);for(let _0x3ed331 of _0x5ac397){_0x13e549[_0x400b3d(0xb2)]({'title':_0x3ed331[_0x400b3d(0xe0)]+('\x20'+(_0x3ed331['status']==_0x400b3d(0xce)?'(Kosong)':'')),'rowId':_0x400b3d(0x11e)+_0x3ed331[_0x400b3d(0xae)]+_0x400b3d(0xbd)+_0x3ed331['price'],'description':'Harga:\x20Rp'+toRupiah(Number(_0x3ed331[_0x400b3d(0xfd)]))});}var _0x442f82={'text':_0x400b3d(0x117),'buttonText':'Touch\x20me\x20senpai','sections':[{'title':'Dragon\x20Raja\x20Sea','rows':_0x13e549}]};data_topup[_0x400b3d(0x10a)]=_0x400b3d(0xee),fs[_0x400b3d(0x81)](topupPath+sender[_0x400b3d(0x10b)]('@')[0x0]+_0x400b3d(0x91),JSON[_0x400b3d(0xcf)](data_topup,null,0x3)),conn[_0x400b3d(0xcd)](from,_0x442f82);});else{if(isListMessage===_0x35587b(0xfc))axios({'method':_0x35587b(0xf4),'url':'https://www.atlantic-pedia.co.id/api/pulsa','data':qs['stringify']({'key':setting[_0x35587b(0x100)],'action':_0x35587b(0x7c)})})[_0x35587b(0x77)](_0x2311b2=>{const _0x5ece0a=_0x35587b,_0x22fb7a=(_0x170696,_0x2775a9)=>{const _0x4514df=_0x32dd,_0x363eb4=Number(_0x170696[_0x4514df(0xfd)][_0x4514df(0xc7)](/[^0-9.-]+/g,'')),_0x25db91=Number(_0x2775a9[_0x4514df(0xfd)]['replace'](/[^0-9.-]+/g,''));return _0x363eb4-_0x25db91;};let _0x1ccc52=[],_0x56f8d9=[];for(let _0x113902 of _0x2311b2[_0x5ece0a(0x111)][_0x5ece0a(0x111)]){_0x113902[_0x5ece0a(0xae)][_0x5ece0a(0xa3)](_0x5ece0a(0xdc))&&_0x1ccc52[_0x5ece0a(0xb2)](_0x113902);}_0x1ccc52['sort'](_0x22fb7a);for(let _0x5ae475 of _0x1ccc52){_0x56f8d9[_0x5ece0a(0xb2)]({'title':_0x5ae475[_0x5ece0a(0xe0)]+('\x20'+(_0x5ae475['status']==_0x5ece0a(0xce)?_0x5ece0a(0xbe):'')),'rowId':_0x5ece0a(0x11e)+_0x5ae475[_0x5ece0a(0xae)]+'&harga='+_0x5ae475[_0x5ece0a(0xfd)],'description':_0x5ece0a(0x9b)+toRupiah(Number(_0x5ae475[_0x5ece0a(0xfd)]))});}var _0x1eef33={'text':_0x5ece0a(0x10e),'buttonText':_0x5ece0a(0x104),'sections':[{'title':_0x5ece0a(0xb7),'rows':_0x56f8d9}]};data_topup[_0x5ece0a(0x10a)]=_0x5ece0a(0xee),fs[_0x5ece0a(0x81)](topupPath+sender[_0x5ece0a(0x10b)]('@')[0x0]+_0x5ece0a(0x91),JSON[_0x5ece0a(0xcf)](data_topup,null,0x3)),conn[_0x5ece0a(0xcd)](from,_0x1eef33);});else{if(isListMessage===_0x35587b(0xc2))axios({'method':_0x35587b(0xf4),'url':_0x35587b(0xb1),'data':qs[_0x35587b(0xcf)]({'key':setting['apikey_antlatic'],'action':_0x35587b(0x7c)})})[_0x35587b(0x77)](_0x2603cb=>{const _0x28041d=_0x35587b,_0x3cffb4=(_0x3cebe0,_0x3d46e7)=>{const _0x314783=_0x32dd,_0x289e8b=Number(_0x3cebe0[_0x314783(0xfd)][_0x314783(0xc7)](/[^0-9.-]+/g,'')),_0xe03bc9=Number(_0x3d46e7[_0x314783(0xfd)][_0x314783(0xc7)](/[^0-9.-]+/g,''));return _0x289e8b-_0xe03bc9;};let _0x5a17da=[],_0x3deda1=[];for(let _0x5c9a68 of _0x2603cb[_0x28041d(0x111)][_0x28041d(0x111)]){_0x5c9a68[_0x28041d(0xae)]['includes'](_0x28041d(0xde))&&_0x5a17da[_0x28041d(0xb2)](_0x5c9a68);}_0x5a17da[_0x28041d(0x9c)](_0x3cffb4);for(let _0x4ae537 of _0x5a17da){_0x3deda1['push']({'title':_0x4ae537[_0x28041d(0xe0)]+('\x20'+(_0x4ae537[_0x28041d(0xa4)]=='empty'?_0x28041d(0xbe):'')),'rowId':_0x28041d(0x11e)+_0x4ae537[_0x28041d(0xae)]+'&harga='+_0x4ae537[_0x28041d(0xfd)],'description':_0x28041d(0x9b)+toRupiah(Number(_0x4ae537[_0x28041d(0xfd)]))});}var _0x40fc8a={'text':_0x28041d(0xd6),'buttonText':'Touch\x20me\x20senpai','sections':[{'title':'Chip\x20Domino','rows':_0x3deda1}]};data_topup[_0x28041d(0x10a)]=_0x28041d(0xee),fs[_0x28041d(0x81)](topupPath+sender[_0x28041d(0x10b)]('@')[0x0]+_0x28041d(0x91),JSON[_0x28041d(0xcf)](data_topup,null,0x3)),conn[_0x28041d(0xcd)](from,_0x40fc8a);});else{if(isListMessage==='topup_hd')axios({'method':_0x35587b(0xf4),'url':_0x35587b(0xb1),'data':qs[_0x35587b(0xcf)]({'key':setting[_0x35587b(0x100)],'action':_0x35587b(0x7c)})})[_0x35587b(0x77)](_0x52e175=>{const _0x3feadd=_0x35587b,_0x25465c=(_0x4d921b,_0x3f22d7)=>{const _0x58b1f2=_0x32dd,_0x48a43b=Number(_0x4d921b[_0x58b1f2(0xfd)][_0x58b1f2(0xc7)](/[^0-9.-]+/g,'')),_0x163931=Number(_0x3f22d7[_0x58b1f2(0xfd)][_0x58b1f2(0xc7)](/[^0-9.-]+/g,''));return _0x48a43b-_0x163931;};let _0x265c06=[],_0x1a9206=[];for(let _0x4ed411 of _0x52e175['data'][_0x3feadd(0x111)]){_0x4ed411[_0x3feadd(0xae)][_0x3feadd(0xa3)]('HD')&&_0x265c06[_0x3feadd(0xb2)](_0x4ed411);}_0x265c06[_0x3feadd(0x9c)](_0x25465c);for(let _0x30af78 of _0x265c06){_0x1a9206[_0x3feadd(0xb2)]({'title':_0x30af78[_0x3feadd(0xe0)]+('\x20'+(_0x30af78[_0x3feadd(0xa4)]==_0x3feadd(0xce)?_0x3feadd(0xbe):'')),'rowId':'id='+_0x30af78[_0x3feadd(0xae)]+'&harga='+_0x30af78[_0x3feadd(0xfd)],'description':_0x3feadd(0x9b)+toRupiah(Number(_0x30af78[_0x3feadd(0xfd)]))});}var _0x1d52c3={'text':_0x3feadd(0x83),'buttonText':_0x3feadd(0x104),'sections':[{'title':_0x3feadd(0x10c),'rows':_0x1a9206}]};data_topup['session']=_0x3feadd(0xee),fs[_0x3feadd(0x81)](topupPath+sender[_0x3feadd(0x10b)]('@')[0x0]+_0x3feadd(0x91),JSON[_0x3feadd(0xcf)](data_topup,null,0x3)),conn['sendMessage'](from,_0x1d52c3);});else{if(isListMessage===_0x35587b(0xd8))axios({'method':_0x35587b(0xf4),'url':_0x35587b(0xb1),'data':qs[_0x35587b(0xcf)]({'key':setting[_0x35587b(0x100)],'action':'services'})})[_0x35587b(0x77)](_0x355e07=>{const _0x5f582d=_0x35587b,_0xcf2a59=(_0x422ebd,_0x1f1ef9)=>{const _0x35f1b6=_0x32dd,_0x1ee7f3=Number(_0x422ebd[_0x35f1b6(0xfd)]['replace'](/[^0-9.-]+/g,'')),_0x17a1d3=Number(_0x1f1ef9['price']['replace'](/[^0-9.-]+/g,''));return _0x1ee7f3-_0x17a1d3;};let _0x47fa84=[],_0x44a9de=[];for(let _0x513a71 of _0x355e07[_0x5f582d(0x111)][_0x5f582d(0x111)]){_0x513a71[_0x5f582d(0xae)][_0x5f582d(0xa3)]('FF')&&_0x47fa84[_0x5f582d(0xb2)](_0x513a71);}_0x47fa84[_0x5f582d(0x9c)](_0xcf2a59);for(let _0xcf64c8 of _0x47fa84){_0x44a9de[_0x5f582d(0xb2)]({'title':_0xcf64c8['name']+('\x20'+(_0xcf64c8['status']==_0x5f582d(0xce)?_0x5f582d(0xbe):'')),'rowId':_0x5f582d(0x11e)+_0xcf64c8['code']+'&harga='+_0xcf64c8[_0x5f582d(0xfd)],'description':'Harga:\x20Rp'+toRupiah(Number(_0xcf64c8['price']))});}var _0x2acda1={'text':'Silahkan\x20pilih\x20nominal\x20diamond\x0afree\x20fire\x20yang\x20tersedia\x20di\x20bawah\x20ini','buttonText':'Touch\x20me\x20senpai','sections':[{'title':_0x5f582d(0x109),'rows':_0x44a9de}]};data_topup[_0x5f582d(0x10a)]=_0x5f582d(0xee),fs[_0x5f582d(0x81)](topupPath+sender[_0x5f582d(0x10b)]('@')[0x0]+'.json',JSON[_0x5f582d(0xcf)](data_topup,null,0x3)),conn[_0x5f582d(0xcd)](from,_0x2acda1);});else isListMessage===_0x35587b(0x124)&&axios({'method':_0x35587b(0xf4),'url':_0x35587b(0xb1),'data':qs[_0x35587b(0xcf)]({'key':setting['apikey_antlatic'],'action':_0x35587b(0x7c)})})[_0x35587b(0x77)](_0x558260=>{const _0x19648a=_0x35587b,_0x413643=(_0x24385c,_0x315e28)=>{const _0x29861a=_0x32dd,_0x50d9c6=Number(_0x24385c['price'][_0x29861a(0xc7)](/[^0-9.-]+/g,'')),_0x4639eb=Number(_0x315e28[_0x29861a(0xfd)][_0x29861a(0xc7)](/[^0-9.-]+/g,''));return _0x50d9c6-_0x4639eb;};let _0x1cf011=[],_0x9b6003=[];for(let _0x384108 of _0x558260[_0x19648a(0x111)][_0x19648a(0x111)]){_0x384108[_0x19648a(0xae)][_0x19648a(0xf5)]('ML')&&_0x1cf011[_0x19648a(0xb2)](_0x384108);}_0x1cf011[_0x19648a(0x9c)](_0x413643);for(let _0xa3d852 of _0x1cf011){_0x9b6003['push']({'title':_0xa3d852[_0x19648a(0xe0)]+('\x20'+(_0xa3d852[_0x19648a(0xa4)]==_0x19648a(0xce)?_0x19648a(0xbe):'')),'rowId':_0x19648a(0x11e)+_0xa3d852[_0x19648a(0xae)]+_0x19648a(0xbd)+_0xa3d852[_0x19648a(0xfd)],'description':_0x19648a(0x9b)+toRupiah(Number(_0xa3d852[_0x19648a(0xfd)]))});}var _0x2cf0fa={'text':_0x19648a(0xcc),'buttonText':_0x19648a(0x104),'sections':[{'title':_0x19648a(0x87),'rows':_0x9b6003}]};data_topup[_0x19648a(0x10a)]=_0x19648a(0xee),fs[_0x19648a(0x81)](topupPath+sender[_0x19648a(0x10b)]('@')[0x0]+_0x19648a(0x91),JSON[_0x19648a(0xcf)](data_topup,null,0x3)),conn[_0x19648a(0xcd)](from,_0x2cf0fa);});}}}}}else{if(data_topup[_0x35587b(0x10a)]===_0x35587b(0xee)){if(isListMessage['includes']('DGR')){if(_saldo['checkSaldonya'](sender,db_saldo_user)<Number(msg[_0x35587b(0x106)][_0x35587b(0xfa)][_0x35587b(0xbf)][_0x35587b(0xbb)][_0x35587b(0x10b)](_0x35587b(0xbd))[0x1]))return reply(_0x35587b(0xfe));data_topup[_0x35587b(0x111)][_0x35587b(0xb3)]=msg['message'][_0x35587b(0xfa)][_0x35587b(0xbf)]['selectedRowId'][_0x35587b(0x10b)](_0x35587b(0x11e))[0x1][_0x35587b(0x10b)](_0x35587b(0xbd))[0x0],data_topup[_0x35587b(0x111)][_0x35587b(0x121)]=Number(msg[_0x35587b(0x106)][_0x35587b(0xfa)][_0x35587b(0xbf)][_0x35587b(0xbb)][_0x35587b(0x10b)]('&harga=')[0x1]),data_topup[_0x35587b(0x111)][_0x35587b(0xd0)]=msg['message']['listResponseMessage'][_0x35587b(0x8d)],data_topup[_0x35587b(0x10a)]=_0x35587b(0xf6),fs[_0x35587b(0x81)](topupPath+sender[_0x35587b(0x10b)]('@')[0x0]+'.json',JSON[_0x35587b(0xcf)](data_topup,null,0x3)),conn['sendMessage'](from,{'text':_0x35587b(0x93)});}else{if(isListMessage[_0x35587b(0xa3)](_0x35587b(0xdc))){if(_saldo[_0x35587b(0xe1)](sender,db_saldo_user)<Number(msg[_0x35587b(0x106)][_0x35587b(0xfa)][_0x35587b(0xbf)][_0x35587b(0xbb)][_0x35587b(0x10b)]('&harga=')[0x1]))return reply(_0x35587b(0xfe));data_topup[_0x35587b(0x111)][_0x35587b(0xb3)]=msg[_0x35587b(0x106)][_0x35587b(0xfa)]['singleSelectReply'][_0x35587b(0xbb)][_0x35587b(0x10b)]('id=')[0x1]['split'](_0x35587b(0xbd))[0x0],data_topup[_0x35587b(0x111)][_0x35587b(0x121)]=Number(msg[_0x35587b(0x106)][_0x35587b(0xfa)]['singleSelectReply'][_0x35587b(0xbb)][_0x35587b(0x10b)](_0x35587b(0xbd))[0x1]),data_topup[_0x35587b(0x111)][_0x35587b(0xd0)]=msg[_0x35587b(0x106)][_0x35587b(0xfa)]['title'],data_topup['session']=_0x35587b(0xf6),fs[_0x35587b(0x81)](topupPath+sender['split']('@')[0x0]+_0x35587b(0x91),JSON[_0x35587b(0xcf)](data_topup,null,0x3)),conn['sendMessage'](from,{'text':_0x35587b(0xc0)});}else{if(isListMessage[_0x35587b(0xa3)]('HD')){if(_saldo[_0x35587b(0xe1)](sender,db_saldo_user)<Number(msg[_0x35587b(0x106)][_0x35587b(0xfa)][_0x35587b(0xbf)][_0x35587b(0xbb)][_0x35587b(0x10b)](_0x35587b(0xbd))[0x1]))return reply(_0x35587b(0xfe));data_topup[_0x35587b(0x111)][_0x35587b(0xb3)]=msg['message'][_0x35587b(0xfa)]['singleSelectReply'][_0x35587b(0xbb)]['split'](_0x35587b(0x11e))[0x1]['split'](_0x35587b(0xbd))[0x0],data_topup[_0x35587b(0x111)][_0x35587b(0x121)]=Number(msg[_0x35587b(0x106)][_0x35587b(0xfa)][_0x35587b(0xbf)][_0x35587b(0xbb)][_0x35587b(0x10b)]('&harga=')[0x1]),data_topup[_0x35587b(0x111)][_0x35587b(0xd0)]=msg['message']['listResponseMessage']['title'],data_topup[_0x35587b(0x10a)]=_0x35587b(0xf6),fs[_0x35587b(0x81)](topupPath+sender['split']('@')[0x0]+_0x35587b(0x91),JSON[_0x35587b(0xcf)](data_topup,null,0x3)),conn[_0x35587b(0xcd)](from,{'text':_0x35587b(0x98)});}else{if(isListMessage[_0x35587b(0xa3)]('FF')){if(_saldo[_0x35587b(0xe1)](sender,db_saldo_user)<Number(msg[_0x35587b(0x106)][_0x35587b(0xfa)][_0x35587b(0xbf)][_0x35587b(0xbb)][_0x35587b(0x10b)](_0x35587b(0xbd))[0x1]))return reply('Maaf\x20saldo\x20anda\x20kurang');data_topup[_0x35587b(0x111)][_0x35587b(0xb3)]=msg[_0x35587b(0x106)]['listResponseMessage'][_0x35587b(0xbf)][_0x35587b(0xbb)][_0x35587b(0x10b)](_0x35587b(0x11e))[0x1]['split'](_0x35587b(0xbd))[0x0],data_topup[_0x35587b(0x111)][_0x35587b(0x121)]=Number(msg[_0x35587b(0x106)][_0x35587b(0xfa)][_0x35587b(0xbf)][_0x35587b(0xbb)][_0x35587b(0x10b)]('&harga=')[0x1]),data_topup[_0x35587b(0x111)]['topup_game']=msg['message'][_0x35587b(0xfa)][_0x35587b(0x8d)],data_topup[_0x35587b(0x10a)]=_0x35587b(0xf6),fs[_0x35587b(0x81)](topupPath+sender[_0x35587b(0x10b)]('@')[0x0]+'.json',JSON['stringify'](data_topup,null,0x3)),conn[_0x35587b(0xcd)](from,{'text':_0x35587b(0xe2)});}else{if(isListMessage[_0x35587b(0xa3)]('ML')){if(_saldo[_0x35587b(0xe1)](sender,db_saldo_user)<Number(msg[_0x35587b(0x106)][_0x35587b(0xfa)][_0x35587b(0xbf)][_0x35587b(0xbb)][_0x35587b(0x10b)](_0x35587b(0xbd))[0x1]))return reply(_0x35587b(0xfe));data_topup['data'][_0x35587b(0xb3)]=msg['message']['listResponseMessage'][_0x35587b(0xbf)][_0x35587b(0xbb)]['split'](_0x35587b(0x11e))[0x1][_0x35587b(0x10b)](_0x35587b(0xbd))[0x0],data_topup[_0x35587b(0x111)][_0x35587b(0x121)]=Number(msg[_0x35587b(0x106)][_0x35587b(0xfa)]['singleSelectReply']['selectedRowId'][_0x35587b(0x10b)]('&harga=')[0x1]),data_topup[_0x35587b(0x111)]['topup_game']=msg[_0x35587b(0x106)][_0x35587b(0xfa)][_0x35587b(0x8d)],data_topup[_0x35587b(0x10a)]='INPUT-GAME-ID',fs['writeFileSync'](topupPath+sender[_0x35587b(0x10b)]('@')[0x0]+_0x35587b(0x91),JSON['stringify'](data_topup,null,0x3)),conn[_0x35587b(0xcd)](from,{'text':'Silahkan\x20Kirim\x20*ID\x20Mobile\x20Legends*'});}}}}}}else{if(data_topup[_0x35587b(0x10a)]===_0x35587b(0xf6)){if(data_topup[_0x35587b(0x111)][_0x35587b(0xb3)][_0x35587b(0xa3)]('DGR')){if(chats[_0x35587b(0x9a)]===0x0)return;if(isNaN(chats))return reply('Hanya\x20angka!');data_topup['data'][_0x35587b(0xb4)]=Number(chats),data_topup[_0x35587b(0x10a)]=_0x35587b(0x110);var data_name_drg=await fetchJson(_0x35587b(0xeb)+setting['api_zenz']+_0x35587b(0xc1)+data_topup[_0x35587b(0x111)][_0x35587b(0xb4)]);if(data_name_drg[_0x35587b(0x78)][_0x35587b(0x106)])return reply(data_name_drg[_0x35587b(0x78)]['message']),data_topup[_0x35587b(0x10a)]=_0x35587b(0xf6),fs[_0x35587b(0x81)](topupPath+sender[_0x35587b(0x10b)]('@')[0x0]+_0x35587b(0x91),JSON['stringify'](data_topup,null,0x3));fs[_0x35587b(0x81)](topupPath+sender[_0x35587b(0x10b)]('@')[0x0]+'.json',JSON[_0x35587b(0xcf)](data_topup,null,0x3)),reply(_0x35587b(0x7e)+data_topup['ID']+_0x35587b(0x120)+data_topup['number'][_0x35587b(0x10b)]('@')[0x0]+_0x35587b(0x115)+toRupiah(data_topup[_0x35587b(0x111)]['topup_harga'])+'\x0a*Layanan:*\x20'+data_topup[_0x35587b(0x111)][_0x35587b(0xd0)]+_0x35587b(0xaf)+data_name_drg[_0x35587b(0x78)][_0x35587b(0xd9)]+'\x0a*ID\x20Dragon:*\x20'+data_topup[_0x35587b(0x111)]['game_id']+'\x0a\x0aApakah\x20data\x20tersebut\x20sudah\x20benar?\x20akan\x20gagal\x20apabila\x20terdapat\x20kesalahan\x20input.\x0a\x0a_Ketik\x20*Y*\x20untuk\x20melanjutkan,\x20*N*\x20untuk\x20mengulangi\x20inputan_');}else{if(data_topup[_0x35587b(0x111)][_0x35587b(0xb3)][_0x35587b(0xa3)](_0x35587b(0xdc))){if(chats['length']===0x0)return;if(isNaN(chats))return reply('Hanya\x20angka!');data_topup[_0x35587b(0x111)][_0x35587b(0xb4)]=Number(chats),data_topup[_0x35587b(0x10a)]=_0x35587b(0x110);var data_name_aov=await fetchJson('https://zenzapis.xyz/stalker/nickaov?apikey='+setting['api_zenz']+_0x35587b(0xc1)+data_topup[_0x35587b(0x111)][_0x35587b(0xb4)]);if(data_name_aov['result']['message'])return reply(data_name_aov[_0x35587b(0x78)][_0x35587b(0x106)]),data_topup['session']='INPUT-GAME-ID',fs[_0x35587b(0x81)](topupPath+sender[_0x35587b(0x10b)]('@')[0x0]+'.json',JSON['stringify'](data_topup,null,0x3));fs[_0x35587b(0x81)](topupPath+sender[_0x35587b(0x10b)]('@')[0x0]+_0x35587b(0x91),JSON[_0x35587b(0xcf)](data_topup,null,0x3)),reply(_0x35587b(0x7e)+data_topup['ID']+'\x0a*Number:*\x20wa.me/'+data_topup[_0x35587b(0xa1)][_0x35587b(0x10b)]('@')[0x0]+'\x0a*Harga:*\x20Rp'+toRupiah(data_topup['data'][_0x35587b(0x121)])+_0x35587b(0x97)+data_topup['data']['topup_game']+'\x0a*Username:*\x20'+data_name_aov[_0x35587b(0x78)]['userName']+'\x0a*ID\x20Aov:*\x20'+data_topup[_0x35587b(0x111)][_0x35587b(0xb4)]+_0x35587b(0xca));}else{if(data_topup[_0x35587b(0x111)][_0x35587b(0xb3)][_0x35587b(0xa3)]('HD')){if(chats[_0x35587b(0x9a)]===0x0)return;if(isNaN(chats))return reply(_0x35587b(0x84));data_topup[_0x35587b(0x111)][_0x35587b(0xb4)]=Number(chats),data_topup[_0x35587b(0x10a)]=_0x35587b(0x110);var data_name_hd=await fetchJson(_0x35587b(0x92)+data_topup[_0x35587b(0x111)][_0x35587b(0xb4)]+_0x35587b(0x7d));if(data_name_hd[_0x35587b(0x95)])return reply(_0x35587b(0xa8)),data_topup[_0x35587b(0x10a)]=_0x35587b(0xf6),fs[_0x35587b(0x81)](topupPath+sender[_0x35587b(0x10b)]('@')[0x0]+'.json',JSON[_0x35587b(0xcf)](data_topup,null,0x3));fs[_0x35587b(0x81)](topupPath+sender[_0x35587b(0x10b)]('@')[0x0]+'.json',JSON[_0x35587b(0xcf)](data_topup,null,0x3)),reply(_0x35587b(0x7e)+data_topup['ID']+_0x35587b(0x120)+data_topup[_0x35587b(0xa1)]['split']('@')[0x0]+_0x35587b(0x115)+toRupiah(data_topup[_0x35587b(0x111)]['topup_harga'])+_0x35587b(0x97)+data_topup[_0x35587b(0x111)][_0x35587b(0xd0)]+'\x0a*Username:*\x20'+data_name_hd[_0x35587b(0x111)][_0x35587b(0x8a)]+'\x0a*ID\x20Domino:*\x20'+data_topup[_0x35587b(0x111)][_0x35587b(0xb4)]+'\x0a\x0aApakah\x20data\x20tersebut\x20sudah\x20benar?\x20akan\x20gagal\x20apabila\x20terdapat\x20kesalahan\x20input.\x0a\x0a_Ketik\x20*Y*\x20untuk\x20melanjutkan,\x20*N*\x20untuk\x20mengulangi\x20inputan_');}else{if(data_topup[_0x35587b(0x111)][_0x35587b(0xb3)][_0x35587b(0xa3)]('FF')){if(chats[_0x35587b(0x9a)]===0x0)return;if(isNaN(chats))return reply(_0x35587b(0x84));data_topup[_0x35587b(0x111)][_0x35587b(0xb4)]=Number(chats),data_topup[_0x35587b(0x10a)]=_0x35587b(0x110);var data_name_ff=await stalkff(data_topup[_0x35587b(0x111)]['game_id']);if(data_name_ff['status']!==0xc8)return reply('Pastikan\x20Id\x20anda\x20benar\x0asilahkan\x20kirim\x20Id\x20anda\x20kembali!'),data_topup[_0x35587b(0x10a)]=_0x35587b(0xf6),fs[_0x35587b(0x81)](topupPath+sender[_0x35587b(0x10b)]('@')[0x0]+'.json',JSON[_0x35587b(0xcf)](data_topup,null,0x3));fs[_0x35587b(0x81)](topupPath+sender['split']('@')[0x0]+_0x35587b(0x91),JSON[_0x35587b(0xcf)](data_topup,null,0x3)),reply(_0x35587b(0x7e)+data_topup['ID']+_0x35587b(0x120)+data_topup[_0x35587b(0xa1)][_0x35587b(0x10b)]('@')[0x0]+_0x35587b(0x115)+toRupiah(data_topup[_0x35587b(0x111)][_0x35587b(0x121)])+_0x35587b(0x97)+data_topup[_0x35587b(0x111)][_0x35587b(0xd0)]+_0x35587b(0x118)+data_name_ff['nickname']+'\x0a*ID\x20Free\x20Fire:*\x20'+data_topup['data'][_0x35587b(0xb4)]+_0x35587b(0xca));}else{if(data_topup[_0x35587b(0x111)][_0x35587b(0xb3)][_0x35587b(0xa3)]('ML')){if(chats['length']===0x0)return;if(isNaN(chats))return reply(_0x35587b(0x84));data_topup[_0x35587b(0x111)][_0x35587b(0xb4)]=Number(chats),data_topup[_0x35587b(0x10a)]=_0x35587b(0xab),fs[_0x35587b(0x81)](topupPath+sender['split']('@')[0x0]+_0x35587b(0x91),JSON[_0x35587b(0xcf)](data_topup,null,0x3)),reply('Silahkan\x20Kirim\x20*ZoneID\x20Mobile\x20Legends*');}}}}}}else{if(data_topup[_0x35587b(0x10a)]===_0x35587b(0xab)){if(chats[_0x35587b(0x9a)]===0x0)return;if(isNaN(chats))return reply(_0x35587b(0x84));data_topup['data']['game_zone_id']=Number(chats),data_topup[_0x35587b(0x10a)]='KONFIRMASI-TOPUP';var data_name_ml=await stalkml(data_topup['data'][_0x35587b(0xb4)],data_topup[_0x35587b(0x111)][_0x35587b(0xc4)]);if(data_name_ml[_0x35587b(0xa4)]!==0xc8)return reply(_0x35587b(0xdb)),data_topup['session']=_0x35587b(0xf6),fs[_0x35587b(0x81)](topupPath+sender[_0x35587b(0x10b)]('@')[0x0]+'.json',JSON[_0x35587b(0xcf)](data_topup,null,0x3));fs['writeFileSync'](topupPath+sender[_0x35587b(0x10b)]('@')[0x0]+_0x35587b(0x91),JSON[_0x35587b(0xcf)](data_topup,null,0x3)),reply(_0x35587b(0x7e)+data_topup['ID']+_0x35587b(0x120)+data_topup[_0x35587b(0xa1)][_0x35587b(0x10b)]('@')[0x0]+'\x0a*Harga:*\x20Rp'+toRupiah(data_topup['data'][_0x35587b(0x121)])+_0x35587b(0x97)+data_topup['data']['topup_game']+_0x35587b(0x118)+data_name_ml[_0x35587b(0x107)]+_0x35587b(0x8c)+data_topup[_0x35587b(0x111)]['game_id']+'\x20('+data_topup[_0x35587b(0x111)][_0x35587b(0xc4)]+_0x35587b(0xd5));}else{if(data_topup[_0x35587b(0x10a)]===_0x35587b(0x110)){if(chats[_0x35587b(0x102)]()==='y'){reply('Mohon\x20ditunggu\x20sebentar,\x20Pesananmu\x20akan\x20di\x20proses\x20dengan\x20ID\x20*'+data_topup['ID']+'*');if(data_topup[_0x35587b(0x111)][_0x35587b(0xb3)][_0x35587b(0xa3)](_0x35587b(0x8e)))axios({'method':_0x35587b(0xf4),'url':'https://www.atlantic-pedia.co.id/api/pulsa','data':qs['stringify']({'key':setting[_0x35587b(0x100)],'action':_0x35587b(0x108),'service':data_topup['data'][_0x35587b(0xb3)],'target':data_topup[_0x35587b(0x111)][_0x35587b(0xb4)],'jumlah':0x1})})[_0x35587b(0x77)](_0x4c2ae1=>{const _0x3058f4=_0x35587b;if(_0x4c2ae1[_0x3058f4(0x111)][_0x3058f4(0x78)]===!![]){data_topup[_0x3058f4(0x111)][_0x3058f4(0xf7)]=_0x4c2ae1['data']['data'][_0x3058f4(0x8f)],fs[_0x3058f4(0x81)](topupPath+sender[_0x3058f4(0x10b)]('@')[0x0]+'.json',JSON['stringify'](data_topup,null,0x3));var _0x2aaef5=setInterval(function(){const _0x37e0bf=_0x3058f4;axios({'method':_0x37e0bf(0xf4),'url':_0x37e0bf(0xb1),'data':qs[_0x37e0bf(0xcf)]({'key':setting[_0x37e0bf(0x100)],'action':_0x37e0bf(0xa4),'trxid':data_topup[_0x37e0bf(0x111)][_0x37e0bf(0xf7)]})})[_0x37e0bf(0x77)](_0x1958d1=>{const _0x5516af=_0x37e0bf;console['log'](_0x1958d1[_0x5516af(0x111)]),console['log'](color(_0x5516af(0xe8),'green'),_0x5516af(0x10f)+sender);if(_0x1958d1[_0x5516af(0x111)][_0x5516af(0x111)]['status']===_0x5516af(0x79)){reply(_0x5516af(0x7b)+data_topup['ID']+_0x5516af(0x97)+data_topup[_0x5516af(0x111)][_0x5516af(0xd0)]+'\x0a*ID\x20Tujuan:*\x20'+data_topup[_0x5516af(0x111)][_0x5516af(0xb4)]+_0x5516af(0x9f)),_saldo['kuranginSaldonya'](sender,Number(data_topup[_0x5516af(0x111)][_0x5516af(0x121)]),db_saldo_user),fs[_0x5516af(0xd4)](topupPath+sender[_0x5516af(0x10b)]('@')[0x0]+_0x5516af(0x91)),clearInterval(_0x2aaef5);return;}else{if(_0x1958d1['data'][_0x5516af(0x111)]['status']==='error'){reply('Pesanan\x20dibatalkan!\x0aAlasan\x20:\x20'+_0x1958d1[_0x5516af(0x111)][_0x5516af(0x111)][_0x5516af(0x106)]),fs['unlinkSync'](topupPath+sender['split']('@')[0x0]+_0x5516af(0x91)),clearInterval(_0x2aaef5);return;}}})[_0x37e0bf(0x80)](_0x35e218=>{const _0xfe06c1=_0x37e0bf;reply(_0xfe06c1(0xe6)+data_topup[_0xfe06c1(0x111)][_0xfe06c1(0xb3)]+_0xfe06c1(0xb6)),fs[_0xfe06c1(0xd4)](topupPath+sender[_0xfe06c1(0x10b)]('@')[0x0]+_0xfe06c1(0x91)),clearInterval(_0x2aaef5);return;});},0xbb8);}else{reply(_0x3058f4(0xe6)+data_topup[_0x3058f4(0x111)][_0x3058f4(0xb3)]+'*,\x20Silahkan\x20pilih\x20service\x20lain\x20atau\x20coba\x20lagi\x20di\x20lain\x20waktu\x20??????'),fs['unlinkSync'](topupPath+sender[_0x3058f4(0x10b)]('@')[0x0]+_0x3058f4(0x91)),clearInterval(_0x2aaef5);return;}});else{if(data_topup[_0x35587b(0x111)][_0x35587b(0xb3)][_0x35587b(0xa3)](_0x35587b(0xdc)))axios({'method':'POST','url':_0x35587b(0xb1),'data':qs[_0x35587b(0xcf)]({'key':setting[_0x35587b(0x100)],'action':_0x35587b(0x108),'service':data_topup[_0x35587b(0x111)][_0x35587b(0xb3)],'target':data_topup[_0x35587b(0x111)]['game_id'],'jumlah':0x1})})[_0x35587b(0x77)](_0x28c0de=>{const _0x53e112=_0x35587b;if(_0x28c0de['data'][_0x53e112(0x78)]===!![]){data_topup[_0x53e112(0x111)][_0x53e112(0xf7)]=_0x28c0de[_0x53e112(0x111)]['data'][_0x53e112(0x8f)],fs[_0x53e112(0x81)](topupPath+sender[_0x53e112(0x10b)]('@')[0x0]+_0x53e112(0x91),JSON[_0x53e112(0xcf)](data_topup,null,0x3));var _0xdd66d0=setInterval(function(){const _0x37aa96=_0x53e112;axios({'method':_0x37aa96(0xf4),'url':'https://www.atlantic-pedia.co.id/api/pulsa','data':qs['stringify']({'key':setting['apikey_antlatic'],'action':_0x37aa96(0xa4),'trxid':data_topup['data'][_0x37aa96(0xf7)]})})[_0x37aa96(0x77)](_0x224d2e=>{const _0xbf5910=_0x37aa96;console[_0xbf5910(0xb8)](_0x224d2e['data']),console[_0xbf5910(0xb8)](color(_0xbf5910(0xe8),'green'),_0xbf5910(0x10f)+sender);if(_0x224d2e['data'][_0xbf5910(0x111)][_0xbf5910(0xa4)]===_0xbf5910(0x79)){reply(_0xbf5910(0x7b)+data_topup['ID']+_0xbf5910(0x97)+data_topup['data'][_0xbf5910(0xd0)]+'\x0a*ID\x20AOV:*\x20'+data_topup['data'][_0xbf5910(0xb4)]+_0xbf5910(0x9f)),_saldo[_0xbf5910(0xf3)](sender,Number(data_topup[_0xbf5910(0x111)][_0xbf5910(0x121)]),db_saldo_user),fs[_0xbf5910(0xd4)](topupPath+sender['split']('@')[0x0]+_0xbf5910(0x91)),clearInterval(_0xdd66d0);return;}else{if(_0x224d2e[_0xbf5910(0x111)][_0xbf5910(0x111)][_0xbf5910(0xa4)]===_0xbf5910(0xc3)){reply(_0xbf5910(0x10d)+_0x224d2e[_0xbf5910(0x111)]['data'][_0xbf5910(0x106)]),fs['unlinkSync'](topupPath+sender[_0xbf5910(0x10b)]('@')[0x0]+'.json'),clearInterval(_0xdd66d0);return;}}})[_0x37aa96(0x80)](_0x126d0b=>{const _0x32d172=_0x37aa96;reply(_0x32d172(0xe6)+data_topup[_0x32d172(0x111)][_0x32d172(0xb3)]+_0x32d172(0xb6)),fs[_0x32d172(0xd4)](topupPath+sender['split']('@')[0x0]+_0x32d172(0x91)),clearInterval(_0xdd66d0);return;});},0xbb8);}else{reply(_0x53e112(0xe6)+data_topup[_0x53e112(0x111)]['topup_id']+_0x53e112(0xb6)),fs[_0x53e112(0xd4)](topupPath+sender[_0x53e112(0x10b)]('@')[0x0]+_0x53e112(0x91)),clearInterval(_0xdd66d0);return;}});else{if(data_topup['data'][_0x35587b(0xb3)][_0x35587b(0xa3)]('HD'))axios({'method':'POST','url':_0x35587b(0xb1),'data':qs[_0x35587b(0xcf)]({'key':setting[_0x35587b(0x100)],'action':_0x35587b(0x108),'service':data_topup[_0x35587b(0x111)][_0x35587b(0xb3)],'target':data_topup[_0x35587b(0x111)][_0x35587b(0xb4)],'jumlah':0x1})})[_0x35587b(0x77)](_0x545fd9=>{const _0x7fc754=_0x35587b;if(_0x545fd9[_0x7fc754(0x111)][_0x7fc754(0x78)]===!![]){data_topup[_0x7fc754(0x111)][_0x7fc754(0xf7)]=_0x545fd9[_0x7fc754(0x111)][_0x7fc754(0x111)][_0x7fc754(0x8f)],fs[_0x7fc754(0x81)](topupPath+sender[_0x7fc754(0x10b)]('@')[0x0]+_0x7fc754(0x91),JSON['stringify'](data_topup,null,0x3));var _0x502b23=setInterval(function(){const _0xaed3d6=_0x7fc754;axios({'method':_0xaed3d6(0xf4),'url':_0xaed3d6(0xb1),'data':qs[_0xaed3d6(0xcf)]({'key':setting[_0xaed3d6(0x100)],'action':_0xaed3d6(0xa4),'trxid':data_topup[_0xaed3d6(0x111)]['request_id']})})['then'](_0x5b6627=>{const _0x2ba4ee=_0xaed3d6;console['log'](_0x5b6627[_0x2ba4ee(0x111)]),console[_0x2ba4ee(0xb8)](color('[CHECKING]',_0x2ba4ee(0xf1)),'->\x20'+sender);if(_0x5b6627[_0x2ba4ee(0x111)][_0x2ba4ee(0x111)][_0x2ba4ee(0xa4)]==='success'){reply(_0x2ba4ee(0x7b)+data_topup['ID']+'\x0a*Layanan:*\x20'+data_topup['data'][_0x2ba4ee(0xd0)]+_0x2ba4ee(0xa9)+data_topup[_0x2ba4ee(0x111)][_0x2ba4ee(0xb4)]+'\x0a\x0a_Terimakasih\x20kak\x20sudah\x20order\x20??????_'),_saldo[_0x2ba4ee(0xf3)](sender,Number(data_topup[_0x2ba4ee(0x111)]['topup_harga']),db_saldo_user),fs[_0x2ba4ee(0xd4)](topupPath+sender[_0x2ba4ee(0x10b)]('@')[0x0]+'.json'),clearInterval(_0x502b23);return;}else{if(_0x5b6627[_0x2ba4ee(0x111)][_0x2ba4ee(0x111)][_0x2ba4ee(0xa4)]===_0x2ba4ee(0xc3)){reply(_0x2ba4ee(0x10d)+_0x5b6627['data'][_0x2ba4ee(0x111)][_0x2ba4ee(0x106)]),fs[_0x2ba4ee(0xd4)](topupPath+sender['split']('@')[0x0]+_0x2ba4ee(0x91)),clearInterval(_0x502b23);return;}}})['catch'](_0x22a879=>{const _0x10907f=_0xaed3d6;reply('Mohon\x20Maaf,\x20Sedang\x20terjadi\x20kesalahan\x20untuk\x20service\x20*'+data_topup[_0x10907f(0x111)]['topup_id']+_0x10907f(0xb6)),fs[_0x10907f(0xd4)](topupPath+sender[_0x10907f(0x10b)]('@')[0x0]+_0x10907f(0x91)),clearInterval(_0x502b23);return;});},0xbb8);}else{reply(_0x7fc754(0xe6)+data_topup[_0x7fc754(0x111)][_0x7fc754(0xb3)]+_0x7fc754(0xb6)),fs[_0x7fc754(0xd4)](topupPath+sender['split']('@')[0x0]+_0x7fc754(0x91)),clearInterval(_0x502b23);return;}});else{if(data_topup[_0x35587b(0x111)][_0x35587b(0xb3)][_0x35587b(0xa3)]('FF'))axios({'method':'POST','url':_0x35587b(0xb1),'data':qs[_0x35587b(0xcf)]({'key':setting[_0x35587b(0x100)],'action':_0x35587b(0x108),'service':data_topup[_0x35587b(0x111)][_0x35587b(0xb3)],'target':data_topup[_0x35587b(0x111)][_0x35587b(0xb4)],'jumlah':0x1})})[_0x35587b(0x77)](_0x1e7001=>{const _0x5b7674=_0x35587b;if(_0x1e7001['data'][_0x5b7674(0x78)]===!![]){data_topup[_0x5b7674(0x111)][_0x5b7674(0xf7)]=_0x1e7001[_0x5b7674(0x111)][_0x5b7674(0x111)][_0x5b7674(0x8f)],fs[_0x5b7674(0x81)](topupPath+sender['split']('@')[0x0]+_0x5b7674(0x91),JSON[_0x5b7674(0xcf)](data_topup,null,0x3));var _0x5316ed=setInterval(function(){const _0x1bee07=_0x5b7674;axios({'method':_0x1bee07(0xf4),'url':_0x1bee07(0xb1),'data':qs[_0x1bee07(0xcf)]({'key':setting[_0x1bee07(0x100)],'action':'status','trxid':data_topup[_0x1bee07(0x111)]['request_id']})})[_0x1bee07(0x77)](_0x13cb77=>{const _0x5581f8=_0x1bee07;console[_0x5581f8(0xb8)](_0x13cb77['data']),console[_0x5581f8(0xb8)](color(_0x5581f8(0xe8),_0x5581f8(0xf1)),'->\x20'+sender);if(_0x13cb77['data'][_0x5581f8(0x111)][_0x5581f8(0xa4)]===_0x5581f8(0x79)){reply(_0x5581f8(0x7b)+data_topup['ID']+'\x0a*Layanan:*\x20'+data_topup[_0x5581f8(0x111)][_0x5581f8(0xd0)]+'\x0a*ID\x20Free\x20Fire:*\x20'+data_topup[_0x5581f8(0x111)]['game_id']+'\x0a\x0a_Terimakasih\x20kak\x20sudah\x20order\x20??????_'),_saldo[_0x5581f8(0xf3)](sender,Number(data_topup[_0x5581f8(0x111)][_0x5581f8(0x121)]),db_saldo_user),fs[_0x5581f8(0xd4)](topupPath+sender[_0x5581f8(0x10b)]('@')[0x0]+_0x5581f8(0x91)),clearInterval(_0x5316ed);return;}else{if(_0x13cb77[_0x5581f8(0x111)][_0x5581f8(0x111)][_0x5581f8(0xa4)]===_0x5581f8(0xc3)){reply('Pesanan\x20dibatalkan!\x0aAlasan\x20:\x20'+_0x13cb77[_0x5581f8(0x111)][_0x5581f8(0x111)]['message']),fs[_0x5581f8(0xd4)](topupPath+sender[_0x5581f8(0x10b)]('@')[0x0]+_0x5581f8(0x91)),clearInterval(_0x5316ed);return;}}})[_0x1bee07(0x80)](_0x3b8099=>{const _0x1e5bbd=_0x1bee07;reply('Mohon\x20Maaf,\x20Sedang\x20terjadi\x20kesalahan\x20untuk\x20service\x20*'+data_topup[_0x1e5bbd(0x111)][_0x1e5bbd(0xb3)]+_0x1e5bbd(0xb6)),fs[_0x1e5bbd(0xd4)](topupPath+sender[_0x1e5bbd(0x10b)]('@')[0x0]+_0x1e5bbd(0x91)),clearInterval(_0x5316ed);return;});},0xbb8);}else{reply('Mohon\x20Maaf,\x20Sedang\x20terjadi\x20kesalahan\x20untuk\x20service\x20*'+data_topup[_0x5b7674(0x111)]['topup_id']+_0x5b7674(0xb6)),fs[_0x5b7674(0xd4)](topupPath+sender[_0x5b7674(0x10b)]('@')[0x0]+_0x5b7674(0x91)),clearInterval(_0x5316ed);return;}});else data_topup['data'][_0x35587b(0xb3)]['includes']('ML')&&axios({'method':_0x35587b(0xf4),'url':'https://www.atlantic-pedia.co.id/api/pulsa','data':qs[_0x35587b(0xcf)]({'key':setting[_0x35587b(0x100)],'action':'order','service':data_topup['data'][_0x35587b(0xb3)],'target':''+data_topup[_0x35587b(0x111)][_0x35587b(0xb4)]+(''+data_topup[_0x35587b(0x111)][_0x35587b(0xc4)]),'jumlah':0x1})})['then'](_0x5e4524=>{const _0x2288f7=_0x35587b;if(_0x5e4524[_0x2288f7(0x111)][_0x2288f7(0x78)]===!![]){data_topup[_0x2288f7(0x111)][_0x2288f7(0xf7)]=_0x5e4524[_0x2288f7(0x111)][_0x2288f7(0x111)][_0x2288f7(0x8f)],fs['writeFileSync'](topupPath+sender[_0x2288f7(0x10b)]('@')[0x0]+'.json',JSON['stringify'](data_topup,null,0x3));var _0x29368b=setInterval(function(){const _0x3a93ea=_0x2288f7;axios({'method':'POST','url':_0x3a93ea(0xb1),'data':qs['stringify']({'key':setting[_0x3a93ea(0x100)],'action':'status','trxid':data_topup[_0x3a93ea(0x111)][_0x3a93ea(0xf7)]})})['then'](_0x4b08ca=>{const _0x214e96=_0x3a93ea;console[_0x214e96(0xb8)](_0x4b08ca[_0x214e96(0x111)]),console[_0x214e96(0xb8)](color(_0x214e96(0xe8),'green'),_0x214e96(0x10f)+sender);if(_0x4b08ca[_0x214e96(0x111)][_0x214e96(0x111)]['status']===_0x214e96(0x79)){reply(_0x214e96(0x7b)+data_topup['ID']+_0x214e96(0x97)+data_topup['data']['topup_game']+_0x214e96(0x8c)+data_topup['data']['game_id']+'\x20('+data_topup[_0x214e96(0x111)][_0x214e96(0xc4)]+_0x214e96(0x11f)),_saldo[_0x214e96(0xf3)](sender,Number(data_topup[_0x214e96(0x111)]['topup_harga']),db_saldo_user),fs['unlinkSync'](topupPath+sender[_0x214e96(0x10b)]('@')[0x0]+_0x214e96(0x91)),clearInterval(_0x29368b);return;}else{if(_0x4b08ca[_0x214e96(0x111)]['data'][_0x214e96(0xa4)]==='error'){reply(_0x214e96(0x10d)+_0x4b08ca['data'][_0x214e96(0x111)][_0x214e96(0x106)]),fs[_0x214e96(0xd4)](topupPath+sender[_0x214e96(0x10b)]('@')[0x0]+_0x214e96(0x91)),clearInterval(_0x29368b);return;}}})['catch'](_0x148a21=>{const _0x19201a=_0x3a93ea;reply(_0x19201a(0xe6)+data_topup[_0x19201a(0x111)]['topup_id']+'*,\x20Silahkan\x20pilih\x20service\x20lain\x20atau\x20coba\x20lagi\x20di\x20lain\x20waktu\x20??????'),fs[_0x19201a(0xd4)](topupPath+sender[_0x19201a(0x10b)]('@')[0x0]+_0x19201a(0x91)),clearInterval(_0x29368b);return;});},0xbb8);}else{reply('Mohon\x20Maaf,\x20Sedang\x20terjadi\x20kesalahan\x20untuk\x20service\x20*'+data_topup[_0x2288f7(0x111)]['topup_id']+_0x2288f7(0xb6)),fs[_0x2288f7(0xd4)](topupPath+sender[_0x2288f7(0x10b)]('@')[0x0]+'.json'),clearInterval(_0x29368b);return;}});}}}}else chats[_0x35587b(0x102)]()==='n'&&(reply('Oke\x20kak\x20Pesanan\x20dengan\x20ID\x20*'+data_topup['ID']+_0x35587b(0xba)),fs[_0x35587b(0xd4)](topupPath+sender[_0x35587b(0x10b)]('@')[0x0]+'.json'));}}}}}}if(isButton===_0x35587b(0xf8)){var top_path=topupPath+sender[_0x35587b(0x10b)]('@')[0x0]+_0x35587b(0x91);if(!fs['existsSync'](top_path))return reply(_0x35587b(0x123));reply(_0x35587b(0x114)),fs[_0x35587b(0xd4)](topupPath+sender[_0x35587b(0x10b)]('@')[0x0]+'.json');}

// Logs;
if (isGroup && isCmd) {
console.log(colors.green.bold("[Group]") + " " + colors.brightCyan(time,) + " " + colors.black.bgYellow(command) + " " + colors.green("from") + " " + colors.blue(groupName));
} else if (!isGroup && isCmd) {
console.log(colors.green.bold("[Private]") + " " + colors.brightCyan(time,) + " " + colors.black.bgYellow(command) + " " + colors.green("from") + " " + colors.blue(pushname));
}

// INI CASE NYA
switch(command) {
case 'ip':
case 'cekip':
if (!isOwner) return reply(mess.OnlyOwner)
axios({
method: 'POST',
url: 'https://www.atlantic-pedia.co.id/api/pulsa',
data: qs.stringify({
key: setting.apikey_antlatic,
action: "services"
})
}).then(res => {
var regExcomp = (a, b) => {
var aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
var bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));
return aPrice - bPrice
};
if (res.data.result == false) return reply(res.data.data)
reply('IP Sudah Tersambung Ke Server.')
})
break
case 'menu':{
let ini_timestamp = speed()
let ini_latensi = speed() - ini_timestamp
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

let teks_menu =`
*_Hi ${pushname} ${ucapanWaktu}_*

???????????? *BOT INFO* ???
??? ??? *Name : ${setting.botName}*
??? ??? *Owner : ${setting.ownerName}*
??? ??? *Creator : @${setting.contactOwner}*
??????????????????????????????????????????????????????
???????????? *SERVER INFO* ???
??? ??? *Library : Baileys MD*
??? ??? *Waktu : ${jam}*
??? ??? *Tanggal : ${tanggal}*
??? ??? *Speed : ${ini_latensi.toFixed(4)} _second_*
??? ??? *Pengguna : ${pendaftar.length}*
??????????????????????????????????????????????????????
???????????? *YOUR INFO* ???
??? ??? *Name : ${pushname}*
??? ??? *Api : @${sender.split('@')[0]}*
??? ??? *Saldo : Rp${toRupiah(_saldo.checkSaldonya(sender, db_saldo_user))}*
??? ??? *Status : ${isOwner? 'Owner':'User'}*
??? ??? *Chat  : ${isGroup? 'Group':'Private'}*
??????????????????????????????????????????????????????

 *??? RUNTIME SERVER ???*
 ${runtime(process.uptime())}
${readmore}
*MAIN MENU*
 ??? ${prefix}simi
 ??? ${prefix}chat
 ??? ${prefix}confes
 ??? ${prefix}menfes
 ??? ${prefix}report
 ??? ${prefix}speed
 ??? ${prefix}script
 ??? ${prefix}runtime
 ??? ${prefix}dashboard

*TOPUP GAME*
 ??? ${prefix}saldo
 ??? ${prefix}topup
 ??? ${prefix}deposit
 ??? ${prefix}listharga

*SOSMED SHOP*
 ??? ${prefix}order
 ??? ${prefix}like
 ??? ${prefix}view
 ??? ${prefix}followers
 ??? ${prefix}pricelist
 ??? ${prefix}cekstatus

*ANTLATIC PEDIA*
 ??? ${prefix}cekip
 ??? ${prefix}profil
 ??? ${prefix}server

*OWNER MENU*
 ??? ${prefix}bc
 ??? ${prefix}join
 ??? ${prefix}leave
 ??? ${prefix}block
 ??? ${prefix}unblock
 ??? ${prefix}setexif
 ??? ${prefix}sendsesi
 ??? ${prefix}setppbot
 ??? ${prefix}setbiobot
 ??? ${prefix}broadcast
 
*STORE MENU*
 ??? ${prefix}list
 ??? ${prefix}dellist
 ??? ${prefix}addlist
 ??? ${prefix}setlist

*STALKER MENU*
 ??? ${prefix}stalkff
 ??? ${prefix}stalkml
 ??? ${prefix}stalkaov
 ??? ${prefix}stalkcod
 ??? ${prefix}stalknpm
 ??? ${prefix}stalktiktok
 ??? ${prefix}stalkgithub
 ??? ${prefix}stalknimotv

*GROUP MENU*
 ??? ${prefix}add
 ??? ${prefix}kick
 ??? ${prefix}tagall
 ??? ${prefix}group
 ??? ${prefix}delete
 ??? ${prefix}revoke
 ??? ${prefix}antilink
 ??? ${prefix}welcome
 ??? ${prefix}hidetag
 ??? ${prefix}demote
 ??? ${prefix}setdesc
 ??? ${prefix}linkgrup
 ??? ${prefix}promote
 ??? ${prefix}setppgrup
 ??? ${prefix}setnamegc

*LESSON MENU*
 ??? ${prefix}addjudul
 ??? ${prefix}listtugas
 ??? ${prefix}deltugas
 ??? ${prefix}addtugas
 ??? ${prefix}resettugas

*ANONYMOUS CHAT*
 ??? ${prefix}start
 ??? ${prefix}search
 ??? ${prefix}skip
 ??? ${prefix}sendprofil
 ??? ${prefix}anonymous

*PROSES/DONE*
 ??? ${prefix}done
 ??? ${prefix}proses
 ??? ${prefix}setdone
 ??? ${prefix}delsetdone
 ??? ${prefix}changedone
 ??? ${prefix}setproses
 ??? ${prefix}delsetproses
 ??? ${prefix}changeproses

*TOOLS/CONVERT*
 ??? ${prefix}ttp
 ??? ${prefix}attp
 ??? ${prefix}tahta
 ??? ${prefix}nulis
 ??? ${prefix}ssweb
 ??? ${prefix}toimg
 ??? ${prefix}obfus
 ??? ${prefix}sticker
 ??? ${prefix}translate
 ??? ${prefix}emojimix

*KALKULATOR*
 ??? ${prefix}kali
 ??? ${prefix}bagi
 ??? ${prefix}kurang
 ??? ${prefix}tambah

*DOWNLOADER*
 ??? ${prefix}play
 ??? ${prefix}ytmp3
 ??? ${prefix}ytmp4
 ??? ${prefix}tiktok
 ??? ${prefix}tiktokmp3
 ??? ${prefix}mediafire

*_Note :_*
_Jika ingin melakukan topup_
_Silahkan deposit terlebih dahulu_

*_?? Simple Bot Whatsapp_*`
let button_menu = [
{ buttonId: `${prefix}owner`, buttonText: { displayText: 'OWNER' }, type: 1 },
{ buttonId: `${prefix}deposit`, buttonText: { displayText: 'DEPOSIT' }, type: 1 },
{ buttonId: `${prefix}topup`, buttonText: { displayText: 'TOPUP' }, type: 1 }
]
const but_menu = {
    image: fs.readFileSync(setting.pathThumb),
    caption: teks_menu,
    footer: '_NOt_Reii ?? 2022_',
    buttons: button_menu,
    headerType: 4
}
conn.sendMessage(from, but_menu, { quoted: fkontak })
}
addCmd(command, 1, db_dashboard)
break
case 'allmenu':
reply(allmenu(prefix))
break
case 'grupwa':
case 'groupwa':
case 'gc_wa':{

reply(grupwa(prefix))
}
addCmd(command, 1, db_dashboard)

break
case 'donasi':
let teks_donasi = `${textdonasi(prefix,pushname)}`
conn.sendMessage(from, { image: fs.readFileSync(setting.pathQris), caption: teks_donasi}, {quoted:msg})
break
case 'listgc': {

let anu = await store.chats.all().filter(v => v.id.endsWith('@g.us')).map(v => v.id)
let teks = ` ??? List Group Chat ???\n\nTotal List Group Bot : ${anu.length}`
for (let i of anu) {
 let metadata = await conn.groupMetadata(i)
 if (metadata.owner === "undefined") {
var loldd = false
 } else {
var loldd = metadata.owner
 }
 teks += `\n\nName : ${metadata.subject ? metadata.subject : "undefined"}\nOwner : ${loldd ? '@' + loldd.split("@")[0] : "undefined"}\nID : ${metadata.id ? metadata.id : "undefined"}\nDibuat : ${metadata.creation ? moment(metadata.creation * 1000).tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss') : "undefined"}\nMember : ${metadata.participants.length ? metadata.participants.length : "undefined"}`
}
reply(teks)
}
addCmd(command, 1, db_dashboard)

break
case 'listpc': {

let anu = await store.chats.all().filter(v => v.id.endsWith('.net')).map(v => v)
let teks = ` ??? List Personal Chat ???\n\nTotal Chat Pribadi : ${anu.length}`
for (let i of anu) {
 teks += `\n\nProfile : @${i.id.split('@')[0]}\nChat : ${i.unreadCount}\nLastchat : ${moment(i.conversationTimestamp * 1000).tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm:ss")}`
}
reply(teks)
}
addCmd(command, 1, db_dashboard)

break
case 'sc':case 'script':
reply('*MAU BUY SCRIPT BOT INI?*\n*_Chat Wa_*\nWa.me/6283160327945\n*Harga Rp70.000*\n\n_Admin Juga Ready Jadibot Tinggal Scan Harga Rp35.000 Permanen_')
addCmd(command, 1, db_dashboard)
break
case 'source_code':let text_source =`?????????[ *SOURCE-CODE* ]?????????
??? _Pengembang : Not_Reii_
??? _Whatsapp : 6287778405247_
??? _Tiktok : always_ntreii_
??? _Script Bot : -_
?????????????????????????????????????????????????????????`
reply(text_source)
addCmd(command, 1, db_dashboard)

break
case 'hit_global':{

var res = await fetchJson(`https://api.countapi.xyz/hit/Lexxy/visits`)
reply(`*HIT GLOBAL ${res.value}*`)
}
addCmd(command, 1, db_dashboard)

break
case 'rules':

let text_rules =`???????????? *RULES-BOT* ????????????

1. Jangan Spam/Mengeksploitasi Bot
Sanksi: *??? WARN/SOFT BLOCK*

2. Dilarang Tlpn/Vc Bot
Sanksi: *??? SOFT BLOCK*

3. Dilarang Culik Bot Ke Grup Kecuali Atas Izin Owner.
Sanksi: *PERMANENT BLOCK*

Jika sudah dipahami rules-nya, silakan ketik *#menu* untuk memulai!
Segala kebijakan dan ketentuan *${botName}* di pegang oleh owner dan segala perubahan kebijakan, sewaktu waktu owner berhak mencabut, atau memblokir user(*???*)

?? Created by ${ownerName}`
reply(text_rules)
addCmd(command, 1, db_dashboard)

break
case 'owner': case 'dev':

sendContact(from, setting.contactOwner, ownerName, msg)
addCmd(command, 1, db_dashboard)

break
case 'tes':{

let ini_tes_text = `*STATUS : BOT ONLINE*\n_${runtime(process.uptime())}_`
reply(ini_tes_text)
}
addCmd(command, 1, db_dashboard)

break
case 'nulis':

if (!q) return reply(`Yang Mau Di Tulis Apaan?\n\nContoh :\n${prefix+command} Hello`)
reply(mess.wait)
var tulisan = q
var splitText = tulisan.replace(/(\S+\s*){1,9}/g, '$&\n')
var fixHeight = splitText.split('\n').slice(0, 31).join('\n')
spawn('convert', ['./storage/nulis/buku/buku_sebelum.jpg','-font','./storage/nulis/font/Indie-Flower.ttf','-size','960x1280','-pointsize','23','-interline-spacing','2','-annotate','+128+129',fixHeight,'./storage/nulis/buku/buku_sesudah.jpg'])
.on('error', () => reply('error'))
.on('exit', () => {
conn.sendMessage(from, { image: fs.readFileSync('./storage/nulis/buku/buku_sesudah.jpg')}, {quoted: msg, caption: `Jangan Malas Kak...`})
})
addCmd(command, 1, db_dashboard)

break
case 'simi':

if (!q) return reply(`*Contoh* : ${prefix+command} halo`)
fetchJson(`https://api.simsimi.net/v2/?text=${q}&lc=id`)
.then(balas_simi => {reply(balas_simi.success)})
addCmd(command, 1, db_dashboard)

break
case 'chat':

if (!q) return reply(`_*Contoh*_\n${prefix+command} 628xxx|hai`)
let nomor_chat = q.split('|')[0] ? q.split('|')[0] : q
let pesan_chat = q.split('|')[1] ? q.split('|')[1] : ''
if (!nomor_chat) return reply(`_*Contoh*_\n${prefix+command} 628xxx|hai`)
if (pesan_chat.length <1) return reply(`Harus di isi semua!!\n_*Contoh*_\n${prefix+command} 628xxx|hai`)
let text_chat =`*| CHAT FITUR |*\n`
text_chat +=`Dari : ${sender.split('@')[0]}\n`
text_chat +=`Pesan : ${pesan_chat}`
conn.sendMessage(`${nomor_chat}@s.whatsapp.net`, {text: text_chat}, {quoted:fkontak})

break
case 'report':
if (!q) return reply(`_*Contoh*_\n${prefix+command} bang fitur antilink error`)
let pesan_report = q.split(' ')[0] ? q.split(' ')[0] : ''
if (pesan_report.length <1) return reply(`_*Contoh*_\n${prefix+command} bang fitur antilink error`)
let text_report =`*| REPORT FITUR |*\n`
text_report +=`Dari : ${sender.split('@')[0]}\n`
text_report +=`Pesan : ${pesan_report}`
conn.sendMessage(`6283160327945@s.whatsapp.net`, {text: text_report}, {quoted:fkontak})
break
case 'request':
if (!q) return reply(`_*Contoh*_\n${prefix+command} bang tambahin fitur sewabot`)
let pesan_request = q.split(' ')[0] ? q.split(' ')[0] : ''
if (pesan_request.length <1) return reply(`_*Contoh*_\n${prefix+command} bang tambahin fitur sewabot`)
let text_request =`*| REQUEST FITUR |*\n`
text_request +=`Dari : ${sender.split('@')[0]}\n`
text_request +=`Pesan : ${pesan_request}`
conn.sendMessage(`6283160327945@s.whatsapp.net`, {text: text_request}, {quoted:fkontak})
break
case 'tes':
case 'runtime':

let respon_nya = `Runtime : ${runtime(process.uptime())}`
reply(respon_nya)
addCmd(command, 1, db_dashboard)

break
case 'ping':

let ini_timestamp = speed()
let ini_latensi = speed() - ini_timestamp
let text_ping = `Kecepatan Respon ${ini_latensi.toFixed(4)} _Second_`
reply(text_ping)
addCmd(command, 1, db_dashboard)

break
case 'obfus':
case 'obfuscator':

if (!q) return reply(`Kode Js Nya?`)
let ini_kode_jsnya = q
let result_obfus = java_script.obfuscate(`${ini_kode_jsnya}`,
{compact: false, controlFlowFlattening: true, controlFlowFlatteningThreshold: 1, numbersToExpressions: true, simplify: true, stringArrayShuffle: true, splitStrings: true, stringArrayThreshold: 1 });
reply(result_obfus.getObfuscatedCode())
addCmd(command, 1, db_dashboard)

break
case 'tambah':
case 'tambah_kan':

if (!q) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 2 2`)
var nilai_one = Number(q.split(" ")[0])
var nilai_two = Number(q.split(" ")[1])
reply(`${nilai_one + nilai_two}`)
addCmd(command, 1, db_dashboard)

break
case 'kurang':
case 'kurang_kan':

if (!q) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 2 2`)
var nilai_one = Number(q.split(" ")[0])
var nilai_two = Number(q.split(" ")[1])
reply(`${nilai_one - nilai_two}`)
addCmd(command, 1, db_dashboard)

break
case 'kali':
case 'kali_kan':

if (!q) return reply(`Gunakan dengan cara ${prefix+command} *angka* tanda *angka*\n\n_Contoh_\n\n${prefix+command} 2 2`)
var nilai_one = Number(q.split(" ")[0])
var nilai_two = Number(q.split(" ")[1])
reply(`${nilai_one * nilai_two}`)
addCmd(command, 1, db_dashboard)

break
case 'bagi':
case 'bagi_kan':

if (!q) return reply(`Gunakan dengan cara ${prefix+command} *angka* *angka*\n\n_Contoh_\n\n${prefix+command} 2 2`)
var nilai_one = Number(q.split(" ")[0])
var nilai_two = Number(q.split(" ")[1])
reply(`${nilai_one / nilai_two}`)
addCmd(command, 1, db_dashboard)

break
case 'cuaca':

if (!q) return reply(`_Contoh_\n${prefix+command} palembang`)
let api_cuaca = '18d044eb8e1c06eaf7c5a27bb138694c'
let unit_cuaca = 'metric'
let nama_kota = q
let cuaca = await fetchJson(`http://api.openweathermap.org/data/2.5/weather?q=${nama_kota}&units=${unit_cuaca}&appid=${api_cuaca}`)
let text_cuaca =`*INFO CUACA*
Nama: ${cuaca.name + "," + cuaca.sys.country}
Longitude: ${cuaca.coord.lon}
Latitude: ${cuaca.coord.lat}
Suhu: ${cuaca.main.temp + " C"}
Angin: ${cuaca.wind.speed + " m/s"}
Kelembaban: ${cuaca.main.humidity + "%"}
Cuaca: ${cuaca.weather[0].main}
Keterangan: ${cuaca.weather[0].description}
Udara: ${cuaca.main.pressure + " HPa"}`
reply(text_cuaca)
addCmd(command, 1, db_dashboard)

break
case 'ttp':
if (args.length < 1) return reply(`Kirim perintah ${prefix}ttp teks`)
if (q.length > 75) return reply(`Teksnya kepanjangan`)
getBuffer(`https://api.xteam.xyz/ttp?file&text=${encodeURIComponent(q)}`)
.then(res => {
if (res == undefined) return reply(mess.error.api)
conn.sendImageAsSticker(from, res, msg, { packname, author })
}).catch(() => reply(mess.error.api))
break
case 'attp':{
if (args.length < 1) return reply(`Kirim perintah ${prefix}attp teks`)
if (q.length > 75) return reply(`Teksnya kepanjangan`)
let anu =`https://zenzapis.xyz/creator/attp?text=${q}&apikey=${setting.api_zenz}`
conn.sendMessage(from, { sticker: {url: anu} , quoted: msg})
}
break
case 'tahta':{
if (args.length < 1) return reply(`Kirim perintah ${prefix+command} nama`)
if (q.length > 75) return reply(`Teksnya kepanjangan`)
let anu =`https://zenzapis.xyz/creator/hartatahta?text=p&apikey=${setting.api_zenz}`
conn.sendMessage(from, { image: {url: anu}, caption: 'Done!'}, {quoted:msg})
}
break
case 'ssweb':{
if (args.length < 1) return reply(`_Contoh_\n${prefix+command} https://google.com`)
let anu = await fetchJson(`https://zenzapis.xyz/convert/ssweb?url=${q}&query=mobile&apikey=lexxybotygy`)
if (anu.status == false) return reply('link url tidak valid')
let text_ssweb =`*from :* ${anu.result.from}`
conn.sendMessage(from, { image: { url: anu.result.url }, caption: text_ssweb }, { quoted: msg })
}
break
case 'emojimix': {
if (!q) return reply(`Example :\n${prefix+command} ????+????`)
var mytext = body.slice(10)
let [emoji1, emoji2] = mytext.split`+`
let anu = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
for (let res of anu.results) {
conn.sendImageAsSticker(from, res.url, msg, { packname: packname, author: author, categories: res.tags })
}
}
break
case 'tomp3': case 'toaudio':
if (isVideo || isQuotedVideo) {
let media = await conn.downloadAndSaveMediaMessage(msg, 'video', `./sticker/${Date.now()}.mp4`)
reply(mess.wait)
let ran = './sticker/'+getRandom('.mp3')
exec(`ffmpeg -i ${media} ${ran}`, async (err) => {
fs.unlinkSync(media)
if (err) { fs.unlinkSync(ran); return reply('Gagal :V') }
conn.sendMessage(from, { audio: fs.readFileSync(ran),mimetype: 'audio/mp4', fileName: `${sender.split("@")[0]}ToMp3`, ptt: args[1] == '--ptt' ? true : false }, { quoted: msg })
fs.unlinkSync(ran)
})
} else {
reply(`Kirim/reply video dengan caption ${command} atau ${command} --ptt`)
}
break
case 'toimg':
if (!isQuotedSticker) return reply(`Reply stikernya!`)
var stream = await downloadContentFromMessage(msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
var buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
var rand1 = 'temp/'+getRandom('.webp')
var rand2 = 'temp/'+getRandom('.png')
fs.writeFileSync(`./${rand1}`, buffer)
if (isQuotedSticker && msg.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated !== true) {
reply(mess.wait)
exec(`ffmpeg -i ./${rand1} ./${rand2}`, (err) => {
fs.unlinkSync(`./${rand1}`)
if (err) return reply(mess.error.api)
conn.sendMessage(from, {caption: `*Sticker Convert To Image!*`, image: fs.readFileSync(`./${rand2}`) }, { quoted: fkontak })
fs.unlinkSync(`./${rand2}`)
})
} else {
reply(mess.wait)
webp2mp4File(`./${rand1}`).then(async(data) => {
fs.unlinkSync(`./${rand1}`)
conn.sendMessage(from, {caption: `*Sticker Convert To Video!*`, video: await getBuffer(data.data) }, { quoted: fkontak })
})
}
addCmd(command, 1, db_dashboard)

break
case 'sticker': case 's':
if (isImage || isQuotedImage) {
var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
var buffer = Buffer.from([])
for await(const chunk of stream) { buffer = Buffer.concat([buffer, chunk]) }
reply(mess.wait)
var rand1 = 'temp/sticker/'+getRandom('.jpg')
var rand2 = 'temp/sticker/'+getRandom('.webp')
fs.writeFileSync(`./${rand1}`, buffer)
ffmpeg(`./${rand1}`)
.on("error", console.error)
.on("end", () => {
exec(`webpmux -set exif ./temp/sticker/data.exif ./${rand2} -o ./${rand2}`, async (error) => {
conn.sendMessage(from, { sticker: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
fs.unlinkSync(`./${rand1}`)
fs.unlinkSync(`./${rand2}`)})}).addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"]).toFormat('webp').save(`${rand2}`)
} else if (isVideo || isQuotedVideo) {
var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
var buffer = Buffer.from([])
for await(const chunk of stream) { buffer = Buffer.concat([buffer, chunk])}
var rand1 = 'temp/sticker/'+getRandom('.mp4')
var rand2 = 'temp/sticker/'+getRandom('.webp')
fs.writeFileSync(`./${rand1}`, buffer)
ffmpeg(`./${rand1}`)
.on("error", console.error)
.on("end", () => {
exec(`webpmux -set exif ./temp/sticker/data.exif ./${rand2} -o ./${rand2}`, async (error) => {
conn.sendMessage(from, { sticker: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
fs.unlinkSync(`./${rand1}`)
fs.unlinkSync(`./${rand2}`)})}).addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"]).toFormat('webp').save(`${rand2}`)
} else {
reply(`Kirim gambar/vidio dengan caption ${prefix+command} atau balas gambar/vidio yang sudah dikirim\nNote : Maximal vidio 10 detik!`)
}
addCmd(command, 1, db_dashboard)

break
case 'broadcast': case 'bc':
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`Kirim perintah ${prefix+command} teks`)
let data_orang = await store.chats.all()
let data_teks = `${q}\n?? broadcast ${botName}`
for (let i of data_orang) { 
conn.sendMessage(i.id, { text: data_teks })
await sleep(1000)
}
reply(`Sukses mengirim pesan siaran kepada ${data.length} chat`)
addCmd(command, 1, db_dashboard)

break
case 'unblock':{
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`Contoh :\n${prefix+command} 628xxxx`)
let nomorNya = q
await conn.updateBlockStatus(`${nomorNya}@s.whatsapp.net`, "unblock") // Unblock user
reply('Sukses Unblock Nomor')
}
addCmd(command, 1, db_dashboard)

break
case 'block':{
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`Contoh :\n${prefix+command} 628xxxx`)
let nomorNya = q
await conn.updateBlockStatus(`${nomorNya}@s.whatsapp.net`, "block") // Block user
reply('Sukses Block Nomor')
}
addCmd(command, 1, db_dashboard)

break
case 'creategc':
if (!isOwner) return reply(mess.OnlyOwner)
if (!q) return reply(`*Example :*\n${prefix+command} namagroup`)
var nama_nya = q
let cret = await conn.groupCreate(nama_nya, [])
let response = await conn.groupInviteCode(cret.id)
var teks_creategc = `??? *Create Group* ???

_*??? Name : ${cret.subject}*_
_*??? Owner : @${cret.owner.split("@")[0]}*_
_*??? Time : ${moment(cret.creation * 1000).tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm:ss")} WIB*_

*Link Create Group* :
https://chat.whatsapp.com/${response}
`
reply(teks_creategc)
addCmd(command, 1, db_dashboard)

break
case 'linkgrup': case 'linkgc':

if (!isGroup) return reply(mess.OnlyGrup)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
var url = await conn.groupInviteCode(from).catch(() => reply(mess.error.api))
url = 'https://chat.whatsapp.com/'+url
reply(url)
addCmd(command, 1, db_dashboard)

break
case 'setbiobot':
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
let ini_biobot = q.split(' ')[0] ? q.split(' ')[0] : ''
if (ini_biobot.length <1) return reply(`_Contoh_\n${prefix+command} text`)
conn.setStatus(ini_biobot)
reply('*Sukses mengganti bio bot ???*')
addCmd(command, 1, db_dashboard)

break
case 'setpp': case 'setppbot':
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (isImage || isQuotedImage) {
var media = await downloadAndSaveMediaMessage('image', 'ppbot.jpeg')
if (args[1] == '\'panjang\'') {
var { img } = await generateProfilePicture(media)
await conn.query({ tag: 'iq', attrs: { to: botNumber, type:'set', xmlns: 'w:profile:picture' },
content: [{ tag: 'picture', attrs: { type: 'image' }, content: img }] })
fs.unlinkSync(media)
reply(`Sukses`)
} else {
var data = await conn.updateProfilePicture(botNumber, { url: media })
fs.unlinkSync(media)
reply(`Sukses`)
}
} else {
reply(`Kirim/balas gambar dengan caption ${prefix+command} untuk mengubah foto profil bot`)
}
addCmd(command, 1, db_dashboard)

break
case 'setnamegc':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *text*\n\n_Contoh_\n\n${prefix+command} Support ${ownerName}`)
await conn.groupUpdateSubject(from, q)
.then( res => {
reply(`Sukses`)
}).catch(() => reply(mess.error.api))
addCmd(command, 1, db_dashboard)

break
case 'setdesc':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *text*\n\n_Contoh_\n\n${prefix+command} New Description by ${ownerName}`)
await conn.groupUpdateDescription(from, q)
.then( res => {
reply(`Sukses`)
}).catch(() => reply(mess.error.api))
addCmd(command, 1, db_dashboard)

break
case 'setppgrup': case 'setppgc':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (isImage || isQuotedImage) {
var media = await downloadAndSaveMediaMessage('image', `ppgc${from}.jpeg`)
if (args[1] == '\'panjang\'') {
var { img } = await generateProfilePicture(media)
await conn.query({ tag: 'iq', attrs: { to: from, type:'set', xmlns: 'w:profile:picture' },
content: [{ tag: 'picture', attrs: { type: 'image' }, content: img }] })
fs.unlinkSync(media)
reply(`Sukses`)
} else {
var data = await conn.updateProfilePicture(from, { url: media })
fs.unlinkSync(media)
reply(`Sukses`)
}
} else {
reply(`Kirim/balas gambar dengan caption ${prefix+command} untuk mengubah foto profil bot`)
}
addCmd(command, 1, db_dashboard)

break
case 'open':
case 'buka_grup':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
conn.groupSettingUpdate(from, 'not_announcement')
reply(`Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini`)
addCmd(command, 1, db_dashboard)

break
case 'close':
case 'tutup_grup':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
conn.groupSettingUpdate(from, 'announcement')
reply(`Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`)
addCmd(command, 1, db_dashboard)

break
case 'welcome':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!args[0]) return conn.sendMessage(from, { text: "[ *FITUR WELCOME* ]\n\nPilih di bawah ini", footer: 'klik button..', buttons: [{buttonId: `${prefix + command} on`, buttonText: {displayText: 'ON'}, type: 1}, {buttonId: `${prefix + command} off`, buttonText: {displayText: 'OFF'}, type: 1}],headerType: 1 })
if (args[0] == "on") {
if (isWelcome) return reply(`Welcome sudah aktif`)
welcome.push(from)
fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome, null, 2))
reply(`Sukses mengaktifkan welcome di grup ini`)
}
if (args[0] == "off") {
if (!isWelcome) return reply(`Welcome sudah dimatikan`)
var posi = welcome.indexOf(from)
welcome.splice(posi, 1)
fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome, null, 2))
reply(`Sukses menonaktifkan welcome di grup ini`)
}
addCmd(command, 1, db_dashboard)

break
case 'left':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!args[0]) return conn.sendMessage(from, { text: "[ *FITUR LEFT* ]\n\nPilih di bawah ini", footer: 'klik button..', buttons: [{buttonId: `${prefix + command} on`, buttonText: {displayText: 'ON'}, type: 1}, {buttonId: `${prefix + command} off`, buttonText: {displayText: 'OFF'}, type: 1}],headerType: 1 })
if (args[0] == "on") {
if (isLeft) return reply(`Left sudah aktif`)
left.push(from)
fs.writeFileSync('./database/left.json', JSON.stringify(welcome, null, 2))
reply(`Sukses mengaktifkan left di grup ini`)
}
if (args[0] == "off") {
if (!isLeft) return reply(`Left sudah dimatikan`)
var posi = welcome.indexOf(from)
left.splice(posi, 1)
fs.writeFileSync('./database/left.json', JSON.stringify(welcome, null, 2))
reply(`Sukses menonaktifkan left di grup ini`)
}
addCmd(command, 1, db_dashboard)

break
case 'grup': case 'group':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (isAntiLink) return reply(`antilink sudah aktif`)
if (!args[0]) return conn.sendMessage(from, { text: "[ *GROUP SETTING* ]\n\npilih buka atau tutup", footer: `Group : ${groupName}`, buttons: [{buttonId: `${prefix+command} y`, buttonText: {displayText: 'Open ???'}, type: 1}, {buttonId: `${prefix+command} n`, buttonText: {displayText: 'Close ???'}, type: 1}],headerType: 1 })
if (args[0] == "y") {
conn.groupSettingUpdate(from, 'not_announcement')
reply(`Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini`)
}
if (args[0] == "n") {
conn.groupSettingUpdate(from, 'announcement')
reply(`Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`)
}
addCmd(command, 1, db_dashboard)

break
case 'delete':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isQuotedMsg) return reply(`Balas chat dari bot yang ingin dihapus`)
if (!quotedMsg.fromMe) return reply(`Hanya bisa menghapus chat dari bot`)
conn.sendMessage(from, { delete: { fromMe: true, id: quotedMsg.id, remoteJid: from }})
addCmd(command, 1, db_dashboard)

break
case 'add':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (groupMembers.length == 257) return reply(`Anda tidak dapat menambah peserta, karena Grup sudah penuh!`)
var mems = []
groupMembers.map( i => mems.push(i.id) )
var number;
if (args.length > 1) {
number = q.replace(/[^0-9]/gi, '')+"@s.whatsapp.net"
var cek = await conn.onWhatsApp(number)
if (cek.length == 0) return reply(`Masukkan nomer yang valid dan terdaftar di WhatsApp`)
if (mems.includes(number)) return reply(`Nomer tersebut sudah berada didalam grup!`)
conn.groupParticipantsUpdate(from, [number], "add")
.then( res => reply(jsonformat(res)))
.catch((err) => reply(jsonformat(err)))
} else if (isQuotedMsg) {
number = quotedMsg.sender
var cek = await conn.onWhatsApp(number)
if (cek.length == 0) return reply(`Peserta tersebut sudah tidak terdaftar di WhatsApp`)
if (mems.includes(number)) return reply(`Nomer tersebut sudah berada didalam grup!`)
conn.groupParticipantsUpdate(from, [number], "add")
.then( res => reply(jsonformat(res)))
.catch((err) => reply(jsonformat(err)))
} else {
reply(`Kirim perintah ${prefix+command} nomer atau balas pesan orang yang ingin dimasukkan`)
}
addCmd(command, 1, db_dashboard)

break
case 'kick':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
var number;
if (mentionUser.length !== 0) {
number = mentionUser[0]
conn.groupParticipantsUpdate(from, [number], "remove")
.then( res => reply(jsonformat(res)))
.catch((err) => reply(jsonformat(err)))
} else if (isQuotedMsg) {
number = quotedMsg.sender
conn.groupParticipantsUpdate(from, [number], "remove")
.then( res => reply(jsonformat(res)))
.catch((err) => reply(jsonformat(err)))
} else {
reply(`Tag atau balas pesan orang yang ingin dikeluarkan dari grup`)
}
addCmd(command, 1, db_dashboard)

break
case 'promote':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (mentionUser.length !== 0) {
conn.groupParticipantsUpdate(from, [mentionUser[0]], "promote")
.then( res => { mentions(`Sukses menjadikan @${mentionUser[0].split("@")[0]} sebagai admin`, [mentionUser[0]], true) })
.catch(() => reply(mess.error.api))
} else if (isQuotedMsg) {
conn.groupParticipantsUpdate(from, [quotedMsg.sender], "promote")
.then( res => { mentions(`Sukses menjadikan @${quotedMsg.sender.split("@")[0]} sebagai admin`, [quotedMsg.sender], true) })
.catch(() => reply(mess.error.api))
} else {
reply(`Tag atau balas pesan member yang ingin dijadikan admin`)
}
addCmd(command, 1, db_dashboard)

break
case 'demote':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (mentionUser.length !== 0) {
conn.groupParticipantsUpdate(from, [mentionUser[0]], "demote")
.then( res => { mentions(`Sukses menjadikan @${mentionUser[0].split("@")[0]} sebagai member biasa`, [mentionUser[0]], true) })
.catch(() => reply(mess.error.api))
} else if (isQuotedMsg) {
conn.groupParticipantsUpdate(from, [quotedMsg.sender], "demote")
.then( res => { mentions(`Sukses menjadikan @${quotedMsg.sender.split("@")[0]} sebagai member biasa`, [quotedMsg.sender], true) })
.catch(() => reply(mess.error.api))
} else {
reply(`Tag atau balas pesan admin yang ingin dijadikan member biasa`)
}
addCmd(command, 1, db_dashboard)

break
case 'leave':
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!isGroup) return reply(mess.OnlyGrup)
conn.groupLeave(from)
reply('bye')
addCmd(command, 1, db_dashboard)

break
case 'revoke':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
await conn.groupRevokeInvite(from)
.then( res => {
reply(`Sukses menyetel tautan undangan grup ini`)
}).catch(() => reply(mess.error.api))
addCmd(command, 1, db_dashboard)

break
case 'tagall':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!q) return reply(`Teks?`)
let teks_tagall = `???????????? *???? Tag All* ????????????\n\n${q ? q : ''}\n`
for (let mem of participants) {
teks_tagall += `??? @${mem.id.split('@')[0]}\n`
}
conn.sendMessage(from, { text: teks_tagall, mentions: participants.map(a => a.id) }, { quoted: msg })
addCmd(command, 1, db_dashboard)

break
case 'hidetag':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
let mem = [];
groupMembers.map( i => mem.push(i.id) )
conn.sendMessage(from, { text: q ? q : '', mentions: mem })
addCmd(command, 1, db_dashboard)

break
case 'mysesi':case 'sendsesi':case 'session':
if (!isOwner) return reply(mess.OnlyOwner)
var my_session = await fs.readFileSync(`./${setting.sessionName}.json`)
conn.sendMessage(from, { document: my_session, mimetype: 'document/application', fileName: 'session.json'}, {quoted: msg } )
reply(`*Note :*\n_Session Bot Bersifat Untuk Pribadi Dari Owner Maupun Bot, Tidak Untuk User Bot Ataupun Pengguna Bot._`)
reply(`_Sedang Mengirim Document_\n_Nama Session : ${setting.sessionName}.json_\n_Mohon Tunggu Sebentar..._`)
addCmd(command, 1, db_dashboard)

break
case 'antilink':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isBotGroupAdmins) return reply(mess.BotAdmin)
if (isAntiLink) return reply(`antilink sudah aktif`)
if (!args[0]) return conn.sendMessage(from, { text: "[ *ANTILINK* ]\n\npilih on atau off", footer: 'setting antilink.', buttons: [{buttonId: `${prefix+command} on`, buttonText: {displayText: 'on'}, type: 1}, {buttonId: `${prefix+command} off`, buttonText: {displayText: 'off'}, type: 1}],headerType: 1 })
if (args[0] == "on") {
if (isAntiLink) return reply(`antilink sudah aktif`)
antilink.push(from)
fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
reply('Successfull Activate Antilink In This Group')}
if (args[0] == "off") {
if (!isAntiLink) return reply(`antilink telah mati`)
let anu = antilink.indexOf(from)
antilink.splice(anu, 1)
fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
reply('Successfull Disabling Antilink In This Group')
}
addCmd(command, 1, db_dashboard)

break
case 'list':
if (!isGroup) return reply(mess.OnlyGrup)
if (db_respon_list.length === 0) return reply(`Belum ada list message di database`)
if (!isAlreadyResponListGroup(from, db_respon_list)) return reply(`Belum ada list message yang terdaftar di group ini`)
var arr_rows = [];
for (let x of db_respon_list) {
if (x.id === from) {
arr_rows.push({
title: x.key,
rowId: x.key
})
}
}
var listMsg = {
text: `Hi @${sender.split("@")[0]}`,
buttonText: 'Click Here!',
footer: `*_itemList ${groupName}_*`,
mentions: [sender],
sections: [{
title: groupName, rows: arr_rows
}]
}
conn.sendMessage(from, listMsg, {quoted: msg})
addCmd(command, 1, db_dashboard)

break
case 'addlist':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
var args1 = q.split("@")[0]
var args2 = q.split("@")[1]
if (!q.includes("@")) return reply(`Gunakan dengan cara ${prefix+command} *key@response*\n\n_Contoh_\n\n${prefix+command} tes@apa`)
if (isAlreadyResponList(from, args1, db_respon_list)) return reply(`List respon dengan key : *${args1}* sudah ada di group ini.`)
if (isImage || isQuotedImage) {
let media = await downloadAndSaveMediaMessage('image', `./temp/${sender}`)
const fd = new FormData();
fd.append('file', fs.readFileSync(media), '.tmp', '.jpg')
fetch('https://telegra.ph/upload', {
method: 'POST',
body: fd
}).then(res => res.json())
.then((json) => {
addResponList(from, args1, args2, true, `https://telegra.ph${json[0].src}`, db_respon_list)
reply(`Berhasil menambah List menu *${args1}*`)
if (fs.existsSync(media)) fs.unlinkSync(media)
})
} else {
addResponList(from, args1, args2, false, '-', db_respon_list)
reply(`Berhasil menambah List menu : *${args1}*`)
}
addCmd(command, 1, db_dashboard)

break
case 'setlist':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
var args1 = q.split("@")[0]
var args2 = q.split("@")[1]
if (!q.includes("@")) return reply(`Gunakan dengan cara ${prefix+command} *key@response*\n\n_Contoh_\n\n${prefix+command} tes@apa`)
if (isAlreadyResponList(from, args1, db_respon_list)) return reply(`List respon dengan key : *${args1}* sudah ada di group ini.`)
if (isImage || isQuotedImage) {
let media = await downloadAndSaveMediaMessage('image', `./temp/${sender}`)
const fd = new FormData();
fd.append('file', fs.readFileSync(media), '.tmp', '.jpg')
fetch('https://telegra.ph/upload', {
method: 'POST',
body: fd
}).then(res => res.json())
.then((json) => {
updateResponList(from, args1, args2, true, `https://telegra.ph${json[0].src}`, db_respon_list)
reply(`Berhasil menambah List menu *${args1}*`)
if (fs.existsSync(media)) fs.unlinkSync(media)
})
} else {
updateResponList(from, args1, args2, false, '-', db_respon_list)
reply(`Berhasil menambah List menu : *${args1}*`)
}
addCmd(command, 1, db_dashboard)

break
case 'dellist':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (db_respon_list.length === 0) return reply(`Belum ada list message di database`)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *key*\n\n_Contoh_\n\n${prefix+command} hello`)
if (!isAlreadyResponList(from, q, db_respon_list)) return reply(`List respon dengan key *${q}* tidak ada di database!`)
delResponList(from, q, db_respon_list)
reply(`Sukses delete list message dengan key *${q}*`)
addCmd(command, 1, db_dashboard)

break
case 'p': case 'proses':
if (!isGroup) return ('Hanya Dapat Digunakan Gi Group')
if (!isOwner && !isGroupAdmins) return ('Hanya Bisa Digunakan Oleh Admin')
if (!isQuotedMsg) return ('Reply Pesanannya!')
let proses = `??? *TRANSAKSI PENDING* ???\n\n\`\`\`???? TANGGAL : ${tanggal}\n??? JAM : ${jam}\n??? STATUS: Pending\`\`\`\n\n???? Catatan :\n${quotedMsg.chats}\n\nPesanan @${quotedMsg.sender.split("@")[0]} sedang di proses!`
const getTextP = getTextSetProses(from, set_proses);
if (getTextP !== undefined) {
mentions(getTextP.replace('pesan', quotedMsg.chats).replace('nama', quotedMsg.sender.split("@")[0]).replace('jam', jam).replace('tanggal', tanggal), [quotedMsg.sender], true)
} else {
mentions(proses, [quotedMsg.sender], true)
}
addCmd(command, 1, db_dashboard)

break
case 'd': case 'done':
if (!isGroup) return ('Hanya Dapat Digunakan Gi Group')
if (!isOwner && !isGroupAdmins) return ('Hanya Bisa Digunakan Oleh Admin')
if (!isQuotedMsg) return ('Reply Pesanannya!')
let sukses = `??? *TRANSAKSI BERHASIL* ???\n\n\`\`\`???? TANGGAL : ${tanggal}\n??? JAM : ${jam}\n??? STATUS: Berhasil\`\`\`\n\nTerimakasih @${quotedMsg.sender.split("@")[0]} Next Order ya????`
const getTextD = getTextSetDone(from, set_done);
if (getTextD !== undefined) {
mentions(getTextD.replace('pesan', quotedMsg.chats).replace('nama', quotedMsg.sender.split("@")[0]).replace('jam', jam).replace('tanggal', tanggal), [quotedMsg.sender], true);
} else {
mentions(sukses, [quotedMsg.sender], true)
}
addCmd(command, 1, db_dashboard)

break
case 'setproses': case 'setp':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *teks_p*\n\n_Contoh_\n\n${prefix+command} pesanan @pesan, tag orang @nama`)
if (isSetProses(from, set_proses)) return reply(`Set proses already active`)
addSetProses(q, from, set_proses)
reply(`Successfully set proses!`)
addCmd(command, 1, db_dashboard)

break
case 'changeproses': case 'changep':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *teks_p*\n\n_Contoh_\n\n${prefix+command} pesanan @pesan, tag orang @nama`)
if (isSetProses(from, set_proses)) {
changeSetProses(q, from, set_proses)
reply(`Sukses change set proses teks!`)
} else {
addSetProses(q, from, set_proses)
reply(`Sukses change set proses teks!`)
}
addCmd(command, 1, db_dashboard)

break
case 'delsetproses': case 'delsetp':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isSetProses(from, set_proses)) return reply(`Belum ada set proses di sini..`)
removeSetProses(from, set_proses)
reply(`Sukses delete set proses`)
addCmd(command, 1, db_dashboard)

break
case 'setdone': case 'setd':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *teks_done*\n\n_Contoh_\n\n${prefix+command} pesanan @pesan, tag orang @nama\n\nList Opts : tanggal/jam`)
if (isSetDone(from, set_done)) return reply(`Set done already active`)
addSetDone(q, from, set_done)
reply(`Successfully set done!`)
addCmd(command, 1, db_dashboard)

break
case 'changedone': case 'changed':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!q) return reply(`Gunakan dengan cara ${prefix+command} *teks_done*\n\n_Contoh_\n\n${prefix+command} pesanan @pesan, tag orang @nama\n\nList Opts : tanggal/jam`)
if (isSetDone(from, set_done)) {
changeSetDone(q, from, set_done)
reply(`Sukses change set done teks!`)
} else {
addSetDone(q, from, set_done)
reply(`Sukses change set done teks!`)
}
addCmd(command, 1, db_dashboard)

break
case 'delsetdone': case 'delsetd':
if (!isGroup) return reply(mess.OnlyGrup)
if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
if (!isSetDone(from, set_done)) return reply(`Belum ada set done di sini..`)
removeSetDone(from, set_done)
reply(`Sukses delete set done`)
addCmd(command, 1, db_dashboard)

break
case 'id':{
reply(from)
}
addCmd(command, 1, db_dashboard)

break
case 'fitnah':

if (!isGroup) return reply(mess.OnlyGrup)
if (!q) return reply(`Kirim perintah *${prefix+command}* @tag|pesantarget|pesanbot`)
var org = q.split('|')[0] ? q.split('|')[0] : q
var target = q.split('|')[1] ? q.split('|')[1] : q
var bot = q.split('|')[2] ? q.split('|')[2] : ''
if (bot.length <1) return reply(`Kirim perintah *${prefix+command}* @tag|pesantarget|pesanbot`)
if (!org.startsWith('@')) return reply('Tag orangnya')
if (!target) return reply(`Masukkan pesan target!`)
if (!bot) return reply(`Masukkan pesan bot!`)
var mens = parseMention(target)
var msg1 = { key: { fromMe: false, participant: `${parseMention(org)}`, remoteJid: from ? from : '' }, message: { extemdedTextMessage: { text: `${target}`, contextInfo: { mentionedJid: mens }}}}
var msg2 = { key: { fromMe: false, participant: `${parseMention(org)}`, remoteJid: from ? from : '' }, message: { conversation: `${target}` }}
conn.sendMessage(from, { text: bot, mentions: mentioned }, { quoted: mens.length > 2 ? msg1 : msg2 })
addCmd(command, 1, db_dashboard)

break
case 'fakehidetag':

if (!isGroup) return reply(mess.OnlyGrup)
if (args.length < 2) return reply(`Kirim perintah *${prefix+command}* @tag|teks`)
var org = q.split("|")[0]
var teks = q.split("|")[1];
if (!org.startsWith('@')) return reply('Tag orangnya')
var mem2 = []
groupMembers.map( i => mem2.push(i.id) )
var mens = parseMention(target)
var msg1 = { key: { fromMe: false, participant: `${parseMention(org)}`, remoteJid: from ? from : '' }, message: { extemdedTextMessage: { text: `${prefix}hidetag ${teks}`, contextInfo: { mentionedJid: mens }}}}
var msg2 = { key: { fromMe: false, participant: `${parseMention(org)}`, remoteJid: from ? from : '' }, message: { conversation: `${prefix}hidetag ${teks}` }}
conn.sendMessage(from, { text: teks ? teks : '', mentions: mem2 }, { quoted: mens.length > 2 ? msg1 : msg2 })
addCmd(command, 1, db_dashboard)

break
case 'join':{
 if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`Kirim perintah ${prefix+command} _linkgrup_`)
var ini_urrrl = q.split('https://chat.whatsapp.com/')[1]
var data = await conn.groupAcceptInvite(ini_urrrl)
reply(jsonformat(data))
}
addCmd(command, 1, db_dashboard)

break
case 'setexif':
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!q) return reply(`harus di isi semua!!\n\n_Contoh_\n${prefix+command} packname|author`)
var namaPack_ny = q.split('|')[0] ? q.split('|')[0] : q
var authorPack_ny = q.split('|')[1] ? q.split('|')[1] : ''
if (authorPack_ny.length <1) return reply(`harus di isi semua!!\n\n_Contoh_\n${prefix+command} packname|author`)
exif.create(namaPack_ny, authorPack_ny)
reply('Sukses membuat exif')
addCmd(command, 1, db_dashboard)
break
//BUG KHUSUS WAR
case 'bug':
case 'bugfc':
case 'bugpc':
case 'sendbug':{
if (isGroup) return reply('Khusus Chat Pribadi')
if (!isDeveloper) return reply('Khusus Developer Bot.')
if (!q) return reply(`Contoh:\n${prefix+command} 628xxx`)
let ini_nomor_hpnya = q
conn.sendMessage(`${ini_nomor_hpnya}@s.whatsapp.net`, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(`${ini_nomor_hpnya}@s.whatsapp.net`, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(`${ini_nomor_hpnya}@s.whatsapp.net`, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(`${ini_nomor_hpnya}@s.whatsapp.net`, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(`${ini_nomor_hpnya}@s.whatsapp.net`, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(`${ini_nomor_hpnya}@s.whatsapp.net`, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(`${ini_nomor_hpnya}@s.whatsapp.net`, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(`${ini_nomor_hpnya}@s.whatsapp.net`, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(`${ini_nomor_hpnya}@s.whatsapp.net`, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(`${ini_nomor_hpnya}@s.whatsapp.net`, {text: "Xd"}, {quoted: doc})
await sleep(7000)
reply(`*Sukses mengirim bug for close ke nomor* :\nhttp://Wa.me/${ini_nomor_hpnya}`)
}
addCmd(command, 1, db_dashboard)

break
case 'inibug': {
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!isGroup) return reply(mess.OnlyGrup)
let teks = `???????????? *BANG INI BUG ? ??????* ????????????
 ??? *Pesan : ${q ? q : 'kosong'}*\n\n`
for (let mem of participants) {
teks += `??? @${mem.id.split('@')[0]}\n`
}
conn.sendMessage(from, { text: teks, mentions: participants.map(a => a.id) }, { quoted: doc })
}
break
case 'buggc':{
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
if (!isGroup) return reply(mess.OnlyGrup)
conn.sendMessage(from, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(from, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(from, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(from, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(from, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(from, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(from, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(from, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(from, {text: "Xd"}, {quoted: doc})
await sleep(20)
conn.sendMessage(from, {text: "Xd"}, {quoted: doc})
await sleep(7000)
reply('sukses bro.')
}
break
case 'confes': case 'confess':{

if (isGroup) return reply("Gunakan bot ini di pesan pribadi:3")
let nomor_temanh = q.split("|")[0] ? q.split("|")[0] : q
let ini_nama_kamu = q.split("|")[1] ? q.split("|")[1] : q
let pesan_temanh = q.split("|")[2] ? q.split("|")[2] : ''
let nomor_pengirimnyah = sender.split("@")[0]
if (pesan_temanh.length <1) return reply(`Harus di isi semua !!\nex : ${prefix+command} 62857xxx|nama|hallo`)
if (!q) return reply(`Format Fitur Confes / Kirim pesan rahasia ke seseorang Lewat bot\n\n_Example_\n${prefix+command} wa|pengirim|pesan\n\n_Contoh_\n${prefix+command} 6285789004732|crush|hello\n\n*Note :*\nBerawal dari 628xxx Tanpa Spasi`)
conn.sendMessage(`${nomor_temanh}@s.whatsapp.net`, { text: `?????????[ *PESAN-RAHASIA* ]?????????\n_Hi ada confess nih buat kamu_\n\n*dari :* ${ini_nama_kamu}\n*pesan :* ${pesan_temanh}\n\n_Pesan ini di tulis oleh seseorang,_\n_bot hanya menyampaikan saja._\n????????????????????????????????????????????????`, footer: 'klik button untuk membalas pesan', buttons: [{buttonId: `${prefix}balas_confes ${nomor_pengirimnyah}@s.whatsapp.net|${nomor_temanh}@s.whatsapp.net`, buttonText: {displayText: 'balas??????'}, type: 1}],headerType: 1 })
reply('Sukses mengirimkan pesan ke dia.')
}
addCmd(command, 1, db_dashboard)

break
case 'balas_confes':{
let pengirim_menh = q.split("|")[0]
let penerima_menh = q.split("|")[1]
db_menfes.push({"id": penerima_menh, "teman": pengirim_menh })
fs.writeFileSync('./database/menfess.json', JSON.stringify(db_menfes))
reply('Silahkan Masukan pesan yang ingin di balas ke dia.')
}
addCmd(command, 1, db_dashboard)
break
case 'menfes': case 'menfess':{
if (isGroup) return reply("Gunakan bot ini di pesan pribadi:3")
if (!q) return reply(`Format Fitur Menfes / Kirim pesan rahasia ke seseorang Lewat bot\n\n_Example_\n${prefix+command} wa|pengirim|pesan\n\n_Contoh_\n${prefix+command} 6285789004732|bot|hai\n\nnote : Berawal dari 628xxx`)
let nomor_teman = q.split('|')[0] ? q.split('|')[0] : q
let nama_pengirim = q.split('|')[1] ? q.split('|')[1] : q
let pesan_teman = q.split('|')[2] ? q.split('|')[2] : ''
if (pesan_teman.length <1) return reply(`Harus di isi semua !!\nex : ${prefix+command} 62857xxx|nama|hallo`)
let nomor_pengirimnya = sender.split("@")[0]
let text_menfess = `_Hi ada menfess nih buat kamu_\n\n*Dari :* ${nama_pengirim}\n*Pesan :* ${pesan_teman}\n\n_Pesan ini di tulis oleh seseorang,_\n_bot hanya menyampaikan saja._`
let button_menfes = [{ buttonId: `${prefix}balas_menfes ${nomor_pengirimnya}@s.whatsapp.net|${nomor_teman}@s.whatsapp.net`, buttonText: { displayText: "Balas??????" }, type: 1 }]
const ini_mess_menfess = { image: await reSize(fs.readFileSync(setting.pathMenfes), 300, 200), caption: text_menfess, footer: 'klik button untuk membalas pesan', buttons: button_menfes, headerType: 4 }
conn.sendMessage(`${nomor_teman}@s.whatsapp.net`, ini_mess_menfess)
reply(`Sukses Mengirimkan Pesan Menfess`)
}
addCmd(command, 1, db_dashboard)
break
case 'balas_menfes':
let pengirim_men = q.split("|")[0]
let penerima_men = q.split("|")[1]
db_menfes.push({id: penerima_men, teman: pengirim_men })
fs.writeFileSync('./database/menfess.json', JSON.stringify(db_menfes))
reply('Silahkan Masukan pesan yang ingin di balas ke dia.')
addCmd(command, 1, db_dashboard)
break
case 'jadian': {
if (!isGroup) return reply(mess.OnlyGrup)
let member = participants.map(u => u.id)
let orang = member[Math.floor(Math.random() * member.length)]
let jodoh = member[Math.floor(Math.random() * member.length)]
let jawab = `Ciee yang Jadian???? Jangan lupa pajak jadiannya????

@${orang.split('@')[0]} ?????? @${jodoh.split('@')[0]}`
let menst = [orang, jodoh]
let buttons = [
{ buttonId: prefix+'jadian', buttonText: { displayText: 'Cari Lagi' }, type: 1 }
]
await sendButtonText(from, buttons, jawab, setting.footer, msg, {mentions: menst})
}
addCmd(command, 1, db_dashboard)

break
case 'jodoh': {

if (!isGroup) return reply(mess.OnlyGrup)
let member = participants.map(u => u.id)
let me = sender
let jodoh = member[Math.floor(Math.random() * member.length)]
let jawab = `????Jodoh mu adalah

@${me.split('@')[0]} ?????? @${jodoh.split('@')[0]}`
let ments = [me, jodoh]
let buttons = [
{ buttonId: prefix+'jodohku', buttonText: { displayText: 'Cari Lagi' }, type: 1 }
]
await sendButtonText(from, buttons, jawab, setting.footer, msg, {mentions: ments})
}
addCmd(command, 1, db_dashboard)

break
case 'dashboard': case 'db':{

let listpcnya = await store.chats.all().filter(v => v.id.endsWith('.net')).map(v => v)
let listgcnya = await store.chats.all().filter(v => v.id.endsWith('@g.us')).map(v => v.id)

var jumlahCmd = db_dashboard.length
if (jumlahCmd > 80) jumlahCmd = 80

teks = `*DASHBOARD*\n_Chat Pribadi : ${listpcnya.length}_\n_Chat Group : ${listgcnya.length}_\n_Total Cmd : ${jumlahCmd}_\n\n*COMMAND*`
for (let i = 0; i < jumlahCmd ; i ++) {
teks += `\n_#${db_dashboard[i].id} = ${db_dashboard[i].total}_`
}
reply(teks)
}
addCmd(command, 1, db_dashboard)

break
case 'resetdb':{
if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
let para_kos = "[]"
db_dashboard.splice(para_kos)
fs.writeFileSync('./database/dashboard.json', JSON.stringify(db_dashboard))
pendaftar.splice(para_kos)
fs.writeFileSync('./database/pengguna.json', JSON.stringify(pendaftar))
}
reply('Sukses Restart database ???')
addCmd(command, 1, db_dashboard)

break
case 'mediafire':

if (!q) return reply(`Contoh :\n${prefix+command} https://www.mediafire.com/file/4jzmc4boquizy0n/HAPUS_CONFIG_FF_MAX.7z/file`)
let { mediafireDl } = require('./lib/mediafire')
let link_nya = q
const result_mediafire = await mediafireDl(link_nya)
let text_mediafire = `*MEDIAFIRE DOWNLOAD*	
Judul : ${result_mediafire[0].nama}
Type : ${result_mediafire[0].mime}
Size : ${result_mediafire[0].size}
Link : ${result_mediafire[0].link}
			
_Sedang Mengirim file._`
reply(text_mediafire)
conn.sendMessage(from, { document : { url : result_mediafire[0].link}, fileName : result_mediafire[0].nama, mimetype: result_mediafire[0].mime }, { quoted : msg }) 
addCmd(command, 1, db_dashboard)

break

case 'view': case 'like': case 'followers':{

if (args.length < 1) return reply(`Link atau Usernamenya mana?\n\nJika masih bingung cara order silahkan ketik : #order`)
let juma = q.split('|')[0] ? q.split('|')[0]: q
let targtt = q.split('|')[1] ? q.split('|')[1]: ''
if (targtt.length < 1) return reply(`Jumlah dan Target harus di isi!`)
let fetaa = await fetchJson(`https://ampibismm.my.id/api/json?bot=true&api_key=hASnfGXGkVRT2NonzLePbp3wZAmzop&action=pricelist&type=${command}`)
let arr_wors = []
let textplus = `${juma}|${targtt}`
for (let x of fetaa.data) {
arr_wors.push({
title: `${x.nama}`,
rowId: `${prefix}confirmorderkunci ${textplus}|${x.id_layanan}`,
description: `${x.desc}`
})
}
var listMsg = {
text: `Pilih layanan sesuai dengan yang ingin anda beli!\njika anda membeli followers maka pilih followers\ndiharapkan anda sudah faham.`,
buttonText: 'Click Here!',
footer: '?? APP STORE 2022',
mentions: [sender],
sections: [{
title: 'SOSMED - SHOP', rows: arr_wors
}]
}
conn.sendMessage(from, listMsg, {quoted: fkontak})
}

break
case 'confirmorderkunci': { //KUNCI = BIAR GA DIAKSES HEHE

if (isGroup) return reply('Fitur Tidak Dapat Digunakan Untuk Group!')
if (args.length < 1) return reply(`*Cara order followers*\n\n*Example :*\n_${prefix + command} jumlah|username tanpa (@)_\n\n*Contoh :*\n_${prefix + command} 500|Lexxy24_\n\n*Min pesan :* _300_ \n*Max pesan :* _500k_\n\nThank You`)
let jumlah = q.split('|')[0] ? q.split('|')[0]: q
let targ = q.split('|')[1] ? q.split('|')[1]: q
let idny = q.split('|')[2] ? q.split('|')[2]: ''
let feta = await fetchJson(`https://ampibismm.my.id/api/json?bot=true&api_key=hASnfGXGkVRT2NonzLePbp3wZAmzop&action=order&quantity=${jumlah}&target=${targ}&id_layanan=${idny}`)
if (feta.status == false) {
reply(`*Maaf orderan gagal di buat*\n\nPermasalahan :\n${feta.data.msg} atau Cara order anda salah\n\nDiharapkan sudah faham jika ingin membeli\njika masih tidak faham silahkan ketik ${prefix}owner!\n`)
} else {
let idpes = feta.data.order_id
let cap = `Hay *${pushname} ????,* Terimakasih Telah Order di Sosmed Shop!\nScan QR diatas untuk membayar! MENGGUNAKAN QRIS.\n\n*Id Pesanan Anda :* ${feta.data.order_id}\n*Target :* ${targ}\n*Jumlah Pesanan :* ${jumlah}\n*Total Harga Pesanan :* Rp${toRupiah(feta.data.amount)}\n*Status Orderan :* ${feta.data.status}\n\n_Info lebih lanjut klik button dibawah._`
let buto = [{
buttonId: `${prefix}cekstatus ${feta.data.order_id}`,
buttonText: {
displayText: 'Check Status'
},
type: 1
}]
conn.sendMessage(from, {
caption: cap, image: {
url: feta.data.qris
}, buttons: buto, footer: '?? APP PREMIUM STORE 2022'
})
}
console.log(feta)
}

break
case 'cekstatus':

if (isGroup) return reply('Fitur Tidak Dapat Digunakan Untuk Group!')
if (args.length < 1) return reply('idnya mana bang')
let seta = await fetchJson(`https://ampibismm.my.id/api/json?bot=true&api_key=hASnfGXGkVRT2NonzLePbp3wZAmzop&action=status&order_id=${q}`)
//console.log(seta)
if (seta.status == false) {
var captionnye = `ID order tidak di temukan`
} else {
var captionnye = `*Status Orderan Anda*\n\nTarget : ${seta.data.target}\nStatus : ${seta.data.status}\nFollowers Default : ${seta.data.start_count}\nOn Process : ${seta.data.kurang}\nTotal Order : ${seta.data.total_order}\nTanggal Pesan : ${seta.data.tanggal_pesan}\nJumlah Pembayaran : ${seta.data.amount}\nId Pesanan : ${seta.data.order_id}\n\nTerimakasih sudah membeli followers dari kami, ditunggu next ordernya!`
}
reply(captionnye)

break
case 'order':
case 'caraorder':{

if (isGroup) return reply('Fitur Tidak Dapat Digunakan Untuk Group!')
let capp = `*Hallo _${pushname}_*\n*Berikut Ini Cara Order Sosmed Shop*\n\n*Order Followers :*\n_Example_\n_${prefix}followers jumlah|username [ tanpa (@) ]_\n\n_Contoh_\n_${prefix}followers 500|Lexxy24_\n\n*Order View :*\nExample_\n_${prefix}view jumlah|link_\n\n_Contoh_\n_${prefix}view 10000|https://vm.tiktok.com/xxxxxxx_\n\n*Order Like :*\n_Example_\n_${prefix}like jumlah|link_\n\n_Contoh_\n_${prefix}like 10000|https://www.instagram.com/p/xxxxxxx_\n\nSekian penjelasan cara order\nSemoga anda paham dengan penjelasan ini????\nbeli = paham`
conn.sendMessage(from, {text: capp}, {quoted:msg})
}

break
case 'prichlist':
case 'pricelist':{
let feta = await fetchJson(`https://ampibismm.my.id/api/json?bot=true&api_key=hASnfGXGkVRT2NonzLePbp3wZAmzop&action=pricelist&type=semua`)
let list = '*List Harga Layanan*\n\n'
for (let L of feta.data) {
list += `name : ${L.nama}\ndesc : ${L.desc}\nmin : ${L.min}\nmax : ${L.max}\nharga : ${L.price}\nid : ${L.id_layanan}\n\n`
}
conn.sendMessage(from, {text: list}, {quoted:msg})
//console.log(feta)
}

break
case 'deposit': case 'depo':{
var button_deposit = {
text: `Hallo Kak ??????, Ingin melakukan deposit?, Silahkan Pilih Payment yang tersedia di bawah ini ya ????????    Untuk Qris Hanya menerima E-Wallet
- Ovo
- Dana
- Shopee Pay
- Gopay`,
footer: 'OHLX ?? 2022',
buttons: [
{ buttonId: 'payment_qris', buttonText: {displayText: 'QRIS'}, type: 1},
{ buttonId: 'payment_dana', buttonText: {displayText: 'DANA'}, type: 1}
],
headerType: 1
}
conn.sendMessage(from, button_deposit)
}
break
case 'bukti':
if (!fs.existsSync(depositPath + sender.split("@")[0] + ".json")) return reply("Sepertinya kamu belum melakukan deposit")
if (!isImage && !isQuotedImage) return reply(`Kirim gambar dengan caption *#bukti* atau tag gambar yang sudah dikirim dengan caption *#bukti*`)

await conn.downloadAndSaveMediaMessage(msg, "image", `./storage/bukti/${sender.split('@')[0]}.jpg`)

let data_depo = JSON.parse(fs.readFileSync(depositPath + sender.split("@")[0] + ".json"))
let caption_bukti =`??? *INFO-DEPOSIT* ???

*ID:* ${data_depo.ID}
*Nomer:* wa.me/${data_depo.number.split('@')[0]}
*Payment:* ${data_depo.payment}
*Tanggal:* ${data_depo.date.split(' ')[0]}
*Jumlah Deposit:* Rp${toRupiah(data_depo.data.amount_deposit)}
*Pajak:* Rp2.500
*Total Pembayaran:* Rp${toRupiah(data_depo.data.amount_deposit+2500)}

_Ada yang deposit nih kak, coba dicek, jika sudah masuk konfirmasi dengan klik button *Accept*_`

let bukti_button = [
{ buttonId: 'acc_deposit', buttonText: {displayText: 'Accept'}, type: 1},
{ buttonId: 'reject_deposit', buttonText: {displayText: 'Reject'}, type: 1}
]
let bukti_bayar = {
image: fs.readFileSync(`./storage/bukti/${sender.split('@')[0]}.jpg`),
caption: caption_bukti,
title: 'bukti pembayaran',
footer: 'Press The Button Below',
buttons: bukti_button,
headerType: 5 
}
conn.sendMessage(`${setting.contactOwner}@s.whatsapp.net`, bukti_bayar, { quoted: msg })
reply(`Mohon tunggu ya kak, sampai di acc oleh owner ??????`)
if (fs.existsSync(`./storage/bukti/${sender.split('@')[0]}.jpg`)) fs.unlinkSync(`./storage/bukti/${sender.split('@')[0]}.jpg`)
break
case 'me': case 'infome': case 'saldo':
reply(`*?????? CHECK YOUR INFO ??????*

 _??? *Name:* ${pushname}_
 _??? *Nomer:* ${sender.split('@')[0]}_
 _??? *Saldo:* Rp${toRupiah(_saldo.checkSaldonya(sender, db_saldo_user))}_

*Note :*
_saldo hanya bisa untuk topup_
_tidak bisa ditarik atau transfer_!`)
break
case 'buy':case 'topup':
if (_saldo.checkSaldonya(sender, db_saldo_user) === 0) return reply(`Maaf sepertinya saldo kamu Rp0, Silahkan melakukan ${prefix}deposit sebelum topup\nketik ${prefix}listharga untuk melihat list harga diamond game`)
if (!fs.existsSync(topupPath + sender.split("@")[0] + ".json")) {
var rows = [
{
title: "Diamond Free Fire",
rowId: "topup_ff",
description: "Menampilkan list harga Diamond Free Fire"
},
{
title: "Membership Free Fire Murah",
rowId: "topup_mmff",
description: "Menampilkan list harga Membership Free Fire Murah"
},
{
title: "Diamond Mobile Legends",
rowId: "topup_ml",
description: "Menampilkan list harga Diamond Mobile Legends"
},
{
title: "Chip Higgs Domino",
rowId: "topup_hd",
description: "Menampilkan list harga Chip Higgs Domino"
},
{
title: "Arena Of Valor",
rowId: "topup_aov",
description: "Menampilkan list harga Voucher Arena Of Valor"
},
{
title: "Dragon Raja Sea",
rowId: "topup_dgr",
description: "Menampilkan list harga Dragon Raja Coupons"
},
{
title: "PLN",
rowId: "topup_pln",
description: "Menampilkan list harga Voucher PLN"
}
]
var listMsg = {
text: `List harga produk yang kami
sediakan, silahkan pilih salah satu`,
buttonText: "Topup !",
sections: [ { title: "??????[ List Produk APP PREMIUM ]??????", rows } ]
}
var object_buy = {
ID: require("crypto").randomBytes(5).toString("hex").toUpperCase(),
number: sender,
session: 'PILIH-GAME',
date: new Date().toLocaleDateString("ID", { timeZone: "Asia/Jakarta"}),
data: {
game_id: '',
game_zone_id: '',
request_id: '',
topup_id: '',
topup_harga: '',
topup_game: ''
}
}
fs.writeFile(topupPath + sender.split("@")[0] + ".json", JSON.stringify(object_buy, null, 3), () => {
conn.sendMessage(from, listMsg)
})
} else {
var buttonMessage = {
text: `Hey, sepertinya kamu masih ada proses yang belum diselesaikan, Ingin batal? click batal dibawah ????????`,
footer: 'APP PREMIUM STORE ?? 2022',
buttons: [
{ buttonId: 'batal_order', buttonText: {displayText: 'BATAL TOPUP'}, type: 1},
],
headerType: 1
}
conn.sendMessage(from, buttonMessage)
}
break
case 'listharga': case 'harga':
var rows = [
{
title: "Diamond Free Fire",
rowId: "#list_harga_ff",
description: "Menampilkan list harga Diamond Free Fire"
},
{
title: "Membership Free Fire Murah !!",
rowId: "#list_harga_mmff",
description: "Menampilkan list harga Membership Free Fire Murah"
},
{
title: "Diamond Mobile Legends",
rowId: "#list_harga_ml",
description: "Menampilkan list harga Diamond Mobile Legends"
},
{
title: "Chip Higgs Domino",
rowId: "#list_harga_hd",
description: "Menampilkan list harga Chip Higgs Domino"
},
{
title: "Arena Of Valor",
rowId: "#list_harga_aov",
description: "Menampilkan list harga Voucher Arena Of Valor"
},
{
title: "Dragon Raja Sea",
rowId: "#list_harga_dg",
description: "Menampilkan list harga Dragon Raja Coupons"
}
]
var listMsg = {
text: `??????[ *TOPUP GAME* ]??????\n\nList harga produk yang kami\nsediakan,\nsilahkan pilih salah satu!\n`,
buttonText: "Click Here!",
sections: [ { title: "???? Voucher Game ????", rows } ]
}
conn.sendMessage(from, listMsg)
break
case 'list_harga_ff':
axios({
method: 'POST',
url: 'https://www.atlantic-pedia.co.id/api/pulsa',
data: qs.stringify({
key: setting.apikey_antlatic,
action: "services"
})
}).then(res => {
var regExcomp = (a, b) => {
var aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
var bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));
return aPrice - bPrice
};
var listff = [];
console.log(res)
for (let x of res.data.data) {
if (x.code.includes("FF")) {
listff.push(x)
}
}
var teks = `*List Harga Diamond Free Fire*\n\n`
listff.sort(regExcomp)
for (let i of listff) {
teks += `*Title :* ${i.name}\n*Harga :* Rp${toRupiah(i.price)}\n*Status :* ${i.status}\n\n`
}
teks += `Silahkan isi Saldo terlebih dahulu jika ingin TopUp, ketik ${prefix}deposit untuk mengisi saldo, dan ketik ${prefix}topup untuk TopUp`
reply(teks)
})
break
case 'dep':
axios({
method: 'POST',
url: 'https://atlantic-pedia.co.id/api/deposit',
data: qs.stringify({
key: setting.apikey_antlatic,
action: "qris",
buyer_name: "HanzoFTAamon",
quantity: "10000"
})
}).then(res => {
var regeXcomp = (a, b) => {
var aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
var bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));
return aPrice - bPrice
};
console.log(res)
})
break
case 'list_harga_ml':
axios({
method: 'POST',
url: 'https://www.atlantic-pedia.co.id/api/pulsa',
data: qs.stringify({
key: setting.apikey_antlatic,
action: "services"
})
}).then(res => {
var regeXcomp = (a, b) => {
var aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
var bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));
return aPrice - bPrice
};
var listml = [];
for (let x of res.data.data) {
if (x.code.startsWith("ML")) {
listml.push(x)
}
}
var teks = `*List Harga Diamond Mobile Legends*\n\n`
listml.sort(regeXcomp)
for (let i of listml) {
teks += `*Title :* ${i.name}\n*Harga :* Rp${toRupiah(i.price)}\n*Status :* ${i.status}\n\n`
}
teks += `Silahkan isi Saldo terlebih dahulu jika ingin TopUp, ketik ${prefix}deposit untuk mengisi saldo, dan ketik ${prefix}topup untuk TopUp`
reply(teks)
})
break
case 'list_harga_hd':
axios({
method: 'POST',
url: 'https://www.atlantic-pedia.co.id/api/pulsa',
data: qs.stringify({
key: setting.apikey_antlatic,
action: "services"
})
}).then(res => {
var regeXcomp = (a, b) => {
var aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
var bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));
return aPrice - bPrice
};
var listhd = [];
for (let x of res.data.data) {
if (x.code.startsWith("HD")) {
listhd.push(x)
}
}
var teks = `*List Harga Chip Higgs Domino*\n\n`
listhd.sort(regeXcomp)
for (let i of listhd) {
teks += `*Title :* ${i.name}\n*Harga :* Rp${toRupiah(i.price)}\n*Status :* ${i.status}\n\n`
}
teks += `Silahkan isi Saldo terlebih dahulu jika ingin TopUp, ketik ${prefix}deposit untuk mengisi saldo, dan ketik ${prefix}topup untuk TopUp`
reply(teks)
})
break
case 'list_harga_aov':
axios({
method: 'POST',
url: 'https://www.atlantic-pedia.co.id/api/pulsa',
data: qs.stringify({
key: setting.apikey_antlatic,
action: "services"
})
}).then(res => {
var regeXcomp = (a, b) => {
var aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
var bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));
return aPrice - bPrice
};
var listaov = [];
for (let x of res.data.data) {
if (x.code.startsWith("AOV")) {
listaov.push(x)
}
}
var teks = `*List Harga Arena Of Valor*\n\n`
listaov.sort(regeXcomp)
for (let i of listaov) {
teks += `*Title :* ${i.name}\n*Harga :* Rp${toRupiah(i.price)}\n*Status :* ${i.status}\n\n`
}
teks += `Silahkan isi Saldo terlebih dahulu jika ingin TopUp, ketik ${prefix}deposit untuk mengisi saldo, dan ketik ${prefix}topup untuk TopUp`
reply(teks)
})
break
case 'list_harga_dg':
axios({
method: 'POST',
url: 'https://www.atlantic-pedia.co.id/api/pulsa',
data: qs.stringify({
key: setting.apikey_antlatic,
action: "services"
})
}).then(res => {
var regeXcomp = (a, b) => {
var aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
var bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));
return aPrice - bPrice
};
var listdgr = [];
for (let x of res.data.data) {
if (x.code.startsWith("DGR")) {
listdgr.push(x)
}
}
var teks = `*List Harga Dragon Raja Coupons*\n\n`
listdgr.sort(regeXcomp)
for (let i of listdgr) {
teks += `*Title :* ${i.name}\n*Harga :* Rp${toRupiah(i.price)}\n*Status :* ${i.status}\n\n`
}
teks += `Silahkan isi Saldo terlebih dahulu jika ingin TopUp, ketik ${prefix}deposit untuk mengisi saldo, dan ketik ${prefix}topup untuk TopUp`
reply(teks)
})
break
case 'list_harga_mmff':
axios({
method: 'POST',
url: 'https://www.atlantic-pedia.co.id/api/pulsa',
data: qs.stringify({
key: setting.apikey_antlatic,
action: "services"
})
}).then(res => {
var regeXcomp = (a, b) => {
var aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
var bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));
return aPrice - bPrice
};
var listmmff = [];
for (let x of res.data.data) {
if (x.code.startsWith("FFMM")) {
listmmff.push(x)
}
}
var teks = `*List Harga Membership Free Fire Murah*\n\n`
listmmff.sort(regeXcomp)
for (let i of listmmff) {
teks += `*Title :* ${i.name}\n*Harga :* Rp${toRupiah(i.price)}\n*Status :* ${i.status}\n\n`
}
teks += `Silahkan isi Saldo terlebih dahulu jika ingin TopUp, ketik ${prefix}deposit untuk mengisi saldo, dan ketik ${prefix}topup untuk TopUp`
reply(teks)
})
break
case 'profil':
case 'server':
case 'cekatlantic':
if (!isOwner) return reply(mess.OnlyOwner)
axios({
method: "POST",
url: "https://atlantic-pedia.co.id/api/profile",
data: qs.stringify({
key: setting.apikey_antlatic
})
}).then(data => {
data = data.data.data
var teks = `*ATLANTIC PEDIA PROFILE*\n*Username :* ${data.username}\n*Fullname :* ${data.full_name}\n*Sisa Saldo :* Rp${toRupiah(data.balance)}\n*Total Order :* ${data.order}\n*Pemakaian Saldo :* Rp${toRupiah(data.spent)}`
reply(teks)
})
break
case 'addjudul':
if (args.length === 0) return reply(`Buat list dengan judul\n\nContoh : ${prefix}addjudul | <judul tugas>`);
if (judullist.length > 0) return reply(`Mohon untuk reset tugas terlebih dahulu dengan command ${prefix}resettugas`);
const isijudullist = q.split(`|`)[1];
const judulin = judullist.push(isijudullist);
if (judulin) return reply(`Tugas sudah ditambahkan, untuk menambahkan tugas menggunakan command ${prefix}addtugas | <nama tugas>`);
break;
case 'addtugas':
if (args.length === 0) return reply(`Tambah daftar Tugas dengan isi\n\nContoh : ${prefix}addtugas | <nama tugas>`);
if (judullist.length === 0) return reply(`Mohon untuk membuat judul Tugas terlebih dahulu dengan command ${prefix}addjudultugas`);
const isilist = q.split(`|`)[1];
const isiin = daftarlist.push(isilist);
if (isiin) {
const isidaftar = ngelistisi();
reply(isidaftar);
}
break;
case 'deltugas':
if (args.length === 0) return reply(`Hapus item pada List dengan nomor item\n\nContoh : ${prefix}deltugas 1`);
if (daftarlist.length === 0) return reply(`Tambah daftar tugas dengan isi\n\nContoh : ${prefix}addtugas | <nama tugas>`);
if (judullist.length === 0) return reply(`Mohon untuk membuat judul tugas terlebih dahulu dengan command ${prefix}addjudultugas`);
var i = args[1];
i--;
const hapusinlist = daftarlist.splice(i, 1);
if (hapusinlist){
reply(`Item dengan nomor ${args} telah dihapus !`);
const isidaftar = ngelistisi();
reply(isidaftar);
}
break;
case 'listtugas':
if (daftarlist.length === 0) return reply(`Tambah daftar tugas dengan isi\n\nContoh : ${prefix}addtugas | <ini tugas>`);
if (judullist.length === 0) return reply(`Mohon untuk membuat judul tugas terlebih dahulu dengan command ${prefix}addjudultugas`);
const isidaftar = ngelistisi();
reply(isidaftar);
break;
case 'resettugas':
while (daftarlist.length) { 
daftarlist.pop(); 
}
while (judullist.length) { 
judullist.pop(); 
}
if (daftarlist.length === 0 && judullist.length === 0) return reply(`tugas sudah di reset !`);
break;
case 'tiktok':
case 'tiktokmp4':
if (!q) return reply('_contoh_ :\n#tiktok https://vt.tiktok.com/ZSRC89VPd/')
let video_tt = await fdl.downloader.tiktok(q)
let cp_ttmp4 = `*TIKTOK DOWNLOAD*
*Judul:* ${video_tt.title}
*Author:* ${video_tt.author}
*Type:* mp4/video
*Creator:* FangzXD

Kamu Bisa Mengambil Audio nya
dengan cara di bawah ini !!

${prefix}tiktokmp3 ${q}`
conn.sendMessage(from, { video: { url: video_tt.nowm }, caption: cp_ttmp4}, {quoted:msg})
break
case 'tiktokmp3':
if (!q) return reply('_contoh_ :\n#tiktok https://vt.tiktok.com/ZSRC89VPd/')
let audio_tt = await fdl.downloader.tiktok(q)
let cp_ttmp3 = `*TIKTOK DOWNLOAD*
*Judul:* ${audio_tt.title}
*Author:* ${audio_tt.author}
*Type:* mp3/audio
*Creator:* Reii`
reply(cp_ttmp3)
conn.sendMessage(from, { audio: { url: audio_tt.audio }, mimetype: 'audio/mpeg'}, { quoted: msg })
break
// Anonymous Chat
case 'anonymous':
var buttonMessage = {
text: `Hai ${pushname !== undefined ? pushname : 'Kak'} Selamat Datang di Anonymous Chat\n\nKetik ${prefix}search untuk mencari Teman Chat anda, atau bisa pencet tombol Search dibawah ini.`,
footer: 'APP PREMIUM STORE: ?? 2022',
buttons: [
{ buttonId: '#start', buttonText: {displayText: 'Start'}, type: 1}
],
headerType: 1
}
conn.sendMessage(from, buttonMessage)
break
case 'start': case 'search':
if (isGroup) return reply(mess.OnlyPM)
var rumss = Object.values(anonymous).find(room => anonyCheck(sender, room))
var rooms = Object.values(anonymous).find(room => anonyCheck(sender, room) && room.state == 'CHATTING')
if (rooms) {
var but = [
{ buttonId: prefix+'stop', buttonText: { displayText: "??? STOP ???" }, type: 1 },
{ buttonId: prefix+'skip', buttonText: { displayText: "??? SKIP ???" }, type: 1 },
{ buttonId: prefix+'sendprofil', buttonText: { displayText: "??????? SEND PROFIL ???????" }, type: 1 }
]
var teks = `[??????] Kamu masih dalam sesi chat dengan partner! ???`
return conn.sendMessage(from, { text: teks, footer: "BotKina ?? 2022", buttons: but })
} else if (rumss) {
var teks = `[????] Mohon tunggu sedang mencari teman chat`
var but = [ { buttonId: prefix+'stop', buttonText: { displayText: "??? STOP ???" }, type: 1 } ]
return conn.sendMessage(from, { text: teks, footer: "BotKina ?? 2022", buttons: but })
}
var roomm = Object.values(anonymous).find(room => room.state == "WAITING" && !anonyCheck(sender, room))
if (roomm) {
var but = [
{ buttonId: prefix+'stop', buttonText: { displayText: "??? STOP ???" }, type: 1 },
{ buttonId: prefix+'skip', buttonText: { displayText: "??? SKIP ???" }, type: 1 },
{ buttonId: prefix+'sendprofil', buttonText: { displayText: "??????? SEND PROFIL ???????" }, type: 1 }
]
roomm.b = sender
roomm.state = "CHATTING"
var teks = `_Pasangan Ditemukan ????_\n_Coba Katakan Halo / Pesan Lainnya_\n${prefix}skip -- _cari pasangan baru_\n${prefix}stop -- _hentikan dialog ini_`
await conn.sendMessage(roomm.a, { text: teks, footer: "BotKina ?? 2022", buttons: but })
await conn.sendMessage(roomm.b, { text: teks, footer: "BotKina ?? 2022", buttons: but })
} else if (!rooms) {
let id = + new Date
anonymous[id] = {
id,
a: sender,
b: '',
state: "WAITING"
}
var but = [
{ buttonId: prefix+'stop', buttonText: { displayText: "??? STOP ???" }, type: 1 }
]
var teks = `[????] Mohon tunggu sedang mencari teman chat`
await conn.sendMessage(from, { text: teks, footer: "BotKina ?? 2022", buttons: but })
}
break
case 'stop':
if (isGroup) return reply(mess.OnlyPM)
var roomo = Object.values(anonymous).find(room => anonyCheck(sender, room))
if (!roomo) {
var but = [
  { buttonId: prefix+'start', buttonText: { displayText: "???? SEARCH ????" }, type: 1 }
]
var teks = `[??????] Kamu belum pernah mulai chat! ???`
await conn.sendMessage(from, { text: teks, footer: "BotKina ?? 2022", buttons: but })
} else {
var but = [
  { buttonId: prefix+'start', buttonText: { displayText: "???? SEARCH ????" }, type: 1 }
]
var teks = `[???] Berhasil memberhentikan chat`
var teks2 = `[??????] Sesi chat ini telah diberhentikan oleh teman chat kamu`
await conn.sendMessage(from, { text: teks, footer: "BotKina ?? 2022", buttons: but })
let other = anonyOther(sender, roomo)
if (other) await conn.sendMessage(other, { text: teks2, footer: "BotKina ?? 2022", buttons: but })
delete anonymous[roomo.id]
}
break
case 'next': case 'skip':
if (isGroup) return reply(mess.OnlyPM)
let romeo = Object.values(anonymous).find(room => anonyCheck(sender, room))
var but = [
{ buttonId: prefix+'start', buttonText: { displayText: "???? SEARCH ????" }, type: 1 }
]
if (!romeo) {
var teks = `[??????] Kamu belum pernah memulai chat! ???`
return await conn.sendMessage(from, { text: teks, footer: "BotKina ?? 2022", buttons: but })
} else {
let other = anonyOther(sender, romeo)
var teks1 = `[??????] Sesi chat ini telah diberhentikan oleh teman chat kamu! ???`
if (other) await conn.sendMessage(other, { text: teks1, footer: "BotKina ?? 2022", buttons: but })
delete anonymous[romeo.id]
}
let room = Object.values(anonymous).find(room => room.state == "WAITING" && !anonyCheck(sender, room))
if (room) {
var but = [
  { buttonId: prefix+'stop', buttonText: { displayText: "??? STOP ???" }, type: 1 },
  { buttonId: prefix+'skip', buttonText: { displayText: "??? SKIP ???" }, type: 1 },
  { buttonId: prefix+'sendprofil', buttonText: { displayText: "??????? SEND PROFIL ???????" }, type: 1 }
]
room.b = sender
room.state = "CHATTING"
var teks = `_Pasangan Ditemukan ????_\n_Coba Katakan Halo / Pesan Lainnya_\n${prefix}skip -- _cari pasangan baru_\n${prefix}stop -- _hentikan dialog ini_`
await conn.sendMessage(room.a, { text: teks, footer: "BotKina ?? 2022", buttons: but })
await conn.sendMessage(room.b, { text: teks, footer: "BotKina ?? 2022", buttons: but })
} else {
let id = + new Date
anonymous[id] = {
    id,
    a: sender,
    b: '',
    state: "WAITING"
}
var but = [
  { buttonId: prefix+'stop', buttonText: { displayText: "??? STOP ???" }, type: 1 }
]
var teks = `[????] Mohon tunggu sedang mencari teman chat`
await conn.sendMessage(from, { text: teks, footer: "BotKina ?? 2022", buttons: but })
}
break
case 'sendprofile': case 'sendprofil':
if (isGroup) return reply(mess.OnlyPM)
let romoe = Object.values(anonymous).find(room => anonyCheck(sender, room) && room.state == 'CHATTING')
var but = [
{ buttonId: prefix+'start', buttonText: { displayText: "???? SEARCH ????" }, type: 1 }
]
if (!romoe) {
var teks = `[??????] Kamu belum pernah memulai chat! ???`
await conn.sendMessage(from, { text: teks, footer: "APP PREMIUM STORE ?? 2022", buttons: but })
} else {
let rms = Object.values(anonymous).find(room => [room.a, room.b].includes(sender) && room.state == "CHATTING")
var partnerJID = anonyOther(sender, rms)
var res = await conn.sendContact(partnerJID, [sender.split("@")[0]])
conn.sendMessage(from, { text: '[???] Berhasil mengirim profil ke teman chat anda!' }, { quoted: msg })
conn.sendMessage(partnerJID, { text: '[????????] Teman chat kamu memberikan kontak profil nya!' }, { quoted: res })
}
break
case 'ytmp3':
case 'ytaudio': {
let { yta } = require('./lib/y2mate')
if (!q) return reply(`_Contoh_\n${prefix + command} https://youtu.be/S5Jjw4JFlwE`)
let quality = args[1] ? args[1] : '128kbps'
let media = await yta(q, quality)
reply(mess.wait)
if (media.filesize >= 100000) return reply('File Melebihi Batas '+util.format(media))
conn.sendMessage(from, { audio: { url: media.dl_link }, mimetype: 'audio/mpeg', fileName: `${media.title}.mp3` }, { quoted: msg })
}
break
case 'ytmp4':
case 'ytvideo': {
let { ytv } = require('./lib/y2mate')
if (!q) return reply(`_Contoh_\n${prefix + command} https://youtu.be/S5Jjw4JFlwE`)
let quality = args[1] ? args[1] : '360p'
let media = await ytv(q, quality)
reply(mess.wait)
if (media.filesize >= 100000) return reply('File Melebihi Batas '+util.format(media))
conn.sendMessage(from, { video: { url: media.dl_link }, mimetype: 'video/mp4', fileName: `${media.title}.mp4`, caption: `??? Title : ${media.title}\n??? File Size : ${media.filesizeF}\n??? Url : ${q}\n??? Ext : MP3\n??? Resolusi : ${args[1] || '360p'}` }, { quoted: msg })
}
break
case 'play':
if (!q) return reply(`Contoh : ${prefix + command} preset angel baby 30 detik`)
reply(mess.wait)
let yts = require("yt-search")
let search = await yts(q)
let anu = search.videos[Math.floor(Math.random() * search.videos.length)]
let button_play = [
{ buttonId: `${prefix}ytmp3 ${anu.url}`, buttonText: { displayText: "????????????????????" }, type: 1 },
{ buttonId: `${prefix}ytmp4 ${anu.url}`, buttonText: { displayText: "????????????????????" }, type: 1 }
]
let text_play =`*YOUTUBE PLAY*
??? Title : ${anu.title}
??? Ext : Search
??? ID : ${anu.videoId}
??? Duration : ${anu.timestamp}
??? Viewers : ${anu.views}
??? Upload At : ${anu.ago}
??? Author : ${anu.author.name}
??? Channel : ${anu.author.url}
??? Description : ${anu.description}
??? Url : ${anu.url}`
const ini_message_Play = {
image: await getBuffer(anu.thumbnail),
caption: text_play,
footer: 'pilih media di bawah ini.',
buttons: button_play,
headerType: 4
}
const sendPlay = await conn.sendMessage(from, ini_message_Play, { quoted: msg })
addCmd(command, 1, db_dashboard)
break
case 'stalktiktok':{
if (!q) return reply('contoh:\n#stalktiktok username')
let anu = await fetchJson(`https://zenzapis.xyz/stalker/tiktok?username=${q}&apikey=lexxybotygy`)
if (anu.status == false) return reply('Username Not Found..')
let cap_tiktok =`*STALK TIKTOK*
name: ${anu.result.name}
username: ${anu.result.username}
followers: ${anu.result.followers}
following: ${anu.result.following}
description: ${anu.result.description}
`
conn.sendMessage(from, {image: {url: anu.result.profile}, caption: cap_tiktok}, {quoted:msg})
}
addCmd(command, 1, db_dashboard)
break
case "stalkgithub":{
if (!q) return reply(`Contoh :\n${prefix+command} Lexxy24`)
reply(mess.wait)
var nama = q
var git = await fetchJson(`https://api.github.com/users/${nama}`)
var tbGit = await getBuffer(git.avatar_url)
let textGitthub =`*STALK-GITHUB*
id : ${git.id}
login : ${git.login}
html_url : ${git.html_url}
type : ${git.type}
admin : ${git.admin}
name : ${git.name}
location : ${git.location}
bio : ${git.bio}
public_repos : ${git.public_repos}
followers : ${git.followers}
following : ${git.following}
created : ${git.created_at}
updated : ${git.updated_at}`
lexxy.sendMessage(from, { image: tbGit, caption: textGitthub }, {quoted:msg})
}
addCmd(command, 1, db_dashboard)
break
case 'stalknpm':{
if (!q) return reply(`Contoh :\n${prefix+command} @adiwajshing/baileys`)
var x = await fetchJson(`https://api.popcat.xyz/npm?q=${q}`)
if (x.error) return reply(x.error)
var npm_text =`*NPM STALKER*
name : ${x.name}
version : ${x.version}
description : ${x.description}
author : ${x.author}
author_email : ${x.author_email}
last_published : ${x.last_published}
maintainers : ${x.maintainers}
repository : ${x.repository}

keywords : ${x.keywords}`
reply(npm_text)
}
addCmd(command, 1, db_dashboard)
break
case 'stalkff':{
if (!q) return reply('Ex: #stalkff idff\n\ncontoh:\n#stalkff 1903450988')
let data_ff = await stalkff(q)
if (data_ff.status !== 200) return reply('Error id tidak di temukan')
reply(data_ff.nickname)
}
addCmd(command, 1, db_dashboard)
break
case 'stalkml':{
if (!q) return reply('Ex: #stalkml id&zone\n\ncontoh:\n#stalkml 738367068&8944')
var data_ml = await stalkml(q.split('&')[0], q.split('&')[1])
if (data_ml.status !== 200) return reply('Error id/zone tidak di temukan')
reply(data_ml.nickname)
}
break
case 'stalkaov':{
if (!q) return reply(`Ex: ${prefix+command} id\n\ncontoh:\n${prefix+command} 293306941441181`)
let anu = await fetchJson(`https://zenzapis.xyz/stalker/nickaov?apikey=${setting.api_zenz}&query=${q}`)
if (anu.result.message) return reply(anu.result.message)
reply(anu.result.userName)
}
break
case 'stalkcod':{
if (!q) return reply(`Ex: ${prefix+command} id\n\ncontoh:\n${prefix+command} 6290150021186841472`)
let anu = await fetchJson(`https://zenzapis.xyz/stalker/nickcod?apikey=${setting.api_zenz}&query=${q}`)
if (anu.result.message) return reply(anu.result.message)
reply(anu.result.userName)
}
break
case 'stalknimotv':{
if (!q) return reply(`Ex: ${prefix+command} id\n\ncontoh:\n${prefix+command} 2753124392`)
let anu = await fetchJson(`https://zenzapis.xyz/stalker/nicknimotv?apikey=${setting.api_zenz}&query=${q}`)
if (anu.status == false) return reply('id tidak di temukan')
reply(anu.result.userName)
}
break
/*case 'hrg':
const sections = [
//batas

{title: "Topup Diamond & Voucher Game",
rows: [
{title: "Diamond Free Fire", rowId: prefix+"topup_ff", description: "Menampilkan list harga Diamond Free Fire"},
{title: "Membership Free Fire Murah", rowId: prefix+"topup_mmff", description: "Menampilkan list harga Membership Free Fire Murah"},
{title: "Diamond Mobile Legends", rowId: prefix+"topup_ml", description: "Menampilkan list harga Diamond Mobile Legends"},
{title: "Chip Higgs Domino", rowId: prefix+"topup_hd", description: "Menampilkan list harga Chip Higgs Domino"},
{title: "Arena Of Valor", rowId: prefix+"topup_aov", description: "Menampilkan list harga Voucher Arena Of Valor"},
{title: "Dragon Raja Sea", rowId: prefix+"topup_dgr", description: "Menampilkan list harga Dragon Raja Coupons"},
]},
{title: "PPOB Murah Promo",
rows: [
{title: "Token PLN Promo", rowId: prefix+"list_token_pln", description: "Menampilkan list Token Listrik PLN Promo"},

]}
//batas
]
let isian = `List harga produk yang kami
sediakan, silahkan pilih salah satu.`
const listMessage = {
text: isian,
buttonText: "Klik Disini",
sections
}
const tessgh = await conn.sendMessage(from, listMessage)
break
case 'orderr':
let data_topup_target = q
axios({
method: "POST",
url: "https://atlantic-pedia.co.id/api/pulsa",
data: qs.stringify({
key: setting.apikey_antlatic,
action: 'order',
service: 'PLN20',
target: data_topup_target
})
}).then(res => {
console.log(res)
})*/                  
break
case 'top_pln':
axios({
method: 'POST',
url: 'https://www.atlantic-pedia.co.id/api/pulsa',
data: qs.stringify({
key: setting.apikey_antlatic,
action: "services"
})
}).then(res => {
var regExcomp = (a, b) => {
var aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
var bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));
return aPrice - bPrice
};
var listff = [];
console.log(res)
for (let x of res.data.data) {
if (x.code.includes("PLN")) {
listff.push(x)
}
}
var teks = `*List Harga Diamond PLN*\n\n`
listff.sort(regExcomp)
for (let i of listff) {
teks += `*Title :* ${i.name}\n*Harga :* Rp${toRupiah(i.price)}\n*Status :* ${i.status}\n\n`
}
teks += `Silahkan isi Saldo terlebih dahulu jika ingin TopUp, ketik ${prefix}deposit untuk mengisi saldo, dan ketik ${prefix}topup untuk TopUp`
reply(teks)
})
case 'top_pln':
let tujuannn = q
axios({
method: 'POST',
url: 'https://www.atlantic-pedia.co.id/api/pulsa',
data: qs.stringify({
key: setting.apikey_antlatic,
action: "services"
})
}).then(res => {
const compare = (a, b) => {
const aPrice = Number(a.price.replace(/[^0-9.-]+/g,""));
const bPrice = Number(b.price.replace(/[^0-9.-]+/g,""));

return aPrice - bPrice
};

let myA = [];
let row_list_aov = [];
for (let x of res.data.data) {
if (x.code.includes("PLN20")) {
myA.push(x)
}
}

myA.sort(compare);
for (let y of myA) {
row_list_aov.push({
title: y.name+` ${y.status == 'empty' ? '(Kosong)' : ''}`,
rowId: `#bayar_trx ${tujuannn}|${y.code}|${y.price}`,
description: `Harga: Rp${toRupiah(Number(y.price))}`
})
}
var listMessage = {
text: "Silahkan pilih jumlah yang ingin di beli",
buttonText: "Touch me senpai",
sections: [
{
title: "PLN20 PAYMENT",
rows: row_list_aov
}
]
}
conn.sendMessage(from, listMessage)
})
break
case 'bayar_trx':
if (_saldo.checkSaldonya(sender, db_saldo_user) < Number(harga_nya)) return reply("Maaf saldo kamu kurang silahkan deposit terlebih dahulu.")
let harga_nya = q.split('|')[2]
axios({
method: 'POST',
url: 'https://www.atlantic-pedia.co.id/api/pulsa',
data: qs.stringify({
key: setting.apikey_antlatic,
action: "order",
service: q.split('|')[1],
target: q.split('|')[0]
})
}).then(r => {
if(r.data.result == false) return reply('Tranksaksi gagal Saldo sistem/server tidak mencukupi')
let text_prosess =`*?????? KONFIRMASI TOPUP ??????*

 ??? *Status :* Pending
 ??? *Layanan :* ${q.split('|')[1]}
 ??? *Harga :* Rp${toRupiah(q.split('|')[2])}
 ??? *Target :* ${q.split('|')[0]}

Apakah data tersebut sudah benar? akan gagal apabila terdapat kesalahan input.

_Klik button Y untuk melanjutkan, N untuk membatalkan_
_Pilih salah satu button yah, di pencet 2 izin Blokir ???_
`
let but_checkstatus = [
{ buttonId: `${prefix}cek_status ${r.data.data.trxid}|${q.split('|')[0]}|${q.split('|')[2]}`, buttonText: { displayText: 'Y' }, type: 1 },
{ buttonId: `${prefix}batal_trx ${r.data.data.trxid}`, buttonText: { displayText: 'N' }, type: 1 }
]
var buttonMessage = {
text: text_prosess,
footer: 'APP PREMIUM STORE ?? 2022',
buttons: but_checkstatus,
headerType: 1
}
conn.sendMessage(from, buttonMessage, { quoted: fkontak })
})
break
case 'batal_trx':
reply(`Baik kak, Transaksi Dengan ID : ${q.split(' ')[0]} dibatalkan ????`)
break
case 'cek_status':
axios({
method: 'POST',
url: 'https://www.atlantic-pedia.co.id/api/pulsa',
data: qs.stringify({
key: setting.apikey_antlatic,
action: "status",
trxid: q.split('|')[0]
})
}).then(r => {
console.log(r)
if (r.data.data.status === "success") {
reply(`*?????? SUKSES TOPUP ??????*

 ??? *Status:* Success
 ??? *ID Order:* ${r.data.data.trxid}
 ??? *Layanan:* ${r.data.data.service}
 ??? *Harga :* Rp${toRupiah(q.split('|')[2])}
 ??? *Target:* ${q.split('|')[1]}

_Terimakasih kak sudah order ??????_
_Cek sisa saldo kamu ketik #me_`)
_saldo.kuranginSaldonya(sender, Number(q.split('|')[2]), db_saldo_user)
clearInterval(intervals);
return;
 } else if (r.data.data.status == 'error') {
 reply(`Mohon Maaf, Sedang terjadi kesalahan untuk service *${r.data.data.service}*, Silahkan pilih service lain atau coba lagi di lain waktu ??????`)
 clearInterval(intervals);
return;
 }
})
break
//PEMBATAS
default:
if (!isGroup && !isCmd) {
if (cekUser("id", sender) == null) return
if (cekUser("teman", sender) == false) return
const reactionMessage = { react: { text: "???????", key: msg.key}}
conn.sendMessage(from, reactionMessage)
if (m.messages[0].type == "conversation" || m.messages[0].type == "extendedTextMessage") {
try{ var text1 = m.messages[0].message.extendedTextMessage.text } catch (err) { var text1 = m.messages[0].message.conversation }
conn.sendMessage(cekUser("teman", sender), {text: text1 }, {quoted:{ key: {fromMe: false, participant: `${botNumber}`, ...(from ? { remoteJid: "status@broadcast" } : {})},message: {"conversation": "???????????? *PESAN-DIBALAS* ????????????"}} })
let menfes_kosong = "[]"
db_menfes.splice(menfes_kosong)
fs.writeFileSync('./database/menfess.json', JSON.stringify(db_menfes))
reply('Pesan balasan kamu diteruskan')
}}
}} catch (err) {
console.log(color('[ERROR]', 'red'), err)
conn.sendMessage(`${setting.contactOwner}@s.whatsapp.net`, { text: `${err}` })
}}