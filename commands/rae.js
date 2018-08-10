const raeService = require('../services/rae')
const Markup = require('telegraf/markup')

const searchWord = (bot) => {
  bot.command('rae', executeCommand)
  bot.action(/rae:([a-zA-Z0-9]+)/, async (ctx) => {
    const wordId = ctx.match[1]
    try {
      await ctx.deleteMessage()
    } catch (error) { console.log('error deleting message for rae') }

    ctx.reply('buscando...')
    const defintion = await getDefintionForWord(wordId)
    ctx.replyWithMarkdown(defintion)
  })
}

const executeCommand = async (ctx) => {
  const word = ctx.message.text.replace('/rae', '').trim().toLowerCase()

  if (!word.length) { return ctx.reply('Tiene que especificar una palabara') }

  const results = await raeService.searchWord(word)

  if (!results.length) {
    ctx.reply('palabra no encontrada.¿La escribiste bien?')
  } else if (results.length === 1) {
    const definition = await getDefintionForWord(results[0].id)
    ctx.replyWithMarkdown(definition)
  } else {
    const keyboard = Markup.inlineKeyboard(results.map(getCallbackButton))
    ctx.reply('¿Cuál de todoas?', keyboard.resize().extra())
  }
}

const getDefintionForWord = (wordId) => {
  return raeService.fetchWord(wordId)
}

const getCallbackButton = (word) => {
  const { header, id } = word
  return [Markup.callbackButton(header, `rae:${id}`)]
}

module.exports = {
  searchWord
}
