const gasolina = require('./gasolina')
const frase = require('./frase')
const terremoto = require('./terremoto')
const clima = require('./clima')
const ayuda = require('./ayuda')
const wiki = require('./wiki')

const initCommands = (bot) => {
  gasolina.getGasPrices(bot)
  frase.getRandomPhrase(bot)
  terremoto.getEarthquakeInfo(bot)
  clima.getWeatherForCity(bot)
  ayuda.getHelp(bot)
  wiki.getWikiArticles(bot)
}

module.exports = {
  initCommands
}
