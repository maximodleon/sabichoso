require('dotenv').config()
const movieHelper = require('../helpers/movies-helper')
const movieTemplateHelper = require('../helpers/movie-template-helper')
const Markup = require('telegraf/markup')

const executeCommand = async (ctx) => {
  const movies = movieHelper.getMovies()
  const keyboard = Markup.inlineKeyboard(movies.map(getCallbackButton.bind(null, 'movie')))
  await ctx.reply('elige una', keyboard.resize().extra())
}

const getMovieListings = (bot) => {
  const commands = ['cine']
  bot.command(commands, executeCommand)

  bot.action(/movie:([A-Za-z0-9\s-:()!áéíóúÁÉÍÓÚ`'"]+)/gi, async (ctx) => {
    const movie = ctx.match[1]
    ctx.session.movie = movie
    const theaters = movieHelper.getTheaterForMovie(movie)
    await ctx.editMessageText('en cual cine')
    const keyboard = Markup.inlineKeyboard(theaters.map(getCallbackButton.bind(null, 'theater')))
    await ctx.editMessageReplyMarkup(keyboard)
  })

  bot.action(/theater:([A-Za-z0-9\s-:]+)/gi, async (ctx) => {
    const movieDetails = movieHelper.getMovieDetails(ctx.session.movie)
    const showings = movieHelper.getShowingForTheater(ctx.session.movie, ctx.match[1])
    const templateParams = Object.assign({}, movieDetails, { theaterName: ctx.match[1], showings })
    await ctx.deleteMessage()
    await ctx.reply('te lo mando ahora')
    const source = await movieTemplateHelper.renderTamplateForMovie(templateParams)
    await ctx.replyWithPhoto({ source }, { caption: `para ver el trailer dale [aqui](${movieDetails.trailer})`, parse_mode: 'markdown' })
  })
}

const getCallbackButton = (label, movieTitle) => {
  return [Markup.callbackButton(movieTitle, `${label}:${movieTitle}`)]
}

module.exports = {
  getMovieListings
}
