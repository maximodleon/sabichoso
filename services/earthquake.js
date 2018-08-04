require('dotenv').config()
const axios = require('axios')

/* DR coordinates */
const EARTHQUAKE_API_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query'
const MIN_EARTHQUAKE_MAGNITUDE = 4.5
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
    const { properties } = filtered[0]
    const details = await axios.get(properties.detail)
    const { data } = details
    const place = properties.place.substring(properties.place.indexOf('of') + 3)
    const { properties: { products: { dyfi } } } = data
    const mapImage = dyfi ? dyfi[0].contents[`us${properties.code}_ciim.jpg`] : {}
    const info = {
      magnitude: properties.mag,
      place,
      detailsUrl: properties.url,
      mapImage: mapImage.url
    }
    value.push(info)
  }

  return value
}

const getDates = () => {
  const today = new Date()
  const todayDay = getDatePart(today.getDay())
  const todayMoth = getDatePart(today.getMonth())
  const tomorrow = getDatePart(today.getDay() + 1)
  const todayFormatted = `${today.getFullYear()}-${todayMoth}-${todayDay}`
  const tomorrowFormatted = `${today.getFullYear()}-${todayMoth}-${tomorrow}`

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
