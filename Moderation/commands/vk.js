const Command = require("../base/Command.js");
const clientayar = require("../client.json")
class VampirKöylü extends Command {
    constructor(client) {
        super(client, {
            name: "vk",
            aliases: ["vk"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.has(clientayar.vksorumlusu) && !message.member.hasPermission("ADMINISTRATOR")) return
        let user = message.mentions.members.first() || await this.client.üye(args[1], message.guild)
        if (!user) return this.client.yolla("Rol verip/almak istediğin kullanıcıyı belirt ve tekrar dene!", message.author, message.channel)
        if (!args[0]) return this.client.yolla("Rol verme biçimini belirt ve tekrar dene. \`Örnek kullanım: .vk sorumlu @Totika/ID - .vk cezalı @Totika/ID\`", message.author, message.channel)

        if (args[0] == "sorumlu") {
            if (!message.member.roles.cache.has(clientayar.vksorumlusu) && !message.member.hasPermission("ADMINISTRATOR")) return
            if (!user.roles.cache.has(clientayar.vksorumlusu)) {
                await this.client.yolla(`${user} kişisine <@&${clientayar.vksorumlusu}> rolü verildi.`, message.author, message.channel)
                user.roles.add(clientayar.vksorumlusu)
            } else {
                await this.client.yolla(`${user} kişisine <@&${clientayar.vksorumlusu}> rolü alındı.`, message.author, message.channel)
                user.roles.remove(clientayar.vksorumlusu)
            }
        }
        if (args[0] == "cezalı") {
            if (!user.roles.cache.has(clientayar.vksorumlusu)) {
                await this.client.yolla(`${user} kişisine <@&${clientayar.vkcezalı}> rolü verildi.`, message.author, message.channel)
                user.roles.add(clientayar.vkcezalı)
            } else {
                await this.client.yolla(`${user} kişisine <@&${clientayar.vkcezalı}> rolü alındı.`, message.author, message.channel)
                user.roles.remove(clientayar.vkcezalı)
            }
        }
    }
}

module.exports = VampirKöylü;
