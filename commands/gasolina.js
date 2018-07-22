const htmlHelper = require('../helpers/html-helper.js')
const browserHelper = require('../helpers/browser-helper.js')
const puppeteer = require('puppeteer')
const {
  GAS_PRICE_URL,
  GAS_PRICE_STYLES,
  PUMP_ICON
} = require('../constants/index.js')
require('dotenv').config()
const { BOT_NAME } = process.env

const getGasPrices = (bot) => {
  const commands = ['gasolina', 'combustible', `gasolina@${BOT_NAME}`, `combustible@${BOT_NAME}`]
  bot.command(commands, executeCommand)
}

const executeCommand = async (ctx) => {
  ctx.reply('déjame buscarlo y te lo mando...')
  console.log('ejecutando el comando gasolina...')
  const browser = await puppeteer.launch()
  const { table, caption } = await getTableAndCaption(browser)
  const body = getBody(table, caption)
  const html = htmlHelper.getHTML(body, GAS_PRICE_STYLES)
  await browserHelper.generateScreenshot(browser, html, 'div', 2, 'gas.png')
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

const getBody = (table, caption) => {
  return `
   <div class="container">
    <div class="caption">
     <span class="gas-pump">${PUMP_ICON}</span> 
      <div class="header">
        <h3> Precios combustibles </h3>
        <span>${caption}</span>
     </div>
    </div>
    <table>${table}</table>
   </div>`
}

module.exports = {
  getGasPrices
}
