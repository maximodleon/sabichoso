require('dotenv').config()
const axios = require('axios')

/* DR coordinates */
const EARTHQUAKE_API_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query'
const MIN_EARTHQUAKE_MAGNITUDE = 4.0
const LATITUDE = 18.735693
const LONGITUDE = -70.162651
const MAX_RADIUS = 5
const FORMAT = 'geojson'

/**
 * query USGS earthquake api to get latest earthquakes occuring in/near DR
 * @function getEarthquakeInfo
 * @param {int} magnitude magnitude to search for, defaults to 4.5
 * @return {Object []} object array with the information for each earthquake found
 */
const getEarthquakeInfo = async magnitude => {
  const dates = getDates()
  const params = {
    format: FORMAT,
    longitude: LONGITUDE,
    latitude: LATITUDE,
    maxradius: MAX_RADIUS,
    minmagnitude: magnitude || MIN_EARTHQUAKE_MAGNITUDE,
    starttime: dates.today,
    endtime: dates.tomorrow
  }

  const results = await axios.get(EARTHQUAKE_API_URL, { params: { ...params } })
  const filtered = results.data.features.filter(feature =>
    feature.properties.place.includes('Dominican Republic')
  )
  const value = []

  if (filtered.length) {
    return filtered.map(earthquake => {
      const {
        properties: { mag, url, place }
      } = earthquake

      return {
        magnitude: mag,
        detailsUrl: url,
        place: place.substring(place.indexOf('of') + 3)
      }
    })
  }
  return value
}

/**
 * Returns an object with dates for today (the day the command is run) and the day after
 * to filter the results of USGS api
 * @function getDates
 *
 * @return {Object} object containing a key for today's date and the day after date
 */
const getDates = () => {
  const today = new Date()
  const todayDay = getDatePart(today.getDay())
  const todayMonth = getDatePart(today.getMonth())
  const tomorrow = getDatePart(today.getDay() + 1)
  const todayFormatted = `${today.getFullYear()}-${todayMonth}-${todayDay}`
  const tomorrowFormatted = `${today.getFullYear()}-${todayMonth}-${tomorrow}`

  return {
    today: todayFormatted,
    tomorrow: tomorrowFormatted
  }
}

/**
 * prepend 0 if date given is less than 10 (two digits)
 * @param {String} part date part to check if is greater than 10
 * @return {String} date part with 0 prepended if needed
 */
const getDatePart = part => {
  if (part >= 10) {
    return `${part}`
  } else {
    return `0${part}`
  }
}

module.exports = {
  getEarthquakeInfo
}
