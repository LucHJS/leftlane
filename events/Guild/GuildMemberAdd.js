const {
    Discord,
    Events,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
  } = require("discord.js");
  const client = require("../../index");
  const { EmbedBuilder } = require("@discordjs/builders");
   
  const createCmd = client.createCmd;
  const config = client.Config;
   
   
  client.on("guildMemberAdd", async (member) => {
    if (!member.user.bot) {
      const welcomeChannel = member.guild.channels.cache.get(
        config.welcomeChannelId
      );
   
      // If the welcome channel is not found, all of the remaining action are return
      if (!welcomeChannel) {
        return console.log("Kan de welkom channel niet vinden");
      }
   
      // DM Welcomer
      const welcomeDMEmbed = new EmbedBuilder()
        .setTitle(`👋 Welkom ${member.user.username} In **__${member.guild.name}__**`)
   
        .setDescription(
          "Check Zeker al mijn Socials\nLees ook even de regels voor dat je gaat praten"
        )
        .setThumbnail(member.guild.iconURL({ size: 1024 }))
        .setColor(Number(config.embedColor))
   
        .setTimestamp();
      // If this server has a banner (Required Server Boost Level 2), this banner URL's image is added to DM embed
      if (member.guild.bannerURL()) {
        welcomeDMEmbed.setImage(
          member.guild.bannerURL({
            size: 1024,
          })
        );
      }
      // 4 Link Buttons
      const welcomeDMRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel(config.dmWelcomerLinkButtons.first.label || "omertaclothing")
          .setURL(
            config.dmWelcomerLinkButtons.first.url || "https://omertaclothing.nl/"
          )
          .setStyle(ButtonStyle.Link),
        new ButtonBuilder()
          .setLabel(config.dmWelcomerLinkButtons.second.label || "athletefit")
          .setURL(
            config.dmWelcomerLinkButtons.second.url ||
              "https://www.athletefit.nl/"
          )
          .setStyle(ButtonStyle.Link),
        new ButtonBuilder()
          .setLabel(config.dmWelcomerLinkButtons.third.label || "Mijn youtube")
          .setURL(
            config.dmWelcomerLinkButtons.third.url ||
              "https://www.youtube.com/@leftlanepapi8304"
          )
          .setStyle(ButtonStyle.Link)
      );
   
      // Send the Information to the member's DM
      member
        .send({
          embeds: [welcomeDMEmbed],
          components: [welcomeDMRow],
        })
        .then(() => {})
        .catch(() => {
          console.error(
            `Discord API error: Cannot send a messages to ${member.username}'s DM, It's seems that this member has closed his DM\nBut other actions are running now!`
          );
        });
      // Welcome in the Specific channel
      // Creëer een nieuwe embed
      const joinEmbed = new EmbedBuilder()
        .setColor(Number(config.embedColor))
        .setAuthor({ name: `Welkom bij ${member.guild.name}`, iconURL: `${member.guild.iconURL()}` })
        .setDescription(
          `Welkom **${member.user.username}** bij **${member.guild.name}**\nJe bent hier van harte welkom! Lees zeker even de regels en check zeker **<#1222189539691597904>**`
        )
        .setThumbnail(member.guild.iconURL())
        .setFooter({ text: `${member.guild.name}`})
        .setTimestamp()
   
   
      // Send the Embed Message to your welcome channel
      welcomeChannel.send({
        embeds: [joinEmbed],
      });
      // Delete the welcome messages after 1.5 minutes
   
      // Auto joined role (Only for Real human users)
      member.roles
        .add(config.welcomeRoleId)
        .then(() => {})
        .catch(() => {
          console.error(
            `Cannot add this joined role to the ${member.username}\nMake sure the role ID that entered in the config.json file is correct and i have the enough permissions`
          );
        });
    } else {
      return;
    }
  });
   