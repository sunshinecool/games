import React from 'react';
import styled from 'styled-components';

const ListContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  padding: 15px;
  border-radius: 10px;
  min-width: 200px;
  margin-top: 20px;
`;

const ListTitle = styled.h3`
  color: white;
  margin: 0 0 10px 0;
  text-align: center;
`;

const PlayerItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const PlayerName = styled.span`
  color: ${props => props.$isCurrentPlayer ? '#4CAF50' : 'white'};
`;

const PlayerChips = styled.span`
  color: #ffd700;
`;

const PlayerList = ({ players }) => {
  return (
    <ListContainer>
      <ListTitle>Players</ListTitle>
      {players.map(player => (
        <PlayerItem key={player.id}>
          <PlayerName $isCurrentPlayer={player.isCurrentPlayer}>
            {player.name} {player.isCurrentPlayer && '(You)'}
          </PlayerName>
          <PlayerChips>{player.chips} chips</PlayerChips>
        </PlayerItem>
      ))}
    </ListContainer>
  );
};

export default PlayerList; 