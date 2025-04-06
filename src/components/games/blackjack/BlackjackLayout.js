import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import GameOverDialog from './GameOverDialog';
import JoinGameForm from './JoinGameForm';
import { useGame } from '../../../context/GameContext';

// Animation for flashing when it's the player's turn
const flashAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 215, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #1a472a 0%, #0a1f12 100%);
  color: white;
  overflow: hidden;
  position: relative;
`;

const DealerSection = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 20vh;
  position: relative;
`;

const DealerTitle = styled.h2`
  color: #ffd700;
  margin-bottom: 8px;
  font-size: 1.4rem;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
`;

const DealerCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
`;

const PlayersSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  padding: 15px;
  min-height: 30vh;
  overflow-x: auto;
  overflow-y: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 60px; /* Space for the help button */
  }
`;

const PlayerCard = styled.div`
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  padding: 12px;
  min-width: 220px;
  max-width: 280px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border: 2px solid ${props => props.isCurrentPlayer ? '#ffd700' : 'transparent'};
  animation: ${props => props.isMyTurn ? flashAnimation : 'none'} 1.5s infinite;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
  }
  
  @media (max-width: 768px) {
    width: 90%;
    max-width: none;
  }
`;

const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const PlayerInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlayerName = styled.div`
  font-weight: bold;
  color: #ffd700;
`;

const PlayerScore = styled.div`
  font-weight: bold;
`;

const PlayerBet = styled.div`
  color: #4CAF50;
  font-weight: bold;
`;

const PlayerChips = styled.div`
  color: #ffd700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &::before {
    content: '💰';
    font-size: 1rem;
  }
`;

const PlayerCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
`;

const Card = styled.div`
  background: white;
  color: ${props => props.color || 'black'};
  width: 35px;
  height: 50px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 0.9rem;
`;

const PlayerActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? '#4CAF50' : '#2196F3'};
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.primary ? '#45a049' : '#0b7dda'};
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const HelpButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #ffd700;
  color: black;
  border: none;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 100;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const HelpPanel = styled.div`
  position: fixed;
  bottom: 80px;
  right: 20px;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 10px;
  padding: 15px;
  max-width: 300px;
  z-index: 99;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  transform: ${props => props.$show ? 'translateY(0)' : 'translateY(100px)'};
  opacity: ${props => props.$show ? 1 : 0};
  pointer-events: ${props => props.$show ? 'auto' : 'none'};
`;

const HelpTitle = styled.h3`
  color: #ffd700;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.1rem;
`;

const HelpRule = styled.p`
  margin: 5px 0;
  font-size: 0.9rem;
  color: #ddd;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  color: #ffd700;
  cursor: pointer;
  font-size: 1rem;
