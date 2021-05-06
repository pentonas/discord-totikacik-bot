const Command = require("../base/Command.js");
const data = require("../models/cezalar.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
const Discord = require("discord.js")
moment.locale("tr")
require("moment-timezone")
const tokuchi = require("pretty-ms");
const mutes = require("../models/chatmute.js")
const sunucu = require("../models/sunucu-bilgi.js")
const bitmiyor = require("parse-ms")
const clientayar = require("../client.json")
class Mute extends Command {
    constructor(client) {
        super(client, {
            name: "mute",
            aliases: ["mute"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.has(clientayar.mutehammer) && !message.member.hasPermission("ADMINISTRATOR")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Susturmak istediğin kullanıcıyı bulamadım.", message.author, message.channel)
        if (!args[1] || isNaN(ms(args[1]))) return this.client.yolla("Susturma süresini belirtmelisin.", message.author, message.channel)
        if (ms(args[1]) < ms("1m")) return this.client.yolla("Belirtilen susturma süresi geçerli değil.", message.author, message.channel)
        if (!args[2]) return this.client.yolla("Susturma sebebini belirtmelisin.", message.author, message.channel)
        if (user.id == message.author.id) return this.client.yolla("Kullanıcılar kendilerine ceza-i işlem uygulayamaz.", message.author, message.channel)
        if (user.hasPermission("ADMINISTRATOR")) return this.client.yolla("Yöneticilere ceza-i işlem uygulayamazsın.", message.author, message.channel)
        if (message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return this.client.yolla("Kendi rolünden yüksek kişilere işlem uygulayamazsın!", message.author, message.channel)
        //if(user.roles.cache.has("773271657582166086") && !message.member.roles.cache.some(r =>["727881517715423304", "729415958262710373", "736891557680119849", "727881272893898773"].includes(r.id))) return this.client.yolla("Yetkililer birbirlerine ceza işlemi uygulayamazlar.", message.author, message.channel)
        if (user.roles.cache.has(clientayar.muted)) return this.client.yolla("Kullanıcı zaten susturulmuş durumda.", message.author, message.channel)
        let time = ms(args[1]);
        let muteTime = time
        let dataTime = await this.client.extraMute(user.id, "chatMute", time)

        let count = await data.countDocuments().exec();
        count = count == 0 ? 1 : count + 1;


        muteTime = muteTime + (muteTime * dataTime)
        let şuanki = this.client.toDate(Date.now())
        let sonraki = this.client.toDate(Date.now() + muteTime)
       // let id = await sunucu.findOne({ guild: "727881213406347282" }).then(res => res.ihlal)
        user.roles.add(clientayar.muted)
        await message.channel.send(`${this.client.ok} <@${user.id}> kişisi ${await this.client.turkishDate(time)} ${ms(args[1]) < muteTime ? `(\`kullanıcı daha önceden cezalı olduğu için cezasına +${await this.client.turkishDate(muteTime - time)} eklendi.\`) ` : `` }boyunca metin kanallarında susturuldu. (Ceza Numarası: \`#${count}\`)`)
        const mutelendı = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setColor("RANDOM")
       //     .setFooter(`Ceza Numarası: #${id + 1}`)
            .setDescription(`${user} (\`${user.user.tag}\` - \`${user.id}\`) kişisi ${await this.client.turkishDate(muteTime)} boyunca metin kanallarında susturuldu\n\n• Susturulma sebebi: \`${args.slice(2).join(" ")}\`\n• Chat Mute atılma tarihi: \`${şuanki}\`\n• Chat Mute bitiş tarihi: \`${sonraki}\``)
            await this.client.channels.cache.get(clientayar.mutelog).send(mutelendı)
        await mutes.findOne({ user: user.id }, async (err, doc) => {
            const newMute = new mutes({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                endDate: Date.now() + muteTime,
                start: Date.now(),
                sebep: args.slice(2).join(" ")
            })
            newMute.save().catch(e => console.log(e))
        })
        await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
            const newData = new data({
                user: user.id,
                yetkili: message.author.id,
                ihlal: count,
                ceza: "Chat Mute",
                sebep: args.slice(2).join(" "),
                tarih: this.client.toDate(Date.now()),
                bitiş: this.client.toDate(Date.now() + muteTime)
            })
            newData.save().catch(e => console.error(e))
            this.client.savePunishment()
        })
    }
}

module.exports = Mute;
