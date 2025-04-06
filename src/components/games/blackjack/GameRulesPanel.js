import React, { useState } from 'react';
import styled from 'styled-components';

const RulesPanel = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  padding: 20px;
  color: white;
  max-width: 300px;
  margin: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  margin: 0 0 15px 0;
  color: #ffd700;
  font-size: 1.2em;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Section = styled.div`
  margin-bottom: 15px;
`;

const Rules = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const Rule = styled.li`
  margin: 8px 0;
  font-size: 0.9em;
  color: #ddd;
`;

const HelpButton = styled.button`
  background: #ffd700;
  color: black;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8em;
  transition: all 0.2s;

  &:hover {
    background: #ffed4a;
  }
`;

const ChipsDisplay = styled.div`
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid #ffd700;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ChipsTitle = styled.div`
  color: #ffd700;
  font-size: 0.9em;
  margin-bottom: 5px;
`;

const ChipsAmount = styled.div`
  color: #ffd700;
  font-size: 1.2em;
  font-weight: bold;
`;

const GameRulesPanel = ({ gameState, playerState }) => {
  const [showHelp, setShowHelp] = useState(false);

  const getCurrentPhaseDescription = () => {
    switch (gameState?.gamePhase) {
      case 'waiting':
        return 'Waiting for players to join...';
      case 'betting':
        return 'Place your bet to start the game';
      case 'playing':
        return playerState?.isCurrentPlayer 
          ? 'Your turn! Choose to Hit or Stand'
          : 'Waiting for other player...';
      case 'dealer':
        return 'Dealer is playing...';
      case 'gameOver':
        return 'Game Over!';
      default:
        return 'Game in progress...';
    }
  };

  const getCurrentActions = () => {
    if (!gameState || !playerState) return [];
    
    switch (gameState.gamePhase) {
      case 'betting':
        return ['Place your bet'];
      case 'playing':
        if (playerState.isCurrentPlayer) {
          return ['Hit', 'Stand', 'Double Down'];
        }
        return ['Waiting for other player'];
      default:
        return [];
    }
  };

  return (
    <RulesPanel>
      <ChipsDisplay>
        <ChipsTitle>Your Chips</ChipsTitle>
        <ChipsAmount>{playerState?.chips || 0}</ChipsAmount>
      </ChipsDisplay>

      <Title>
        Game Status
        <HelpButton onClick={() => setShowHelp(!showHelp)}>
          {showHelp ? 'Hide Help' : 'Show Help'}
        </HelpButton>
      </Title>
      
      <Section>
        <Rule>Phase: {getCurrentPhaseDescription()}</Rule>
        {playerState?.isCurrentPlayer && (
          <Rule>Available Actions: {getCurrentActions().join(', ')}</Rule>
        )}
      </Section>

      {showHelp && (
        <>
          <Section>
            <Rule>• Get as close to 21 as possible without going over</Rule>
            <Rule>• Face cards are worth 10, Aces are worth 1 or 11</Rule>
            <Rule>• Dealer must hit until 17 or higher</Rule>
          </Section>
          
          <Section>
            <Rule>• Hit: Take another card</Rule>
            <Rule>• Stand: Keep your current hand</Rule>
            <Rule>• Double Down: Double your bet and take one more card</Rule>
          </Section>
          
          <Section>
            <Rule>• Win: Beat dealer's hand without busting</Rule>
            <Rule>• Push: Same score as dealer (bet returned)</Rule>
            <Rule>• Lose: Bust or lower score than dealer</Rule>
          </Section>
        </>
      )}
    </RulesPanel>
  );
};

export default GameRulesPanel; 