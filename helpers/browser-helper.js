const DEFAULT_OPTIONS = {
  selector: 'body',
  padding: 0,
  filename: 'default',
  scaleFactor: 2
}

const generateScreenshot = async (browser, html, options = DEFAULT_OPTIONS) => {
  const page = await browser.newPage()
  await page.setViewport({ width: 1000, height: 600, deviceScaleFactor: options.scaleFactor }) // hit desktop breakpoint
  await page.goto(`data:text/html;charset=UTF-8,${html}`)
  const rect = await page.evaluate(selector => {
    const element = document.querySelector(selector)
    const { x, y, width, height } = element.getBoundingClientRect()
    return { left: x, top: y, width, height }
  }, options.selector)

  await page.screenshot({
    path: options.filename,
    ommitBackground: true,
    clip: {
      x: rect.left - options.padding,
      y: rect.top - options.padding,
      width: rect.width + options.padding * 2,
      height: rect.height + options.padding * 2
    }
  })
  await page.close()
  return options.filename
}

const setupPageLoading = (page) => {
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
    } else { request.continue() }
  })
}

module.exports = {
  generateScreenshot,
  setupPageLoading
}
