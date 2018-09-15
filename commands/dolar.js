require('dotenv').config()
const fs = require('fs')
const { BOT_NAME } = process.env
const { getMonthString } = require('../helpers/dates-helper')

const executeCommand = ctx => {
  const tasas = JSON.parse(fs.readFileSync('assets/tasas.json'))
  const {
    dolar: { compra, venta, actualizado }
  } = tasas

  const date = new Date(actualizado)
  const month = getMonthString(date.getMonth())
  const day = date.getDate()
  const year = date.getFullYear()

  ctx.replyWithMarkdown(`
*Compra:* RD$${compra}
*Venta:* RD$${venta} 

*Actualizado:*  _${day}-${month}-${year}_
`)
}

const getDollarPrice = bot => {
  const commands = [
    'dolar',
    'dollar',
    `dolar@${BOT_NAME}`,
    `dollar@${BOT_NAME}`
  ]
  bot.command(commands, executeCommand)
}

module.exports = {
  getDollarPrice
}
