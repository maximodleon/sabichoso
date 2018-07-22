const phrases = require('../phrases.json')
require('dotenv').config()
const { BOT_NAME } = process.env

const executeCommand = (ctx) => {
  const filtered = phrases.filter((phrase) => phrase.category === 'motivación')
  const phrase = filtered[Math.floor(Math.random() * filtered.length)]
  console.log('yes')
  ctx.replyWithMarkdown(`
  _${phrase.phrase}_
  *${phrase.author}*
  `)
}

const getRandomPhrase = (bot) => {
  const commands = ['frase', `frase@${BOT_NAME}`]
  bot.command(commands, executeCommand)
}

module.exports = {
  getRandomPhrase
}
