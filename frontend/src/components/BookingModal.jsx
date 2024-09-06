import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useBookingContext } from '../contexts/BookingContext';
import { useUmbrellaContext } from '../contexts/UmbrellaContext';
import { formatDateToEuropean, parseEuropeanDate } from '../utils/dateUtils';

const BookingModal = ({ show, onHide, umbrellaId, umbrellaPrice, booking, onBookingUpdated }) => {
  const { updateBooking, bookings, checkOverlap, deleteBooking } = useBookingContext();
  const { umbrellas } = useUmbrellaContext();

// Funzione per resettare i dati del modale
const resetFormData = () => {
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      startDate: '',
      endDate: '',
      price: umbrellaPrice || 0,  // Prezzo predefinito dell'ombrellone
      deposit: 0,
      sunbeds: 0,
      notes: '',
    });
  };


const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    startDate: '',
    endDate: '',
    price: umbrellaPrice || 0,
    deposit: 0,
    sunbeds: 0,
    notes: '',
  });

  // Imposto i valori in base al booking
  useEffect(() => {
    if (booking) {
      setFormData({
        customerName: booking.customer?.name || '',
        customerPhone: booking.customer?.phone || '',
        customerEmail: booking.customer?.email || '',
        startDate: booking.startDate ? formatDateToEuropean(booking.startDate) : '',
        endDate: booking.endDate ? formatDateToEuropean(booking.endDate) : '',
        price: booking.price || umbrellaPrice || 0,
        deposit: booking.deposit || 0,
        sunbeds: booking.additionalServices?.sunbeds || 0,
        notes: booking.notes || '',
      });
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        price: umbrellaPrice || 0,
      }));
    }
  }, [booking, umbrellaPrice, show]);

  console.log('Form Data:', formData);

  // funzione per cambiare i valori
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'startDate' || name === 'endDate') {
      // Mantengo il valore come stringa nel formato DD/MM/YYYY
      setFormData({ ...formData, [name]: value });
    } else {
      // Gestisco 'sunbeds' come numero
      const parsedValue = name === 'sunbeds' ? parseInt(value, 10) : value;
      setFormData({ ...formData, [name]: parsedValue });
    }
  };

  // Funzione per eliminare una prenotazione
  const handleDelete = async () => {
    try {
      if (booking && booking._id) {
        await deleteBooking(umbrellaId, booking._id);
        onHide();  // Chiudo il modale dopo l'eliminazione
        onBookingUpdated();  // Aggiorno la lista delle prenotazioni
      }
    } catch (error) {
      console.error('Errore durante l\'eliminazione della prenotazione:', error);
      alert('Si è verificato un errore durante l\'eliminazione della prenotazione.');
    }
  };


 // Funzione per salvare le modifiche
  const handleSave = async () => {
    const { customerName, customerPhone, customerEmail, startDate, endDate, price, deposit, sunbeds, notes } = formData;

     // Converto le date in formato ISO (YYYY-MM-DD)
    const formattedStartDate = parseEuropeanDate(startDate);
    const formattedEndDate = parseEuropeanDate(endDate);

    console.log(formattedStartDate, formattedEndDate);

    // Ottenere la data corrente senza l'ora
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Imposto l'ora a mezzanotte per il confronto

    // Controllo se la data di inizio è antecedente a oggi
    if (new Date(formattedStartDate) < today) {
        alert('Non è possibile effettuare prenotazioni per date precedenti a oggi.');
        return; // Interrompo l'esecuzione se la data è non valida
    }
  
    const sunbedsPrice = sunbeds * 5;
    console.log("Sunbeds Price:", sunbedsPrice);
    const totalPrice = parseFloat(price) + sunbedsPrice;
    const balance = totalPrice - parseFloat(deposit);
  
    const updatedBooking = {
      customer: { name: customerName, phone: customerPhone, email: customerEmail },
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      price: parseFloat(price),
      totalPrice,
      deposit: parseFloat(deposit),
      balance,
      status: 'riservato',
      additionalServices: { sunbeds },
      additionalServicesPrice: { sunbeds: sunbedsPrice },
      notes,
    };
  
    console.log('Dati prenotazione da inviare:', updatedBooking);
    // console.log('Form Data:', formData);
    // console.log('Calculated Total Price:', totalPrice);
    // console.log('Sending New Booking:', newBooking);
  
    
  try {
    if (booking && booking._id) {
        console.log("Aggiornamento prenotazione...");
        const updatedBookingData = await updateBooking(umbrellaId, booking._id, updatedBooking);
        console.log("Risultato aggiornamento prenotazione:", updatedBookingData);  // Dovrebbe mostrare i dati corretti
        if (updatedBookingData) {
          onBookingUpdated(updatedBookingData);
        }
      }
    onHide();
      } catch (error) {
        console.error('Errore durante la gestione della prenotazione:', error);
        alert('Si è verificato un errore durante la gestione della prenotazione.');
      }
    };
  
    // Funzione per resettare i valori
    const handleClose = () => {
      resetFormData();
      onHide();
    };
  

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{booking ? 'Modifica Prenotazione' : 'Nuova Prenotazione'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Telefono</Form.Label>
            <Form.Control
              type="text"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Data Inizio</Form.Label>
            <Form.Control
              type="text"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              placeholder="DD/MM/YYYY"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Data Fine</Form.Label>
            <Form.Control
              type="text"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              placeholder="DD/MM/YYYY"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Prezzo</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              disabled={true}  //il campo disabilitato in modo che l'utente non lo modifichi
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Deposito</Form.Label>
            <Form.Control
              type="number"
              name="deposit"
              value={formData.deposit}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Lettini</Form.Label>
            <Form.Control
              type="number"
              name="sunbeds"
              value={formData.sunbeds}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Note</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
      {booking && (
          <Button variant="danger" onClick={handleDelete}>Elimina Prenotazione</Button>
        )}
        <Button variant="secondary" onClick={handleClose}>Annulla</Button>
        <Button variant="primary" onClick={handleSave}>Salva Prenotazione</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookingModal;



