const fs = require('fs')
const Discord = require('discord.js')
const bot = new Discord.Client()

const token = 'NDAyMTc3NjIxNTQ4NDY2MTc3.DT08ng.o2RHziMjgTTM00haDD4p-5VIpy0'
const prefix = '!'

bot.on('ready', () =>
{
  console.log('Bot ready !')
  bot.user.setActivity('être programmé')
})

bot.on('message', (message) =>
{
  let args = message.content.substring(prefix.length).split(' ')
  let member = message.channel.guild.members.find('id', message.author.id)
  let subRole = message.channel.guild.roles.find('name', 'Abonnés')

  if (!message.author.bot && message.content.startsWith(prefix))
  {
    switch (args[0].toLowerCase())
    {
      //Welcome to you !
      case 'subscribe' :

        if (!member.roles.find('name', 'Abonnés'))
        {
          member.addRole(subRole)
          message.channel.send('Vous faites maintenant parti des Abonnés, vous avez donc accès à de nouveaux salons !')
        }
        else
        {
          message.channel.send('Vous êtes déjà abonné !')
        }
        break

      //Shame on him
      case 'unsubscribe' :

        if (member.roles.find('name', 'Abonnés'))
        {
          member.removeRole(subRole)
          message.channel.send('Vous n\'êtes plus abonné.')
        }
        else
        {
          message.channel.send('Vous n\'êtes pas abonné !')
        }
        break

      case 'me' :

        let content = fs.readFileSync('./data/' + message.channel.guild.id + '.json')
        let jsonContent = JSON.parse(content)

        let xp = 0
        if (!jsonContent.hasOwnProperty(member.id))
        {
          xp = 0
        }
        else
        {
          xp = jsonContent[member.id]
        }

        let roles = ''
        member.roles.forEach((role, id, map) =>
        {
          if (role.name != '@everyone')
          {
            roles += role.name + ' '
          }
        })

        let userEmbed = new Discord.RichEmbed()
          .setTitle(member.displayName)
          .setColor(randomColor())
          .setThumbnail(member.user.avatarURL)
          .setDescription('· Niveau ' + Math.floor(xp / 1000) + ', (' + Math.floor(xp % 1000) + ' / 1000)' + '\n' +
                          '· Experience totale : ' + xp + '\n' +
                          '· Membre depuis ' + formatTime((Date.now() - member.joinedTimestamp) / 1000) + '\n' +
                          '· Rôles : ' + roles
                         )

        message.channel.send(userEmbed)
        break

      //HELP ME !!!
      case 'help':

        let helpEmbed = new Discord.RichEmbed()
          .setTitle('Aide')
          .setColor(randomColor())
          .setThumbnail(bot.user.avatarURL)
          .setDescription(
                          '· **' + prefix + 'subscribe** : Vous ajoute le rôle Abonné,' + '\n' +
                          '· **' + prefix + 'unsubscribe** : Vous retire le rôle Abonné,' + '\n' +
                          '· **' + prefix + 'me** : Donne des informations à votre sujet,' + '\n' +
                          '· **' + prefix + 'ping** : Renvoie pong,' + '\n' +
                          '. **' + prefix + 'social** : Donne le lien des réseaux sociaux.'
                         )
        message.channel.send(helpEmbed)
        break

      //This guy want to play ping-pong
      case 'ping' :

        message.channel.send('**PONG !** :hammer:')
        break

      case 'social' :

        let socialEmbed = new Discord.RichEmbed()
          .setTitle('Social')
          .setColor(randomColor())
          .setThumbnail(bot.user.avatarURL)
          .setDescription(
                          '· **Twitter : https://twitter.com/ZOm__YT**' + '\n' +
                          '· **Youtube : https://www.youtube.com/c/ZomZD**'
                         )
        message.channel.send(socialEmbed)
        break

      //In the case of the guy said something weird...
      default :
        let nbrBots = 0
        for (let i = 0; i < message.channel.guild.members.length; i++)
        {
          if (message.channel.guild.members[i].user.bot)
          {
            nbrBots++
          }
        }
        if (nbrBots > 1)
        {
          message.channel.send('Cette commande n\'éxiste pas !')
        }
        break
    }
  }

  if (!message.author.bot && !message.content.startsWith(prefix))
  {
    let exp = Math.floor(Math.random() * message.content.length - 5) + 5
    let path = './data/' + message.channel.guild.id + '.json'

    if (fs.existsSync(path))
    {
      let content = fs.readFileSync(path)
      let jsonContent = JSON.parse(content)

      if (jsonContent.hasOwnProperty(member.id))
      {
        jsonContent[member.id] = jsonContent[member.id] + exp
        fs.writeFileSync(path, JSON.stringify(jsonContent))
      }
      else
      {
        jsonContent[member.id] = exp
        fs.writeFileSync(path, JSON.stringify(jsonContent))
      }
    }
    else
    {
      fs.writeFileSync(path, '{}')
    }
  }
})

bot.login(token)

//Utils functions

function randomColor()
{
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

function formatTime(time)
{
  days = Math.floor(time / 86400)
  time %= 86400
  hours = Math.floor(time / 3600)
  time %= 3600
  minutes = Math.floor(time / 60)
  seconds = Math.floor(time % 60)
  return days + ' jours, ' + hours + ' heures, ' + minutes + ' minutes et ' + seconds + ' secondes'
}
