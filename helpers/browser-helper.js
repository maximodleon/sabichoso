const puppeteer = require('puppeteer')
const DEFAULT_OPTIONS = {
  selector: 'body',
  padding: 0,
  scaleFactor: 2
}

/**
 * Generate screenshot from html template string
 * @function generateScreenshot
 * @param {String} html template to render for screenshot
 * @param {Object} option override for puppeteer
 *
 * @return {String} name of image file created after taking screenshot
 */
const generateScreenshot = async (html, options) => {
  const screenshotOptions = Object.assign(
    {
      filename: `${Math.random()
        .toString(36)
        .substring(2)}.png`
    },
    DEFAULT_OPTIONS,
    options
  )
  const browser = await puppeteer.launch({
    args: ['--start-maximized', '--no-sandbox']
  })
  const page = await browser.newPage()
  await page.setViewport({
    width: 1000,
    height: 600,
    deviceScaleFactor: screenshotOptions.scaleFactor
  }) // hit desktop breakpoint
  await page.goto(`data:text/html;charset=UTF-8,${html}`)
  const rect = await page.evaluate(selector => {
    const element = document.querySelector(selector)
    const { x, y, width, height } = element.getBoundingClientRect()
    return { left: x, top: y, width, height }
  }, screenshotOptions.selector)

  await page.screenshot({
    path: screenshotOptions.filename,
    ommitBackground: true,
    clip: {
      x: rect.left - screenshotOptions.padding,
      y: rect.top - screenshotOptions.padding,
      width: rect.width + screenshotOptions.padding * 2,
      height: rect.height + screenshotOptions.padding * 2
    }
  })
  await page.close()
  await browser.close()
  return screenshotOptions.filename
}

/**
 * Setup network request abortion for unnecessary assets
 * @function setupPageLoading
 * @param {Puppeteer.Page} page for which to set requests interception
 */
const setupPageLoading = page => {
  page.setRequestInterception(true)
  page.on('request', request => {
    if (
      request.url().includes('.jpg') ||
      request.url().includes('.jpeg') ||
      request.url().includes('.png') ||
      request.url().includes('.gif') ||
      request.url().includes('.css') ||
      request.url().includes('.js') ||
      request.url().includes('/css')
    ) {
      request.abort()
    } else {
      request.continue()
    }
  })
}

module.exports = {
  generateScreenshot,
  setupPageLoading
}
