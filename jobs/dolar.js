require('dotenv').config()
const { CronJob } = require('cron')
const currencyService = require('../services/currency')

// run this everyday at 5:30 PM
const job = new CronJob('0 30 17 * * *', async () => {
  console.log('fetching current dollar prices', new Date().toLocaleString())
  try {
    await currencyService.getDollar()
  } catch (error) {
    console.log('error fetching dollar prices', error)
    return
  }

  console.log('successfully fetched dollar prices')
})

job.start()
