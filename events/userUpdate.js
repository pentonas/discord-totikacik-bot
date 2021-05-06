const clientayar = require("../client.json")
module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(old, nev) {
        if (old.username !== nev.username) {
            if (
                !nev.username.includes(clientayar.tag) &&
                this.client.guilds.cache.get(clientayar.sunucuID).members.cache.get(nev.id).roles.cache.has(clientayar.ekiprolu)
            ) {
                this.client.guilds.cache.get(clientayar.sunucuID).members.cache.get(nev.id).roles.remove(clientayar.ekiprolu);
                let tokicham = this.client.guilds.cache.get(clientayar.sunucuID).members.cache.get(nev.id);
                    let name = tokicham.displayName.replace(`${clientayar.tag}`, `${clientayar.tag2}`)
                    await tokicham.setNickname(name)
                let roller = [""]
                for (let i = 0; i < roller.length; i++) {
                    if (tokicham.roles.cache.has(roller[i])) {
                        setTimeout(function () { tokicham.roles.remove(roller[i]); }, 1000);
                    }
                }
                let tagsayı = this.client.users.cache.filter(user => user.username.includes(clientayar.tag)).size +100
                this.client.channels.cache.get(clientayar.ekiplog)
                    .send(
                        `─────────────────\n${this.client.no} ${nev} kişisi tagımızı bırakarak ailemize veda etti. **(Toplam Taglı Üyemiz: ${tagsayı})**\n\nÖnce: \`${old.tag}\`\nSonra: \`${nev.tag}\`\n─────────────────`
                    );
            }
            if (
                nev.username.includes(clientayar.tag) &&
                !this.client.guilds.cache.get(clientayar.sunucuID).members.cache.get(nev.id).roles.cache.has(clientayar.ekiprolu)
            ) {
                let tagsayı = this.client.users.cache.filter(user => user.username.includes(clientayar.tag)).size
                this.client.channels.cache.get(clientayar.ekiplog).send(
                        `─────────────────\n${this.client.ok} ${nev} kişisi tagımızı alarak ailemize katıldı. **(Toplam Taglı Üyemiz: ${tagsayı})**\n\nÖnce: \`${old.tag}\`\nSonra: \`${nev.tag}\`\n─────────────────`
                    );
                this.client.guilds.cache.get(clientayar.sunucuID).members.cache.get(nev.id).roles.add(clientayar.ekiprolu);
                let tokicham = this.client.guilds.cache.get(clientayar.sunucuID).members.cache.get(nev.id);
                    let name = tokicham.displayName.replace(`${clientayar.tag2}`, `${clientayar.tag}`)
                    await tokicham.setNickname(name)
            }
        }
    }
};
