import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

// componente Login che gestisce il login sia di users che di admin
function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // funzione che gestisce il login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Tentativo di login con:', { email, password });
      await login(email, password);
      console.log('Login riuscito');
      setSuccess('Login effettuato con successo!');
      setError('');
    } catch (error) {
      console.error('Dettagli errore login:', error.response?.data || error.message);
      setError('Login fallito. Controlla le tue credenziali.');
      setSuccess('');
    }
  };

  return (
    <div className="login-container">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="login-card w-100" style={{ maxWidth: '400px' }}>
          <h2 className="header-text text-center mb-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <div className="surfboard-container">
                <img
                  src="/images/surf1.png"
                  alt="Surfboard"
                  className="surfboard-image"
                />
                <Form.Group controlId="formBasicEmail">
                <label htmlFor="formBasicEmail" className="email-label">Email</label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="email-input"
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="input-wrapper">
              <div className="surfboard-container">
                <img
                  src="/images/surf2.png"
                  alt="Surfboard"
                  className="surfboard-image"
                />
                <Form.Group controlId="formBasicPassword">
                <label htmlFor="formBasicPassword" className="password-label">Passwordd</label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="password-input"
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <Button type="submit" className="login-button w-100">
              Login
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default Login;


