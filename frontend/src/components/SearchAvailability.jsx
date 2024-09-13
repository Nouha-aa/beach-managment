import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

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

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    onClear();
  };

  const customButtonStyle = {
    backgroundColor: 'rgba(221, 153, 63, 0.469)',
    borderColor: '#8B4513',
    transition: 'all 0.3s ease',
  };

  const customButtonHoverStyle = {
    backgroundColor: '#c6850c',
    borderColor: '#A0522D',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const customDateInputStyle = {
    backgroundColor: 'rgba(221, 153, 63, 0.469)',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="startDate">
              <Form.Label>Data di inizio</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                style={customDateInputStyle}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="endDate">
              <Form.Label>Data di fine</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                style={customDateInputStyle}
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button 
                variant="primary" 
                type="submit" 
                style={customButtonStyle}
                className="custom-btn"
              >
                <i className="bi bi-search me-2"></i>
                Cerca disponibilità
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleClear}
                style={customButtonStyle}
                className="custom-btn"
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancella ricerca
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
      <style jsx>{`
        .custom-btn:hover {
          background-color: #A0522D !important;
          border-color: #A0522D !important;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </Container>
  );
};

export default SearchAvailability;