import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { umbrellaApi } from '../services/api';
import { useUmbrellaContext } from '../contexts/UmbrellaContext';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import './CreateUmbrella.css';

// Funzione per creare un nuovo ombrellone
const CreateUmbrella = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { number, row, isAccessible } = location.state || {};

  const [umbrellaData, setUmbrellaData] = useState({
    number: number || '',
    tipology: '',
    row: row || '',
    isAccessible: isAccessible || false,
    price: ''
  });

  const [error, setError] = useState('');
  const { addUmbrella } = useUmbrellaContext();

  // Funzione per modificare i dati dell'ombrellone
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUmbrellaData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Funzione per creare un nuovo ombrellone
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      number: umbrellaData.number,
      tipology: umbrellaData.tipology,
      row: umbrellaData.row,
      isAccessible: umbrellaData.isAccessible,
      price: parseFloat(umbrellaData.price) || 0
    };

    console.log('Dati inviati:', dataToSend);

    try {
      const response = await umbrellaApi.createUmbrella(dataToSend);
      console.log('Risposta dell\'API:', response);
      if (response.data) {
        // Aggiungo l'ombrellone con l'ID generato dal server
        addUmbrella(response.data);
        console.log('Ombrellone creato:', response.data);
        navigate('/umbrellas');
      } else {
        console.error('La risposta dell\'API non contiene dati:', response);
      }
    } catch (error) {
      setError('Errore nella creazione dell\'ombrellone');
      console.error('Errore nella creazione dell\'ombrellone:', error);
    }
  };

  return (
    <div className="create-umbrella-page">
      <Container className="py-5">
        <h1 className="text-center mb-4">Crea Dati Ombrellone</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
          <Form.Group controlId="formNumber">
            <Form.Label>Numero (es. E3)</Form.Label>
            <Form.Control
              type="text"
              name="number"
              value={umbrellaData.number}
              onChange={handleChange}
              disabled
            />
          </Form.Group>

          <Form.Group controlId="formTipology">
            <Form.Label>Tipologia</Form.Label>
            <Form.Control
              type="text"
              name="tipology"
              value={umbrellaData.tipology}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formRow">
            <Form.Label>Fila (es. E)</Form.Label>
            <Form.Control
              type="text"
              name="row"
              value={umbrellaData.row}
              onChange={handleChange}
              disabled
            />
          </Form.Group>

          <Form.Group controlId="formPrice">
            <Form.Label>Prezzo</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={umbrellaData.price}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formIsAccessible">
            <Form.Check
              type="checkbox"
              name="isAccessible"
              label="Accessibile"
              checked={umbrellaData.isAccessible}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Crea Ombrellone
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default CreateUmbrella;
