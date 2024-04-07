const {SlashCommandBuilder, } = require('discord.js')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ticket-send')
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageMessages)
    .setDescription("Stuur de ticket embed in het tickets kanaal"),


    run: async(client, interaction) => {
        
        const client1 = require('../../../index')
        const embed = new Discord.EmbedBuilder()
        .setColor(Number(client.Config.embedColor))
        .setTitle("❓ Support Tickets")
        .setAuthor({ name: `Support Tickets`, iconURL: `${interaction.guild.iconURL()}` })
        .setThumbnail(interaction.guild.iconURL())
        .setFooter({ text: `® ${interaction.guild.name}`})
        .setTimestamp()
        .setDescription("Open een ticket in de discord server!\n\n❗ Let op maak geen onodige tickets. Wij proberen zo snel mogelijk te reageren. Gelieve niet te taggen en leg alvast uit waarom je een ticket gemaakt hebt!")

        const button = new Discord.ActionRowBuilder().setComponents(
            new Discord.ButtonBuilder().setCustomId('vraag').setLabel('Vragen').setStyle(Discord.ButtonStyle.Primary).setEmoji('❓'),
            new Discord.ButtonBuilder().setCustomId('samenwerking').setLabel('Samenwerking').setStyle(Discord.ButtonStyle.Secondary).setEmoji('✍')
        );
          
        
        const channel =  interaction.guild.channels.cache.get("1222564266452975757")
        
        channel.send({
            embeds: [embed],
            components: [
                button
            ]
        })

       await interaction.reply({content: `Ticket embed is verstuurd`, ephemeral: true})
    }
}