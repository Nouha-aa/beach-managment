import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './NotFound.css';

const NotFound = () => {
  const [squares, setSquares] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      for (let i = 0; i < 5; i++) { // Genera più quadratini ad ogni intervallo
        const newSquare = {
          id: Date.now() + i,
          isExploding: false,
          left: Math.random() * window.innerWidth,
        };
        setSquares(squares => [...squares, newSquare]);
      }
    }, 1000); // Intervallo tra la creazione di nuovi quadratini

    return () => clearInterval(interval);
  }, []);

  // Funzione per esplosione in caso di click sui quadratini :)
  const handleSquareClick = (id) => {
    setSquares(squares => squares.map(square =>
      square.id === id ? { ...square, isExploding: true } : square
    ));
    setTimeout(() => {
      setSquares(squares => squares.filter(square => square.id !== id));
    }, 500); // Durata dell'animazione di esplosione
  };

  return (
    <div className="not-found-container">
      <AnimatePresence>
        {squares.map(square => (
          <motion.div
            key={square.id}
            className="falling-square"
            style={{ left: square.left }}
            initial={{ top: -60, rotate: 0 }}
            animate={
              square.isExploding
                ? { scale: [1, 2, 3], opacity: [1, 0.5, 0] }
                : { top: '100vh', rotate: 360 }
            }
            exit={{ opacity: 0 }}
            transition={{
              duration: square.isExploding ? 0.5 : 10, // Caduta più lenta
              ease: "linear",
            }}
            onClick={() => handleSquareClick(square.id)}
          ></motion.div>
        ))}
      </AnimatePresence>
      <div className="card">
        <h1>404 Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <a href="/" className="home-button">Go Home</a>
      </div>
    </div>
  );
};

export default NotFound;
