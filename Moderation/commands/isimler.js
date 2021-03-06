const Command = require("../base/Command.js");
const Discord = require("discord.js")
const isimler = require("../models/isimler.js")
const clientayar = require("../client.json")

class İsimler extends Command {
    constructor(client) {
        super(client, {
            name: "isimler",
            usage: "erkek",
            aliases: ["isimler"]
        });
    }

    async run(message, args, level) {
        if(!message.member.roles.cache.has(clientayar.registerhammer) && !message.member.hasPermission("ADMINISTRATOR")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Geçmiş isimlerine bakmak istediğin kullanıcıyı düzgünce belirt ve tekrar dene !", message.author, message.channel)

        isimler.findOne({ user: user.id }, async (err, res) => {
            if (!res) return this.client.yolla("<@" + user.id + "> kişisinin isim kayıtı veritabanında bulunmadı.", message.author, message.channel)
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setColor("RANDOM")
                .setDescription(`${user} kişisinin toplamda ${res.isimler.length} isim kayıtı bulundu.\n\n${res.isimler.map(x => `\`• ${x.isim}\` (${x.state})`).join("\n")}`)
            message.channel.send(embed)
        })
    }
}

module.exports = İsimler;
