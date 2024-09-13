import React, { useState, useEffect, useCallback } from 'react';
import { useUmbrellaContext } from '../contexts/UmbrellaContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import SearchAvailability from './SearchAvailability';
import { Alert } from 'react-bootstrap';
import './UmbrellaGrid.css';

// Funzione per creare la griglia in cui si trovano le ombrelloni
const UmbrellaGrid = () => {
  const { umbrellas } = useUmbrellaContext();
  const [grid, setGrid] = useState([]);
  const [selectedUmbrella, setSelectedUmbrella] = useState(null);
  const [filteredUmbrellas, setFilteredUmbrellas] = useState({});
  const [searchPeriod, setSearchPeriod] = useState({ start: null, end: null });
  const navigate = useNavigate();

  const createGrid = useCallback(() => {
    const columnsLeft = 8;
    const columnsRight = 8;
    const rows = 10;

    let newGrid = [];
    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= columnsLeft; col++) {
        const cell = `${String.fromCharCode(64 + row)}${col}`;
        newGrid.push({ cell, side: 'left', row, col });
      }
      newGrid.push({ cell: `passerella${row}`, side: 'center', row });
      for (let col = 1; col <= columnsRight; col++) {
        const cell = `${String.fromCharCode(64 + row)}${col + columnsLeft}`;
        newGrid.push({ cell, side: 'right', row, col: col + columnsLeft });
      }
    }
    return newGrid;
  }, []);

  useEffect(() => {
    setGrid(createGrid());
  }, [createGrid]);

  // Funzione per calcolare lo stato dell'ombrello in base alle prenotazioni
  const calculateCurrentStatus = useCallback((umbrella, start, end) => {
    if (start && end) {
      const hasBookingInPeriod = umbrella.bookings.some(booking => {
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);
        return (start <= bookingEnd && end >= bookingStart);
      });
      return hasBookingInPeriod ? 'occupato' : 'libero';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const hasBookingToday = umbrella.bookings.some(booking => {
        const startDate = new Date(booking.startDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(booking.endDate);
        endDate.setHours(23, 59, 59, 999);
        return today >= startDate && today <= endDate;
      });
      return hasBookingToday ? 'occupato' : 'libero';
    }
  }, []);

  // Funzione per calcolare la posizione delle ombrelloni
  const positionUmbrellas = useCallback(() => {
    const positions = {};
    umbrellas.forEach((umbrella) => {
      if (umbrella.number) {
        positions[umbrella.number] = {
          ...umbrella,
          currentStatus: calculateCurrentStatus(umbrella, searchPeriod.start, searchPeriod.end)
        };
      }
    });
    return positions;
  }, [umbrellas, calculateCurrentStatus, searchPeriod]);

  // Funzione per filtrare le ombrelloni
  const handleSearch = useCallback((startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    setSearchPeriod({ start, end });
    
    const filtered = umbrellas.reduce((acc, umbrella) => {
      if (umbrella.number) {
        acc[umbrella.number] = {
          ...umbrella,
          currentStatus: calculateCurrentStatus(umbrella, start, end)
        };
      }
      return acc;
    }, {});

    setFilteredUmbrellas(filtered);
  }, [umbrellas, calculateCurrentStatus]);

  // Funzione per cancellare la ricerca
  const handleClearSearch = useCallback(() => {
    setSearchPeriod({ start: null, end: null });
    setFilteredUmbrellas({});
  }, []);

  const handleCellClick = useCallback((cell, row, col, side) => {
    if (side !== 'center') {
      const umbrellaPositions = positionUmbrellas();
      if (umbrellaPositions[cell]) {
        setSelectedUmbrella(umbrellaPositions[cell]);
      } else {
        const isAdjacentToWalkway = col === 8 || col === 9;
        const rowChar = String.fromCharCode(64 + row);
        navigate('/create-umbrella', {
          state: {
            number: cell,
            row: rowChar,
            isAccessible: isAdjacentToWalkway
          }
        });
      }
    }
  }, [navigate, positionUmbrellas]);

  // Funzione per chiudere la sidebar
  const handleSidebarClose = useCallback(() => {
    setSelectedUmbrella(null);
  }, []);

  const displayUmbrellas = Object.keys(filteredUmbrellas).length > 0 ? filteredUmbrellas : positionUmbrellas();

  return (
    <div className="container-fluid mt-4">
      <SearchAvailability 
        onSearch={handleSearch} 
        onClear={handleClearSearch}
        searchPeriod={searchPeriod}
      />
      {searchPeriod.start && searchPeriod.end && (
        <Alert variant="info" className="mt-3 mb-3">
          Ricerca attiva per il periodo: {searchPeriod.start.toLocaleDateString()} - {searchPeriod.end.toLocaleDateString()}
        </Alert>
      )}
      <div className="scroll-container">
      <div className="grid-wrapper">
      <div className="grid-container">
        {grid.map(({ cell, side, row, col }) => (
          <div
          key={cell}
          className={`grid-item ${side === 'center' ? 'passerella' : (displayUmbrellas[cell] ? 'registered' : 'not-registered')} ${side}`}
          style={
            side === 'center'
              ? {
                  backgroundImage: `url('/images/passerella.jpeg')` // Immagine per la passerella
                }
              : {
                  backgroundImage: displayUmbrellas[cell]
                    ? displayUmbrellas[cell].currentStatus === 'occupato'
                      ? `url('/images/occupied.png')`
                      : `url('/images/free.png')`
                    : 'none' // Nessuna immagine se l'ombrellone non è registrato
                }
          }
          onClick={() => handleCellClick(cell, row, col, side)}
          >
            {side !== 'center' && (
              <span className="umbrella-number">{cell}</span>
            )}
          </div>
        ))}
      </div>
    </div>
      </div>
      <Sidebar 
        umbrella={selectedUmbrella} 
        onClose={handleSidebarClose} 
      />
    </div>
  );
};

export default UmbrellaGrid;
