const { Client, Collection, DiscordAPIError } = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const klaw = require("klaw");
const clientayar = require("./client.json")
const path = require("path");
const mongoose = require("mongoose")
const Discord = require("discord.js")
let cezalar = require("./models/cezalar.js")
let sunucu = require("./models/sunucu-bilgi.js")
let extra = require("./models/extraMute.js")
const logs = require("discord-logs");
const tokuchi = require("pretty-ms");
const ms = require("ms");
const moment = require("moment");
class TokuchiBot extends Client {
  constructor(options) {
    super(options);
    this.lastPunishment = 0
    this.kayıtlar = new Map()
    this.channelTime = new Map()
    this.snipe = new Map()
    this.banLimit = new Map()
    this.jailLimit = new Map()
    this.roleLimit = new Map()
    this.yasaklıtag = []
    this.blockedFromCommand = []
    this.commandBlock = new Map()
    this.commands = new Collection();
    this.aliases = new Collection();
    this.databaseCache = {};
    this.databaseCache.users = new Collection();
    this.databaseCache.guilds = new Collection();
    this.databaseCache.members = new Collection();
    this.usersData = require("./models/user.js")
    this.logger = require("./modules/Logger");

    this.wait = require("util").promisify(setTimeout);
  }

  loadCommand(commandPath, commandName) {
    try {
      const props = new (require(`${commandPath}${path.sep}${commandName}`))(
        this
      );
      this.logger.log(`Yüklenen Komut: ${props.help.name}. ✔`, "log");
      props.conf.location = commandPath;
      if (props.init) {
        props.init(this);
      }
      this.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        this.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Komut yüklenirken hata oluştu: ${commandName}: ${e}`;
    }
  }

// lastCeza = sunucu.findOne({ guild: "825678482884395028" }).then(res => res.ihlal)

  async savePunishment() {
    sunucu.findOne({ guild: ayarlar.sunucuID }, async (err, res) => {
      if (!res) return
      res.ihlal = res.ihlal + 1
      res.save().catch(e => console.log(e))
    })
  }

  async unloadCommand(commandPath, commandName) {
    let command;
    if (this.commands.has(commandName)) {
      command = this.commands.get(commandName);
    } else if (this.aliases.has(commandName)) {
      command = this.commands.get(this.aliases.get(commandName));
    }
    if (!command)
      return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(this);
    }
    delete require.cache[
      require.resolve(`${commandPath}${path.sep}${commandName}.js`)
    ];
    return false;
  }

  ok = "<:onay:833081561443598366>"
  no = "<:red:833081561321570364>"

  async yolla(mesaj, msg, kanal) {
    if (!mesaj || typeof mesaj !== "string") return
    const embd = new Discord.MessageEmbed()
      .setAuthor(msg.tag, msg.displayAvatarURL({ dynamic: true }))
      .setColor("RANDOM")
      .setDescription(mesaj)
    kanal.send(embd).then(msg => {
      msg.delete({ timeout: 15000 })
    })
      .catch(console.error);
  }

  async turkishDate(date) {
    if (!date || typeof date !== "number") return
    let convert = tokuchi(date, { verbose: true })
      .replace("minutes", "dakika")
      .replace("minute", "dakika")
      .replace("hours", "saat")
      .replace("hour", "saat")
      .replace("seconds", "saniye")
      .replace("second", "saniye")
      .replace("days", "gün")
      .replace("day", "gün")
      .replace("years", "yıl")
      .replace("year", "yıl");
    return convert
  }

  async findOrCreateUser({ id: userID }, isLean){
    return new Promise(async (resolve) => {
        if(this.databaseCache.users.get(userID)){
            resolve(isLean ? this.databaseCache.users.get(userID).toJSON() : this.databaseCache.users.get(userID));
        } else {
            let userData = (isLean ? await this.usersData.findOne({ id: userID }).lean() : await this.usersData.findOne({ id: userID }));
            if(userData){
                resolve(userData);
            } else {
                userData = new this.usersData({ id: userID });
                await userData.save();
                resolve((isLean ? userData.toJSON() : userData));
            }
            this.databaseCache.users.set(userID, userData);
        }
    });
}



  async punishPoint(userID) {
    let res = await cezalar.find({ user: userID })
    if (!res) return 0
    let filterArr = res.map(x => (x.ceza))
    let chatMute = filterArr.filter(x => x == "Chat Mute").length || 0
    let voiceMute = filterArr.filter(x => x == "Voice Mute").length || 0
    let jail = filterArr.filter(x => x == "Cezalı").length || 0
    let ban = filterArr.filter(x => x == "Yasaklı").length || 0
    let uyarı = filterArr.filter(x => x == "Uyarı").length || 0
    let point = (chatMute * 8) + (voiceMute * 10) + (jail * 15) + (ban * 20) + (uyarı * 3)
    return point
  }

  async extraMute(userID, type, time) {
    let res = await extra.findOne({ user: userID })
    if ((!res)) {
      let buffer = new extra({
        __id: new mongoose.Types.ObjectId,
        user: userID,
        array: [{
          type: type,
          attendeAt: Date.now(),
          time: time
        }]
      })
      await buffer.save().catch(e => console.log(e))
      return 0
    }
    if (res.array.length == 0) return 0

    if (res && (res && res.array.filter(a => a.type == type).length == 0)) {
      res.array.push({
        type: type,
        attendeAt: Date.now(),
        time: time
      })
      res.save().catch(e => console.log(e))
      return 0
    }

    let datx = res.array.filter(a => (a.type == type) && (Date.now() - a.attendeAt < ms("12h")) && (a.time == time))
    if (datx.length == 0) return 0

    res.array = res.array.filter(a => Date.now() - a.attendeAt < ms("12h"))

    res.array.push({
      type: type,
      attendeAt: Date.now(),
      time: time
    })
    res.save().catch(e => console.log(e))
    return datx.length
  }

  async clean(text) {
    if (text && text.constructor.name == "Promise") text = await text;
    if (typeof text !== "string")
      text = require("util").inspect(text, { depth: 1 });

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(
        this.token,
        "ODI4MzY4Mzk2MTgxMTc2MzUy.YGokLw.m8svPmdSZk4Rn7Oozod9plXCRVk"
      );

    return text;
  }

  async fetchPunishments() {
    let res = await cezalar.find()
    if (res.length == 0) return 0
    let last = await res.sort((a, b) => { return b.ihlal - a.ihlal })[0]
    return last.ihlal
  }


  async shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }


  async üye(search, guild) {
    let member = null;
    if (!search || typeof search !== "string") return;
    if (search.match(/^<@!?(\d+)>$/)) {
      let id = search.match(/^<@!?(\d+)>$/)[1];
      member = await guild.members.fetch(id).catch(() => { });
      if (member) return member;
    }
    if (search.match(/^!?([^#]+)#(\d+)$/)) {
      guild = await guild.fetch();
      member = guild.members.cache.find(m => m.user.tag === search);
      if (member) return member;
    }
    member = await guild.members.fetch(search).catch(() => { });
    return member;
  }

  async client_üye(search) {
    let user = null;
    if (!search || typeof search !== "string") return;
    if (search.match(/^!?([^#]+)#(\d+)$/)) {
      let id = search.match(/^!?([^#]+)#(\d+)$/)[1];
      user = this.users.fetch(id).catch(err => { });
      if (user) return user;
    }
    user = await this.users.fetch(search).catch(() => { });
    return user;
  }
}

const client = new TokuchiBot();
logs(client);
const init = async () => {
  klaw("./commands").on("data", item => {
    const cmdFile = path.parse(item.path);
    if (!cmdFile.ext || cmdFile.ext !== ".js") return;
    const response = client.loadCommand(
      cmdFile.dir,
      `${cmdFile.name}${cmdFile.ext}`
    );
    if (response) client.logger.error(response);
  });

  const evtFiles = await readdir("./events/");
  client.logger.log(`Toplam ${evtFiles.length} event yükleniyor.`, "log");
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    client.logger.log(`Yüklenen Event: ${eventName} ✔`);
    const event = new (require(`./events/${file}`))(client);
    client.on(eventName, (...args) => event.run(...args));
    delete require.cache[require.resolve(`./events/${file}`)];
  });


  client.login(clientayar.token);
  mongoose.connect(clientayar.mongolink, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client.logger.log("Mongo Bağlantısı Kuruldu ✔", "log"));

};

init();

client
  .on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
  .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
  .on("error", e => client.logger.error(e))
  .on("warn", info => client.logger.warn(info));


process.on("uncaughtException", err => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error("Beklenmedik yakalanamayan hata: ", errorMsg);
  process.exit(1);
});

process.on("unhandledRejection", err => {
  console.error("Promise Hatası: ", err);
});

client.format = sure => {
  return moment.duration(sure).format("D [gün,] H [saat,] m [dakika,] s [saniye.]");
};

client.moment = sure => {
  return moment(sure).format("HH:mm:ss");
};

client.toDate = date => {
  return moment(date).format("DD/MM/YYYY HH:mm:ss");
};

