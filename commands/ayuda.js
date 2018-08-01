require('dotenv').config()
const { BOT_NAME } = process.env

const getHelp = (bot) => {
  const commands = ['ayuda', `ayuda@${BOT_NAME}`]
  bot.command(commands, (ctx) => {
    ctx.replyWithMarkdown(`
   Yo puedo ayudarte a buscar diferentes informaciones al escribir alguno de los siguientes comandos:


   */clima:* _Escribe una ciudad del mundo y recibe el estado actual del clima. Ejemplo:_ */clima santo domingo*

   */combustible o /gasolina:* _Recibir los precios actuales de los combustibles en RD_

   */frase:* _Recibir frase de motivación al azar_

   */terrmoto:* _Recibir información sobre terremotos occuridos en RD en las útlimas 24 horas, si es que ha habido alguno con magnitud >= 4.5_
  `)
  })
}

module.exports = {
  getHelp
}
