const Command = require("../base/Command.js");
const Discord = require("discord.js")
const clientayar = require("../client.json")

class Say extends Command {
    constructor(client) {
        super(client, {
            name: "say",
            aliases: []
        });
    }

    async run(message, args, data) {
        if (!message.member.hasPermission("ADMINISTRATOR")) return
        let tag = this.client.users.cache.filter(x => x.username.includes(clientayar.tag)).size+100
        let ses = message.guild.members.cache.filter(x => x.voice.channel).size
        let members = message.guild.members.cache.size
        let online = message.guild.members.cache.filter(m => m.presence.status !== "offline").size
        let embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setDescription("`❯` Seste toplam **" + ses + "** kullanıcı var.\n`❯` Sunucumuzda toplam **" + members + "** üye var.\n`❯` Sunucumuzda toplam **" + online + "** çevrim içi üye var.\n`❯` Toplam **" + tag + "** kişi tagımıza sahip.")
        message.channel.send(embed);

    }

};

module.exports = Say;
