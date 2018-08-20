const fs = require('fs')
const URL =
  'https://gdc.bancentral.gov.do/Common/public/estadisticas/mercado-cambiario//documents//TAC4009_BC_2018.pdf'
const pdf2table = require('pdf2table')
const axios = require('axios')

/**
 * Get pdf with dolar information from Central Bank of DR to fetch/scrape latest price
 * and write to json file for later usage
 */
const getDollar = async () => {
  const res = await axios.get(URL, {
    responseType: 'stream',
    headers: { Accept: 'application/pdf' }
  })
  const writeStream = fs.createWriteStream('monedas.pdf', {
    encoding: 'binary'
  })
  await res.data.pipe(writeStream)

  writeStream.on('finish', () => {
    fs.readFile('./monedas.pdf', (error, buffer) => {
      if (error) return console.log(error)

      pdf2table.parse(buffer, (err, rows) => {
        if (err) return console.log(err)

        const day = new Date().getDate() - 1
        const row = rows.filter(item => item.includes(day.toString()))[0]
        const compraVenta = row.slice(-2)

        const dolar = Object.assign(
          {},
          {
            dolar: {
              compra: compraVenta[0],
              venta: compraVenta[1],
              actualizado: new Date()
            }
          }
        )

        fs.writeFileSync('./assets/tasas.json', JSON.stringify(dolar))
      })
    })
  })
}

module.exports = {
  getDollar
}
