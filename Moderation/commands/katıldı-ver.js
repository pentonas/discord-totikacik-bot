const Command = require("../base/Command.js");
const Discord = require("discord.js");
const clientayar = require("../client.json")
class Toplantı extends Command {
    constructor(client) {
        super(client, {
            name: "yoklama",
            aliases: ["yoklama"]
        });
    }

    async run(message, args, level) {
        if (!message.member.hasPermission("ADMINISTRATOR")) return
        message.channel.send(""+this.client.ok+" Odadaki yetkililere katıldı permi veriliyor. Bu işlem uzun sürebilir.")
        let toplantıdaOlanlarx = message.member.voice.channel.members.filter(x => {
            return x.roles.cache.has(clientayar.katıldırolu)
        }).map(x => x.id)
        for (let i = 0; i < toplantıdaOlanlarx.length; i++) {
            setTimeout(() => {
                message.guild.members.cache.get(toplantıdaOlanlarx[i]).roles.add(clientayar.katıldırolu)
            }, (i + 1) * 1000)
        }
        message.channel.send("Odadaki tüm yetkililere katıldı permi başarıyla verildi.")

    }
}
module.exports = Toplantı