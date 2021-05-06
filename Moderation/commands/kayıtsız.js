const Command = require("../base/Command.js");
const clientayar = require("../client.json")
class Terapist extends Command {
    constructor(client) {
        super(client, {
            name: "kayıtsız",
            aliases: ["terapist"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.has(clientayar.registerhammer) && !message.member.hasPermission("ADMINISTRATOR")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if(!user) return this.client.yolla("Kayıtsız Rolü verip/almak istediğin kullanıcıyı belirt ve tekrar dene!", message.author, message.channel)
        if(!user.roles.cache.has(clientayar.registerhammer)) {
            await this.client.yolla(`${user} kişisine <@&${clientayar.kayıtsız}> rolü verildi.`, message.author, message.channel)
            user.roles.add(clientayar.kayıtsız)
            user.roles.remove([clientayar.kayıtsız , clientayar.erkekrol1 , clientayar.kadınrol1 , clientayar.erkekrol2 , clientayar.kadınrol2 , clientayar.vip , clientayar.muzisyen])
        } else{
            await this.client.yolla(`${user} kişisine <@&${clientayar.kayıtsız}> rolü alındı.`, message.author, message.channel)
        }
    }
}

module.exports = Terapist;
