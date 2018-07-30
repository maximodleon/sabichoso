const browserHelper = require('../helpers/browser-helper.js')
const puppeteer = require('puppeteer')
const { GAS_PRICE_URL } = require('../constants/index.js')
const templateHelper = require('../helpers/templates-helper')

require('dotenv').config()
const { BOT_NAME } = process.env

const getGasPrices = (bot) => {
  const commands = ['gasolina', 'combustible', `gasolina@${BOT_NAME}`, `combustible@${BOT_NAME}`]
  bot.command(commands, executeCommand)
}

const executeCommand = async (ctx) => {
  ctx.reply('déjame buscarlo y te lo mando...')
  console.log('ejecutando el comando gasolina...')
  const browser = await puppeteer.launch({ args: ['--start-maximized'] })
  const { table, caption } = await getTableAndCaption(browser)
  const template = templateHelper.loadAndRenderTemplate('gas', { table, caption })
  await browserHelper.generateScreenshot(browser, template, 'div', 2, 'gas.png')
  console.log('respondiendo')
  ctx.replyWithPhoto({ source: 'gas.png' }, { caption: 'Aqui están los precios.' })
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
  getGasPrices
}
