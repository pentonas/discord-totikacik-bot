const config = require("./musniJson/musniConfig.json");
const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://kaantotika:kaantotika@totika.wybpx.mongodb.net/immoralbackup?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
const Database = require("./models/roleBackup.js");
const guardAndBackupConfig = require("./../guardAndBackupConfig.json");
module.exports = client => {
client.checkAdvertise = function(message) {
var regex = new RegExp(/(discord.gg|http|.gg|.com|.net|.org|İnstagram|Facebook|watch|Youtube|youtube|facebook|instagram)/)
return regex.test(message.content)
}

client.dateConvert = function(date) {
const startedAt = Date.parse(date);
var msecs = Math.abs(new Date() - startedAt);

const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
msecs -= years * 1000 * 60 * 60 * 24 * 365;
const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
msecs -= months * 1000 * 60 * 60 * 24 * 30;
const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
msecs -= days * 1000 * 60 * 60 * 24;
const hours = Math.floor(msecs / (1000 * 60 * 60));
msecs -= hours * 1000 * 60 * 60;
const mins = Math.floor((msecs / (1000 * 60)));
msecs -= mins * 1000 * 60;
const secs = Math.floor(msecs / 1000);
msecs -= secs * 1000;

var string = "";
if (years > 0) string += `${years} yıl ${months} ay`
else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks+" hafta" : ""}`
else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days+" gün" : ""}`
else if (days > 0) string += `${days} gün ${hours > 0 ? hours+" saat" : ""}`
else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins+" dakika" : ""}`
else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs+" saniye" : ""}`
else if (secs > 0) string += `${secs} saniye`
else string += `0 saniye`;

string = string.trim();
return `${string}`;
};


client.chunk = function (array,size) {
array.reduce((acc, _, i) => {
if (i % size === 0) acc.push(array.slice(i, i + size))
return acc
}, [])
}

client.cleanNick = function (nick) {
let array = ['/','.','a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
let cıkarılcaklar = []
for(var i=0;i <= nick.length-1;i++) {
if(!array.includes(nick.toLowerCase()[i])) cıkarılcaklar.push(nick.toLowerCase()[i])
}
cıkarılcaklar.forEach(u=> {
nick = nick.replace(u,'')
})
return nick
}

client.roleBackup = function () {
if(!client.guilds.cache.get(config.guildID)) return 
console.log('SUNUCUNUN BACKUPU ALINDI!')
client.guilds.cache.get(config.guildID).roles.cache.filter(a =>!a.managed || !a.editable || a.name !== "@everyone").forEach(u => {
let roleChannelOverwrites = [];
client.guilds.cache.get(config.guildID).channels.cache.filter(c => c.permissionOverwrites.has(u.id)).forEach(r => {
let permissionOverwrite = {}
r.permissionOverwrites.get(u.id).allow.toArray().forEach(u => permissionOverwrite[u] = true)
r.permissionOverwrites.get(u.id).deny.toArray().forEach(u => permissionOverwrite[u] = false)
roleChannelOverwrites.push({channelID : r.id , permissionOverwrites: permissionOverwrite})
});
Database.findOne({guildID: config.guildID, roleID: u.id}, async (err, backupedRole) => {
if (!backupedRole) {
let newDataSchema = new Database({
_id: new mongoose.Types.ObjectId(),
guildID: config.guildID,
roleID: u.id,
roleName: u.name,
roleColor: u.hexColor,
roleHoist: u.hoist,
rolePosition: u.position,
rolePermissions: u.permissions,
roleMentionable: u.mentionable,
roleBackupTime: Date.now(),
roleMembers: u.members.map(a => a.id),
roleChannelOverwrites: roleChannelOverwrites
});
newDataSchema.save();
} else {
backupedRole.roleName = u.name;
backupedRole.roleColor = u.hexColor;
backupedRole.roleHoist = u.hoist;
backupedRole.rolePosition = u.position;
backupedRole.rolePermissions = u.permissions;
backupedRole.roleMentionable = u.mentionable;
backupedRole.roleBackupTime = Date.now();
backupedRole.roleMembers = u.members.map(m => m.id);
backupedRole.roleChannelOverwrites = roleChannelOverwrites;
backupedRole.save();
};
});
});
};


client.roleDistribute = async function (role,newRole) {
if(!client.guilds.cache.get(config.guildID)) return 
Database.findOne({guildID: config.guildID, roleID: role.id}, async (err, roleDistributeData) => {
if(!roleDistributeData) return console.log('Kayıtlı veri bulunamadı!')
if(roleDistributeData.roleChannelOverwrites) {
roleDistributeData.roleChannelOverwrites.forEach(async r => {
let channel = role.guild.channels.cache.get(r.channelID);
if (!channel) return;
await channel.createOverwrite(newRole,r.permissionOverwrites);
});
roleDistributeData.roleMembers.forEach(async r => {
if(!role.guild.members.cache.get(r) || role.guild.members.cache.get(r).roles.cache.get(newRole.id)) return;
await role.guild.members.cache.get(r).roles.add(newRole.id)
})
}
})
};
};