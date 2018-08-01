const wiki = require('wikipediajs')
const Markup = require('telegraf/markup')

const getWikiArticles = (bot) => {
  bot.command('wiki', async (ctx) => {
    const word = ctx.message.text.substr(ctx.message.text.indexOf(' '))
    const { query } = await wiki.search(word, 'es')
    if (!query.pages) return ctx.reply('no hay resultados para esa busqueda')

    const keys = Object.keys(query.pages)
    if (keys.length === 1) {
      ctx.reply(query.page[keys[0]].fullurl)
    } else if (keys.length > 1) {
      const buttons = keys.map((key) => [Markup.callbackButton(query.pages[key].title, `wiki:${query.pages[key].fullurl}`)])
      console.log(buttons)
      const keyboard = Markup.inlineKeyboard(buttons)
      ctx.reply('encontre varios, cual de estos?', keyboard.resize().extra())
    }
  })

  bot.action(/wiki:(.+)/g, async (ctx) => {
    const articleUrl = ctx.match[1]
    try {
    await ctx.deleteMessage()
    } catch(error) { }
    await ctx.reply(articleUrl)
  })
}

module.exports = {
  getWikiArticles
}
