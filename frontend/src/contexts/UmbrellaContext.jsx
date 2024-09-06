import React, { createContext, useState, useContext } from 'react';
import { umbrellaApi } from '../services/api'; 

// Creo il contesto
const UmbrellaContext = createContext();

// Creo il provider per gli ombrelloni
export const UmbrellaProvider = ({ children }) => {
  const [umbrellas, setUmbrellas] = useState([]);

  // Funzione per calcolare lo stato corrente dell'ombrellone
  const setUmbrellasWithStatus = (umbrellaData) => {
    // Se umbrellaData è un array, lo mappo, altrimenti creo un array con un solo elemento
    const dataToProcess = Array.isArray(umbrellaData) ? umbrellaData : [umbrellaData];
    const updatedUmbrellas = dataToProcess.map(umbrella => ({
      ...umbrella,
      currentStatus: calculateCurrentStatus(umbrella)
    }));
    setUmbrellas(prevUmbrellas => {
      // Se stiamo aggiungendo un singolo ombrellone, lo aggiungiamo all'array esistente
      if (!Array.isArray(umbrellaData)) {
        return [...prevUmbrellas, ...updatedUmbrellas];
      }
      // Altrimenti, sostituiamo completamente l'array
      return updatedUmbrellas;
    });
  };

  // Funzione per aggiungere un ombrellone
  const addUmbrella = (umbrella) => {
    setUmbrellasWithStatus(umbrella);
  };
  
  

  // Funzione per rimuovere un ombrellone
  const deleteUmbrella = async (id) => {
    try {
      await umbrellaApi.deleteUmbrella(id);
      setUmbrellasWithStatus(umbrellas.filter(umbrella => umbrella._id !== id));
    } catch (error) {
      console.error('Error deleting umbrella:', error);
    }
  };

  // Funzione per aggiornare un ombrellone
  const updateUmbrella = async (id, updatedData) => {
    try {
      const response = await umbrellaApi.updateUmbrella(id, updatedData);
      const updatedUmbrella = response.data;
  
      setUmbrellasWithStatus(umbrellas.map(umbrella =>
        umbrella._id === id ? { ...umbrella, ...updatedUmbrella } : umbrella
      ));
    } catch (error) {
      console.error('Error updating umbrella:', error);
    }
  };

  // Funzione per gestire le prenotazioni
  const addBooking = async (umbrellaId, bookingData) => {
    try {
      const updatedUmbrella = await umbrellaApi.createBooking(umbrellaId, bookingData);
      setUmbrellasWithStatus(umbrellas.map(umbrella =>
        umbrella._id === umbrellaId ? updatedUmbrella.data : umbrella
      ));
    } catch (error) {
      console.error('Errore nella creazione della prenotazione:', error);
    }
  };

  // Funzione per calcolare lo stato corrente dell'ombrellone
  const calculateCurrentStatus = (umbrella) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const hasBookingToday = umbrella.bookings.some(booking => {
      const startDate = new Date(booking.startDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(booking.endDate);
      endDate.setHours(23, 59, 59, 999);
      
      return today >= startDate && today <= endDate;
    });
  
    return hasBookingToday ? 'occupato' : 'libero';
  };

  return (
    <UmbrellaContext.Provider value={{ umbrellas, setUmbrellas, addUmbrella, deleteUmbrella, updateUmbrella, addBooking, calculateCurrentStatus }}>
      {children}
    </UmbrellaContext.Provider>
  );
};

// Creo un hook per usare il contesto
export const useUmbrellaContext = () => {
  const context = useContext(UmbrellaContext);
  if (!context) {
    throw new Error('useUmbrellaContext deve essere usato all\'interno di un UmbrellaProvider');
  }
  return context;
};
