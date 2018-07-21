
const getHTML = (body, style, link = []) => {
 return `
  <html>
  <style>
   ${style}
  </style>
  ${link.join('')} 
  <body>
   ${body}
  </body>
  </html>
 `
}

const table = (header, body) => `<table>${header}${body}</table>`

module.exports = {
  getHTML,
  table
}
