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

module.exports = {
  getDayString,
  getMonthString
}
