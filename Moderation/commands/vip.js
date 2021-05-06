const Command = require("../base/Command.js");
const clientayar = require("../client.json")
class Vip extends Command {
    constructor(client) {
        super(client, {
            name: "vip",
            aliases: ["vip"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.has(clientayar.botCommandhammer) && !message.member.hasPermission("ADMINISTRATOR")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if(!user) return this.client.yolla("Rolü verip/almak istediğin kullanıcıyı belirt ve tekrar dene!", message.author, message.channel)
        if(!clientayar.vip) return this.client.yolla(`${user} kişisine rolü vermek için o üyede rol olması gerek eğer rolü yoksa rolünü alamam`, message.author, message.channel)
        if(!user.roles.cache.has(clientayar.vip)) {
            await this.client.yolla(`${user} kişisine <@&${clientayar.vip}> rolü verildi.`, message.author, message.channel)
            user.roles.add(clientayar.vip)
        } else{
            await this.client.yolla(`${user} kişisine <@&${clientayar.vip}> rolü alındı.`, message.author, message.channel)
            user.roles.remove(clientayar.vip)
        }
    }
}

module.exports = Vip;
