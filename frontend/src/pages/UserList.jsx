import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserList.css';

// Funzione per l'elenco degli utenti registrati dall'admin
function UserList({ token, updateTrigger }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Funzione per il recupero degli utenti
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers(token);
        setUsers(response);
        setLoading(false);
      } catch (error) {
        console.error('Errore nel recupero degli utenti', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, updateTrigger]);

  // Funzione per l'eliminazione di un utente
  const handleDelete = async (id) => {
    try {
      await deleteUser(id, token);
      setUsers(users.filter(user => user._id !== id));
      alert('Utente eliminato con successo');
    } catch (error) {
      console.error('Errore durante l\'eliminazione dell\'utente', error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  // faccio in modo che l'utente admin possa eliminare gli utenti ma non se stesso
  return (
    <div className="user-list-page">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card p-4">
              <h2 className="text-center mb-4">Lista degli utenti</h2>
              <ul className="user-list">
                {users.map(user => (
                  <li key={user._id} className="user-list-item">
                    {user.nome} {user.cognome} - {user.email}
                    {!user.isAdmin && (
                      <button 
                        className="btn delete-button btn-sm"
                        onClick={() => handleDelete(user._id)}
                      >
                        Elimina
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserList;



