require('dotenv').config()
const { CronJob } = require('cron')
const earthquakeService = require('../services/earthquake')
const dateHelper = require('../helpers/dates-helper')
const Telegraf = require('telegraf')

const { BOT_TOKEN, LOG_CHAT_ID } = process.env

// run this command every 5 minutes
const job = new CronJob('0 */5 * * * *', async () => {
  const bot = new Telegraf(BOT_TOKEN)
  console.log(
    'searching for earthquake information at:',
    new Date().toLocaleString()
  )
  let res = []
  try {
    res = await earthquakeService.getEarthquakeInfo()
  } catch (error) {
    console.log('Error getting earthquake information', error)
  }

  if (res.length) {
    const caption = res
      .map(
        earthquake =>
          `Terremoto de magnitud *${earthquake.magnitude}* en *${
            earthquake.place
          }* en fecha ${earthquake.date.getDay() +
            1}/${earthquake.date.getMonth() +
            1}/${earthquake.date.getFullYear()} a las ${dateHelper.getHour(
            earthquake.date.getHours()
          )}:${dateHelper.getMinutes(earthquake.date.getMinutes())} ${
            earthquake.date.getHours() < 12 ? 'AM' : 'PM'
          }\npara más detalles presiona [aqui](${earthquake.detailsUrl})`
      )
      .join('\n\n')
    bot.telegram.sendMessage(LOG_CHAT_ID, caption)
  } else {
    console.log('nothing found')
  }
})

job.start()
