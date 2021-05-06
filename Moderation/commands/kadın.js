const Command = require("../base/Command.js");
const Discord = require("discord.js")
const kayıtlar = require("../models/kayıt.js")
const isimler = require("../models/isimler.js")
const clientayar = require("../client.json")

class Kadın extends Command {
    constructor(client) {
        super(client, {
            name: "kadın",
            usage: "kadın",
            aliases: ["k"]
        });
    }

    async run(message, args, level) {
        if(!message.member.roles.cache.has(clientayar.registerhammer) && !message.member.hasPermission("ADMINISTRATOR")) return
        let user = this.client.kayıtlar.has(message.author.id) ? await this.client.üye(this.client.kayıtlar.get(message.author.id), message.guild) : message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Kaydetmek istediğin kullanıcıyı düzgünce belirt ve tekrar dene!", message.author, message.channel)
        if (!args[1]) return this.client.yolla("Kaydetmek istediğin isim ve yaşı belirtmelisin.", message.author, message.channel)
        if (!args[2]) return this.client.yolla("Kaydetmek istediğin isim ve yaşı belirtmelisin.", message.author, message.channel)
        if (user.roles.cache.some(x => [""].includes(x.id))) {
            if (this.client.kayıtlar.has(message.author.id)) {
                this.client.kayıtlar.delete(message.author.id)
            }
            return this.client.yolla("<@" + user.id + "> kullanıcısı zaten kayıtlı olduğundan dolayı kayıt işlemi iptal edildi.", message.author, message.channel)
        }
        await kayıtlar.findOne({ user: message.author.id }, async (err, res) => {
            if (res) {
                if (res.kayıtlar.includes(user.id)) {
                    res.kadın = res.kadın
                    res.save().catch(e => console.log(e))
                } else {
                    res.kayıtlar.push(user.id)
                    res.kadın = res.kadın + 1
                    res.save().catch(e => console.log(e))
                }
            } else if (!res) {
                let arr = []
                arr.push(user.id)
                const data = new kayıtlar({
                    user: message.author.id,
                    kadın: 1,
                    kadın: 0,
                    kayıtlar: arr
                })
                data.save().catch(e => console.log(e))
            }
            if (!user.roles.cache.has(clientayar.registerhammer)) {
                let isim = args[1].charAt(0).toUpperCase() + args[1].slice(1).toLowerCase()
                let yaş = args[2];
                user.user.username.includes(clientayar.tag) ? await user.setNickname(`${clientayar.tag} ${isim} | ${yaş}`) : await user.setNickname(`${clientayar.tag2} ${isim} | ${yaş}`)
                await user.roles.add([clientayar.kadınrol1, clientayar.kadınrol2])
                await user.roles.remove([clientayar.kayıtsız])
                const emux = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${user} kullanıcısı başarıyla <@&${clientayar.kadınrol1}> olarak kayıt edildi.`)
                    .setColor("RANDOM")
                    message.channel.send(emux)
                if (this.client.kayıtlar.has(message.author.id)) {
                    this.client.kayıtlar.delete(message.author.id)
                }
                this.client.channels.cache.get(clientayar.genelchat).send("Aramıza yeni biri katıldı! <@" + user.id + "> hoş geldin diyelim!")
            }
            isimler.findOne({ user: user.id }, async (err, res) => {
                let isim = args[1];
                let yaş = args[2];
                if (!res) {
                    let arr = []
                    arr.push({ isim: `${isim} | ${yaş}`, state: `<@&${clientayar.kadınrol1}>`, yetkili: message.author.id })
                    let newData = new isimler({
                        user: user.id,
                        isimler: arr
                    })
                    newData.save().catch(e => console.log(e))
                } else {
                    res.isimler.push({ isim: `${isim} | ${yaş}`, state: `<@&${clientayar.kadınrol1}>`, yetkili: message.author.id })
                    res.save().catch(e => console.log(e))
                }
            })
        })
    }
}

module.exports = Kadın;
