const Command = require("../base/Command.js");
const Discord = require("discord.js")
const clientayar = require("../client.json")
class Komutlar extends Command {
    constructor(client) {
        super(client, {
            name: "komutlar",
            aliases: ["komutlar"]
        });
    }

    async run(message, args, data) {
        if (!message.member.roles.cache.has(clientayar.registerhammer) && !message.member.hasPermission("ADMINISTRATOR")) return
        const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
        .setColor("RANDOM")
        .setDescription(`${this.client.commands.map(x => `- \`\`${x.help.name}\`\``).join("\n")}`)
        message.channel.send(embed)
    }
}

module.exports = Komutlar;
