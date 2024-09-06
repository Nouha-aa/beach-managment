import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useBookingContext } from '../contexts/BookingContext';
import { formatDateToEuropean, parseEuropeanDate } from '../utils/dateUtils';

export default function NewBookingModal({ show, onHide, umbrellaId, umbrellaPrice}) {
    const { addBooking, checkOverlap, bookings } = useBookingContext();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'startDate' || name === 'endDate') {
      // Mantiengo il valore come stringa nel formato DD/MM/YYYY
      setFormData({ ...formData, [name]: value });
    } else {
      // Gestisco 'sunbeds' come numero
      const parsedValue = name === 'sunbeds' ? parseInt(value, 10) : value;
      setFormData({ ...formData, [name]: parsedValue });
    }
  };

  // Funzione per salvare la prenotazione
  const handleSave = async () => {
    const { customerName, customerPhone, customerEmail, startDate, endDate, price, deposit, sunbeds, notes } = formData;

     // Converto le date in formato ISO (YYYY-MM-DD)
    const formattedStartDate = parseEuropeanDate(startDate);
    const formattedEndDate = parseEuropeanDate(endDate);

    console.log(formattedStartDate, formattedEndDate);

    // Ottengo la data corrente senza l'ora
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Imposta l'ora a mezzanotte per il confronto

    // Controllo se la data di inizio è antecedente a oggi
    if (new Date(formattedStartDate) < today) {
        alert('Non è possibile effettuare prenotazioni per date precedenti a oggi.');
        return; // Interrompo l'esecuzione se la data è non valida
    }
  
    const sunbedsPrice = sunbeds * 5;
    const totalPrice = parseFloat(price) + sunbedsPrice;
    const balance = totalPrice - parseFloat(deposit);
  
    const newBooking = {
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
  
     console.log('Form Data:', formData);
     console.log('Calculated Total Price:', totalPrice);
     console.log('Sending New Booking:', newBooking);
  
    
  try {
    // Se stiamo creando una nuova prenotazione
    if (checkOverlap(formattedStartDate, formattedEndDate, bookings[umbrellaId])) {
        throw new Error('Le date selezionate si sovrappongono con una prenotazione esistente');
      }
      await addBooking(umbrellaId, newBooking);
      alert('Prenotazione creata con successo!');
      resetFormData();
      onHide();
      } catch (error) {
        console.error('Errore durante la gestione della prenotazione:', error);
        alert('Si è verificato un errore durante la gestione della prenotazione.');
      }
    };

    const handleClose = () => {
        onHide();
      };
  return (
    
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Nuova Prenotazione</Modal.Title>
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
              disabled={true}  // Rendo il campo disabilitato se non vuoi che l'utente lo modifichi
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
        <Button variant="secondary" onClick={handleClose}>Annulla</Button>
        <Button variant="primary" onClick={handleSave}>Salva Prenotazione</Button>
      </Modal.Footer>
    </Modal>

  )
}
