const raeService = require('../services/rae')
const paging = require('../helpers/pagination-helper')

const callbackButtonsOptions = {
  callbackText: 'header',
  callbackDataPrefix: 'rae',
  callbackData: 'id'
}

const searchWord = bot => {
  bot.command('rae', executeCommand)
  bot.action(/rae:([a-zA-Z0-9]+)/, async ctx => {
    const wordId = ctx.match[1]
    try {
      await ctx.deleteMessage()
    } catch (error) {
      console.log('error deleting message for rae')
    }

    ctx.reply('buscando...')
    const defintion = await getDefintionForWord(wordId)
    ctx.replyWithMarkdown(defintion)
  })

  bot.action(/raePage:([0-9]+)/g, async ctx => {
    const offset = Number.parseInt(ctx.match[1])
    const results = await raeService.searchWord(ctx.session.word)
    const words = results.map(mapWords)
    const keyboard = paging.paginateArray(
      words,
      offset,
      4,
      callbackButtonsOptions
    )
    ctx.answerCallbackQuery()
    ctx.editMessageReplyMarkup(keyboard)
  })
}

const executeCommand = async ctx => {
  const word = ctx.message.text
    .replace('/rae', '')
    .trim()
    .toLowerCase()

  if (!word.length) {
    return ctx.reply('Tiene que especificar una palabara')
  }

  const results = await raeService.searchWord(word)
  ctx.session.word = word
  if (!results.length) {
    ctx.reply('palabra no encontrada.¿La escribiste bien?')
  } else if (results.length === 1) {
    const definition = await getDefintionForWord(results[0].id)
    ctx.replyWithMarkdown(definition)
  } else {
    const words = results.map(mapWords)
    const keyboard = paging.paginateArray(words, 0, 4, callbackButtonsOptions)
    ctx.reply('¿Cuál de todoas?', keyboard.resize().extra())
  }
}

const getDefintionForWord = wordId => {
  return raeService.fetchWord(wordId)
}

const mapWords = word => {
  const { header, id } = word
  return { header, id }
}

module.exports = {
  searchWord
}
