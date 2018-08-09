require('dotenv').config()
const axios = require('axios')
const memoize = require('memoizee')
const { parseString } = require('xml2js')
const { RAE_TOKEN } = process.env

const BASE_ENDPOINT = 'https://dle.rae.es/data'
const RAE_SEARCH_ENDPOINT = `${BASE_ENDPOINT}/search`
const RAE_FETCH_ENDPOINT = `${BASE_ENDPOINT}/fetch`
const headers = { Authorization: `Basic ${RAE_TOKEN}`, 'Cache-Control': 'no-cache' }


/* maxAge = one week (7 days)
 * 3600 * 1000 = one hour in miliseconds
 * a day has 24 hours
 * and a week has 7 days
 * which gives 3600 * 100 * 24 * 7 
 * to get 1 week of caching
 */
const maxAge = 3600 * 1000 * 24 * 7

const searchWord = async (word) => {
  const config = Object.assign({}, { headers }, { params: { w: word, m: '10' } })
  const { data: { res } } = await axios.get(`${RAE_SEARCH_ENDPOINT}`, config)

  return res
}

const fetchWord = async (wordId) => {
  const config = Object.assign({}, { headers }, { params: { id: wordId } })
  const { data } = await axios.get(`${RAE_FETCH_ENDPOINT}`, config)
  return getWordDefinitions(data)
}

const getWordDefinitions = (rss) => {
  let definitions = ' '

  parseString(rss, (error, data) => {
    if (error) throw error

    const { article } = data
    const header = article.header[0]._
    const { p: ps } = article

    definitions += `*${header}* \n\n`
    for (const p of ps) {
      if (p.$.class === 'j') {
        delete p.$
        delete p.span
        if (p._) {
          const match = p._.match(/\d{1}\./)[0]
          definitions += `*${match}* `
        }

        definitions += `*${p.abbr[0]._}* `

        const mark = p.mark && `_${p.mark.map((item) => item._ || item).join(' ')}_`
        const a = p.a && p.a[0]._

        if (mark) { definitions += mark }
        if (a) { definitions += a }
        definitions += '\n\n'
      }
    }
  })

  return definitions
}

module.exports = {
  searchWord: memoize(searchWord, { promise: true, maxAge }),
  fetchWord: memoize(fetchWord, { promise: true, maxAge })
}
