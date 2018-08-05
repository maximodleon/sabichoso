const Telegraf = require('telegraf')
const session = require('telegraf/session')
const commands = require('./commands')
require('dotenv').config()

const { BOT_TOKEN, LOG_CHAT_ID } = process.env

const bot = new Telegraf(BOT_TOKEN)
bot.use(session())
bot.use(Telegraf.log())
bot.start((ctx) => ctx.reply('Hola!'))
commands.initCommands(bot)

bot.catch((error) => {
  console.log('error', error)
  bot.telegram.sendMessage(LOG_CHAT_ID, `Error ejecutando un comando ${error}`)
})

bot.startPolling()
