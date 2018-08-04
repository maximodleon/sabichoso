const wiki = require('wikipediajs')
const Markup = require('telegraf/markup')

const executeCommand = async (ctx) => {
  const { message: { text } } = ctx
  const word = text.substr(text.indexOf(' '))
  let pages
  try {
    const { query } = await wiki.search(word, 'es')
    pages = query.pages
  } catch (error) {
    ctx.reply('oops..Ha habido un error buscando la información. Por favor intenta en unos minutos')
    throw error
  }
  if (!pages) return ctx.reply('no hay resultados para esa búsqueda')

  const keys = Object.keys(pages)
  if (keys.length === 1) {
    ctx.reply(pages[keys[0]].fullurl)
  } else if (keys.length > 1) {
    const buttons = keys.map((key) => {
      const data = `wiki:${pages[key].title.replace(/\s/g, '_')}`
      const text = pages[key].title
      return [Markup.callbackButton(text, data)]
    })
    const keyboard = Markup.inlineKeyboard(buttons)
    ctx.reply('encontre varios, cual de estos?', keyboard.resize().extra())
  }
}

const getWikiArticles = (bot) => {
  bot.command('wiki', executeCommand)

  bot.action(/wiki:([a-zA-Z0-9_.()áéíóú]+)/gi, async (ctx) => {
    const article = ctx.match[1]
    try {
      await ctx.deleteMessage()
    } catch (error) { console.log('error deleting wiki artcile message') }
    await ctx.reply(`https://es.wikipedia.org/wiki/${article}`)
  })
}

module.exports = {
  getWikiArticles
}
