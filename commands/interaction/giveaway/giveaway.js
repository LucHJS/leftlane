const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const ms = require('ms');
const fs = require('fs')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Alle tools die je nodig hebt voor giveaways')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers)
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Start een giveaway')
                .addStringOption(option => option.setName('reward').setDescription('De beloning van de giveaway').setRequired(true))
                .addStringOption(option => option.setName('duration').setDescription('De duur van de giveaway').setRequired(true))
                .addIntegerOption(option => option.setName('winners').setDescription('Het aantal winnaars').setRequired(true).setMinValue(1))
                .addUserOption(option => option.setName('host').setDescription('De gebruiker die de giveaway host')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('reroll')
                .setDescription('Kiest een nieuwe winnaar voor de giveaway')
                .addStringOption(option => option.setName('message-id').setDescription('Het bericht-ID van de giveaway die je opnieuw wilt uitvoeren').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('pause')
                .setDescription('Pauzeert een lopende giveaway')
                .addStringOption(option => option.setName('message-id').setDescription('Het bericht-ID van de giveaway die je wilt pauzeren').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('resume')
                .setDescription('Hervat een gepauzeerde giveaway')
                .addStringOption(option => option.setName('message-id').setDescription('Het bericht-ID van de giveaway die je wilt hervatten').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('end')
                .setDescription('Beëindigt een giveaway')
                .addStringOption(option => option.setName('message-id').setDescription('Het bericht-ID van de giveaway die je wilt beëindigen').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('cancel')
                .setDescription('Stopt een giveaway')
                .addStringOption(option => option.setName('message-id').setDescription('Het bericht-ID van de giveaway die je wilt annuleren').setRequired(true))),
    run: async(client, interaction)=> {

        if(interaction.options.getSubcommand() === "start"){

            const reward = interaction.options.getString('reward')
            const duration = interaction.options.getString('duration')
            const winners = interaction.options.getInteger('winners')
            const host = interaction.options.getUser('host')
            const thumbnail = interaction.options.getAttachment('thumbnail')

            if(isNaN(ms(duration))) {return interaction.reply({ content: 'Kan de duur niet parsen!', ephemeral: true });}
            var messegeid = undefined;
            await client.giveawaysManager.start(interaction.channel, {
                duration: ms(duration),
                prize: reward,
                winnerCount: winners,
                hostedBy: host ? host : interaction.user,
                thumbnail: "https://yt3.googleusercontent.com/fJ8ctNAHvdir8yhggXDL6_ivWxnWQrxm5nHgohrHCB5sRx2tEf1BLVfHYfyW-Ru2nDU20decjg=s176-c-k-c0x00ffffff-no-rj",
                messages: {
                    giveaway: "🎉 **GIVEAWAY** 🎉",
                    giveawayEnded: "🎉 **GIVEAWAY VOORBIJ** 🎉",
                    drawing: "Giveaway eindigt {timestamp}",
                    inviteToParticipate: "Klik op de 🎉 reactie hieronder om deel te nemen",
                    winMessage: "🎉 Gefeliciteerd, {winners}! Je hebt **{this.prize}** gewonnen!",
                }
            }).then((msg) => {
                return (messegeid = msg.message.id)
            })

           

         
            interaction.reply({content: `De giveaway wordt gestart... als je iemand anders wil kiezen doe </giveaway reroll:1225494243565637655> en vul je dit **${messegeid} ** ID`, ephemeral: true })

        }

        if(interaction.options.getSubcommand() === 'reroll'){
            const messageID = interaction.options.getString('message-id')

            await client.giveawaysManager
                .reroll(messageID,{
                         messages: {
                            congrat: '🎉 Nieuwe winnaar(s): {winners}! Gefeliciteerd, je hebt **{this.prize}** gewonnen!'
                         }
                })
                .then(() => {
                    return interaction.reply({content: 'Een nieuwe winnaar wordt gekozen...', ephemeral: true});
                })
                .catch((err) => {
                    return interaction.reply({content: `Ik ben een fout tegengekomen!\n\`\`${err}\`\``, ephemeral: true});
                });

           // interaction.reply({content:"De giveaway wordt opnieuw uitgevoerd...", ephemeral: true})
        }

        if(interaction.options.getSubcommand() === 'pause'){
            const messageID = interaction.options.getString('message-id')

            const giveaway = client.giveawaysManager.giveaways.find((giveaway) => giveaway.messageId === messageID && giveaway.guildId === interaction.guild.id);
            if (giveaway.pauseOptions.isPaused) return interaction.reply({content: 'Deze giveaway is al gepauzeerd!', ephemeral: true})

            if(!giveaway) return interaction.reply({content: 'Kon het invoerbericht-ID niet parsen!', ephemeral: true})

            client.giveawaysManager
                .pause(messageID)
                .then(() => {
                    return interaction.reply({content: 'De giveaway is succesvol gepauzeerd.', ephemeral: true});
                })
                .catch((err) => {
                    return interaction.reply({content: `Ik ben een fout tegengekomen!\n\`\`${err}\`\``, ephemeral: true});
                });


        }

        if(interaction.options.getSubcommand() === 'resume'){
            const messageID = interaction.options.getString('message-id')

            const giveaway = client.giveawaysManager.giveaways.find((giveaway) => giveaway.messageId === messageID && giveaway.guildId === interaction.guild.id);
            if (!giveaway.pauseOptions.isPaused) return interaction.reply({content: 'Deze giveaway loopt al.', ephemeral: true})

            if(!giveaway) return interaction.reply({content: 'Kon het invoerbericht-ID niet parsen!', ephemeral: true})

            client.giveawaysManager
                .unpause(messageID)
                .then(() => {
                    return interaction.reply({content: 'De giveaway is succesvol hervat.', ephemeral: true});
                })
                .catch((err) => {
                    return interaction.reply({content: `Er is een ongebruikelijke fout opgetreden!\n\`\`${err}\`\``, ephemeral: true});
                });

        }

        if(interaction.options.getSubcommand() === 'end'){
            const messageID = interaction.options.getString('message-id')

            const giveaway = client.giveawaysManager.giveaways.find((giveaway) => giveaway.messageId === messageID && giveaway.guildId === interaction.guild.id);

            if(!giveaway) return interaction.reply({content: 'Kon het invoerbericht-ID niet parsen!', ephemeral: true})

            client.giveawaysManager
                .end(messageID)
                .then(() => {
                    return interaction.reply({content: 'De giveaway is beëindigd.', ephemeral: true});
                })
                .catch((err) => {
                    return interaction.reply({content: `Er is een ongebruikelijke fout opgetreden!\n\`\`${err}\`\``, ephemeral: true});
                });

        }

        if(interaction.options.getSubcommand() === 'stop'){
            const messageID = interaction.options.getString('message-id')

            const giveaway = client.giveawaysManager.giveaways.find((giveaway) => giveaway.messageId === messageID && giveaway.guildId === interaction.guild.id);

            if(!giveaway) return interaction.reply({content: 'Kon het invoerbericht-ID niet parsen!', ephemeral: true})

            client.giveawaysManager
                .delete(messageID)
                .then(() => {
                    return interaction.reply({content: 'De giveaway is geannuleerd.', ephemeral: true});
                })
                .catch((err) => {
                    return interaction.reply({content: `Er is een ongebruikelijke fout opgetreden!\n\`\`${err}\`\``, ephemeral: true});
                });
        }


    }
};
