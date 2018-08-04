require('dotenv').config()
const earthquakeService = require('../services/earthquake')
const { BOT_NAME } = process.env

const getEarthquakeInfo = (bot) => {
  const commands = ['terremoto', `terremoto@${BOT_NAME}`, 'terremotos', `terremtos@${BOT_NAME}`]
  bot.command(commands, executeCommand)
}

const executeCommand = async (ctx) => {
  const magnitude = ctx.message.text.split(' ')[1]
  if (magnitude) {
    if (Number.parseFloat(magnitude).toString() === Number.NaN.toString()) return ctx.reply('Tienes que introducir un número para la magnitud')
  }
  let results
  try {
    results = await earthquakeService.getEarthquakeInfo(magnitude)
  } catch (error) {
    ctx.reply('oops...Ha ocurrido un problema buscando la información. Por favor intenta en unos minutos')
    throw error
  }
  if (results.length) {
    const caption = results.map((earthquake) => `Terremoto de magnitud *${earthquake.magnitude}* en *${earthquake.place}* para más detalles presiona [aqui](${earthquake.detailsUrl})`).join('\n\n')
    ctx.replyWithMarkdown(caption)
  } else {
    ctx.reply('No han habido terremotos de magnitud menor o igual a 4.5 en las últimas 24 horas')
  }
}

module.exports = {
  getEarthquakeInfo
}
