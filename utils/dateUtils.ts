import { format, add } from 'date-fns'

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

export function formatDateToStr(data: Date): string{
    const novaData = format( add(data, { hours: 4}), 'dd/MM/yyyy');
    return novaData
}

export function formatDateToLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}