const config = require("../musniJson/musniConfig.json");
const guardAndBackupConfig = require("../../guardAndBackupConfig.json");
const Discord = require("discord.js");

module.exports = async role => {
if(role.guild.id !== config.guildID) return
let entry = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first());
if (!entry || !entry.executor || entry.executor.id === client.user.id || entry.executor.id === role.guild.ownerID || Date.now() - entry.createdTimestamp > 5000 ) return;
if(guardAndBackupConfig.whitelist.includes(entry.executor.id) || role.guild.members.cache.get(entry.executor.id).roles.cache.some(x => guardAndBackupConfig.whitelist.includes(x.id))) return
let embed = new Discord.MessageEmbed().setAuthor(role.guild.name,role.guild.iconURL({dynamic:true})).setColor(config.setColor).setFooter(config.setFooter).setTimestamp()
role.delete();
role.guild.members.ban(entry.executor.id); 
if (client.channels.cache.get(config.log)) client.channels.cache.get(config.log).send(embed.setDescription(`${entry.executor.tag} (${entry.executor.id}) kullanıcısı \`${role.name}\` isimli rol açtığı için banlandı!`));  
};