/**
 * Get name of day of week
 * @function getDayString
 * @param {int} day day of week from Date.prototype.getDay()
 * @return {String} Name of day in spanish
 */
const getDayString = day => {
  const days = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'
  ]
  return days[day]
}

/**
 * Get name of month in spanish
 * @function getMonthString
 * @param {int} month month from Date.prototype.getMonth()
 * @return {String} Name of month in spanish
 */
const getMonthString = month => {
  const days = [
    'Enero',
    'Febreo',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septimebre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ]
  return days[month]
}

/**
 * Convert hour from 24-hour format to 12-hour format
 * @function
 * @params {Number.int} hour of the day in 24 hour format
 * @return {string} formatted hour
 */
const getHour = hour => {
  if (hour > 12) {
    const newHour = hour - 12
    if (newHour < 10) {
      return `0${newHour}`
    }
    return newHour
  } else {
    if (hour < 12) {
      return `0${hour}`
    }
    return hour
  }
}

/**
 * Prepend 0 to minutes param
 * @function
 * @param {Number.int} minutes
 * @return {string} formatted minutes
 */
const getMinutes = minutes => {
  if (minutes < 10) {
    return `0${minutes}`
  }

  return minutes
}

module.exports = {
  getDayString,
  getMonthString,
  getHour,
  getMinutes
}
