import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const NavbarComponent = () => {
  const { handleLogout, loggedIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Stato per gestire l'apertura/chiusura della navbar
  const [expanded, setExpanded] = useState(false);

  const logout = async () => {
    try {
      await handleLogout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Funzione per chiudere la navbar
  const handleLinkClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar bg="light" expand="lg" expanded={expanded}>
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={handleLinkClick}>Beach App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={handleLinkClick}>Home</Nav.Link>
            {loggedIn && <>
              <Nav.Link as={Link} to="/create" onClick={handleLinkClick}>Create Post</Nav.Link>
              <Nav.Link as={Link} to="/umbrellas" onClick={handleLinkClick}>Umbrellas</Nav.Link>
              {isAdmin() && <>
                <Nav.Link as={Link} to="/bookings/status" onClick={handleLinkClick}>Booking Status</Nav.Link>
                <Nav.Link as={Link} to="/register" onClick={handleLinkClick}>Register Users</Nav.Link>
              </>}
            </>}
          </Nav>
          <Nav>
            {loggedIn ? (
              <>
                <Navbar.Text className="me-2">
                  Signed in as: {user.email}
                </Navbar.Text>
                <Button variant="outline-primary" onClick={logout}>Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" onClick={handleLinkClick}>Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
