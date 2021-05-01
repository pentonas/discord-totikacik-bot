const Discord = require("discord.js");
const { Client, RichEmbed } = require("discord.js");
const { CommandHandler } = require("djs-commands");
const client  = global.client = new Client();
const config = require("./musniJson/musniConfig.json");
require('moment-duration-format');
const mongoose = require('mongoose')
require('./eventLoader.js')(client);
require('./functions.js')(client);

client.on("message", msg => {
var dm = client.users.cache.get("823317022100029460")
if(msg.channel.type === "dm") {
if(msg.author.id === client.user.id) return;
const botdm = new Discord.MessageEmbed()
.setTitle(`${client.user.username} Dm`)
.setTimestamp()
.setColor("RED")
.setThumbnail(`${msg.author.avatarURL()}`)
.addField("Gönderen", msg.author.tag)
.addField("Gönderen ID", msg.author.id)
.addField("Gönderilen Mesaj", msg.content)
dm.send(botdm)
}
if(msg.channel.bot) return;
});
client.login(config.token)
client.emoji = {
"afk" : {getEmoji:"<a:afk:806788397179338773>",getEmojiID:"806788397179338773"},
"yıldız": {getEmoji:"<a:yildiz:807322102637396018>",getEmojiID:"806788397179338773"},
"tag": {getEmoji:"<a:sentinus:810442411619647519>",getEmojiID:"810442411619647519"},
"yes": {getEmoji:"<a:totika_onay:823243147294670898> ",getEmojiID:"823243147294670898"},
"no": {getEmoji:"<a:totika_iptal:823243153686921266>",getEmojiID:"823243153686921266"}
}
client.mongoConnect = () => {
mongoose.connect(`xdxdxd`, {useNewUrlParser: true, useUnifiedTopology: true})
};

