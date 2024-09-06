import React, { useState } from 'react';
import { umbrellaApi } from '../services/api'; // API per la gestione degli ombrelloni

// Funzione per creare un nuovo ombrellone attraverso un modale
const UmbrellaModal = ({ data, closeModal }) => {
    const [tipology, setTipology] = useState('');
    const [price, setPrice] = useState('');

    const handleCreateUmbrella = async () => {
        try {
            await umbrellaApi.createUmbrella({
                number: data.umbrellaNumber,
                tipology,
                row: data.row,
                isAccessible: data.isAccessible,
                price,
            });
            closeModal();  // Chiudo il modale dopo la creazione
        } catch (error) {
            console.error('Errore nella creazione dell\'ombrellone:', error);
        }
    };

    return (
        <div className="modal">
            <h2>Crea Ombrellone {data.umbrellaNumber}</h2>
            <label>
                Tipologia:
                <input type="text" value={tipology} onChange={(e) => setTipology(e.target.value)} />
            </label>
            <label>
                Prezzo:
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>
            <label>
                Accessibile:
                <input type="checkbox" checked={data.isAccessible} readOnly />
            </label>
            <button onClick={handleCreateUmbrella}>Crea Ombrellone</button>
            <button onClick={closeModal}>Annulla</button>
        </div>
    );
};

export default UmbrellaModal;
