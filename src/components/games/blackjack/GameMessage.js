import React from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  margin: 10px 0;
  text-align: center;
  font-size: 18px;
  min-width: 300px;
  animation: fadeIn 0.3s ease-in;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const GameMessage = ({ message }) => {
  return (
    <MessageContainer>
      {message}
    </MessageContainer>
  );
};

export default GameMessage; 