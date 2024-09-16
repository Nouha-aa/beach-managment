import React, { useRef } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Hero.css';

const Hero = () => {
    const carouselRef = useRef(null);

  const handleMouseEnter = () => {
    if (carouselRef.current) {
      carouselRef.current.cycle(); // Avvio l'autoplay
    }
  };

  const handleMouseLeave = () => {
    if (carouselRef.current) {
      carouselRef.current.pause(); // Interrompo l'autoplay
    }
  };
    return (
    <Carousel
        ref={carouselRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        interval={3500} // Cambio immagine ogni 3 secondi
        className="hover-carousel"
      >
        <Carousel.Item style={{ height: '60vh', backgroundImage: 'url(../images/beachhh.jpg)' }}>
          <Carousel.Caption>
            <h1>Soluzioni Digitali per la Tua Spiaggia</h1>
            <h4>Un’unica piattaforma per gestire prenotazioni, eventi e servizi della tua spiaggia. Ottimizza il lavoro e migliora l’esperienza dei tuoi ospiti.</h4>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item style={{ height: '60vh', backgroundImage: 'url(../images/rimini.jpg)' }}>
          <Carousel.Caption>
            <h1>Eventi Esclusivi in Spiaggia</h1>
            <h4>Scopri e partecipa agli eventi più emozionanti sul litorale. Da feste serali a tornei sportivi, vivi l’estate al massimo!</h4>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item style={{ height: '60vh', backgroundImage: 'url(../images/tramonto.jpg)' }}>
          <Carousel.Caption>
            <h1>La Tua Spiaggia, Sempre Organizzata</h1>
            <h4>Gestisci ombrelloni, lettini ed eventi in modo semplice e professionale. Offri ai tuoi clienti un'esperienza personalizzata e senza stress!</h4>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    );
};

export default Hero;
