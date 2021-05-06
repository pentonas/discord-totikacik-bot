const Command = require("../base/Command.js");
const data = require("../models/cezalar.js")
const ms = require("ms")
const clientayar = require("../client.json")
const moment = require("moment")
require("moment-duration-format")
const Discord = require("discord.js")
moment.locale("tr")
const tokuchi = require("pretty-ms");
const mutes = require("../models/voicemute.js")
const sunucu = require("../models/sunucu-bilgi.js")
const wmute = require("../models/waitMute.js")
class Unmute extends Command {
    constructor(client) {
        super(client, {
            name: "unmute",
            aliases: ["unmute"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.roles.cache.has(clientayar.mutehammer) && !message.member.hasPermission("VIEW_AUDIT_LOG")) return
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if(message.author.id == user.id) return
        if (!user) return message.react(this.client.no)
        if (user.voice.serverMute == true) {
            user.voice.setMute(false)
            message.react(this.client.yes)
        } else {
            message.react(this.client.yes)
        }
        if (user.roles.cache.has(clientayar.mutehammer)) {
            user.roles.remove(clientayar.muted)
            message.react(this.client.yes)
        } else {
            message.react(this.client.no)
        }

    }
}

module.exports = Unmute;
