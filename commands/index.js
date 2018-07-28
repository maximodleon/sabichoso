const gasolina = require('./gasolina')
const frase = require('./frase')
const terremoto = require('./terremoto')
const clima = require('./clima')

const initCommands = (bot) => {
  gasolina.getGasPrices(bot)
  frase.getRandomPhrase(bot)
  terremoto.getEarthquakeInfo(bot)
  clima.getWeatherForCity(bot)
}

module.exports = {
  initCommands
}
