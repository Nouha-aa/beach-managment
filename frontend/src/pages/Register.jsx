import React, { useState } from 'react';
import { register } from '../services/api';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Register.css';
import UserList from './UserList';

// Funzione per registrare un nuovo utente con il permesso (password) dell'admin
function Register() {
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // Stato per gestire la registrazione
  const [updateUserList, setUpdateUserList] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Recupero il token dall'archiviazione locale
    
    if (!token) {
      console.error('Token non disponibile');
      return;
    }

    try {
      const response = await register(nome, cognome, email, password, adminPassword, token);
      console.log('Registration successful', response);
      setRegistrationSuccess(true);
      //navigate('/users'); // Reindirizzo alla lista utenti
      setUpdateUserList(prev => !prev); // Toggle to force UserList update
      // Reset form fields
      setNome('');
      setCognome('');
      setEmail('');
      setPassword('');
      setAdminPassword('');

    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <div className="register-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card register-card p-4 mb-4">
              <h2 className="text-center mb-4">Register</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    id='nome'
                    type="text"
                    className="form-control"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    id='cognome'
                    type="text"
                    className="form-control"
                    value={cognome}
                    onChange={(e) => setCognome(e.target.value)}
                    placeholder="Cognome"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    id='email'
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    id='password'
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    id='admin-password'
                    type="password"
                    className="form-control"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Admin Password"
                    required
                  />
                </div>
                <button type="submit" className="register-button w-100">Register</button>
              </form>
            </div>
            <div className="card user-list-card p-4">
              <UserList token={localStorage.getItem('token')} updateTrigger={updateUserList} /> {/* Mostra sempre UserList */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
