import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

const Login = ({ onLogin, showSuccess, showError }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (data.message === 'User logged in') {
      onLogin(data.user.email);
      showSuccess('Login successful');
      navigate('/hello');
    } else {
      showError('Invalid credentials');
    }
  };

  const formStyle = {
    width: '100%',
    maxWidth: '400px',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
  };

  return (
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Form onSubmit={handleSubmit} style={formStyle}>
        <h2>Login</h2>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        </Form.Group>

        <Button variant="primary" type="submit" style={{ width: '100%', marginTop: '1rem' }}>
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
