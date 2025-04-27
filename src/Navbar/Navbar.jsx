import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar as BootstrapNavbar, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../Navbar/logo.png'; // Your logo image
import UserImage from '../pages/user.png'; // Default user image

const MyNavbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Safe capitalize function
  const capitalizeWords = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/hackathon');
  };

  return (
    <BootstrapNavbar expand="lg" bg="light" variant="light" className="shadow-sm py-3 px-4">
      <Container fluid>
        <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold text-primary fs-4">
          <img src={Logo} alt="Logo" style={{ height: 60 }} />
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="navbarScroll" />
        <BootstrapNavbar.Collapse id="navbarScroll" className="justify-content-between">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
           
            {user?.isAdmin && (
              <Nav.Link as={Link} to="/dashboard" className="mx-2">Admin Panel</Nav.Link>
            )}
          </Nav>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                <img
                  src={user.image || UserImage}
                  alt="User"
                  className="w-10 h-10 rounded-circle"
                  style={{ width: 40, height: 40, objectFit: 'cover' }}
                />
                <span>{capitalizeWords(user?.username)}</span>
                <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline-primary">Login</Button>
              </Link>
            )}
          </div>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default MyNavbar;
