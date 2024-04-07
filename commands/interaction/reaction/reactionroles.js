const { EmbedBuilder } = require('@discordjs/builders');
const { Client, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, PermissionsBitField } = require('discord.js')
const Discord = require('discord.js')
const reaction = require('../../../Models/reactions')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('reactie-rolen')
    .setDescription('Zet de reactie rol op een embed')
    .addSubcommand(subcommand =>
        subcommand
            .setName('toevoegen')
            .setDescription('voeg een role toe!')
            .addStringOption(option => option.setName('message-id').setDescription('het bericht waar die op moet reageren').setRequired(true))
            .addStringOption(option => option.setName('emoji').setDescription('de emoji waar die moet reageren').setRequired(true))
            .addRoleOption(option => option.setName('role').setDescription('welke rol wil je gebruiken').setRequired(true))
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('verijderen')
                    .setDescription('voeg een role toe!')
                    .addStringOption(option => option.setName('message-id').setDescription('het bericht waar die op moet reageren').setRequired(true))
                    .addStringOption(option => option.setName('emoji').setDescription('de emoji waar die moet reageren').setRequired(true))
                   
                    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    
    run: async( client, interaction) => {
        const { options, guild, channel } = interaction;
        const sub = options.getSubcommand()
        const emoji = options.getString('emoji')

        let e;
        const message = await channel.messages.fetch(options.getString('message-id')).catch((err) =>{
            e = err;
        })

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({content: `Je hebt geen perms`, ephemeral: true})
        if(e) return interaction.reply({content: `Pak een bericht van ${channel}`, ephemeral: true})

        const data = await reaction.findOne({Guild: guild.id, Message: message.id, Emoji: emoji})
        switch(sub){
            case `toevoegen`:
                if(data){
                    return await interaction.reply({content: `Je hebt het al ingesteld met ${emoji}`, ephemeral: true})
                }else{
                    const role = options.getRole('role')
                    await reaction.create({
                        Guild: guild.id, 
                        Message: message.id,
                         Emoji: emoji,
                         Role: role.id
                    });

                    const embed = new Discord.EmbedBuilder()
                    .setColor(Number(client.Config.embedColor))
                    
                    .setDescription(`👌 ik heb een reactie toegevoegd aan ${message.url} met ${emoji} en met role ${role}`)
                    await message.react(emoji).catch(err => {return})
                    await interaction.reply({embeds: [embed], ephemeral: true})
                }

                break;
                case 'verijderen':

                if(!data){
                    return await interaction.reply({content: `Het lijkt niet dat die bestaat!`, ephemeral: true})

                }else{
                    await reaction.deleteMany({
                        Guild: guild.id, 
                        Message: message.id,
                         Emoji: emoji,
                    })

                    const embed = new Discord.EmbedBuilder()
                    .setColor(Number(client.Config.embedColor))
                    
                    .setDescription(`👌 ik heb een reactie verwijdert van ${message.url} met ${emoji}`)
                    await interaction.reply({embeds: [embed], ephemeral: true})
                }

        }
    }
}