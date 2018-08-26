const axios = require('axios')
const BASE_URL = 'http://api.openweathermap.org/data/2.5'
const WEATHER_API_URL = `${BASE_URL}/weather`
const FORECAST_API_URL = `${BASE_URL}/forecast`
require('dotenv').config()
const templateHelper = require('../helpers/templates-helper')
const browserHelper = require('../helpers/browser-helper')
const dateHelper = require('../helpers/dates-helper')
const fs = require('fs')
const memoize = require('memoizee')
const { WEATHER_API_KEY } = process.env

/* maxAge = one week (3 hours)
 * 3600 * 1000 = one hour in miliseconds
 * which gives 3600 * 1000 * 3
 * to get 3 hours of caching
 */
const maxAge = 3600 * 1000 * 3

/**
 * query OpenWeatherMap's APi for weather conditions
 * @param {object} extraParams override information for OpenWeatherMap's api endpoint
 * @return {Promise} weather information
 */
const _getWeatherCondition = async extraParams => {
  const defaultParams = {
    lang: 'es',
    units: 'metric',
    appid: WEATHER_API_KEY
  }

  const params = Object.assign({}, defaultParams, extraParams)
  return axios.get(WEATHER_API_URL, { params })
}

const getWeatherCondition = memoize(_getWeatherCondition, {
  promise: true,
  maxAge
})

/**
 * query OpenWeatherMap's API to get 3 hour forecast
 * @param {object} extraParams override information for OpenWeatherMap's API endpoint
 * @return {Promise} forecast information
 */
const _getForecastForCity = async extraParams => {
  const defaultParams = {
    lang: 'es',
    units: 'metric',
    appid: WEATHER_API_KEY
  }

  const params = Object.assign({}, defaultParams, extraParams)
  return axios.get(FORECAST_API_URL, { params })
}

const getForecastForCity = memoize(_getForecastForCity, {
  promise: true,
  maxAge
})

/**
 * Generate screenshot with weather information
 * @function generateWeatherScreenshotForCity
 * @param {int} cityId id of city from OpenWetherMap's list of ids
 * @return {object} object with name of image file and current weather caption
 */
const generateWeatherScreenshotAndCaptionForCity = async cityId => {
  const { data } = await getWeatherCondition({ id: cityId })
  const { data: forecast } = await getForecastForCity({ id: cityId })
  const icon = fs.readFileSync(`./assets/icons/${data.weather[0].icon}.svg`)
  const template = templateHelper.loadAndRenderTemplate('weather', {
    icon,
    city: data.name,
    forecast: data.weather[0].description,
    temp: Math.floor(data.main.temp),
    date: getWeatherDateString(data.dt),
    forecasts: mapForecasts(forecast.list)
  })
  const options = { selector: 'div[class="container"]', scaleFactor: 0.9 }
  const filename = await browserHelper.generateScreenshot(template, options)
  const caption = `El tiempo actual en ${data.name} es ${
    data.weather[0].description
  } con temperatura máxima de ${forecast.list[0].main.temp_max} y mínima de ${
    forecast.list[0].main.temp_min
  } grados celsius`
  return { filename, caption }
}

/**
 * transform date from milliseconds to readable date
 * @function getWeatherDateString
 * @param {int} miliseconds unix timestamp
 * @return {String} formatted date
 */
const getWeatherDateString = miliseconds => {
  const date = new Date(miliseconds * 1000)
  const day = dateHelper.getDayString(date.getDay())
  const month = dateHelper.getMonthString(date.getMonth())
  const monthDay = date.getDate()

  return `${day}, ${month} ${monthDay}`
}

/**
 * Map results from forecast api to get only the needed fields
 * @function
 * @param {object []} forecasts array results from the forecast api
 * @param {Number.int} sliceAmount amount of hours to get from forecast results
 * @return {Object []} mapped results
 */
const mapForecasts = (forecasts, sliceAmount = 4) => {
  const entries = forecasts.slice(0, sliceAmount)
  return entries.map(forecast => {
    console.log(new Date(forecast.dt * 1000).toLocaleTimeString())
    return {
      icon: fs.readFileSync(`./assets/icons/${forecast.weather[0].icon}.svg`),
      temp: Math.floor(forecast.main.temp),
      hour: new Date(forecast.dt * 1000)
        .toLocaleTimeString()
        .replace(/00/g, '')
        .replace(/:/g, '')
    }
  })
}

module.exports = {
  getWeatherCondition,
  generateWeatherScreenshotAndCaptionForCity
}
