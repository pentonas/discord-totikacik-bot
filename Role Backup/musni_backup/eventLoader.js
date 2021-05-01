const reqEvent = (event) => require(`./musniEvents/${event}`);
module.exports = client => {
client.on('ready', () => reqEvent('ready')(client));
client.on('message', reqEvent('roleBackup'));
client.on('message', reqEvent('whitelistAddOrRemove'));
//client.on('guildMemberUpdate', reqEvent('staffRole'));
client.on('roleCreate', reqEvent('roleCreate'));
client.on('roleUpdate', reqEvent('roleUpdate'));
client.on('roleDelete', reqEvent('roleDelete'));
};