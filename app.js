const Telegraf = require('telegraf')
const session = require('telegraf/session')
const commands = require('./commands')
require('dotenv').config()

const { BOT_TOKEN } = process.env

const bot = new Telegraf(BOT_TOKEN)
bot.use(session())
bot.use(Telegraf.log())
bot.start((ctx) => ctx.reply('Hola!'))
commands.initCommands(bot)

bot.startPolling()
