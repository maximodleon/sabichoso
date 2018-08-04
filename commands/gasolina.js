const gasService = require('../services/gas')

require('dotenv').config()
const { BOT_NAME } = process.env

const getGasPrices = (bot) => {
  const commands = ['gasolina', 'combustible', `gasolina@${BOT_NAME}`, `combustible@${BOT_NAME}`]
  bot.command(commands, executeCommand)
}

const executeCommand = async (ctx) => {
  ctx.reply('déjame buscarlo y te lo mando...')
  let filename
  try {
    filename = await gasService.generateGasPriceScreenshot()
  } catch (error) {
    ctx.reply('oops..Ha ocurrido un error buscando la información. Por favor intenta en unos minutos')
    throw error
  }
  ctx.replyWithPhoto({ source: filename }, { caption: 'Aqui están los precios.' })
}

module.exports = {
  getGasPrices
}
