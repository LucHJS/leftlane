const { EmbedBuilder } = require('discord.js')
const client = require('../../index')

const Reactie = new EmbedBuilder()
.setColor(Number(client.Config.embedColor))
.setTitle("🎵 | Muziek systeem Leftlanepapi")
.setTimestamp(Date.now())

const status = queue =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Uit'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'Gehele Wachtrij' : 'Dit Nummer') : 'Uit'
  }\` | Autoplay: \`${queue.autoplay ? 'Aan' : 'Uit'}\``
client.distube
  .on('playSong', (queue, song) =>
    queue.textChannel.send({embeds: [Reactie.setDescription(`▶️ | Aan het spelen \`${song.name}\` - \`${song.formattedDuration}\`\n\nAangevraagd door: ${
        song.user
      }\n${status(queue)}`).setThumbnail(song.thumbnail)]}
    )
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send({embeds: [Reactie.setDescription(`✅ | Toegevoegd ${song.name} - \`${song.formattedDuration}\` aan de wachtrij door ${song.user}`).setThumbnail(song.thumbnail)]})
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send({embeds: [Reactie.setDescription(`✅ | Toegevoegd \`${playlist.name}\` afspeellijst (${
        playlist.songs.length
      } nummers) aan wachtrij\n${status(queue)}`)]}
    )
  )
  .on('error', (channel, e) => {
    if (channel) channel.send(`❌ | Er is een fout opgetreden: ${e.toString().slice(0, 1974)}`)
    else console.error(e)
  })
  .on('empty', channel => channel.send({embeds: [Reactie.setDescription('De spraakkanaal is leeg! Verlaat het kanaal...')]}))
  .on('searchNoResult', (message, query) =>
    message.channel.send({embeds: [Reactie.setDescription(`❌ | Geen resultaat gevonden voor \`${query}\`!`)]})
  )
  .on('finish', queue => queue.textChannel.send({embeds: [Reactie.setDescription("`✅ Klaar! + Ik heb het spraakkanaal verlaten. Als je wilt dat ik terugkom, zet dan gewoon een nummer en ik speel het af :)`")]}))
