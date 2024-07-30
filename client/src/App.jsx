import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate ,useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Toast } from 'primereact/toast';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Hello from './components/Hello';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const toast = useRef(null);

  const handleLogin = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const showSuccess = (message) => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
  };

  const showError = (message) => {
    toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
  };

  const appStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  const mainStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  };

  return (
    <Router>
      <div style={appStyle}>
        <Toast ref={toast} />
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">Tassc</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                {/* <Nav.Link as={Link} to="/">Home</Nav.Link> */}
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
              </Nav>
              {isLoggedIn && (
                <Nav>
                  <NavDropdown title={`Welcome, ${userEmail}`} id="user-dropdown" alignRight>
                    <NavDropdown.Item as={Link} to="/logout">Logout</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              )}
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <main style={mainStyle}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} showSuccess={showSuccess} showError={showError} />} />
            <Route path="/signup" element={<SignUp showSuccess={showSuccess} showError={showError} />} />
            <Route path="/hello" element={isLoggedIn ? <Hello userEmail={userEmail} /> : <Navigate to="/login" />} />
            <Route path="/logout" element={<Logout onLogout={() => { setIsLoggedIn(false); setUserEmail(''); }} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    onLogout();
    navigate('/login');
  }, [onLogout, navigate]);

  return null;
};

export default App;
