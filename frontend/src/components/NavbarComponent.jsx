import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { FaUserCircle } from "react-icons/fa";
import './NavbarComponent.css'; // Aggiunta del file CSS

const NavbarComponent = () => {
  const { handleLogout, loggedIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);

  const logout = async () => {
    try {
      await handleLogout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleLinkClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar expand="lg" expanded={expanded} className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={handleLinkClick} className="mx-auto navbar-center">
          Beach App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id="basic-navbar-nav" className='ms-lg-4'>
          <Nav className="me-auto left-nav">
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
          <Nav className="right-nav">
            {loggedIn ? (
              <>
              <div className="d-flex align-items-center">
                <DropdownButton
                  bg="transparent"
                  align="end" 
                  id="drop"
                  title={<FaUserCircle />}      
                >
                  <Dropdown.Item disabled="true">Hello, {user.nome}!</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item disabled="true">Signed in as:</Dropdown.Item>
                  <Dropdown.Item disabled="true">{user.email}</Dropdown.Item>
                  <Dropdown.Divider />
                  <Button id="logout" size="sm" onClick={logout}>Logout</Button>
                </DropdownButton>
              </div>
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

