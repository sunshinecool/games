import React from 'react';
import styled from 'styled-components';
import Card from './Card';

const DealerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  min-width: 200px;
`;

const CardsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const DealerInfo = styled.div`
  color: white;
  font-size: 14px;
  text-align: center;
`;

const DealerHand = ({ cards, score, hideFirstCard }) => {
  return (
    <DealerContainer>
      <CardsContainer>
        {cards.map((card, index) => (
          <Card 
            key={index}
            value={card.value}
            suit={card.suit}
            faceDown={hideFirstCard && index === 0}
          />
        ))}
      </CardsContainer>
      <DealerInfo>
        {!hideFirstCard ? `Score: ${score}` : 'Score: ?'}
      </DealerInfo>
    </DealerContainer>
  );
};

export default DealerHand; 