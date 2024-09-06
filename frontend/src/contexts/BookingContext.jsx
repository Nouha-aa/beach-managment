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
      fetchBookings(selectedUmbrellaId);
    }
  }, [selectedUmbrellaId]);

  const fetchBookings = async (umbrellaId) => {
    try {
      const response = await umbrellaApi.getUmbrellaBookings(umbrellaId);
      setBookings(prevBookings => ({
        ...prevBookings,
        [umbrellaId]: response.data,
      }));
    } catch (error) {
      console.error('Errore durante il fetch delle prenotazioni:', error);
    }
  };

  const addBooking = async (umbrellaId, newBooking) => {
    try {
      if (checkOverlap(newBooking.startDate, newBooking.endDate, bookings[umbrellaId])) {
        throw new Error('Le date selezionate si sovrappongono con una prenotazione esistente');
      }
      const response = await umbrellaApi.createBooking(umbrellaId, newBooking);
      if (response) {
        await fetchBookings(umbrellaId);
        return response;
      } else {
        console.error('La risposta non contiene dati validi', response);
      }
    } catch (error) {
      console.error('Errore durante l\'aggiunta della prenotazione:', error);
      throw error;
    }
  };

  const updateBooking = async (umbrellaId, bookingId, updatedBooking) => {
    try {
      const existingBookings = bookings[umbrellaId] || [];
      const isOverlapping = checkOverlap(
        updatedBooking.startDate,
        updatedBooking.endDate,
        existingBookings,
        bookingId
      );

      if (isOverlapping) {
        throw new Error('Le date selezionate si sovrappongono con una prenotazione esistente');
      }

      const response = await umbrellaApi.updateBooking(umbrellaId, bookingId, updatedBooking);
      const updatedBookingData = response.data || response;

      if (updatedBookingData) {
        await fetchBookings(umbrellaId);
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

  const deleteBooking = async (umbrellaId, bookingId) => {
    try {
      await umbrellaApi.deleteBooking(umbrellaId, bookingId);
      await fetchBookings(umbrellaId);
    } catch (error) {
      console.error('Errore durante l\'eliminazione della prenotazione:', error);
      throw error;
    }
  };

  const checkOverlap = (startDate, endDate, bookings, bookingIdToExclude = null) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Date non valide');
    }

    if (start > end) {
      throw new Error('La data di inizio deve essere prima della data di fine');
    }

    return bookings.some(booking => {
      if (booking._id === bookingIdToExclude) {
        return false;
      }

      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);

      bookingStart.setHours(0, 0, 0, 0);
      bookingEnd.setHours(0, 0, 0, 0);

      return (
        (start < bookingEnd && end > bookingStart) ||
        (start >= bookingStart && start < bookingEnd) ||
        (end > bookingStart && end <= bookingEnd) ||
        (start <= bookingStart && end >= bookingEnd) ||
        (start <= bookingEnd && end >= bookingStart)
      );
    });
  };
  
  
  return (
    <BookingContext.Provider value={{ bookings, addBooking, checkOverlap, setSelectedUmbrellaId, updateBooking, deleteBooking, fetchBookings }}>
      {children}
    </BookingContext.Provider>
  );
};
