require('dotenv').config()
const movieHelper = require('../helpers/movies-helper')
const Markup = require('telegraf/markup')

const executeCommand = async ctx => {
  const movies = movieHelper.getMovies()
  const keyboard = Markup.inlineKeyboard(
    movies.map(getCallbackButton.bind(null, 'movie'))
  )
  await ctx.reply('elige una', keyboard.resize().extra())
}

const getMovieListings = bot => {
  const commands = ['cine']
  bot.command(commands, executeCommand)

  bot.action(/movie:([A-Za-z0-9\s-:()!áéíóúÁÉÍÓÚ`'"]+)/gi, async ctx => {
    const movie = ctx.match[1]
    const movieDetails = movieHelper.getMovieDetails(movie)
    await ctx.deleteMessage()
    await ctx.replyWithMarkdown(
      `[Poster](${movieDetails.poster})\n\n[Trailer](${
        movieDetails.trailer
      })\n\n[Horarios](${movieDetails.link}#horarios)\n\n*Sinopsis:*\n\n${
        movieDetails.description
      }`
    )
  })
}

const getCallbackButton = (label, movieTitle) => {
  return [Markup.callbackButton(movieTitle, `${label}:${movieTitle}`)]
}

module.exports = {
  getMovieListings
}
