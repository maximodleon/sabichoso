require('dotenv').config()
const { CronJob } = require('cron')
const weatherService = require('../services/weather')
const Telegraf = require('telegraf')
const fs = require('fs')

const { BOT_TOKEN, LOG_CHAT_ID } = process.env

// Get the weather for santo domingo, DO every day
// at 8 am
// cityId for santo domingo is 3492908
const job = new CronJob('0 0 8 * * *', async () => {
  const bot = new Telegraf(BOT_TOKEN)
  console.log(
    'getting weather for santo domingo at:',
    new Date().toLocaleString()
  )

  let image
  let imageCaption
  try {
    const {
      filename,
      caption
    } = await weatherService.generateWeatherScreenshotAndCaptionForCity(3492908)
    image = filename
    imageCaption = caption
  } catch (error) {
    console.log('error getting weather', error)
  }

  try {
    await bot.telegram.sendPhoto(
      LOG_CHAT_ID,
      { source: fs.readFileSync(image) },
      { caption: imageCaption }
    )
    console.log('weather sent', new Date().toLocaleString())
  } catch (error) {
    console.log('error sending weather information', error)
  }
})

job.start()
