const Command = require("../base/Command.js");
const Discord = require("discord.js")
const cezalar = require("../models/cezalı.js")
const ceza = require("../models/cezalar.js")
const moment = require("moment")
require("moment-duration-format")
require("moment-timezone")
const sunucu = require("../models/sunucu-bilgi")
const clientayar = require("../client.json")
class Cezalı extends Command {
    constructor(client) {
        super(client, {
            name: "cezalı",
            aliases: ["jail"]
        });
    }

    async run(message, args, level) {
        if (!message.member.roles.cache.has(clientayar.jailhammer) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`).then(x => x.delete({ timeout: 10000 }));
        if (args.length < 1) return this.client.yolla("Bir kullanıcı etiketleyin veya kullanıcı ID giriniz.", message.author, message.channel)
        let user = message.mentions.users.first() || await this.client.users.fetch(args[0]).catch(e => console.log(e))
        if (!user) return this.client.yolla("Cezalıya atmak istediğin kullanıcı geçerli değil.", message.author, message.channel)
        if (!args.slice(1).join(" ")) return this.client.yolla("Sebep belirtmeden cezalı işlemi uygulayamazsın.", message.author, message.channel)
        if(message.guild.members.cache.has(user.id)) {
        let member = message.guild.members.cache.get(user.id)
        if (message.member.roles.highest.rawPosition < member.roles.highest.rawPosition) return this.client.yolla("Rolleri senden yüksek birine ses çekme işlemi uygulayamazsın.", message.author, message.channel)
        if (message.guild.members.cache.get(user.id).hasPermission("ADMINISTRATOR")) return this.client.yolla("Üst yetkiye sahip kişileri yasaklayamazsın!", message.author, message.channel)
        if (message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return this.client.yolla("Kendi rolünden yüksek kişilere işlem uygulayamazsın!", message.author, message.channel)
        }
        if (user.id == message.author.id) return this.client.yolla("Kullanıcılar kendilerine ceza-i işlem uygulayamaz.", message.author, message.channel)
        let banNum = this.client.jailLimit.get(message.author.id) || 0

        let count = await ceza.countDocuments().exec();
        count = count == 0 ? 1 : count + 1;

        this.client.jailLimit.set(message.author.id, banNum + 1)
        if (banNum == 5) return this.client.yolla("Gün içerisinde çok fazla jail işlemi uyguladığınız için komut geçici olarak kullanımınıza kapatılmıştır.", message.author, message.channel)
        if (!message.guild.members.cache.has(user.id)) {
            const embedx = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setColor("RANDOM")
                .setDescription(`<@${user}> kişişine Cezalı Rolü verildi. (Ceza Numarası: ${count})`)
            message.channel.send(embedx)
            await cezalar.findOne({ user: user.id }, async (err, doc) => {
                if (doc) return this.client.yolla(`${user.tag} kullanıcısı veritabanında cezalı olarak gözüküyor.`, message.author, message.channel)
                if (!doc) {
                    const newPun = new cezalar({
                        user: user.id,
                        ceza: true,
                        yetkili: message.author.id,
                        tarih: moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL"),
                        sebep: args.slice(1).join(" ")
                    })
                    newPun.save().catch(e => console.log(e))
                }
                await ceza.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new ceza({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: count,
                        ceza: "Cezalı",
                        sebep: args.slice(1).join(" "),
                        tarih: moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL"),
                        bitiş: moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL")
                    })
                    newData.save().catch(e => console.error(e))
                    this.client.savePunishment()
                })
            })
        } else {
            await cezalar.findOne({ user: user.id }, async (err, doc) => {
                if (doc) return this.client.yolla(`${user.tag} kullanıcısı veritabanında cezalı olarak bulunuyor.`, message.author, message.channel)
                let member = message.guild.members.cache.get(user.id)
                let memberRoles = member.roles.cache.map(x => x.id)
                member.roles.set(member.roles.cache.has(clientayar.booser) ? [clientayar.booser, clientayar.cezalı] : [clientayar.cezalı]).catch(e => console.log(e))
                //member.roles.set(member.roles.cache.has("booster Rol") ? ["booster", "cezalırol"] : ["sadece ceza"]).catch(e => console.log(e))
                message.channel.send(`${this.client.ok} ${member} başarıyla cezalı rol verildi. (Ceza Numarası: \`#${count}\`)`)
                const başe = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor("RANDOM")
                    .setDescription(`${user} kişisine ${args.slice(1).join(" ")} sebebi ile cezalı rolü verildi.
                    Atılma Tarihi: ${moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL")}
                    Açılış Tarihi: \`Açılmaz\`
                    `)
                await this.client.channels.cache.get(clientayar.jaillog).send(başe)
                if (!doc) {
                    const newPun = new cezalar({
                        user: user.id,
                        ceza: true,
                        roller: memberRoles,
                        yetkili: message.author.id,
                        tarih: moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL"),
                        sebep: args.slice(1).join(" ")
                    })
                    newPun.save().catch(e => console.log(e))
                }
                await ceza.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new ceza({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: id + 1,
                        ceza: "Cezalı",
                        sebep: args.slice(1).join(" "),
                        tarih: moment(Date.parse(new Date().toLocaleString("tr-TR", { timeZone: "Asia/Istanbul" }))).format("LLL"),
                        bitiş: "-"
                    })
                    newData.save().catch(e => console.error(e))
                    this.client.savePunishment()
                })
            })
        }


    }
}

module.exports = Cezalı;
