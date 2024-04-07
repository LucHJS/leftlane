const Discord = require('discord.js')
const ticketSchema = require('../../Models/ticket')
const config = require('../../config.json')
const client = require('../../index')

client.on('interactionCreate', async interaction => {
   const {guild, member, customId, channel} = interaction;
   const {ViewChannel, SendMessages, ManageChannels, ReadMessageHistory} = Discord.PermissionFlagsBits;
    const ticketId = Math.floor(Math.random() * 9000) + 100000

    if(!interaction.isButton()) return;

    if(!["vraag", "samenwerking"].includes(customId)) return;

    if(!guild.members.me.permissions.has(ManageChannels))
    interaction.reply({content: `Ik heb hier geen perms voor!`, ephemeral: true})

    try{
        await guild.channels.create({
            name: `${member.user.username}-ticket${ticketId}`,
            type: Discord.ChannelType.GuildText,
            parent: config.tickets.TicketParent,
            permissionOverwrites: [
                {
                    id: config.tickets.everyoneId,
                    deny: [ViewChannel, SendMessages, ReadMessageHistory],
                },
                {
                    id: member.id,
                    allow:[ViewChannel, SendMessages, ReadMessageHistory],
                }
            ]
        }).then(async(channel) => {
            const newTicketSchema = await ticketSchema.create({
                GuildID: guild.id,
                MemberID: member.id,
                TicketID: ticketId,
                ChannelID: channel.id,
                Closed: false,
                Locked: false,
                Type: customId
            });

            const embed = new Discord.EmbedBuilder()
                .setTitle(`${guild.name} - Ticket: ${customId}`)
                .setDescription("je wordt zo snel mogelijk geholpen, Gelieve niet te taggen en geduldig aftewachten. Maak geen onodige tickets!")
                .setFooter({text: `${ticketId}`, iconURL: member.displayAvatarURL({dynamic: true})})
                .setThumbnail(interaction.guild.iconURL())
                .setTimestamp()

                const button = new Discord.ActionRowBuilder().setComponents(
                    new Discord.ButtonBuilder().setCustomId('close').setLabel('Sluit Ticket').setStyle(Discord.ButtonStyle.Danger).setEmoji('❌'),
                    new Discord.ButtonBuilder().setCustomId('lock').setLabel('Lock de ticket').setStyle(Discord.ButtonStyle.Primary).setEmoji('🔐'),
                    new Discord.ButtonBuilder().setCustomId('unlock').setLabel('Unlock de Ticket').setStyle(Discord.ButtonStyle.Success).setEmoji('🔓')
                )
                    const role = interaction.guild.roles.cache.get(client.Config.tickets.ModRole)
            channel.send({
                content: `<@${interaction.user.id}> ${role}`,
                embeds:[embed],
                components: [
                    button
                ]
            });

            interaction.reply({content: `De ticket is succesvol geopent! ${channel}`, ephemeral: true})

            
        })
    }catch (err) {
        return console.log(err)
    }
})