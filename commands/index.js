const gasolina = require('./gasolina')

const initCommands =  (bot) => {
  gasolina.getGasPrices(bot)
}

module.exports = {
 initCommands 
}
