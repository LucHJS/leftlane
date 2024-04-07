const { EmbedBuilder } = require('@discordjs/builders');
const { Client, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, MessageContextMenuCommandInteraction, CommandInteractionOptionResolver } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Verwijderen een aantal berichten van het kanaal')
    .addNumberOption(
        option => 
        option.setName("amount")
        .setDescription("Hoeveel berichten wil je verwijderen!")
        .setRequired(true)
        .setMaxValue(100)
        )
    .addUserOption(
        option => 
        option.setName("target")
        .setDescription("de persoon waarvan je de berichten wil verwijderen!")
        .setRequired(false))

    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    
    run: async(client, interaction) => {
        const { channel, options } = interaction;

        const Amount = interaction.options.getNumber("amount")
        const Target = options.getUser("target");

        const Messages = await channel.messages.fetch();

        const Response = new EmbedBuilder()
        .setColor(Number(client.Config.embedColor))

        if (Target) {
            let i = 0;
            const filtered = [];
            (await Messages).filter((m) => {
                if(m.author.id === Target.id && Amount > i) {
                    filtered.push(m);
                    i++;
                }
            })

            await channel.bulkDelete(filtered, true).then(async messages => {
                Response.setDescription(`🧹 Heb ${messages.size} Berichten van ${Target} verwijdert.`)
                await interaction.reply({embeds: [Response]})
            })
        } else {
            await channel.bulkDelete(Amount, true).then(async messages => {
                Response.setDescription(`🧹 Heb ${messages.size} berichten Verwijdert van dit kanaal`)
                await interaction.reply({embeds: [Response]})
            })
        }
    }
}