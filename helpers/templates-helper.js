const fs = require('fs')
const Mustache = require('mustache')
const TEMPLATES_DIR = 'assets/templates/'

const loadTemplate = (templateName) => {
  try {
    return fs.readFileSync(`${TEMPLATES_DIR}${templateName}.template`, 'utf8')
  } catch (error) {
    console.log('error occurred whilte opening template', error)
    return ' '
  }
}

const renderTemplate = (template, params) => {
  try {
    return Mustache.render(template, params)
  } catch (error) {
    console.log('erro rendering template', error)
    return ''
  }
}

const loadAndRenderTemplate = (templateName, params) => {
  const template = loadTemplate(templateName)
  return renderTemplate(template, params)
}

module.exports = {
  loadAndRenderTemplate,
  renderTemplate,
  loadTemplate
}
