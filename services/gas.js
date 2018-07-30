const browserHelper = require('../helpers/browser-helper.js')
const puppeteer = require('puppeteer')
const templateHelper = require('../helpers/templates-helper')
const { GAS_PRICE_URL } = require('../constants/index.js')

const generateGasPriceScreenshot = async () => {
  const browser = await puppeteer.launch({ args: ['--start-maximized'] })
  const { table, caption } = await getTableAndCaption(browser)
  const template = templateHelper.loadAndRenderTemplate('gas', { table, caption })
  await browserHelper.generateScreenshot(browser, template, 'div', 2, 'gas.png')
  await browser.close()
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
