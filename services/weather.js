const axios = require('axios')
const WEATHER_API_URL = 'http://api.openweathermap.org/data/2.5/weather'
require('dotenv').config()
const templateHelper = require('../helpers/templates-helper')
const browserHelper = require('../helpers/browser-helper')
const dateHelper = require('../helpers/dates-helper')
const fs = require('fs')
const { WEATHER_API_KEY } = process.env

const getWeatherCondition = async (extraParams) => {
  const defaultParams = {
    lang: 'es',
    units: 'metric',
    appid: WEATHER_API_KEY
  }

  const params = Object.assign({}, defaultParams, extraParams)
  return axios.get(WEATHER_API_URL, { params })
}

const generateWeatherScreenshotForCity = async (cityId) => {
  const { data } = await getWeatherCondition({ id: cityId })
  const icon = fs.readFileSync(`./assets/icons/${data.weather[0].icon}.svg`)
  const template = templateHelper.loadAndRenderTemplate('weather', { icon, city: data.name, forecast: data.weather[0].description, temp: Math.floor(data.main.temp), date: getWeatherDateString(data.dt) })
  const options = { selector: 'div[class="container"]', scaleFactor: 0.9 }
  const filename = await browserHelper.generateScreenshot(template, options)
  return filename
}

const getWeatherDateString = (miliseconds) => {
  const date = new Date(miliseconds * 1000)
  const day = dateHelper.getDayString(date.getDay())
  const month = dateHelper.getMonthString(date.getMonth())
  const monthDay = date.getDate()

  return `${day}, ${month} ${monthDay}`
}

module.exports = {
  getWeatherCondition,
  generateWeatherScreenshotForCity
}
