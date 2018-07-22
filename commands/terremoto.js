require('dotenv').config()
const axios = require('axios')

const { EARTHQUAKE_API_URL, MIN_EARTHQUAKE_MAGNITUDE } = process.env

/* DR coordinates */
const LATITUDE=18.735693
const LONGITUDE=-70.162651
const MAX_RADIUS=5
const FORMAT = 'geojson'

const getEarthquakeInfo = (bot) =>  {
   bot.command('terremoto', executeCommand)
}

const executeCommand = async (ctx) => {
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
  if (filtered.length) {
   const { properties } = filtered[0]
   const details = await axios.get(properties.detail) 
   const { data } = details
   const place = properties.place.substring(properties.place.indexOf('of') + 3)
   const mapImage = data.properties.products.dyfi[0].contents[`us${properties.code}_ciim.jpg`]
   ctx.replyWithPhoto({ url: mapImage.url }, 
                      {  
                        caption: `Terremoto de magnitud *${properties.mag}* en *${place}* para más detalles presiona [aqui](${properties.url})`,
                        parse_mode: 'Markdown'
                      })
  } else {
   ctx.reply('No han habido terremotos en las últimas 24 horas')
  }
}

const getDates = () => {
  const today = new Date()
  const todayDay = getDatePart(today.getDay()) 
  const todayMoth = getDatePart(today.getMonth()) 
  const tomorrow  = getDatePart(today.getDay() + 1)
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
