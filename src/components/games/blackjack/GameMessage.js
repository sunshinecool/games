import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

const MessageContainer = styled.div`
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  text-align: center;
  font-size: 1.1rem;
  min-width: 250px;
  max-width: 90vw;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 215, 0, 0.3);
  animation: ${props => props.isVisible ? fadeIn : fadeOut} 0.5s ease-in-out;
  z-index: 1000;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 10px 20px;
    min-width: 200px;
  }
`;

const GameMessage = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Auto-hide message after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [message]);
  
  // Reset visibility when message changes
  useEffect(() => {
    setIsVisible(true);
  }, [message]);
  
  if (!message) return null;
  
  return (
    <MessageContainer isVisible={isVisible}>
      {message}
    </MessageContainer>
  );
};

export default GameMessage; 