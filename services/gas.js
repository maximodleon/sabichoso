const browserHelper = require('../helpers/browser-helper.js')
const puppeteer = require('puppeteer')
const templateHelper = require('../helpers/templates-helper')
const GAS_PRICE_URL = 'https://micm.gob.do/precios-de-combustibles'

const generateGasPriceScreenshot = async () => {
  const browser = await puppeteer.launch({ args: ['--start-maximized'] })
  const { table, caption } = await getTableAndCaption(browser)
  const template = templateHelper.loadAndRenderTemplate('gas', { table, caption })
  const options = { selector: 'div', padding: 2, filename: 'gas.png', scaleFactor: 2 }
  const filename = await browserHelper.generateScreenshot(browser, template, options)
  await browser.close()
  return filename
}

const getTableAndCaption = async (browser) => {
  const page = await browser.newPage()
  browserHelper.setupPageLoading(page)
  await page.goto(GAS_PRICE_URL)
  const table = await page.evaluate(() => document.querySelector('table > tbody').outerHTML)
  const caption = await page.evaluate(() => document.querySelector('h2').innerHTML)
  await page.close()
  return { table, caption }
}

module.exports = {
  generateGasPriceScreenshot
}
