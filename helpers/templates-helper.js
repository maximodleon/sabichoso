const fs = require('fs')
const Mustache = require('mustache')
const TEMPLATES_DIR = 'assets/templates/'

/**
 * returns template file/buffer for rendering
 * @function loadTemplate
 * @param {String} templateName name of template file to load
 * @return {String | Buffer} contents of template file
 *
 */
const loadTemplate = templateName => {
  try {
    return fs.readFileSync(`${TEMPLATES_DIR}${templateName}.template`, 'utf8')
  } catch (error) {
    console.log('error occurred whilte opening template', error)
    return ' '
  }
}

/**
 * Use mustache to render template loaded
 * @function renderTemplate
 * @param {String} template name of template to render
 * @param {Object}  params parameters to send to template for rendering
 * @return {Strinng} rendered templated
 */
const renderTemplate = (template, params) => {
  try {
    return Mustache.render(template, params)
  } catch (error) {
    console.log('erro rendering template', error)
    return ''
  }
}

/**
 * Load tempate from templates folder and render using mustache
 * @function loadAndRenderTemplate
 * @param {String} templateName name of template to render
 * @param {Object} param paramters to send to teamplte for rendering
 * @return {String} rendered template
 */
const loadAndRenderTemplate = (templateName, params) => {
  const template = loadTemplate(templateName)
  return renderTemplate(template, params)
}

module.exports = {
  loadAndRenderTemplate,
  renderTemplate,
  loadTemplate
}
