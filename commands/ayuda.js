require('dotenv').config()
const { BOT_NAME } = process.env
const fs = require('fs')

const getHelp = (bot) => {
  const commands = ['ayuda', `ayuda@${BOT_NAME}`]
  bot.command(commands, (ctx) => {
    const helpText = fs.readFileSync('assets/help.md', 'utf-8')
    console.log(helpText)
    ctx.replyWithMarkdown(helpText)
  })
}

module.exports = {
  getHelp
}
