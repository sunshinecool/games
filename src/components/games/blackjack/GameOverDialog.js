import React from 'react';
import styled, { keyframes } from 'styled-components';

const rocketLaunch = keyframes`
  0% {
    transform: translateY(0) scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateY(-150px) scale(1.5) rotate(15deg);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-300px) scale(0.5) rotate(30deg);
    opacity: 0;
  }
`;

const confettiAnimation = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateY(50vh) rotate(360deg);
    opacity: 0.8;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
`;

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background: linear-gradient(135deg, #2c5338 0%, #1a472a 100%);
  border-radius: 15px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  border: 2px solid #ffd700;
  position: relative;
  overflow: hidden;
`;

const Title = styled.h2`
  color: #ffd700;
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Timer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: ${props => props.seconds <= 5 ? '#ff4444' : '#fff'};
  padding: 5px 10px;
  border-radius: 15px;
  font-weight: bold;
  transition: color 0.3s ease;
`;

const ResultsContainer = styled.div`
  margin-bottom: 25px;
`;

const PlayerResult = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid ${props => props.isWinner ? '#4CAF50' : 'transparent'};
  box-shadow: ${props => props.isWinner ? '0 0 20px rgba(76, 175, 80, 0.5)' : 'none'};
  position: relative;
  transition: all 0.3s ease;
  
  ${props => props.isWinner && `
    background: rgba(0, 0, 0, 0.5);
    transform: scale(1.02);
    &:hover {
      transform: scale(1.03);
    }
  `}
`;

const Confetti = styled.div`
  position: absolute;
  width: ${props => props.size || '15px'};
  height: ${props => props.size || '15px'};
  background: ${props => props.color};
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  top: -20px;
  left: ${props => props.left}%;
  animation: ${confettiAnimation} ${props => props.duration}s linear infinite;
  animation-delay: ${props => props.delay}s;
  z-index: 1001;
`;

const RocketEmoji = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  font-size: 32px;
  transform-origin: center;
  animation: ${rocketLaunch} 1.5s ease-out infinite;
  z-index: 1002;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
`;

const FireworkSparkle = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background: ${props => props.color};
  border-radius: 50%;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  animation: ${confettiAnimation} ${props => props.duration}s linear infinite;
  animation-delay: ${props => props.delay}s;
  z-index: 1001;
`;

const PlayerName = styled.div`
  color: #ffd700;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 5px;
`;

const ResultDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  color: #fff;
`;

const HandInfo = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Card = styled.div`
  background: white;
  color: ${props => (props.suit === '♥' || props.suit === '♦') ? 'red' : 'black'};
  padding: 5px 8px;
  border-radius: 4px;
  font-weight: bold;
`;

const ChipsChange = styled.div`
  color: ${props => props.amount > 0 ? '#4CAF50' : '#f44336'};
  font-weight: bold;
`;

const NextGameButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s;
  
  &:hover {
    background: #45a049;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const confettiColors = ['#ffd700', '#ff4444', '#4CAF50', '#2196F3', '#9C27B0'];

const GameOverDialog = ({ gameState, onNextGame }) => {
  const dealerScore = gameState.dealer.score;
  const dealerBust = dealerScore > 21;

  const getResultExplanation = (player) => {
    if (player.score > 21) return 'Bust!';
    if (dealerBust) return 'Dealer Bust!';
    if (player.score > dealerScore) return 'Higher Score!';
    if (player.score < dealerScore) return 'Lower Score';
    return 'Push';
  };

  const getChipsChange = (player) => {
    if (player.status === 'bust') return -player.bet;
    if (dealerBust || (player.score > dealerScore)) return player.bet;
    if (player.score < dealerScore) return -player.bet;
    return 0;
  };

  const isWinner = (player) => {
    return gameState.winners && gameState.winners.includes(player.name);
  };

  return (
    <DialogOverlay>
      <DialogContent>
        <Timer seconds={gameState.resetTimer}>
          {gameState.resetTimer}s
        </Timer>
        
        <Title>{gameState.message}</Title>
        
        {/* Enhanced celebration effects for winners */}
        {gameState.winners && gameState.winners.length > 0 && (
          <>
            {/* Confetti */}
            {confettiColors.map((color, i) => (
              Array.from({ length: 5 }).map((_, j) => (
                <Confetti
                  key={`confetti-${i}-${j}`}
                  color={color}
                  left={Math.random() * 100}
                  size={`${10 + Math.random() * 10}px`}
                  duration={2 + Math.random() * 3}
                  delay={Math.random() * 2}
                />
              ))
            ))}
            
            {/* Firework sparkles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <FireworkSparkle
                key={`sparkle-${i}`}
                color={confettiColors[i % confettiColors.length]}
                top={Math.random() * 100}
                left={Math.random() * 100}
                duration={1 + Math.random() * 2}
                delay={Math.random()}
              />
            ))}
          </>
        )}
        
        <ResultsContainer>
          {/* Dealer's Hand */}
          <PlayerResult>
            <PlayerName>Dealer's Hand</PlayerName>
            <HandInfo>
              {gameState.dealer.cards.map((card, index) => (
                <Card key={index} suit={card.suit}>
                  {card.value === 1 ? 'A' : 
                   card.value === 11 ? 'J' :
                   card.value === 12 ? 'Q' :
                   card.value === 13 ? 'K' : 
                   card.value}{card.suit}
                </Card>
              ))}
              <span>Score: {dealerScore}</span>
            </HandInfo>
          </PlayerResult>

          {/* Players' Results */}
          {gameState.players.map((player) => {
            const chipsChange = getChipsChange(player);
            const winner = isWinner(player);
            
            return (
              <PlayerResult key={player.id} isWinner={winner}>
                <PlayerName>{player.name}</PlayerName>
                <HandInfo>
                  {player.cards.map((card, index) => (
                    <Card key={index} suit={card.suit}>
                      {card.value === 1 ? 'A' : 
                       card.value === 11 ? 'J' :
                       card.value === 12 ? 'Q' :
                       card.value === 13 ? 'K' : 
                       card.value}{card.suit}
                    </Card>
                  ))}
                  <span>Score: {player.score}</span>
                </HandInfo>
                <ResultDetails>
                  <div>{getResultExplanation(player)}</div>
                  <ChipsChange amount={chipsChange}>
                    {chipsChange >= 0 ? '+' : ''}{chipsChange} chips
                  </ChipsChange>
                </ResultDetails>
                {winner && <RocketEmoji>🚀</RocketEmoji>}
              </PlayerResult>
            );
          })}
        </ResultsContainer>

        <NextGameButton onClick={onNextGame}>
          Play Next Game ({gameState.resetTimer}s)
        </NextGameButton>
      </DialogContent>
    </DialogOverlay>
  );
};

export default GameOverDialog; 