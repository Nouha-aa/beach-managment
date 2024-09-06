import React, { useState, useEffect } from 'react';
import { useUmbrellaContext } from '../contexts/UmbrellaContext';

// Funzione per visualizzare i dettagli di un ombrellone
const UmbrellaDetails = ({ umbrella, onClose }) => {
  const { updateUmbrella, deleteUmbrella, calculateCurrentStatus } = useUmbrellaContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    number: umbrella?.number || '',
    price: umbrella?.price || '',
    status: 'disponibile',
    isAccessible: umbrella?.isAccessible || false,
  });

  // Calcolo lo stato attuale dell'ombrellone
  useEffect(() => {
    if (umbrella) {
      const currentStatus = calculateCurrentStatus(umbrella);
      setFormData(prev => ({
        ...prev,
        number: umbrella.number,
        price: umbrella.price,
        status: currentStatus,
        isAccessible: umbrella.isAccessible,
      }));
    }
  }, [umbrella, calculateCurrentStatus]);

  // Funzione per il cambio di stato dell'ombrellone
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  // Funzione per l'aggiornamento
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Funzione per salvataggio o annullamento dell'aggiornamento
  const handleSaveClick = async () => {
    try {
      if (umbrella && umbrella._id) {
        await updateUmbrella(umbrella._id, formData);
        alert('Ombrellone aggiornato con successo!');
        setIsEditing(false);
        onClose();
      } else {
        throw new Error('ID ombrellone non valido');
      }
    } catch (error) {
      console.error('Errore durante l\'aggiornamento:', error);
      alert('Errore durante l\'aggiornamento dell\'ombrellone.');
    }
  };

  // Funzione per annullamento
  const handleCancelClick = () => {
    setIsEditing(false);
    if (umbrella) {
      const currentStatus = calculateCurrentStatus(umbrella);
      setFormData({
        number: umbrella.number,
        price: umbrella.price,
        status: currentStatus,
        isAccessible: umbrella.isAccessible,
      });
    }
  };

  // Funzione per eliminazione
  const handleDeleteClick = () => {
    if (umbrella && umbrella._id) {
      deleteUmbrella(umbrella._id);
      onClose();
    }
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <div className="mb-3">
            <label className="form-label"><strong>Numero:</strong></label>
            <input
              type="text"
              className="form-control"
              name="number"
              value={formData.number}
              onChange={handleInputChange}
              disabled
            />
          </div>
          <div className="mb-3">
            <label className="form-label"><strong>Prezzo:</strong></label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label"><strong>Stato:</strong></label>
            <select
              className="form-control"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="disponibile">Disponibile</option>
              <option value="occupato">Occupato</option>
            </select>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="isAccessible"
              checked={formData.isAccessible}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label"><strong>Accessibile:</strong></label>
          </div>
          <div className="d-flex justify-content-between mt-4">
            <button className="btn btn-success" onClick={handleSaveClick}>Salva</button>
            <button className="btn btn-secondary" onClick={handleCancelClick}>Annulla</button>
          </div>
        </div>
      ) : (
        <div>
          <p><strong>Numero:</strong> {umbrella.number}</p>
          <p><strong>Stato:</strong> {formData.status === 'occupato' ? 'Occupato' : 'Disponibile'}</p>
          <p><strong>Posizione:</strong> {umbrella.row}</p>
          <p><strong>Prezzo:</strong> €{formData.price}</p>
          <p><strong>Accessibile:</strong> {formData.isAccessible ? 'Sì' : 'No'}</p>
          <div className="d-flex justify-content-between mt-4">
            <button className="btn btn-primary" onClick={handleEditClick}>Modifica</button>
            <button className="btn btn-danger" onClick={handleDeleteClick}>Elimina</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UmbrellaDetails;
