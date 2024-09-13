import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';
import UmbrellaDetails from './UmbrellaDetails';
import BookingList from './BookingList';
import BookingModal from './BookingModal';
import { useBookingContext } from '../contexts/BookingContext';
import NewBookingModal from './NewBookingModal';
import { Button, Modal } from 'react-bootstrap';
import PaymentSummary from './PaymentSummary';

// creo la sidebar che gestirà le informazioni del singolo ombrellone
const Sidebar = ({ umbrella, onClose, onUpdateUmbrella }) => {
  const { bookings, addBooking, checkOverlap, setSelectedUmbrellaId, updateBooking, deleteBooking } = useBookingContext();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [showPaymentSummary, setShowPaymentSummary] = useState(false);

  useEffect(() => {
    if (umbrella) {
      setSelectedUmbrellaId(umbrella._id);
    }
  }, [umbrella, setSelectedUmbrellaId, bookings]);

  const handleBookingClick = () => {
    setSelectedBooking(null);
    setShowBookingModal(true);
  };

  const handleBookingEditClick = (booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const handleSave = async (newBooking) => {
    try {
      await addBooking(umbrella._id, newBooking); // Aggiungo la prenotazione tramite il contesto
      setShowBookingModal(false);
    } catch (error) {
      console.error('Errore durante il salvataggio della prenotazione:', error);
      alert('Si è verificato un errore durante il salvataggio della prenotazione.');
    }
  };

  console.log('Selected Umbrella:', umbrella);

  // Accedo alle prenotazioni per l'ombrellone selezionato
  const filteredBookings = bookings[umbrella?._id] || [];

  const handleBookingUpdated = async (updatedBooking) => {
    try {
        if (updatedBooking) {
            console.log("Dati della prenotazione aggiornata:", updatedBooking);
            const result = await updateBooking(umbrella._id, updatedBooking._id, updatedBooking);
            console.log("Risultato aggiornamento prenotazione:", result);
            
            setSelectedUmbrellaId(prevId => prevId);
          } else {
            console.error("Dati della prenotazione aggiornata non validi:", updatedBooking);
          }
    } catch (error) {
      console.error('Errore durante l\'aggiornamento della prenotazione:', error);
      alert('Si è verificato un errore durante l\'aggiornamento della prenotazione.');
    }
  };

  // Funzione per eliminare una prenotazione
  const handleDelete = async (bookingId) => {
    try {
      await deleteBooking(umbrella._id, bookingId);
      setShowBookingModal(false); // Chiudo il modale dopo l'eliminazione
    } catch (error) {
      console.error('Errore durante l\'eliminazione della prenotazione:', error);
      alert('Si è verificato un errore durante l\'eliminazione della prenotazione.');
    }
  };

 

  return (
    <div className={`offcanvas offcanvas-end ${umbrella ? 'show' : ''}`} tabIndex="-1" id="sidebar" aria-labelledby="sidebarLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="sidebarLabel">Dettagli Ombrellone</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <div className="offcanvas-body">
        {umbrella ? (
          <>
            <UmbrellaDetails umbrella={umbrella} onClose={onClose} />
            <BookingList 
              bookings={filteredBookings} // Uso le prenotazioni filtrate per l'ombrellone selezionato
              onBookingEdit={handleBookingEditClick} 
            />
            <NewBookingModal 
            show={showNewBookingModal}
            onHide={() => setShowNewBookingModal(false)}
            umbrellaPrice={umbrella?.price}
            umbrellaId={umbrella?._id}
            onSave={handleSave}
            />
            <Button className='mt-4' variant="primary" onClick={() => setShowNewBookingModal(true)}>
                Effettua prenotazione
            </Button>
          </>
        ) : (
          <p>Nessun ombrellone selezionato.</p>
        )}
      </div>

      <BookingModal
        show={showBookingModal}
        onHide={() => setShowBookingModal(false)}
        umbrellaPrice={umbrella?.price}
        umbrellaId={umbrella?._id}
        booking={selectedBooking}
        onSave={handleSave} // passo handleSave a BookingModal
        bookings={filteredBookings}
        onBookingUpdated={handleBookingUpdated}
        onDelete={handleDelete}
      />
        <PaymentSummary 
          onClick={() => setShowNewBookingModal(true)}
          umbrella={umbrella} 
          bookings={filteredBookings} 
          onClose={() => setShowPaymentSummary(false)} // Passo la funzione per chiudere
        />
    </div>
  );
};

export default Sidebar;

