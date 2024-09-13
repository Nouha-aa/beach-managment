import React, { useEffect, useRef, useState } from 'react';
import { useUmbrellaContext } from '../contexts/UmbrellaContext';
import { umbrellaApi } from '../services/api';
import UmbrellaGrid from './UmbrellaGrid';
import './UmbrellaManager.css';

// funzione per gestire la creazione e l'aggiornamento di ombrelloni
const UmbrellaManager = () => {
  const { setUmbrellas, umbrellas } = useUmbrellaContext();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const prevUmbrellasRef = useRef(umbrellas);

  useEffect(() => {
    const fetchUmbrellas = async () => {
      setLoading(true);
      try {
        const response = await umbrellaApi.getAllUmbrellas();
        console.log('Dati ricevuti:', response.data);
        if (JSON.stringify(response.data) !== JSON.stringify(prevUmbrellasRef.current)) {
          setUmbrellas(response.data);
          prevUmbrellasRef.current = response.data;
          console.log('Stato aggiornato.');
        } else {
          console.log('Nessun cambiamento nello stato degli ombrelloni.');
        }
        setLoading(false);
      } catch (error) {
        setErrorMessage('Errore nel caricamento degli ombrelloni.');
        console.error('Errore nel caricamento degli ombrelloni:', error);
        setLoading(false);
      }
    };
    fetchUmbrellas();
  }, [setUmbrellas]);

  if (loading) {
    return <p>Caricamento in corso...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div className="umbrella-manager-container">
      <div className="content">
        <UmbrellaGrid />
      </div>
    </div>
  );
};

export default UmbrellaManager;


