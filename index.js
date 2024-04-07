const {
  Discord,
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  Collection,
  EmbedBuilder,
  ActivityType,
  Ac,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildScheduledEvents,
  ],
});

const fs = require("fs");
const config = require("./config.json");

/* Music System */
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");

client.distube = new DisTube(client, {
  leaveOnEmpty: true,
  leaveOnFinish: true,
  plugins: [new SpotifyPlugin()],
});

client.events = new Collection();
client.handler = new Collection();

client.slashCommands = new Collection();
client.Config = config;

module.exports = client;
const { GiveawaysManager } = require('discord-giveaways');
const manager = new GiveawaysManager(client, {
  storage: './json/giveaways.json',
  default: {
      botsCanWin: false,
      embedColor: Number(config.embedColor),
      embedColorEnd: Number(config.embedColor),
      reaction: '🎉'

  }
});
// Giveaway manager
client.giveawaysManager = manager


client.giveawaysManager.on("giveawayEnded", (giveaway, winners) => {
  winners.forEach((member) => {
      member.send(`**
      Gefeliciteerd ${member.user.username}, je hebt ${giveaway.prize} gewonnen!**`);
  })
});


const Ascii = require("ascii-table");
let tableEvents = new Ascii().setHeading("Events", "Load Status");
//eventHandler
fs.readdirSync(`./events/`).forEach((dir) => {
  var jsFiles = fs
    .readdirSync(`./events/${dir}`)
    .filter((f) => f.split(".").pop() === "js");
  jsFiles.forEach((event) => {
    const eventGet = require(`./events/${dir}/${event}`);

    tableEvents.addRow(dir, "✅ Loaded");
    try {
      client.events.set(eventGet.name, eventGet);
    } catch (err) {
      tableEvents.addRow(file.split(".js")[0], "❌ Failed");

      return console.log(err);
    }
  });
});
console.log(tableEvents.toString());

fs.readdirSync("./handlers").forEach((handler) => {
  try {
    require(`./handlers/${handler}`)(client);
  } catch {
    (err) => {
      console.log(err);
    };
  }
});

client.login(config.Token).catch((err) => {
  console.log(err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const Parser = require("rss-parser");
const parser = new Parser();

client.checkVideo = async () => {
  try {
    const data = await parser.parseURL("https://youtube.com/feeds/videos.xml?channel_id=UCgajIlMgdS8wYElkt4KwieQ");
    const rawData = fs.readFileSync(`./json/video.json`);
    const jsonData = JSON.parse(rawData);

    console.log("Latest Video ID from YouTube:", data.items[0].id);
    console.log("Stored Video ID:", jsonData.id);

    if (jsonData.id !== data.items[0].id) {
      console.log("New Video Detected. Updating JSON...");

      fs.writeFileSync("./json/video.json", JSON.stringify({ id: data.items[0].id }));

      var guild = undefined;
      client.guilds.cache.forEach((g) => {
        if (g.id === "1222160685056659533") {
          guild = g;
        }
      });

      const channel = await guild.channels.cache.get("1222242544654745671");

      const { title, link, id, author } = data.items[0];
      const embed = new EmbedBuilder({
        title: title,
        url: link,
        timestamp: Date.now(),
        image: {
          url: `https://img.youtube.com/vi/${id.slice(9)}/maxresdefault.jpg`,
        },
        author: {
          name: author,
          iconURL: "https://yt3.googleusercontent.com/fJ8ctNAHvdir8yhggXDL6_ivWxnWQrxm5nHgohrHCB5sRx2tEf1BLVfHYfyW-Ru2nDU20decjg=s176-c-k-c0x00ffffff-no-rj",
          url: "https://www.youtube.com/@leftlanepapi8304/?sub_confirmation=1",
        },
        footer: {
          text: client.user.tag,
          iconURL: client.user.displayAvatarURL(),
        },
      });

      var role;
      await guild.roles.cache.forEach((c) => {
        if (c.id === "1222160685056659533") {
          role = c;
        }
      });

      await channel.send({ embeds: [embed], content: `${role}` }).catch(console.error);
    } else {
      console.log("No new video detected.");
    }
  } catch (error) {
    console.error("Error occurred in checkVideo function:", error);
  }
};

// Rest of your code...

