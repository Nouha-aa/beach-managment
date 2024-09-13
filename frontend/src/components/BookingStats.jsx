import React, { useState, useEffect } from 'react';
import { umbrellaApi } from '../services/api';
import { useUmbrellaContext } from '../contexts/UmbrellaContext';
import "./BookingStats.css";

const BookingStats = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalPrice: 0,
    unsolvedPrice: 0,
  });
  const { umbrellas } = useUmbrellaContext();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await umbrellaApi.getBookingStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching booking stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Calcoliamo il totale dei soldi entrati
  const totalCollected = stats.totalPrice - stats.unsolvedPrice;

  return (
    <div className='w-100 vh-100 bg-custom pt-5'>
      <div className='container'>
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Totale Ombrelloni</h5>
                <p className="card-text display-4">{umbrellas.length}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Prenotazioni Totali</h5>
                <p className="card-text display-4">{stats.totalBookings}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Incasso Totale</h5>
                <p className="card-text display-4">€{stats.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Saldo da Riscuotere</h5>
                <p className="card-text display-4">€{stats.unsolvedPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Totale Incassato</h5>
                <p className="card-text display-4">€{totalCollected.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingStats;