const gasService = require('../services/gas')

require('dotenv').config()
const { BOT_NAME } = process.env

const getGasPrices = (bot) => {
  const commands = ['gasolina', 'combustible', `gasolina@${BOT_NAME}`, `combustible@${BOT_NAME}`]
  bot.command(commands, executeCommand)
}

const executeCommand = async (ctx) => {
  ctx.reply('déjame buscarlo y te lo mando...')
  console.log('ejecutando el comando gasolina...')
  gasService.generateGasPriceScreenshot()
  console.log('respondiendo')
  ctx.replyWithPhoto({ source: 'gas.png' }, { caption: 'Aqui están los precios.' })
}

module.exports = {
  getGasPrices
}
