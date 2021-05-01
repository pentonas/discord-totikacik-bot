const { MessageEmbed } = require('discord.js');
const MemberStats = require('../Models/MemberStats.js');

/// Yashinu was here

module.exports.execute = async(client, message, args,ayar,emoji) => {
   // if(!message.member.roles.cache.array().some(rol => message.guild.roles.cache.get(ayar.staffrole).rawPosition <= rol.rawPosition)) return  message.reply("`Bu komut yetkililere özeldir.`");
    let kullanici = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(' ').toLowerCase())).first(): message.author) || message.author;
    let uye = message.guild.member(kullanici);
    let embed = new MessageEmbed().setColor("RANDOM").setAuthor(kullanici.tag , kullanici.avatarURL({ dynamic: true})).setThumbnail(kullanici.avatarURL({dynamic: true, size: 2048}));
    MemberStats.findOne({ guildID: message.guild.id, userID: uye.id }, (err, data) => {
        if (!data) return message.channel.send(message.channel, embed.setDescription('Belirtilen üyeye ait herhangi bir veri bulunamadı!'));
        let haftalikSesToplam = 0;
        data.voiceStats.forEach(c => haftalikSesToplam += c);
        let haftalikSesListe = '';
        data.voiceStats.forEach((value, key) => haftalikSesListe += ` \`❯ ${message.guild.channels.cache.has(key) ? message.guild.channels.cache.get(key).name : 'Bilinmeyen'}:\` ** ${client.convertDuration(value)}**\n`);
        let haftalikChatToplam = 0;
        data.chatStats.forEach(c => haftalikChatToplam += c);
        let haftalikChatListe = '';
      	data.chatStats.forEach((value, key) => haftalikChatListe += `\`❯ ${message.guild.channels.cache.has(key) ? message.guild.channels.cache.get(key).name : 'Bilinmeyen'}:\`** ${value} mesaj**\n`);
		
		    const members = message.guild.members.cache.filter(x => !x.user.bot).array().sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
            const joinPos = members.map((u) => u.id).indexOf(kullanici.id);
            const previous = members[joinPos - 1] ? members[joinPos - 1].user : null;
            const next = members[joinPos + 1] ? members[joinPos + 1].user : null;
		
		let cihaz = ""
        let ha = Object.keys(kullanici.presence.clientStatus)
        if (ha[0] == "mobile") cihaz = "Mobil Telefon"
        if (ha[0] == "desktop") cihaz = "Masaüstü Uygulama"
        if (ha[0] == "web") cihaz = "İnternet Tarayıcısı"
		
		embed.addField('Bilgileri:',`\`ID:\` ${kullanici.id} \n \`Profil:\` ${kullanici} \n \`Katılım Bilgisi:\` ${previous ? `**${previous.tag}** > ` : ""}<@${kullanici.id}>${next ? ` > **${next.tag}**` : ""} \n \`Cihaz:\` ${cihaz}`);
	    embed.addField('Toplam İstatistik:',`\`❯ Genel Toplam Ses:\` ** ${client.convertDuration(data.totalVoiceStats || 0)}**\n\`❯ Toplam Mesaj:\` ** ${data.totalChatStats || 0} mesaj**`);
        embed.addField('Haftalık Ses:',`\`❯ Toplam:\`  ** ${client.convertDuration(haftalikSesToplam)}** \n ${haftalikSesListe}`);
        embed.addField('Haftalık Mesaj:',`\`❯ Toplam:\`  ** ${haftalikChatToplam} mesaj** \n ${haftalikChatListe}`);
    message.channel.send(embed)
    });
};
module.exports.configuration = {
    name: 'stat',
    aliases: ['stats','me'],
    usage: 'stat [üye]',
    description: 'Belirtilen üyenin tüm ses ve chat bilgilerini gösterir.',
    permLevel: 0
};
