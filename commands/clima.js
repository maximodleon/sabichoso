require('dotenv').config()
const { BOT_NAME } = process.env
const cityList = require('../assets/city.list.json')
const countryList = require('../assets/countries.json')
const weatherService = require('../services/weather')
const paging = require('../helpers/pagination-helper')

const callbackButtonsOptions = {
  callbackText: 'cityName',
  callbackDataPrefix: 'weather',
  callbackData: 'cityId'
}

const executeCommand = async ctx => {
  const searchCity = ctx.message.text
    .replace('/clima', '')
    .trim()
    .toLowerCase()
  if (!searchCity.length) return ctx.reply('Tiene que especificar una ciudad')

  ctx.session.city = searchCity
  const cities = cityList.filter(city => city.name.toLowerCase() === searchCity)
  if (cities.length > 1) {
    const results = cities.map(mapCities)
    const keyboard = paging.paginateArray(results, 0, 4, callbackButtonsOptions)
    ctx.reply('¿De cuál país?', keyboard.resize().extra())
  } else if (cities.length === 1) {
    let source
    try {
      source = await weatherService.generateWeatherScreenshotForCity(
        cities[0].id
      )
    } catch (error) {
      ctx.reply(
        'oops.. Ha ocurrido un error, por favor intenta de nuevo en un momento'
      )
      throw error
    }

    await ctx.replyWithPhoto({ source })
  } else {
    await ctx.reply('No encuentro esa ciudad')
  }
}

const getWeatherForCity = bot => {
  const commands = ['clima', `clima@${BOT_NAME}`]
  bot.command(commands, executeCommand)

  bot.action(/weatherPage:([0-9]+)/g, async ctx => {
    const offset = Number.parseInt(ctx.match[1])
    const cities = cityList.filter(
      city => city.name.toLowerCase() === ctx.session.city
    )
    const results = cities.map(mapCities)

    const keyboard = paging.paginateArray(
      results,
      offset,
      4,
      callbackButtonsOptions
    )
    ctx.answerCallbackQuery()
    ctx.editMessageReplyMarkup(keyboard)
  })

  bot.action(/weather:(\d+)/g, async ctx => {
    const cityId = ctx.match[1]
    try {
      await ctx.deleteMessage()
    } catch (error) {
      console.log('error deleting message for weather')
    }
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

const mapCities = city => {
  const countryName = countryList.filter(
    country => country.Code === city.country
  )
  return { cityName: countryName[0].Name, cityId: city.id }
}

module.exports = {
  getWeatherForCity
}
