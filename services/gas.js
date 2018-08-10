const browserHelper = require('../helpers/browser-helper.js')
const puppeteer = require('puppeteer')
const templateHelper = require('../helpers/templates-helper')
const GAS_PRICE_URL = 'https://micm.gob.do/precios-de-combustibles'
const memoize = require('memoizee')

/* maxAge = one week (3 days)
 * 3600 * 1000 = one hour in miliseconds
 * a day has 24 hours
 * and a week has 7 days
 * which gives 3600 * 100 * 24 * 7
 * to get 1 week of caching
 */
const maxAge = 3600 * 1000 * 24 * 3

const generateGasPriceScreenshot = async () => {
  const browser = await puppeteer.launch({ args: ['--start-maximized'] })
  const { table, caption } = await getTableAndCaption(browser)
  await browser.close()
  const template = templateHelper.loadAndRenderTemplate('gas', {
    table,
    caption
  })
  const options = { selector: 'div', padding: 2, scaleFactor: 2 }
  const filename = await browserHelper.generateScreenshot(template, options)
  return filename
}

const _getTableAndCaption = async browser => {
  const page = await browser.newPage()
  browserHelper.setupPageLoading(page)
  await page.goto(GAS_PRICE_URL)
  const table = await page.evaluate(
    () => document.querySelector('table > tbody').outerHTML
  )
  const caption = await page.evaluate(
    () => document.querySelector('h2').innerHTML
  )
  await page.close()
  return { table, caption }
}

const getTableAndCaption = memoize(_getTableAndCaption, {
  promise: true,
  maxAge
})

module.exports = {
  generateGasPriceScreenshot
}
