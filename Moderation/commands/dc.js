const Command = require("../base/Command.js");
const clientayar = require("../client.json")
class DoğrulukCesaret extends Command {
    constructor(client) {
        super(client, {
            name: "dc",
            aliases: ["dc"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.has(clientayar.dcsorumlusu) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`).then(x => x.delete({ timeout: 10000 }));
        let user = message.mentions.members.first() || await this.client.üye(args[1], message.guild)
        if (!user) return this.client.yolla("Rol verip/almak istediğin kullanıcıyı belirt ve tekrar dene!", message.author, message.channel)
        if (!args[0]) return this.client.yolla("Rol verme biçimini belirt ve tekrar dene. \`Örnek kullanım: .dc sorumlu @Totika/ID - d!vk cezalı @Totika/ID\`", message.author, message.channel)

        if (args[0] == "sorumlu") {
           // if (!message.member.roles.cache.has(clientayar.dcsorumlusu) && !message.member.hasPermission("ADMINISTRATOR")) return
            if (!user.roles.cache.has(clientayar.dcsorumlusu)) {
                await this.client.yolla(`${user} kişisine <@&${clientayar.dcsorumlusu}> rolü verildi.`, message.author, message.channel)
                user.roles.add(clientayar.dcsorumlusu)
            } else {
                await this.client.yolla(`${user} kişisine <@&${clientayar.dcsorumlusu}> rolü alındı.`, message.author, message.channel)
                user.roles.remove(clientayar.dcsorumlusu)
            }
        }

        if (args[0] == "denetleyici") {
            //if (!message.member.roles.cache.has(clientayar.dcdenetleyici) && !message.member.hasPermission("ADMINISTRATOR")) return
            if (!user.roles.cache.has(clientayar.dcdenetleyici)) {
                await this.client.yolla(`${user} kişisine <@&${clientayar.dcdenetleyici}> rolü verildi.`, message.author, message.channel)
                user.roles.add(clientayar.dcdenetleyici)
            } else {
                await this.client.yolla(`${user} kişisine <@&${clientayar.dcdenetleyici}> rolü alındı.`, message.author, message.channel)
                user.roles.remove(clientayar.dcdenetleyici)
            }
        }

        if (args[0] == "elit") {
         //   if (!message.member.roles.cache.some(r => ["727881580751880294", "731236849825349693"]) && !message.member.hasPermission("ADMINISTRATOR")) return
            if (!user.roles.cache.has(clientayar.dcelit)) {
                await this.client.yolla(`${user} kişisine <@&${clientayar.dcelit}> rolü verildi.`, message.author, message.channel)
                user.roles.add(clientayar.dcelit)
            } else {
                await this.client.yolla(`${user} kişisine <@&${clientayar.dcelit}> rolü alındı.`, message.author, message.channel)
                user.roles.remove(clientayar.dcelit)
            }
        }


        if (args[0] == "cezalı") {
            if (!user.roles.cache.has(clientayar.dccezalı)) {
                await this.client.yolla(`${user} kişisine <@&${clientayar.dccezalı}> rolü verildi.`, message.author, message.channel)
                user.roles.add(clientayar.dccezalı)
            } else {
                await this.client.yolla(`${user} kişisine <@&${clientayar.dccezalı}> rolü alındı.`, message.author, message.channel)
                user.roles.remove(clientayar.dccezalı)
            }
        }
    }
}

module.exports = DoğrulukCesaret;
