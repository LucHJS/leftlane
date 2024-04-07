const client = require('../../index')
const config = require(('../../config.json'))
const { Discord, Client, GatewayIntentBits, PermissionsBitField, Collection, EmbedBuilder, ActivityType, Ac } = require('discord.js')

const Timeout = new Collection()
const ms = require('ms')
client.on('messageCreate', async (message) => {


   if(
   message.content.startsWith('kanker') || 
   message.content.startsWith('kkr')|| 
   message.content.startsWith('neger')|| 
   message.content.startsWith('nigger')|| 
   message.content.startsWith('niger')|| 
   message.content.startsWith('kkk') ||
   message.content.startsWith("hoer")
   ||
   message.content.startsWith("slet")
   ){
    const member = message.member
  

    
    if(member.roles.cache.has(config.tickets.ModRole)) return

    
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
           value: `${member} heeft zojuist gescholden met ${message.content} (Getimeout: 10 Min )`,
           inline: true
       }
   )

   const logchannel = member.guild.channels.cache.get("1225113685450555412") 
   if(!logchannel) return

   logchannel.send({embeds: [embed]})
   
 message.channel.send(`${member} Je hier niet schelden.....`).then( (msg) => {
    setTimeout(() => {
        msg.delete()
    }, 5000);

    user.timeout(5 * 60 * 1000)
 })
        

 message.delete()
   }


 
})

