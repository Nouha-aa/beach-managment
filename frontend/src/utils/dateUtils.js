import { format, parse, parseISO } from 'date-fns';

// Funzione per convertire una data da YYYY-MM-DD a DD/MM/YYYY
export const formatDateToEuropean = (date) => {
  return format(parseISO(date), 'dd/MM/yyyy');
};

// Funzione per convertire una data da DD/MM/YYYY a YYYY-MM-DD
export const parseEuropeanDate = (dateString) => {
    const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
    return format(parsedDate, 'yyyy-MM-dd');
  };