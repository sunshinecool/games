import React from 'react';
import styled from 'styled-components';

const RulesPanel = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  color: white;
  width: 300px;
  margin-left: 20px;
  height: fit-content;
`;

const Title = styled.h3`
  color: #4CAF50;
  margin-bottom: 15px;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  color: #FFD700;
  margin-bottom: 10px;
`;

const Rule = styled.p`
  margin: 5px 0;
  font-size: 14px;
  line-height: 1.4;
`;

const Status = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
`;

const GameRulesPanel = ({ gameState, playerState }) => {
  const getGamePhaseDescription = () => {
    switch (gameState.gamePhase) {
      case 'waiting':
        return 'Waiting for players to join and be ready.';
      case 'betting':
        return 'Players should place their bets. Each player starts with 1000 chips.';
      case 'playing':
        return `It's ${gameState.players.find(p => p.id === gameState.currentPlayer)?.name}'s turn to make a decision.`;
      case 'dealerTurn':
        return 'Dealer is playing their turn. Dealer must hit until 17 or higher.';
      case 'gameOver':
        return 'Game is over. Winners have been determined and chips have been distributed.';
      default:
        return 'Game is in progress.';
    }
  };

  const getCurrentAction = () => {
    if (gameState.gamePhase === 'playing' && gameState.currentPlayer === playerState.id) {
      return 'It\'s your turn! You can Hit, Stand, or Double Down.';
    }
    if (gameState.gamePhase === 'betting' && playerState.status !== 'betPlaced') {
      return 'Place your bet to continue.';
    }
    if (gameState.gamePhase === 'waiting' && playerState.status !== 'ready') {
      return 'Click "Ready to Play" when you\'re ready to start.';
    }
    return 'Waiting for other players...';
  };

  return (
    <RulesPanel>
      <Title>Blackjack Rules & Status</Title>
      
      <Section>
        <SectionTitle>Game Status</SectionTitle>
        <Status>
          <Rule>Phase: {gameState.gamePhase}</Rule>
          <Rule>{getGamePhaseDescription()}</Rule>
          <Rule>{getCurrentAction()}</Rule>
        </Status>
      </Section>

      <Section>
        <SectionTitle>Basic Rules</SectionTitle>
        <Rule>• Goal: Get closer to 21 than the dealer without going over</Rule>
        <Rule>• Number cards (2-10) are worth their face value</Rule>
        <Rule>• Face cards (J,Q,K) are worth 10</Rule>
        <Rule>• Aces are worth 1 or 11, whichever is better</Rule>
      </Section>

      <Section>
        <SectionTitle>Actions</SectionTitle>
        <Rule>• Hit: Take another card</Rule>
        <Rule>• Stand: End your turn</Rule>
        <Rule>• Double Down: Double your bet and take one more card</Rule>
      </Section>

      <Section>
        <SectionTitle>Winning</SectionTitle>
        <Rule>• Beat dealer's hand without going over 21</Rule>
        <Rule>• Dealer must hit until 17 or higher</Rule>
        <Rule>• Blackjack (Ace + 10) pays 3:2</Rule>
        <Rule>• Push (tie) returns your bet</Rule>
      </Section>
    </RulesPanel>
  );
};

export default GameRulesPanel; 