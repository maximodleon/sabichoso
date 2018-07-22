const gasolina = require('./gasolina')
const frase = require('./frase')
const terremoto = require('./terremoto.js')

const initCommands = (bot) => {
  gasolina.getGasPrices(bot)
  frase.getRandomPhrase(bot)
  terremoto.getEarthquakeInfo(bot)
}

module.exports = {
  initCommands
}
