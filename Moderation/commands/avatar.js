const Command = require("../base/Command.js");
const Discord = require("discord.js")
class Avatar extends Command {
    constructor(client) {
        super(client, {
            name: "avatar",
            aliases: ["av"]
        });
    }

    async run(message, args, data) {
        if(!message.member.hasPermission("ADMINISTRATOR") && message.channel.id == "759566000378871828") return
        let user = args.length > 0 ? message.mentions.users.first() || await this.client.users.fetch(args[0]) || message.author : message.author
       let embed = new Discord.MessageEmbed().setColor("RANDOM").setTimestamp().setFooter(`${user.tag}`);
       // message.channel.send(`${user.tag} ${user.displayAvatarURL({ dynamic: true, size: 4096 })}`)
        message.channel.send(embed.setImage(user.displayAvatarURL({ dynamic: true, size: 4096 })).setDescription(`[URL](${user.displayAvatarURL({dynamic:true})})`).setTitle(user.tag));

    }
}

module.exports = Avatar;
