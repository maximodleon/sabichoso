const getDayString = (day) => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  return days[day]
}

const getMonthString = (month) => {
  const days = ['Enero', 'Febreo', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septimebre', 'Octubre', 'Noviembre', 'Diciembre']
  return days[month]
}

module.exports = {
  getDayString,
  getMonthString
}
