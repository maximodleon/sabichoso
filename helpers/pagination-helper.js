const Markup = require('telegraf/markup')

/**
 * Returns keyboard with paginated results from a given array of objects or strings
 * @function paginateArray
 * @param {Object [] | String []} array array to generate the keyboard from
 * @param {int} offset index from where to slice the array
 * @param {int} count amount of buttons/records to get from the array
 * @param {Object} callbackButtonOtions configuration object with information to get keys from the array and set callback data
 * @return {Markup.inlineKeyboard}  keyboard with keys and next/prev buttons
 */
const paginateArray = (
  array,
  offset = 0,
  count = 4,
  callbackButtonsOptions = {}
) => {
  const valuesArray = array.slice(offset, offset + count)
  const dataButtons = getCallbackButtons(valuesArray, callbackButtonsOptions)
  const pagingButtons = getNextPrev(
    array,
    offset,
    count,
    callbackButtonsOptions.callbackDataPrefix
  )

  const keyboard = [].concat(dataButtons, pagingButtons)
  return Markup.inlineKeyboard(keyboard)
}

/**
 * Returns next and previous buttons for pagination
 * @function getNextPrev
 * @param {Object [] | String []} array array with the keys for the inline keyboard
 * @param {int} offset index from where to slice the array
 * @param {int} count how many elements to get from the array
 * @param {String} callbackDataPrefix prefix for inline keyboard callback data
 */
const getNextPrev = (array, offset, count, callbackDataPrefix) => {
  let prev
  let next
  const buttons = []

  if (offset > 0) {
    prev = Markup.callbackButton(
      '<< Ant.',
      `${callbackDataPrefix}Page:${offset - count}`
    )
    buttons.push(prev)
  }

  if (offset + count < array.length) {
    next = Markup.callbackButton(
      'Sig. >>',
      `${callbackDataPrefix}Page:${offset + count}`
    )
    buttons.push(next)
  }

  return [buttons]
}

/**
 * Generate callback buttons for a command
 *
 * @function getCallbackButtons
 * @param {Object [] | String []} array array of element from where to get information for the buttons
 * @params {Object} callbackButtonsOptions configuration object that tells how to get information from array
 * @return {Object []} buttons for the inline keyboard
 */
const getCallbackButtons = (array, callbackButtonsOptions) => {
  const {
    callbackText,
    callbackData,
    callbackDataPrefix
  } = callbackButtonsOptions

  const buttons = array.map(item => {
    if (typeof item === 'string') {
      return [Markup.callbackButton(item, `${callbackDataPrefix}:${item}`)]
    }

    return [
      Markup.callbackButton(
        item[callbackText],
        `${callbackDataPrefix}:${item[callbackData]}`
      )
    ]
  })

  return buttons
}

module.exports = {
  paginateArray
}
