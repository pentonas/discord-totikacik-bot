const config = require("../musniJson/musniConfig.json");
const guardAndBackupConfig = require("../../guardAndBackupConfig.json");
const Discord = require("discord.js");

module.exports = message => {
if(message.guild.id !== config.guildID) return
if(!guardAndBackupConfig.whitelist.includes(message.author.id) && message.author.id !== message.guild.ownerID && !message.guild.members.cache.get(message.author.id).roles.cache.some(x => guardAndBackupConfig.whitelist.includes(x.id))) return //message.channel.send("Bu Komutu Kullanamazsın :x:")
if(message.content === "!backup" || message.content === ".backup") {
message.channel.send("Sunucunun Backupu Alındı!")
let embed = new Discord.MessageEmbed().setAuthor(message.guild.name,message.guild.iconURL({dynamic:true})).setColor(config.setColor).setFooter(config.setFooter).setTimestamp()
client.roleBackup()
if (client.channels.cache.get(config.log)) client.channels.cache.get(config.log).send(embed.setDescription(`${message.author}, Tarafından Sunucu da olan rollerin Backup Aldı.`));  
}
};