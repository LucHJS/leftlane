const client = require('../../index');
const {
 
  Events,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ActivityType
} = require("discord.js");

const Discord = require('discord.js')
const fs = require('fs')

client.once('ready', async () => {

    console.log(`[READY] ${client.user.tag} is up and ready to go.`)
 
  
    client.user.setPresence({
      activities: [{ name: `LeftlanePapi`, type: ActivityType.Streaming }],
    });


    // const guild = client.guilds.cache.get('1222160685056659533')
    // const channel = guild.channels.cache.get("1225500346458308691")
    // const embed = new Discord.EmbedBuilder()
    // .setColor(Number(client.Config.embedColor))
    // .setTitle("👑 BABAYANNNNNNN")
    // .setAuthor({ name: `® LeftlanePapi`, iconURL: `${guild.iconURL()}` })
    // .setThumbnail(guild.iconURL())
    // .setFooter({ text: `® ${guild.name}`})
    // .setTimestamp()
    // .setDescription( "Join de community")

    // channel.send({embeds: [embed]})
    setTimeout(client.checkVideo, 5 * 1000)
  

})
