const { EmbedBuilder } = require("discord.js");
const client = require("../..");

client.on('interactionCreate', async interaction => {
    if(!interaction.isChatInputCommand()) return;

    const slashCommand = client.slashCommands.get(interaction.commandName)
    if(!slashCommand) return client.slashCommands.delete(interaction.commandName)

    try{
        await slashCommand.run(client, interaction)
    }catch(error){
        const errorEmbed = new EmbedBuilder()
            .setTitle("❌ Helaas Error")
            .setColor(Number(client.Config.embedColor))
            .setDescription(`\`\`\`fix\n${error.message}\`\`\``)
            .setTimestamp()
            //await interaction.reply({embeds: [errorEmbed], ephemeral:true})

            console.log(error)
    }
})