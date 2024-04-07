const client = require('../../index')
const config = require(('../../config.json'))
const { Discord, Client, GatewayIntentBits, PermissionsBitField, Collection, EmbedBuilder, ActivityType, Ac } = require('discord.js')
const reactions = require('../../Models/reactions')

client.on('messageReactionAdd', async (reaction, user) => {
    if(!reaction.message.guildId) return;

    if(user.bot) return
    let cID = `<:${reaction.emoji.name}:${reaction.emoji.id}>`


    if(!reaction.emoji.id) cID = reaction.emoji.name

    const data = await reactions.findOne({     
       Guild: reaction.message.guildId, 
        Message: reaction.message.id,
         Emoji: cID,
         })

        if(!data) return

        const guild = await client.guilds.cache.get(reaction.message.guildId)
        const member = await guild.members.cache.get(user.id)

        try{
            await member.roles.add(data.Role)
        }catch(e){
            return
        }

})


client.on('messageReactionRemove', async (reaction, user) => {
    if(!reaction.message.guildId) return;

    if(user.bot) return
    let cID = `<:${reaction.emoji.name}:${reaction.emoji.id}>`


    if(!reaction.emoji.id) cID = reaction.emoji.name

    const data = await reactions.findOne({     
       Guild: reaction.message.guildId, 
        Message: reaction.message.id,
         Emoji: cID,
         })

        if(!data) return;

        const guild = await client.guilds.cache.get(reaction.message.guildId)
        const member = await guild.members.cache.get(user.id)

        try{
            await member.roles.remove(data.Role)
        }catch(e){
            return
        }

})
