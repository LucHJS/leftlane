const {SlashCommandBuilder } = require('discord.js')
const Discord = require('discord.js')
const {Minesweeper} = require('discord-gamecord')

const schema = require('../../../Models/Mines')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('saldo')
    .setDescription("check je saldo van de casino"),
    run: async(client, interaction) => {
       
       

            const data = await schema.findOne(
                { MemberID: interaction.user.id }, 
            );
            if(!data) return interaction.reply({content: `Je hebt nog geen geld`, ephemeral: true} )  
       
        interaction.reply(`je hebt nu $${data.Balance}`)
    }
}