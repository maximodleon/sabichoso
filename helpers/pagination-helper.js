const Markup = require('telegraf/markup')

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
