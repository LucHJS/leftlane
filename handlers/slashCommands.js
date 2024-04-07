const fs = require('fs')
const Ascii = require('ascii-table')
const client = require('..')

const {REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v10')

const token = client.Config.Token
const clientId = client.Config.CLIENTID
const guildId = client.Config.GuildId
const applicationId = client.Config.applicationId

module.exports = async(client) => {
     const slashCommands = []
    let table = new Ascii().setHeading('Slash Commands', 'Load Status')
     fs.readdirSync('./commands/interaction/').forEach(dir =>{
        const files = fs.readdirSync(`./commands/interaction/${dir}/`).filter(file => file.endsWith('.js'))

        for (let file of files){
            let slashCommand = require(`../commands/interaction/${dir}/${file}`)

            if(slashCommand.data.name){
                slashCommands.push(slashCommand.data)

                client.slashCommands.set(slashCommand.data.name, slashCommand)

                table.addRow(slashCommand.data.name, '✅ Loaded')
            }else{
                table.addRow(file.split('.js')[0], '❌ Failed')
                continue;
            }
        }
     });

     console.log(table.toString())

     const rest = new REST({version: 10}).setToken(token)

     try{
        rest.put(
            guildId ?
            Routes.applicationGuildCommands(applicationId || clientId, guildId):
            Routes.applicationCommands(applicationId || clientId),
            {body: slashCommands}
        )
        console.log('✅  Slashcommands Loaded'.red)

     }catch(error){
        console.log(error)
     }
}