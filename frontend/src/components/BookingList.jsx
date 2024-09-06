import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { formatDateToEuropean } from '../utils/dateUtils';

const BookingList = ({ bookings = [], onBookingEdit }) => {
    console.log('Bookings in BookingList:', bookings);
  
    if (bookings.length === 0) {
      return <p>Nessuna prenotazione trovata.</p>;
    }
  
    return (
      <ListGroup>
        {bookings.map((booking, index) => (
          <ListGroup.Item key={index} onClick={() => onBookingEdit(booking)}>
            {formatDateToEuropean(booking.startDate)} - {formatDateToEuropean(booking.endDate)}: {booking.customer.name}
            <br />
            Stato: {booking.status}, Prezzo totale: €{booking.totalPrice}
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  };
  

export default BookingList;