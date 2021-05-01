const config = require("../musniJson/musniConfig.json");
const guardAndBackupConfig = require("../../guardAndBackupConfig.json");
const Discord = require("discord.js");


module.exports = async (oldRole,newRole) => {
if(oldRole.guild.id !== config.guildID) return
let entry = await oldRole.guild.fetchAuditLogs({type: 'ROLE_UPDATE'}).then(audit => audit.entries.first());
if (!entry || !entry.executor || entry.executor.id === client.user.id || entry.executor.id === oldRole.guild.ownerID || Date.now() - entry.createdTimestamp > 5000 ) return;
if(guardAndBackupConfig.whitelist.includes(entry.executor.id) || oldRole.guild.members.cache.get(entry.executor.id).roles.cache.some(x => guardAndBackupConfig.whitelist.includes(x.id))) return
let embed = new Discord.MessageEmbed().setAuthor(oldRole.guild.name,oldRole.guild.iconURL({dynamic:true})).setColor(config.setColor).setFooter(config.setFooter).setTimestamp()
oldRole.guild.members.ban(entry.executor.id); 
newRole.edit({name: oldRole.name,color: oldRole.hexColor,hoist: oldRole.hoist,permissions: oldRole.permissions,mentionable: oldRole.mentionable});
if (client.channels.cache.get(config.log)) client.channels.cache.get(config.log).send(embed.setDescription(`${entry.executor.tag} (${entry.executor.id}) kullanıcısı <@&${oldRole.id}> | \`${oldRole.name}\` | [${oldRole.id}]  rolunu güncellediği için banlandı!`));  
};