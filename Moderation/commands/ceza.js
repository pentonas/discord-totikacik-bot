const Command = require("../base/Command.js");
const data = require("../models/cezalar.js")
const clientayar = require("../client.json")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
const {table} = require('table');
const Discord = require("discord.js");
class Ceza extends Command {
    constructor(client) {
        super(client, {
            name: "ceza",
            aliases: ["ceza"]
        });
    }

    async run(message, args, perm) {

        if (!message.member.roles.cache.has(clientayar.jailhammer) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`).then(x => x.delete({ timeout: 10000 }));
        if(!args[0]) return this.client.yolla("Kontrol etmek istediğin ceza numarasını girmelisin.", message.author, message.channel)
        await data.findOne({ihlal: args[0]}, async (err, res) => {
            if(!res) return this.client.yolla("Belirttiğin numaralı ceza bilgisi bulunamadı.", message.author, message.channel)
            let user = message.guild.members.cache.get(res.user)
            const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
            //.setThumbnail(user.user.displayAvatarURL({dynamic:true}))
            .addFields(
                { name: 'Ceza Türü', value: res.ceza },
                { name: 'Ceza Atan Yetkili:', value: "<@"+res.yetkili+">", inline: false },
                { name: 'Ceza Sebebi:', value: res.sebep, inline: false },
                { name: 'Ceza Başlangıç:', value: res.tarih, inline: false },
                { name: 'Ceza Bitiş:', value: res.bitiş, inline: false },
            )
            .setColor("RANDOM")
            .setDescription("<@"+res.user+"> kişisine uygulanan "+res.ihlal+" numaralı ceza bilgisi;")
            message.channel.send(embed)
           
    })
    }
}

module.exports = Ceza;