`;

const BlackjackLayout = () => {
  const {
    gameState,
    playerState,
    placeBet,
    readyToPlay,
    hit,
    stand,
    doubleDown,
    nextGame,
    joinGame
  } = useGame();

  const [showHelp, setShowHelp] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  
  useEffect(() => {
    console.log('BlackjackLayout - Current game phase:', gameState?.gamePhase);
    console.log('BlackjackLayout - Current player:', gameState?.currentPlayer);
    console.log('BlackjackLayout - Player state:', playerState);
    
    if (gameState?.gamePhase === 'playing' && 
        gameState?.currentPlayer === playerState?.id) {
      setIsMyTurn(true);
    } else {
      setIsMyTurn(false);
    }
  }, [gameState?.gamePhase, gameState?.currentPlayer, playerState]);
  
  // Get card color based on suit
  const getCardColor = (card) => {
    if (!card) return 'black';
    return (card.suit === '♥' || card.suit === '♦') ? 'red' : 'black';
  };
  
  // Format card display
  const formatCard = (card) => {
    if (!card) return '';
    
    // Convert face cards to symbols
    let displayValue = card.value;
    if (displayValue === 11) displayValue = 'J';
    else if (displayValue === 12) displayValue = 'Q';
    else if (displayValue === 13) displayValue = 'K';
    else if (displayValue === 1) displayValue = 'A';
    
    return `${displayValue}${card.suit}`;
  };
  
  const handleAction = (action) => {
    switch (action) {
      case 'hit':
        hit();
        break;
      case 'stand':
        stand();
        break;
      case 'double':
        doubleDown();
        break;
      case 'bet10':
        console.log('Placing bet: 10');
        placeBet(10);
        break;
      case 'bet20':
        console.log('Placing bet: 20');
        placeBet(20);
        break;
      case 'bet50':
        console.log('Placing bet: 50');
        placeBet(50);
        break;
      case 'ready':
        console.log('Player ready');
        readyToPlay();
        break;
      default:
        console.log('Unknown action:', action);
    }
  };
  
  const handleNextGame = () => {
    console.log('Requesting next game');
    nextGame();
  };

  if (!playerState) {
    return (
      <GameContainer>
        <JoinGameForm onJoin={joinGame} />
      </GameContainer>
    );
  }

  const renderPlayerCard = (player) => {
    const isMyTurn = gameState?.currentPlayer === player.id;
    const isCurrentPlayer = player.id === playerState?.id;

    return (
      <PlayerCard 
        key={player.id} 
        isCurrentPlayer={isCurrentPlayer}
        isMyTurn={isMyTurn}
      >
        <PlayerInfo>
          <PlayerInfoRow>
            <PlayerName>{player.name}</PlayerName>
            <PlayerScore>Score: {player.score || 0}</PlayerScore>
          </PlayerInfoRow>
          <PlayerInfoRow>
            <PlayerChips>{player.chips}</PlayerChips>
            <PlayerBet>Bet: ${player.bet || 0}</PlayerBet>
          </PlayerInfoRow>
        </PlayerInfo>
        
        <PlayerCards>
          {player.cards?.map((card, index) => (
            <Card 
              key={index}
              color={card.suit === '♥' || card.suit === '♦' ? '#d32f2f' : '#000000'}
            >
              {card.value > 10 ? ['J', 'Q', 'K'][card.value - 11] : card.value}{card.suit}
            </Card>
          ))}
        </PlayerCards>
        
        {isCurrentPlayer && (
          <PlayerActions>
            {gameState?.gamePhase === 'waiting' && player.status !== 'ready' && (
              <ActionButton onClick={() => readyToPlay()} primary>
                Ready
              </ActionButton>
            )}
            
            {gameState?.gamePhase === 'betting' && (
              <>
                <ActionButton 
                  onClick={() => placeBet(10)} 
                  disabled={player.chips < 10}
                >
                  Bet $10
                </ActionButton>
                <ActionButton 
                  onClick={() => placeBet(20)} 
                  disabled={player.chips < 20}
                >
                  Bet $20
                </ActionButton>
                <ActionButton 
                  onClick={() => placeBet(50)} 
                  disabled={player.chips < 50}
                >
                  Bet $50
                </ActionButton>
              </>
            )}
            
            {gameState?.gamePhase === 'playing' && isMyTurn && (
              <>
                <ActionButton onClick={() => hit()}>Hit</ActionButton>
                <ActionButton onClick={() => stand()}>Stand</ActionButton>
                <ActionButton 
                  onClick={() => doubleDown()}
                  disabled={player.chips < player.bet}
                >
                  Double Down
                </ActionButton>
              </>
            )}
          </PlayerActions>
        )}
      </PlayerCard>
    );
  };

  return (
    <GameContainer>
      {/* Dealer Section */}
      <DealerSection>
        <DealerTitle>Dealer</DealerTitle>
        <DealerCards>
          {gameState?.dealer?.cards?.map((card, index) => (
            <Card key={index} color={getCardColor(card)}>
              {formatCard(card)}
            </Card>
          ))}
        </DealerCards>
      </DealerSection>
      
      {/* Players Section */}
      <PlayersSection>
        {gameState?.players?.map((player) => renderPlayerCard(player))}
      </PlayersSection>
      
      {/* Help Button and Panel */}
      <HelpButton onClick={() => setShowHelp(!showHelp)}>
        ?
      </HelpButton>
      
      <HelpPanel $show={showHelp}>
        <CloseButton onClick={() => setShowHelp(false)}>×</CloseButton>
        <HelpTitle>How to Play Blackjack</HelpTitle>
        <HelpRule>1. Place your bet before the game starts</HelpRule>
        <HelpRule>2. Try to get as close to 21 as possible without going over</HelpRule>
        <HelpRule>3. Face cards are worth 10, Aces are worth 1 or 11</HelpRule>
        <HelpRule>4. Dealer must hit on 16 and stand on 17</HelpRule>
        <HelpRule>5. Double down to double your bet and receive one more card</HelpRule>
      </HelpPanel>

      {gameState?.gamePhase === 'gameOver' && (
        <GameOverDialog 
          gameState={gameState}
          onNextGame={handleNextGame}
        />
      )}
    </GameContainer>
  );
};

export default BlackjackLayout; 