require('dotenv').config()
const Markup = require('telegraf/markup')
const { BOT_NAME } = process.env
const cityList = require('../assets/city.list.json')
const weatherService = require('../services/weather')

const executeCommand = async (ctx) => {
  const searchCity = ctx.message.text.replace('/clima', '').trim().toLowerCase()
  const cities = cityList.filter((city) => city.name.toLowerCase() === searchCity)
  let results
  if (cities.length > 1) {
    results = cities.map((city) => [Markup.callbackButton(city.country, `weather:${city.id}`)])
    const keyboard = Markup.inlineKeyboard(results)
    ctx.reply('de que pais', keyboard.resize().extra())
  } else if (cities.length === 1) {
    await weatherService.generateWeatherScreenshotForCity(cities[0].id)
    await ctx.replyWithPhoto({ source: 'weather.png' })
  } else {
    await ctx.reply('No encuentro esa ciudad')
  }
}

const getWeatherForCity = (bot) => {
  const commands = ['clima']
  bot.command(commands, executeCommand)
  bot.action(/weather:(\d+)/g, async (ctx) => {
    const cityId = ctx.match[1]
    await ctx.deleteMessage()
    await ctx.reply('Buscando')
    await weatherService.generateWeatherScreenshotForCity(cityId)
    await ctx.replyWithPhoto({ source: 'weather.png' })
  })
}

module.exports = {
  getWeatherForCity
}
