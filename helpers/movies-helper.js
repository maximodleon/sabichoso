const movies = require('../assets/movies.json')
const memoize = require('memoizee')

/* maxAge = one week (3 hours)
 * 3600 * 1000 = one hour in miliseconds
 * which gives 3600 * 1000 * 3
 * to get 3 hours of caching
 */
const maxAge = 3600 * 1000 * 3

const getMovies = () => {
  return movies.map(movie => movie.title)
}

const getMovieDetails = title => {
  return movies.filter(movie => movie.title === title).map(movie => {
    return {
      trailer: movie.trailer,
      title: movie.title,
      link: movie.link,
      poster: movie.poster,
      description: movie.description
    }
  })[0]
}

const getTheaterForMovie = title => {
  const movie = movies.filter(movie => movie.title === title)[0]
  return Object.keys(movie.showings)
}

const getShowingForTheater = (movieTitle, theaterName) => {
  const movie = movies.filter(movie => movie.title === movieTitle)[0]
  return movie.showings[theaterName]
}

module.exports = {
  getMovies: memoize(getMovies, { maxAge }),
  getMovieDetails: memoize(getMovieDetails, { maxAge }),
  getTheaterForMovie: memoize(getTheaterForMovie, { maxAge }),
  getShowingForTheater: memoize(getShowingForTheater, { maxAge })
}
