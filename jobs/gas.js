require('dotenv').config()
const { CronJob } = require('cron')
const gasService = require('../services/gas')
const Telegraf = require('telegraf')
const fs = require('fs')
const { BOT_TOKEN, LOG_CHAT_ID } = process.env

// run every friday at 12 PM
const job = new CronJob('0 0 12 * * 4', async () => {
  console.log('getting gas prices', new Date().toLocaleString())

  const bot = new Telegraf(BOT_TOKEN)
  let filename
  try {
    filename = await gasService.generateGasPriceScreenshot()
  } catch (error) {
    console.log('error getting gas prices', error)
    return
  }

  try {
    await bot.telegram.sendPhoto(LOG_CHAT_ID, {
      source: fs.readFileSync(filename)
    })
  } catch (error) {
    console.log('error sending gas prices', error)
    return
  }

  console.log('successfully sent gas prices')
})

job.start()
