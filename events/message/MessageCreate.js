const client = require('../../index')
const config = require(('../../config.json'))
const { Discord, Client, GatewayIntentBits, PermissionsBitField, Collection, EmbedBuilder, ActivityType, Ac } = require('discord.js')

const Timeout = new Collection()
const ms = require('ms')
client.on('messageCreate', async (message) => {


   if(
   message.content.startsWith('discord.gg') || 
   message.content.startsWith('https://discord.gg') ||
   message.content.startsWith('https://') 
   ||
   message.content.startsWith('https://') 

   ){
    const user = message.member
    const member = message.guild.members.cache.get(user.id) 
    if(user.roles.cache.has(config.tickets.ModRole)) return

    const embed = new EmbedBuilder()
    .setColor(Number(client.Config.embedColor))
    .setTitle(`🛑 | LOGS`)
    .setAuthor({ name: `Discord Logs`, iconURL: `${message.guild.iconURL()}` })
    .setThumbnail(message.guild.iconURL())
    .setFooter({ text: `® ${message.guild.name}`})
    .setTimestamp()
    .addFields(
        {
            name: `Persoon:`,
            value: `${member} | ${member.id} | ${member.user.username} `,
            inline: true
        },
        {
            name: `Inhoud:`,
            value: `${member} heeft zojuist ${message.content} Gestuurd in ${message.channel} (Getimeout: 10 Min )`,
            inline: true
        }
    )
 
    const logchannel = member.guild.channels.cache.get("1225113685450555412") 
    if(!logchannel) return
 
    logchannel.send({embeds: [embed]})
  
      
    message.channel.send(`${member} Je mag hier geen linkjes sturen.....`).then( (msg) => {
        setTimeout(() => {
            msg.delete()
        }, 5000);
    
        user.timeout(5 * 60 * 1000)
     }) 
      message.delete()}
  
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;

    if (message.author.id == client.user.id) return;

    var countingChannel = message.guild.channels.cache.get(config.counting);

    if (message.channel.id == countingChannel) {

        if (isNaN(message)) return message.reply({ content: `**${message.author} geef een getal op! \n begin weer vanaf 1 te tellen!**`, ephemeral: true });

        var test = "";

        await message.channel.messages.fetch({ limit: 2 }).then(async messages => {

            var lastMessageId = Array.from(messages.keys());

            test += lastMessageId[1];

        });

        var lastMessage1 = await message.channel.messages.fetch({ limit: 2 });
        var lastMessage = lastMessage1.last();
        var lastMessageContent = lastMessage.content;

        // Check nadat beicht van bot er is geweest

        if (lastMessage.author.id === client.user.id && lastMessageContent.endsWith("begin weer vanaf 1 te tellen!**")) {
            if (message.content === "1") {
                return message.react("✅");
            } else {
                message.react("❌");
                return message.reply({ content: `**${message.author} heeft het foute getal opgegeven! \n begin weer vanaf 1 te tellen!**` });
            }

        }
        // Check of het vorige getal + 1 = aan het huidige getal

        if (message.content == parseInt(lastMessageContent) + 1 && lastMessage.author.id !== message.author.id) {
            return message.react("✅");
        } else {
            message.react("❌");
            return message.reply({ content: `**${message.author} heeft het foute getal opgegeven! \n begin weer vanaf 1 te tellen!**` });
        }

    }




})

