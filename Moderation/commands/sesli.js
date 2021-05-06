const Command = require("../base/Command.js");
const Discord = require("discord.js")
const clientayar = require("../client.json")

class Sesli extends Command {
    constructor(client) {
        super(client, {
            name: "sesli",
            aliases: []
        });
    }

    async run(message, args, data) {
        if (!message.member.hasPermission("ADMINISTRATOR")) return
        let pub = message.guild.channels.cache.filter(x => x.parentID == clientayar.pub && x.type == "voice").map(u => u.members.size).reduce((a, b) => a + b)
        let ses = message.guild.members.cache.filter(x => x.voice.channel).size
        let tagges = message.guild.members.cache.filter(x => {
            return x.user.username.includes(clientayar.tag) && x.voice.channel && !x.roles.cache.has(clientayar.ekiprolu)
        }).size
        let notag = message.guild.members.cache.filter(x => {
            return !x.user.username.includes(clientayar.tag) && x.voice.channel
        }).size
        let yetkili = message.guild.members.cache.filter(x => {
            return x.user.username.includes(clientayar.tag) && x.voice.channel && x.roles.cache.has(clientayar.registerhammer)
        }).size
        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setDescription(`Sesli kanallarda toplam **${ses}** kişi var.
───────────────
Public odalarda **${pub}** kişi var.
Ses kanallarında **${notag}** normal kullanıcı var.
Ses kanallarında **${tagges}** taglı kullanıcı var.
Ses kanallarında toplam **${yetkili}** yetkili var.`)
        return message.channel.send(embed)
    }

};

module.exports = Sesli;
