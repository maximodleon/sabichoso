const wiki = require('wikipediajs')
const Markup = require('telegraf/markup')

const BASE_URL = 'https://es.wikipedia.org/wiki?curid='
const getWikiArticles = (bot) => {
  bot.command('wiki', async (ctx) => {
    const word = ctx.message.text.substr(ctx.message.text.indexOf(' '))
    const { query } = await wiki.search(word, 'es')
    if (!query.pages) return ctx.reply('no hay resultados para esa busqueda')

    const keys = Object.keys(query.pages)
    if (keys.length === 1) {
      ctx.reply(query.page[keys[0]].fullurl)
    } else if (keys.length > 1) {
      const buttons = keys.map((key) => [Markup.callbackButton(query.pages[key].title, `wiki:${key}`)])
      const keyboard = Markup.inlineKeyboard(buttons)
      ctx.message.state = { pages: query.pages }
      ctx.reply('encontre varios, cual de estos?', keyboard.resize().extra())
    }
  })

  bot.action(/wiki:(\d+)/g, async (ctx) => {
    const articleId = ctx.match[1]
    await ctx.deleteMessage()
    await ctx.reply(`${BASE_URL}${articleId}`)
  })
}

module.exports = {
  getWikiArticles
}
