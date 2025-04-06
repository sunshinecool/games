import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  width: 100px;
  height: 140px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  margin: 0 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  color: ${props => props.suit === '♥' || props.suit === '♦' ? 'red' : 'black'};
  transform: ${props => props.faceDown ? 'rotateY(180deg)' : 'none'};
  transition: transform 0.3s ease;
`;

const CardValue = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const CardSuit = styled.div`
  font-size: 24px;
  text-align: center;
`;

const CardBack = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #b22222, #8b0000);
  border-radius: 10px;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  transform: ${props => props.faceDown ? 'rotateY(0deg)' : 'rotateY(180deg)'};
  transition: transform 0.3s ease;
`;

const Card = ({ value, suit, faceDown = false }) => {
  // Convert numeric value to card display value
  const displayValue = (val) => {
    switch (val) {
      case 1: return 'A';
      case 11: return 'J';
      case 12: return 'Q';
      case 13: return 'K';
      default: return val;
    }
  };

  return (
    <CardContainer suit={suit} faceDown={faceDown}>
      {faceDown ? (
        <CardBack faceDown={faceDown}>♠</CardBack>
      ) : (
        <>
          <CardValue>{displayValue(value)}</CardValue>
          <CardSuit>{suit}</CardSuit>
        </>
      )}
    </CardContainer>
  );
};

export default Card; 