const config = require("../musniJson/musniConfig.json");
const guardAndBackupConfig = require("../../guardAndBackupConfig.json");
const Discord = require("discord.js");
const fs = require('fs');
module.exports = message => {
if(message.guild.id !== config.guildID) return
//if(!guardAndBackupConfig.whitelist.includes(message.author.id) && message.author.id !== message.guild.ownerID && !message.guild.members.cache.get(message.author.id).roles.cache.some(x => guardAndBackupConfig.whitelist.includes(x.id))) return
if(message.content.startsWith("!whitelist") || message.content.startsWith(".whitelist")) {
let args = message.content.split(' ')
let whitelist = message.mentions.members.first() || message.guild.members.cache.get(args.slice(1).join(' ')) || message.mentions.roles.first() || message.guild.roles.cache.get(args.slice(1).join(' '))
if(args.slice(1).join(' ') === 'list') {
let embed = new Discord.MessageEmbed().setAuthor(message.guild.name,message.guild.iconURL({dynamic:true})).setColor(config.setColor).setFooter(config.setFooter).setTimestamp()
let whitelistArr = []
whitelistArr.push(guardAndBackupConfig.whitelist.filter(x => message.guild.members.cache.get(x) || !message.guild.roles.cache.get(x)).map(a => `<@${a}>`).join('\n'))
whitelistArr.push(guardAndBackupConfig.whitelist.filter(x => message.guild.roles.cache.get(x) || !message.guild.members.cache.get(x)).map(a => `<@&${a}>`).join('\n'))
embed.addField("Whitelist",whitelistArr)
message.channel.send(embed)
} else { 
let embed2 = new Discord.MessageEmbed().setAuthor(message.guild.name,message.guild.iconURL({dynamic:true})).setColor(config.setColor).setFooter(config.setFooter).setTimestamp()
if(!whitelist) return message.react(client.emoji.no.getEmojiID)
message.react(client.emoji.yes.getEmojiID)
//message.channel.send(embed2.setDescription(`<@${args}> Başarı ile Whiteliste Eklendi!`))
let arr = guardAndBackupConfig.whitelist
if(arr.includes(whitelist.id)) {
arr = arr.filter(x => x !== whitelist.id)
guardAndBackupConfig.whitelist = arr
fs.writeFile("./../guardAndBackupConfig.json", JSON.stringify(guardAndBackupConfig,null,2), (err) => {
if (err) console.log(err);
});
let embed = new Discord.MessageEmbed().setAuthor(message.guild.name,message.guild.iconURL({dynamic:true})).setColor(config.setColor).setFooter(config.setFooter).setTimestamp()
let whitelistArr = []
whitelistArr.push(guardAndBackupConfig.whitelist.filter(x => message.guild.members.cache.get(x) || !message.guild.roles.cache.get(x)).map(a => `<@${a}>`).join('\n'))
whitelistArr.push(guardAndBackupConfig.whitelist.filter(x => message.guild.roles.cache.get(x) || !message.guild.members.cache.get(x)).map(a => `<@&${a}>`).join('\n'))
embed.addField("Whitelist",whitelistArr)
message.channel.send(embed)
} else { 
arr.push(whitelist.id)
guardAndBackupConfig.whitelist = arr
fs.writeFile("./../guardAndBackupConfig.json", JSON.stringify(guardAndBackupConfig,null,2), (err) => {
if (err) console.log(err);
let embed = new Discord.MessageEmbed().setAuthor(message.guild.name,message.guild.iconURL({dynamic:true})).setColor(config.setColor).setFooter(config.setFooter).setTimestamp()
let whitelistArr = []
whitelistArr.push(guardAndBackupConfig.whitelist.filter(x => message.guild.members.cache.get(x) || !message.guild.roles.cache.get(x)).map(a => `<@${a}>`).join('\n'))
whitelistArr.push(guardAndBackupConfig.whitelist.filter(x => message.guild.roles.cache.get(x) || !message.guild.members.cache.get(x)).map(a => `<@&${a}>`).join('\n'))
embed.addField("Whitelist",whitelistArr)
message.channel.send(embed)
});
}
}
}
};