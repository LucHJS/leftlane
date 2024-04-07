const Discord = require('discord.js')
const {createTranscript} = require("discord-html-transcripts")
const ticketSchema = require('../../Models/ticket')
const client = require('../../index')
client.on("interactionCreate", async(interaction) => {
    const {guild, member, customId, channel} = interaction;
    const { SendMessages, ManageChannels} = Discord.PermissionFlagsBits;

    if(!interaction.isButton()) return;

    if(!['close', 'lock', 'unlock'].includes(customId)) return;

    const embed = new Discord.EmbedBuilder()
        .setColor(Number(client.Config.embedColor))

    ticketSchema.findOne({ChannelID: channel.id}, async(err, data) => {
        if(err) throw err;
        if(!data) return;

        const fetchedMember = await guild.members.cache.get(data.MemberID)

        switch(customId){
            case "close":
                    if(data.Closed == true)
                        return interaction.reply({content: `Ticket Wordt al verwijdert`, ephemeral: true})

                        const transcript = await createTranscript(channel, {
                            limit: -1,
                            returnBuffer: true,
                            fileName: `${member.user.username}-ticket${data.Type}-${data.TicketID}.html`
                        });

                        await ticketSchema.updateOne({ChannelID: channel.id}, {Closed: true});

                        const transcriptEmbed = new Discord.EmbedBuilder()
                            .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL({ size: 1024 }) })
                            .setTitle("🗑・Gesloten")
                            .setDescription("Er is een ticket gesloten!")
                            .addFields(
                                {
                                    name: `📃・Gesloten Door:`,
                                    value: `<@${interaction.user.id}>`,
                                     inline:true
                                },
                                {
                                    name: "❓・Channel",
                                    value: `${interaction.channel.name}`,
                                    inline:true
                                },
                                {
                                    name: `🔢・ChannelID: `,
                                    value: `${data.ChannelID}`,
                                    inline:true
                                },
                                {
                                    name: `🔢・TicketID: `,
                                    value: `${data.TicketID}`,
                                    inline:true
                                },
                                {
                                    name: `📝・Type Ticket: `,
                                    value: `${data.Type}`,
                                    inline:true
                                },
                                {
                                    name: `🧑・Member ID: `,
                                    value: ` ${data.MemberID}`,
                                    inline:true
                                },
                                )
                                .setColor(Number(client.Config.embedColor))
                            .setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ size: 1024 }) })
                            .setTimestamp();

                        const transcriptProcess = new Discord.EmbedBuilder()
                            .setTitle('Ticket transcript aan het opslaan')
                            .setDescription(`Ticket wordt binnen 10 Seconden Gesloten, om de ticket transcript te krijgen moet je DM aanzetten`)
                            .setColor(Number(client.Config.embedColor))
                            .setFooter({text: member.user.tag, iconURL: member.displayAvatarURL({dynamic: true})})
                            .setTimestamp()

                        const res = await guild.channels.cache.get(client.Config.tickets.TicketTranscriptChannel).send({
                            embeds: [transcriptEmbed],
                            
                        });
                        await guild.channels.cache.get(client.Config.tickets.TicketTranscriptChannel).send({
                            files: [transcript]
                            
                        });
                        interaction.reply({embeds: [transcriptProcess]})
                        setTimeout(() => {
                            member.send({
                                embeds: [transcriptEmbed.setDescription(`Toegang tot jou Ticket transcript:`)],
                                files: [transcript]
                            }).catch(() => channel.send(`Kon de ticket transcript niet in je DM sturen`))
                            channel.delete()
                        }, 10000);

                        break;

                          case "lock":
                            if(!member.permissions.has(ManageChannels))
                                return interaction.reply({content: `Jij hebt daar geen permissies voor! `, ephemeral: true})

                                if(data.Locked == true)
                                return interaction.reply({content: `Deze ticket is al op slot  `, ephemeral: true})

                                await ticketSchema.updateOne({ChannelID: channel.id}, {Locked: true})

                                embed.setDescription("Ticket is succesvol op slot gezet!")

                                channel.permissionsOverwrites.edit(fetchedMember, {SendMessages: false})

                                return interaction.reply({embeds: [embed]})
                            
                                case "lock":
                                    if(!member.permissions.has(ManageChannels))
                                        return interaction.reply({content: `Jij hebt daar geen permissies voor! `, ephemeral: true})
        
                                        if(data.Locked == true)
                                        return interaction.reply({content: `Deze ticket is al ontgrendeld  `, ephemeral: true})
        
                                        await ticketSchema.updateOne({ChannelID: channel.id}, {Locked: false})
        
                                        embed.setDescription("Ticket is succesvol ontgrendeld!")
        
                                        channel.permissionsOverwrites.edit(fetchedMember, {SendMessages: true})
        
                                        return interaction.reply({embeds: [embed]})


                            
                    
        }
    })
})