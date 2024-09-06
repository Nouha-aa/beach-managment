import React, { createContext, useState, useContext, useEffect } from 'react';
import { umbrellaApi } from '../services/api';

const BookingContext = createContext();

export const useBookingContext = () => useContext(BookingContext);

// booking provider per le prenotazioni
export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState({});
  const [selectedUmbrellaId, setSelectedUmbrellaId] = useState(null);

  // Funzione per recuperare le prenotazioni
  useEffect(() => {
    if (selectedUmbrellaId) {
      const fetchBookings = async () => {
        try {
          const response = await umbrellaApi.getUmbrellaBookings(selectedUmbrellaId);
          console.log('Prenotazioni recuperate:', response.data);

          // Mappa l'ID ombrellone alle prenotazioni
          setBookings(prevBookings => ({
            ...prevBookings,
            [selectedUmbrellaId]: response.data,
          }));
        } catch (error) {
          console.error('Errore durante il fetch delle prenotazioni:', error);
        }
      };
      fetchBookings();
    }
  }, [selectedUmbrellaId]);

  // Funzione per aggiungere una prenotazione
  const addBooking = async (umbrellaId, newBooking) => {
    //console.log('Adding booking:', newBooking);
    //console.log('Current bookings:', bookings[umbrellaId]);
    try {
       // Controllo la sovrapposizione delle date prima di aggiungere una nuova prenotazione
    if (checkOverlap(newBooking.startDate, newBooking.endDate, bookings[umbrellaId])) {
        throw new Error('Le date selezionate si sovrappongono con una prenotazione esistente');
      }
      const response = await umbrellaApi.createBooking(umbrellaId, newBooking);
      if (response) {
        //console.log('Prenotazione aggiunta:', response);
        
        // Aggiungo la nuova prenotazione alla lista esistente per l'ombrellone
        setBookings(prevBookings => ({
          ...prevBookings,
          [umbrellaId]: [...(prevBookings[umbrellaId] || []), newBooking],
        }));
        return response; // Ritorna la risposta per uso futuro
      } else {
        console.error('La risposta non contiene dati validi', response);
      }
    } catch (error) {
      console.error('Errore durante l\'aggiunta della prenotazione:', error);
      throw error; // Propaga l'error
    }
  };

  // Funzione per aggiornare una prenotazione
  const updateBooking = async (umbrellaId, bookingId, updatedBooking) => {
    console.log('updateBooking function called');
    console.log('Updating booking:', updatedBooking);
    try {
      // Controllo la sovrapposizione prima di inviare la richiesta
      const existingBookings = bookings[umbrellaId] || [];
      const isOverlapping = checkOverlap(
        updatedBooking.startDate,
        updatedBooking.endDate,
        existingBookings,
        bookingId // Passo l'ID della prenotazione da escludere
      );
  
      if (isOverlapping) {
        throw new Error('Le date selezionate si sovrappongono con una prenotazione esistente');
      }
  
      const response = await umbrellaApi.updateBooking(umbrellaId, bookingId, updatedBooking);
      console.log('Risposta API aggiornamento prenotazione:', response);  // Log della risposta completa

      const updatedBookingData = response.data || response;

      if (updatedBookingData) {
        console.log('Dati aggiornati della prenotazione:', updatedBookingData);
        // Procedo con l'aggiornamento dello stato
        setBookings(prevBookings => {
          const umbrellaBookings = prevBookings[umbrellaId] || [];
          const updatedUmbrellaBookings = umbrellaBookings.map(booking =>
            booking._id === bookingId ? { ...booking, ...updatedBookingData } : booking
          );

          console.log('Prenotazioni aggiornate:', updatedUmbrellaBookings);
  
          return {
            ...prevBookings,
            [umbrellaId]: updatedUmbrellaBookings
          };
        });
  
        return updatedBookingData;
      } else {
        console.error('La risposta API non contiene dati:', response);
        return undefined;
      }
    } catch (error) {
      console.error('Errore durante l\'aggiornamento della prenotazione:', error);
      throw error;
    }
  };

  // Funzione per controllare la sovrapposizione
  const checkOverlap = (startDate, endDate, bookings, bookingIdToExclude = null) => {
    //console.log('Checking overlap for:', { startDate, endDate });
  
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
  
    //console.log('Normalized dates:', { start, end });
  
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Date non valide');
    }
  
    if (start > end) {
      throw new Error('La data di inizio deve essere prima della data di fine');
    }
  
    console.log('Existing bookings:', bookings);
  
    return bookings.some(booking => {
    //console.log('Checking booking:', booking);
    //console.log('Booking ID to exclude:', bookingIdToExclude);
    //console.log('Current booking ID:', booking._id);
      if (booking._id === bookingIdToExclude) {
        // Escludo la prenotazione che stai modificando dal controllo
        console.log('Excluding booking:', booking._id);
        return false;
      }
  
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
  
      bookingStart.setHours(0, 0, 0, 0);
      bookingEnd.setHours(0, 0, 0, 0);
  
      console.log('Checking against booking:', { bookingStart, bookingEnd });
  
      // sezione di verifica sovrapposizione
      return (
        (start < bookingEnd && end > bookingStart) || // Sovrapposizione generale
        (start >= bookingStart && start < bookingEnd) || // La nuova prenotazione inizia durante una esistente
        (end > bookingStart && end <= bookingEnd) || // La nuova prenotazione finisce durante una esistente
        (start <= bookingStart && end >= bookingEnd) || // La nuova prenotazione copre completamente una esistente
        (start <= bookingEnd && end >= bookingStart) // Sovrapposizione generale o contigua
      );
    });
  };

  // Funzione per eliminare una prenotazione
  const deleteBooking = async (umbrellaId, bookingId) => {
    try {
      await umbrellaApi.deleteBooking(umbrellaId, bookingId);
      setBookings(prevBookings => ({
        ...prevBookings,
        [umbrellaId]: prevBookings[umbrellaId].filter(booking => booking._id !== bookingId),
      }));
    } catch (error) {
      console.error('Errore durante l\'eliminazione della prenotazione:', error);
      throw error;
    }
  };
  
  
  return (
    <BookingContext.Provider value={{ bookings, addBooking, checkOverlap, setSelectedUmbrellaId, updateBooking, deleteBooking }}>
      {children}
    </BookingContext.Provider>
  );
};
