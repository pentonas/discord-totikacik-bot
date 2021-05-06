const Command = require("../base/Command.js");
const clientayar = require("../client.json")
class Terapist extends Command {
    constructor(client) {
        super(client, {
            name: "terapist",
            aliases: ["terapist"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.has(clientayar.botCommandhammer) && !message.member.hasPermission("ADMINISTRATOR")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if(!user) return this.client.yolla("Rolü verip/almak istediğin kullanıcıyı belirt ve tekrar dene!", message.author, message.channel)
        if(!user.roles.cache.has(clientayar.terapist)) {
            await this.client.yolla(`${user} kişisine <@&${clientayar.terapist}> rolü verildi.`, message.author, message.channel)
            user.roles.add(clientayar.terapist)
        } else{
            await this.client.yolla(`${user} kişisine <@&${clientayar.terapist}> rolü alındı.`, message.author, message.channel)
            user.roles.remove(clientayar.terapist)
        }
    }
}

module.exports = Terapist;
