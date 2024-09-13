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
        <Carousel.Item style={{ height: '60vh', backgroundImage: 'url(https://via.placeholder.com/1600x900)' }}>
          <Carousel.Caption>
            <h1>bla bla</h1>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item style={{ height: '60vh', backgroundImage: 'url(https://via.placeholder.com/1600x900)' }}>
          <Carousel.Caption>
            <h1>una cosa</h1>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item style={{ height: '60vh', backgroundImage: 'url(https://via.placeholder.com/1600x900)' }}>
          <Carousel.Caption>
            <h1>una cosa</h1>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item style={{ height: '60vh', backgroundImage: 'url(https://via.placeholder.com/1600x900)' }}>
          <Carousel.Caption>
            <h1>una cosa</h1>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item style={{ height: '60vh', backgroundImage: 'url(https://via.placeholder.com/1600x900)' }}>
          <Carousel.Caption>
            <h1>una cosa</h1>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    );
};

export default Hero;
