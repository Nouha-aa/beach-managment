import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Button, Dropdown } from 'flowbite-react';
import { getMe } from '../services/api.js';
import { useAuth } from '../contexts/AuthContext';

export default function GetMe({ }) {
  const { loggedIn, author, setAuthor, setLoggedIn, handleLogout } = useAuth();
  const navigate = useNavigate();

  // Funzione per verificare se l'utente è loggato
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getMe();
          setAuthor(userData);
          setLoggedIn(true);
        } catch (error) {
          console.error('Errore nel recupero dei dati utente:', error);
          handleLogout();
        }
      } else {
        setLoggedIn(false);
        setAuthor({});
      }
    };

    checkLoginStatus();

    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setAuthor, setLoggedIn]);

  // Funzione per ottenere l'iniziale del nome
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase(); // Restituisce le iniziali in maiuscolo
  };

  return (
    <div className="flex flex-wrap gap-2">
      {loggedIn ? (
        <>
          <Dropdown
            label={<Avatar placeholderInitials={getInitials(author.nome)} rounded bordered color="light" status="online" statusPosition="bottom-right" />}
            arrowIcon={false}
            inline
          >
            <Dropdown.Header>
              <span className="block text-sm">{"Welcome " + author.nome || 'Guest'}</span>
              <span className="block truncate text-sm font-medium">{author.email || 'N/A'}</span>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item>
            <Button gradientDuoTone="greenToBlue" className='w-full' size="xs" onClick={handleLogout}>
                Logout
              </Button>
            </Dropdown.Item>
          </Dropdown>
        </>
      ) : (
        <>
          <Avatar rounded bordered color="light" status="offline" statusPosition="bottom-right" />
          <Button gradientDuoTone="greenToBlue" size="sm" as={Link} to="/login">
            Login
          </Button>
        </>
      )}
    </div>
  );
}