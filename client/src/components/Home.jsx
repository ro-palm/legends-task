import React from 'react';
import { Container } from 'react-bootstrap';

const Home = () => {
  const homeStyle = {
    textAlign: 'center',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const headingStyle = {
    fontSize: '2.5rem',
    marginBottom: '1rem'
  };

  const paragraphStyle = {
    fontSize: '1.2rem'
  };

  return (
    <Container style={homeStyle}>
      <h2 style={headingStyle}>Welcome to Tassc</h2>
      <p style={paragraphStyle}>Your security, our priority.</p>
    </Container>
  );
};

export default Home;
