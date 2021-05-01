const config = require("../musniJson/musniConfig.json");


module.exports = client => {
if(client.channels.cache.get(config.voiceChannelID)) client.channels.cache.get(config.voiceChannelID).join()
console.log("Ready ! ");  
client.user.setPresence("dnd");  
client.user.setActivity(config.botStatus, {type: "PLAYING"})
setInterval(function(){ 
client.user.setActivity(config.botStatus, {type: "PLAYING"})
}, 60000);
setInterval(function(){ 
if(client.channels.cache.get(config.voiceChannelID)) client.channels.cache.get(config.voiceChannelID).join()
}, 3600000);
};