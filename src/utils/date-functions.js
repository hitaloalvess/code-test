export const formattedDate = (dateValue, options) => {
  const opt = options ? options : {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }

  const date = new Date(dateValue);
  const newDate = new Intl.DateTimeFormat('pt-BR', opt).format(date);

  return newDate
}
