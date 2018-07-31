require('dotenv').config()
const earthquakeService = require('../services/earthquake')
const { BOT_NAME } = process.env

const getEarthquakeInfo = (bot) => {
  const commands = ['terremoto', `terremoto@${BOT_NAME}`, 'terremotos', `terremtos@${BOT_NAME}`]
  bot.command(commands, executeCommand)
}

const executeCommand = async (ctx) => {
  const results = await earthquakeService.getEarthquakeInfo()
  if (results.length) {
    ctx.replyWithPhoto({ url: results.mapImage },
      {
        caption: `Terremoto de magnitud *${results.magnitude}* en *${results.place}* para más detalles presiona [aqui](${results.detailsUrl})`,
        parse_mode: 'Markdown'
      })
  } else {
    ctx.reply('No han habido terremotos en las últimas 24 horas')
  }
}

module.exports = {
  getEarthquakeInfo
}
