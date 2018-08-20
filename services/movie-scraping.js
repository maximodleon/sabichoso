const { parseString } = require('xml2js')
const { get } = require('axios')
const puppeteer = require('puppeteer')
const fs = require('fs')

/*
 * scrape basic movie information for movies showing in DR and writes to
 * a JSON file for later use.
 * @function scrapeMovieInfo
 */
const scrapeMovieInfo = async () => {
  const browser = await puppeteer.launch()
  const feedItems = await getRSS()

  const movies = await Promise.all(
    feedItems.map(async item => {
      const page = await browser.newPage()
      await page.goto(item.link[0])

      const title = await page.evaluate(() => {
        return document.querySelector(
          'div[class="small-12 medium-8 large-8 columns"]>h1'
        ).innerText
      })
      const description = await page.evaluate(() => {
        return document.querySelector(
          'div[class="small-12 medium-8 large-8 columns"] > p:last-child'
        ).innerText
      })
      const movieDetail = await page.evaluate(evaluateMoviePage)

      const movie = {
        title,
        description,
        trailer: item.guid[0],
        link: item.link[0],
        estreno: item.category[0] === 'ESTRENO',
        poster: item.enclosure[0].$.url,
        showings: movieDetail
      }

      return movie
    })
  )

  await browser.close()
  fs.writeFileSync('movies.json', JSON.stringify(movies))
}

/*
 * reads movies rss feed to get movie details urls for later
 * scraping
 * @function getRSS
 * @return {Object []} RSS feed information
 */
const getRSS = async () => {
  const { data } = await get('http://www.cinema.com.do/rss.php')
  let feed
  parseString(data, (error, json) => {
    if (error) throw error
    feed = json
  })

  return feed.rss.channel[0].item
}

/**
 * scrape schedule information from movie details page
 * @function evaluateMovePage
 * @return {Object []} schedules for each theater the movie is showing in
 */
const evaluateMoviePage = () => {
  const divs = document.querySelectorAll('.panel>div.row')
  const theaters = {}
  let dayTime = []
  for (let div of divs) {
    const divParent = div.querySelector(
      'div[class="small-12 medium-12 large-12 columns"]'
    )
    const movieTheater = divParent.querySelector('h6').innerText
    const times = divParent.querySelectorAll(
      'div[class="row collapse"]>div[class="small-12 medium-11 large-11 columns"]>ul>li'
    )
    for (let time of times) {
      const ps = time.querySelectorAll('p')
      const day = { hours: [] }
      for (let p of ps) {
        if (
          ['Jue', 'Vie', 'Sab', 'Dom', 'Lun', 'Mar', 'Mie'].includes(
            p.innerText
          )
        ) {
          day.name = p.innerText
        } else {
          day.hours.push(p.innerText)
        }
      }

      const found = dayTime.findIndex(d => d.name === day.name)
      if (found > -1) {
        dayTime[found].hours = dayTime[found].hours.concat(day.hours)
      } else {
        dayTime.push(day)
      }
    }

    theaters[movieTheater] = dayTime
    dayTime = []
  }
  return theaters
}

module.exports = {
  scrapeMovieInfo
}
