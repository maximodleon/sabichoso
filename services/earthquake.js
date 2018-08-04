require('dotenv').config()
const axios = require('axios')

/* DR coordinates */
const EARTHQUAKE_API_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query'
const MIN_EARTHQUAKE_MAGNITUDE = 4.0
const LATITUDE = 18.735693
const LONGITUDE = -70.162651
const MAX_RADIUS = 5
const FORMAT = 'geojson'

const getEarthquakeInfo = async () => {
  const dates = getDates()
  const params = {
    format: FORMAT,
    longitude: LONGITUDE,
    latitude: LATITUDE,
    maxradius: MAX_RADIUS,
    minmagnitude: MIN_EARTHQUAKE_MAGNITUDE,
    starttime: dates.today,
    endtime: dates.tomorrow
  }

  const results = await axios.get(EARTHQUAKE_API_URL, { params: { ...params } })
  const filtered = results.data.features.filter((feature) => feature.properties.place.includes('Dominican Republic'))
  const value = []

  if (filtered.length) {
    return filtered.map((earthquake) => {
      const { properties: { mag, url, place } } = earthquake

      return {
        magnitude: mag,
        detailsUrl: url,
        place: place.substring(place.indexOf('of') + 3)
      }
    })
  }
  return value
}

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

const getDatePart = (part) => {
  if (part >= 10) {
    return `${part}`
  } else {
    return `0${part}`
  }
}

module.exports = {
  getEarthquakeInfo
}
