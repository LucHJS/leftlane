const { EmbedBuilder } = require('@discordjs/builders');
const { Client, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban een member van de server')
    .addUserOption(
        option => 
        option.setName("persoon")
        .setDescription("Selecteer iemand die je wil verbannen")
        .setRequired(true))
    .addStringOption(
        option =>
        option.setName("reason")
        .setDescription("Reden van deban")
        .setRequired(false))

    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    
    run: async( client, interaction) => {
        const { options } = interaction;

        const Target = options.getMember("target")
        const Reason = options.getString("reason")

        const Response = new EmbedBuilder()
        .setColor(client.mainColor)
        .setTimestamp(Date.now())

        if(Target.bannable) {
           

            if (Reason) {
                    await interaction.guild.bans.create(Target, {reason: Reason})
                    Response.setDescription(`<@${interaction.member.id}> Heeft <@${Target.id}> Verbannen`)
                    Response.addFields([
                        {
                            name: "Reden:",
                            value: Reason,
                            inline: false
                        }
                    ])
            } else {
                await interaction.guild.bans.create(Target)
                Response.setDescription(`<@${interaction.member.id}> heeft <@${Target.id}> Verbannen`)
            }
        } else {
            Response.setDescription(`❌ Kon <@${Target.id}> Omdat ik geen perms heb`).setColor(Number(client.Config.embedColor))
        }

        await interaction.reply({embeds: [Response]})
    }
}