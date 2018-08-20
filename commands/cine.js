require('dotenv').config()
const movieHelper = require('../helpers/movies-helper')
const paging = require('../helpers/pagination-helper')

const callbackButtonsOptions = {
  callbackText: 'movieTitle',
  callbackDataPrefix: 'movie',
  callbackData: 'movieTitle'
}

const executeCommand = async ctx => {
  const keyboard = paging.paginateArray(
    movieHelper.getMovies(),
    0,
    4,
    callbackButtonsOptions
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

  bot.action(/moviePage:([0-9]+)/g, async ctx => {
    const next = Number.parseInt(ctx.match[1])

    const keyboard = paging.paginateArray(
      movieHelper.getMovies(),
      next,
      4,
      callbackButtonsOptions
    )
    await ctx.answerCallbackQuery()
    await ctx.editMessageReplyMarkup(keyboard)
  })
}

module.exports = {
  getMovieListings
}
