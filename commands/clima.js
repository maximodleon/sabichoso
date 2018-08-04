require('dotenv').config()
const Markup = require('telegraf/markup')
const { BOT_NAME } = process.env
const cityList = require('../assets/city.list.json')
const countryList = require('../assets/countries.json')
const weatherService = require('../services/weather')

const executeCommand = async (ctx) => {
  const searchCity = ctx.message.text.replace('/clima', '').trim().toLowerCase()
  if (!searchCity.length) return ctx.reply('Tiene que especificar una ciudad')

  const cities = cityList.filter((city) => city.name.toLowerCase() === searchCity)
  if (cities.length > 1) {
    const results = cities.map(getCallbackButton)
    const keyboard = Markup.inlineKeyboard(getSlicedArray(results))
    ctx.reply('¿De cuál país?', keyboard.resize().extra())
  } else if (cities.length === 1) {
    let source
    try {
      source = await weatherService.generateWeatherScreenshotForCity(cities[0].id)
    } catch (error) {
      ctx.reply('oops.. Ha ocurrido un error, por favor intenta de nuevo en un momento')
      throw error
    }

    await ctx.replyWithPhoto({ source })
  } else {
    await ctx.reply('No encuentro esa ciudad')
  }
}

const getWeatherForCity = (bot) => {
  const commands = ['clima', `clima@${BOT_NAME}`]
  bot.command(commands, executeCommand)
  bot.action(/weather:(\d+)/g, async (ctx) => {
    const cityId = ctx.match[1]
    try {
      await ctx.deleteMessage()
    } catch (error) { console.log('error deleting message for weather') }
    await ctx.reply('Buscando')
    let source
    try {
      source = await weatherService.generateWeatherScreenshotForCity(cityId)
    } catch (error) {
      ctx.reply('oops..Ha occurido un error. Por favor intenta en un momento')
      throw error
    }
    await ctx.replyWithPhoto({ source })
  })
}

const getCallbackButton = (city) => {
  const countryName = countryList.filter((country) => country.Code === city.country)
  return Markup.callbackButton(countryName[0].Name, `weather:${city.id}`)
}

const getSlicedArray = (resultsArray) => {
  return resultsArray.reduce((result, value, index, array) => {
    if (index % 2 === 0) {
      result.push(array.slice(index, index + 2))
    }
    return result
  }, [])
}

module.exports = {
  getWeatherForCity
}
