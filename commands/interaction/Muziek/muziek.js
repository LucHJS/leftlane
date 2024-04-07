const { Client, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, Colors, VoiceChannel, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("muziek")
    .setDescription("Muziek Systeem")
    .addSubcommand(
        command =>
        command.setName("play")
        .setDescription("Speel een liedje")
        .addStringOption(
            option => 
            option.setName("query")
            .setDescription("Stuur een naam of URL")
            .setRequired(true)
        )
    )
    .addSubcommand(
        command =>
        command.setName("volume")
        .setDescription("Zet de volume van de bot")
        .addNumberOption(
            option =>
            option.setName("procent")
            .setDescription("10 = 10%")
            .setRequired(true)
        )
    )
    .addSubcommand(
        command =>
        command.setName("settings")
        .setDescription("Selecteer een optie")
        .addStringOption(
            option =>
            option.setName("options")
            .setDescription("Selecteer een optie")
            .setRequired(true)
            .addChoices(
                { name: "🗒️ Queue", value: "queue" },
                { name: "⏩ Skip", value: "skip" },
                { name: "⏸️ Pause", value: "pause" },
                { name: "▶️ Resume", value: "resume" },
                { name: "⏹️ Stop", value: "stop" },
                { name: "🔀 Shuffle", value: "shuffle" },
            )
        )
    ),
   
    run: async( client, interaction) => {
        const { options, member, guild, channel } = interaction;
        const voiceChannel = member.voice.channel;

        const Response = new EmbedBuilder()
        .setColor(Number(client.Config.embedColor))
        .setTitle("🎶 Muziek")

        if(!voiceChannel) return interaction.reply({embeds: [Response.setDescription("❌ Je moet in een spraakkanaal zijn om deze opdracht te kunnen gebruiken.")], ephemeral: true})
        const test = guild.channels.cache.filter(chnl => (chnl.type == ChannelType.GuildVoice)).find(channel => (channel.members.has(client.user.id)))
        if(test && voiceChannel.id !== test.id) return interaction.reply({embeds: [Response.setDescription(`❌ Ik ben al aan het spelen in<#${test.id}>`)], ephemeral: true})

        try {
            
            switch(options.getSubcommand()) {
                case "play": {
                    client.distube.play( voiceChannel, options.getString("query"), {
                        textChannel: channel, member: member
                    })

                    return interaction.reply({content: `🎼 Verzoek ontvangen`, ephemeral: true})
                }

                case "volume": {
                    const Volume = options.getNumber("procent")
                    if(Volume > 100 || Volume < 1) return interaction.reply({embeds: [Response.setDescription("Je moet een getal tussen 1 en 100 specificeren ")], ephemeral: true});

                    client.distube.setVolume(voiceChannel, Volume)
                    return interaction.reply({content: `🔊 Het volume is ingesteld op \`${Volume}%\``})
                }

                case "settings": {

                    const queue = await client.distube.getQueue(voiceChannel);
                    if(!queue) return interaction.reply({content: '🛑 Er is momenteel geen wachtrij.', ephemeral: true})

                    switch(options.getString("options")) {
                        case "skip": {
                            await queue.skip(voiceChannel)
                            return interaction.reply({content: '⏩ Het nummer is overgeslagen.'})
                        }

                        case "shuffle": {
                            await queue.shuffle()
                            return interaction.reply({content: '🔀 Nummers in de wachtrij zijn geschud.'})
                        }

                        case "stop": {
                            await queue.stop(voiceChannel)
                            return interaction.reply({content: '⏹️ De muziek is gestopt.'})
                        }

                        case "pause": {
                            await queue.pause(voiceChannel)
                            return interaction.reply({content: '⏸️ Het nummer is gepauzeerd.'})
                        }

                        case "resume": {
                            await queue.resume(voiceChannel)
                            return interaction.reply({content: '▶️ Het nummer is hervat.'})
                        }

                        case "queue": {
                            return interaction.reply({embeds: [
                                Response.setDescription(`${queue.songs.map(
                                    (song, id) => `\n**${id + 1}** | ${song.name} - \`${song.formattedDuration}\``)}`
                            )]});
                        }
                    }

                    return;
                }
            }

        } catch (error) {
            const errorEmbed = new EmbedBuilder()
            .setColor(client.Config.embedColor)
            .setDescription(`🛑 Alert: ${error}`)
            return interaction.reply({embeds: [errorEmbed], ephemeral: true})
        }
    
    }
}