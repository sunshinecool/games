import React from 'react';
import styled from 'styled-components';
import Card from './Card';

const HandContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: ${props => props.$isCurrentPlayer ? 'rgba(76, 175, 80, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
  border-radius: 10px;
  min-width: 200px;
  border: 2px solid ${props => props.$isCurrentTurn ? '#4CAF50' : 'transparent'};
`;

const PlayerName = styled.h3`
  color: ${props => props.$isCurrentPlayer ? '#4CAF50' : 'white'};
  margin: 0 0 10px 0;
`;

const CardsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  font-size: 14px;
`;

const Status = styled.div`
  color: ${props => {
    switch (props.$status) {
      case 'bust':
        return '#f44336';
      case 'stand':
        return '#ff9800';
      case 'blackjack':
        return '#4CAF50';
      default:
        return 'white';
    }
  }};
  font-weight: bold;
`;

const PlayerHand = ({ player, isCurrentPlayer, isCurrentTurn }) => {
  return (
    <HandContainer $isCurrentPlayer={isCurrentPlayer} $isCurrentTurn={isCurrentTurn}>
      <PlayerName $isCurrentPlayer={isCurrentPlayer}>
        {player.name} {isCurrentPlayer && '(You)'}
      </PlayerName>
      
      <CardsContainer>
        {player.cards.map((card, index) => (
          <Card 
            key={index}
            value={card.value}
            suit={card.suit}
          />
        ))}
      </CardsContainer>
      
      <PlayerInfo>
        <div>Score: {player.score}</div>
        <div>Bet: {player.bet}</div>
        <div>Chips: {player.chips}</div>
        {player.status !== 'waiting' && player.status !== 'ready' && (
          <Status $status={player.status}>
            {player.status.toUpperCase()}
          </Status>
        )}
      </PlayerInfo>
    </HandContainer>
  );
};

export default PlayerHand; 