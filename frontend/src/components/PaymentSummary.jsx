import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const PaymentSummary = ({ umbrella, bookings }) => {
  const [showModal, setShowModal] = useState(false);

  if (!umbrella) {
    return null; // Ritorna null o un indicatore che i dati non sono disponibili
  }

  const calculateDaysDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - start.getTime();
    return Math.ceil(differenceInTime / (1000 * 3600 * 24)) + 1; // Aggiungo 1 per includere il giorno di inizio
  };

  // Funzione per calcolare il prezzo totale
  const calculateTotalPrice = (booking) => {
    const days = calculateDaysDifference(booking.startDate, booking.endDate);
    const umbrellaPrice = umbrella.price * days;
    const sunbedsPrice = (booking.additionalServices?.sunbeds || 0) * 5 * days;
    return umbrellaPrice + sunbedsPrice;
  };

  // Calcola il saldo totale
  const bookingSummary = bookings.map(booking => {
    const totalDays = calculateDaysDifference(booking.startDate, booking.endDate);
    //const totalPrice = calculateTotalPrice(booking);
    //const balance = totalPrice - booking.deposit;
    const isPaid = booking.balance <= 0;

    return {
      ...booking,
      totalDays,
      //totalPrice,
      //balance,
      isPaid,
      sunbeds: booking.additionalServices?.sunbeds || 0
    };
  });

  const totalBalance = bookingSummary.reduce((acc, booking) => acc + booking.balance, 0);

  return (
    <>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Riepilogo Pagamenti
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Riepilogo Pagamenti - Ombrellone {umbrella.number}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Saldo Totale: €{totalBalance.toFixed(2)}</h5>
          <ul className="list-group">
            {bookingSummary.map((booking, index) => (
              <li key={index} className={`list-group-item ${booking.isPaid ? 'list-group-item-success' : 'list-group-item-danger'}`}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{booking.customer.name}</strong>
                    <br />
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    <br />
                    Giorni: {booking.totalDays}
                    <br />
                    Lettini: {booking.sunbeds}
                  </div>
                  <div>
                    <strong>Totale: €{booking.totalPrice.toFixed(2)}</strong>
                    <br />
                    Deposito: €{booking.deposit.toFixed(2)}
                    <br />
                    Saldo: €{booking.balance.toFixed(2)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PaymentSummary;