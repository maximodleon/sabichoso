const fs = require('fs')
const memoize = require('memoizee')

/* maxAge = one week (3 hours)
 * 3600 * 1000 = one hour in miliseconds
 * which gives 3600 * 1000 * 3
 * to get 3 hours of caching
 */
const maxAge = 3600 * 1000 * 3

/**
 * Return titles for all movies store in the database
 * @function getMovies
 * @return {String []} string array with all movie titles from database
 */
const getMovies = () => {
  const movies = getMoviesFromDisk()
  return movies.map(movie => movie.title)
}

/**
 * Return details for the given movie title
 * @function getMovieDetails
 * @param {String} title title to search for
 * @return {Object} object containing details for the movies, if found.
 */
const getMovieDetails = title => {
  const movies = getMoviesFromDisk()
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

/**
 * Return all movie theaters where a movie is showing
 * @function getTheaterForMovie
 * @param {String} title title of the movie to search for
 * @return {String []} String array containing the name of the theaters where the movie is showing
 */
const getTheaterForMovie = title => {
  const movies = getMoviesFromDisk()
  const movie = movies.filter(movie => movie.title === title)[0]
  return Object.keys(movie.showings)
}

/**
 * Get schedule for a given movie and theater
 * @function getShowingForTheater
 * @param {String} movieTitle title of the movie to search for
 * @param {String} theaterName name of theater to search in
 * @return {Object []} Array with the hours and day the movie is showing in the theater
 */
const getShowingForTheater = (movieTitle, theaterName) => {
  const movies = getMoviesFromDisk()
  const movie = movies.filter(movie => movie.title === movieTitle)[0]
  return movie.showings[theaterName]
}

const getMoviesFromDisk = () => {
  let movies
  try {
    movies = fs.readFileSync('assets/movies.json')
  } catch (error) {
    console.log('error opening movies file', error)
    return []
  }
  return JSON.parse(movies)
}

module.exports = {
  getMovies: memoize(getMovies, { maxAge }),
  getMovieDetails: memoize(getMovieDetails, { maxAge }),
  getTheaterForMovie: memoize(getTheaterForMovie, { maxAge }),
  getShowingForTheater: memoize(getShowingForTheater, { maxAge })
}
