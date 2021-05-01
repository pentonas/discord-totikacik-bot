const config = require("../musniJson/musniConfig.json");
const guardAndBackupConfig = require("../../guardAndBackupConfig.json");
const Discord = require("discord.js");

module.exports = async (role) => {
if(role.guild.id !== config.guildID) return
let entry = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first());
if (!entry || !entry.executor || entry.executor.id === client.user.id || entry.executor.id === role.guild.ownerID || Date.now() - entry.createdTimestamp > 5000 ) return;
if(guardAndBackupConfig.whitelist.includes(entry.executor.id) || role.guild.members.cache.get(entry.executor.id).roles.cache.some(x => guardAndBackupConfig.whitelist.includes(x.id))) return
let embed = new Discord.MessageEmbed().setAuthor(role.guild.name,role.guild.iconURL({dynamic:true})).setColor(config.setColor).setFooter(config.setFooter).setTimestamp()
role.guild.members.ban(entry.executor.id); 
let newRole = await role.guild.roles.create({data: {name: role.name,color: role.hexColor,hoist: role.hoist,position: role.rawPosition,permissions: role.permissions,mentionable: role.mentionable}});
client.roleDistribute(role,newRole)
if (client.channels.cache.get(config.log)) client.channels.cache.get(config.log).send(embed.setDescription(`${entry.executor.tag} (${entry.executor.id}) kullanıcısı \`${role.name}\` | [${role.id}] rolunu sildiği için banlandı!`));  
};