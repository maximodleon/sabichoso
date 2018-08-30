require('dotenv').config()
const { CronJob } = require('cron')
const movieScrapper = require('../services/movie-scraping')

// run every day at 8 AM
const job = new CronJob('0 0 8 * * *', async () => {
  console.log('scraping movie information', new Date().toLocaleString())
  try {
    await movieScrapper.scrapeMovieInfo()
  } catch (error) {
    console.log('error scraping movies', error)
    return
  }

  console.log('successfully scraped movies informaton')
})

job.start()
