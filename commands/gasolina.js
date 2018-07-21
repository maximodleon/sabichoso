const htmlHelper = require('../helpers/html-helper.js')
const browserHelper = require('../helpers/browser-helper.js')
const puppeteer = require('puppeteer')
const { GAS_PRICE_URL, GAS_PRICE_STYLES, FONT_AWESOME_LINK } = require('../constants/index.js')

const getGasPrices = (bot) => {
  bot.command('gasolina', executeCommand)
}

const executeCommand = async (ctx) => {
 ctx.reply('lo busco y te lo mando...')
 const browser = await puppeteer.launch()
 const { table, caption } = await getTableAndCaption(browser)
 const link = [`<link rel="stylesheet" integrity="sha384-O8whS3fhG2OnA5Kas0Y9l3cfpmYjapjI0E4theH4iuMD+pLhbf6JI0jIMfYcK3yZ" crossorigin="anonymous" href="${FONT_AWESOME_LINK}" />`]
 const body = getBody(table, caption)
 const html = htmlHelper.getHTML(body, GAS_PRICE_STYLES, link)
 await browserHelper.generateScreenshot(browser, html, 'div', 2, 'gas.png')
 await browser.close()
 ctx.replyWithPhoto({ source: 'gas.png' }, { caption: 'Estos son los precios para esta semana' })
}

const getTableAndCaption = async (browser) => {
 const page = await browser.newPage()
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
      <i class="fas fa-gas-pump"></i>
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
