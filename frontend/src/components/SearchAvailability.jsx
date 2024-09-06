import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

// Funzione per la ricerca delle disponibilità
const SearchAvailability = ({ onSearch, onClear, searchPeriod }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (searchPeriod.start && searchPeriod.end) {
      setStartDate(searchPeriod.start.toISOString().split('T')[0]);
      setEndDate(searchPeriod.end.toISOString().split('T')[0]);
    } else {
      setStartDate('');
      setEndDate('');
    }
  }, [searchPeriod]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(startDate, endDate);
  };

  // Funzione per la cancellazione della ricerca
  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    onClear();
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <Form.Group className="mb-3" controlId="startDate">
        <Form.Label>Data di inizio</Form.Label>
        <Form.Control
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="endDate">
        <Form.Label>Data di fine</Form.Label>
        <Form.Control
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="me-2">
        Cerca disponibilità
      </Button>
      <Button variant="secondary" onClick={handleClear}>
        Cancella ricerca
      </Button>
    </Form>
  );
};

export default SearchAvailability;