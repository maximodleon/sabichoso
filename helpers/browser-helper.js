

const generateScreenshot = async (browser, html, selector, padding = 0, filename) => {
  // const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({ width: 1000, height: 600, deviceScaleFactor: 2 }) // hit desktop breakpoint
  await page.goto(`data:text/html;charset=UTF-8,${html}`)
  const rect = await page.evaluate(selector => {
    const element = document.querySelector(selector)
    const{ x, y, width, height } = element.getBoundingClientRect()
    return { left: x, top: y, width, height }
  }, selector)

  await page.screenshot({
      path: filename,
      ommitBackground: true,
      clip: {
       x: rect.left - padding,
       y: rect.top - padding,
       width: rect.width + padding * 2,
       height: rect.height + padding * 2
      }
  })
 await page.close()
}

const setupPageLoading = (page) => {
page.setRequestInterception(true)
page.on('request', request => {
	if (
		request.url().endsWith('.jpg')
		|| request.url().includes('.jpeg')
		|| request.url().includes('.png')
		|| request.url().includes('.gif')
        || request.url().includes('.css') 
        || request.url().includes('.js')
        || request.url().includes('/css')
    ) {
       request.abort(); 
    }
	else { request.continue(); }
 })
}

module.exports = {
  generateScreenshot,
  setupPageLoading
}
