const {SlashCommandBuilder } = require('discord.js')
const Discord = require('discord.js')
const {Minesweeper} = require('discord-gamecord')

const schema = require('../../../Models/Mines')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('mines')
    .setDescription("speel een leuk spelletje")
    .addNumberOption(
        option =>
        option.setName("inzet")
        .setDescription("hoeveel wil je inzetten")
        .setRequired(true)
        
    )
    .addNumberOption(
        option =>
        option.setName("bombs")
        .setDescription("tegen hoeveel 💣 wil je spelen")
        .setRequired(false)
      ),
    run: async(client, interaction) => {
        
        const inzet = interaction.options.getNumber("inzet")
        
        const mines = interaction.options.getNumber("bombs" || "5")
 
        const game = new Minesweeper({
            message: interaction,
            isSlashGame: true,
            embed: {
                title: 'Mines',
                color: "#0400FF",
                description: 'klik on de knoppen'
            },
            emojis: {flag: "💎", mine: "💣"},
            mines: mines,
            timeoutTime: 6000,
            winMessage: "Je hebt gewonnen!",
            loseMessage: "Je hebt verloren",
            playerOnlyMessage: 'alleen {player} kan deze knoppen gebruiken'
        });// Voeg deze regel toe waar je de emojis bijwerkt
        console.log("Nieuwe emojis:", game.options.emojis);
        
        // Voeg deze regel toe binnen de startGame() methode
        

        game.startGame()

       
        game.on("gameOver", async(result) => {
            const multiplier = (result.blocksTurned  * 0.1);
            const blocks = result.blocksTurned - 1
            const winnings = blocks * inzet * 0.3;

            client.winnings = winnings

            

           
            const data = await schema.findOne(
                { MemberID: interaction.user.id }, 
            );
                

            if(!data){
                const newRecord = new schema({
                    MemberID: interaction.user.id,
                    Balance: winnings
                });

                await newRecord.save();
              
                console.log('Nieuw balansrecord aangemaakt:', newRecord);
            }else {
                data.Balance += winnings;
                await data.save();
                console.log('Balans bijgewerkt:', data);
            }
          })
        
    }
}