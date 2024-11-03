export function stringToDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
}

export function getLastDayOfCurrentMonth(): Date {
    const today = new Date(); // Obtém a data atual
    const year = today.getFullYear(); // Ano atual
    const month = today.getMonth(); // Mês atual (0-11)
  
    // Retorna o último dia do mês atual
    return new Date(year, month + 1, 0)
}