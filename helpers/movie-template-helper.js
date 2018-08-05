const templateHelper = require('./templates-helper')
const { generateScreenshot } = require('./browser-helper')

const renderTamplateForMovie = async (movie) => {
  // poster, movieName, description, theaterName
  const params = {
    poster: movie.poster,
    movieName: movie.title,
    theaterName: movie.theaterName,
    showings: movie.showings,
    description: movie.description
  }

  const template = templateHelper.loadAndRenderTemplate('movie', params)
  const filename = await generateScreenshot(template, { selector: 'div[class="container"]' })
  return filename
}

module.exports = {
  renderTamplateForMovie
}
