import React, { useState } from 'react';
import styled from 'styled-components';

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  min-width: 300px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: ${props => props.disabled ? '#666' : props.variant === 'primary' ? '#4CAF50' : '#2196F3'};
  color: white;
  font-weight: bold;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.disabled ? '#666' : props.variant === 'primary' ? '#45a049' : '#0b7dda'};
  }
`;

const BetControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BetInput = styled.input`
  width: 80px;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  text-align: center;
`;

const BetButton = styled(Button)`
  background-color: ${props => props.disabled ? '#666' : '#ff9800'};
  
  &:hover {
    background-color: ${props => props.disabled ? '#666' : '#e68a00'};
  }
`;

const GameControls = ({ 
  gamePhase, 
  playerStatus, 
  chips, 
  currentBet, 
  onPlaceBet, 
  onHit, 
  onStand, 
  onDoubleDown,
  isCurrentTurn
}) => {
  const [betAmount, setBetAmount] = useState(10);
  
  const handleBetChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setBetAmount(Math.min(value, chips));
    }
  };
  
  const handlePlaceBet = () => {
    if (betAmount > 0 && betAmount <= chips) {
      onPlaceBet(betAmount);
    }
  };
  
  // Determine if controls should be disabled
  const isPlaying = gamePhase === 'playing' && playerStatus === 'playing';
  const isBetting = gamePhase === 'betting' && playerStatus === 'ready';
  const canDoubleDown = isPlaying && chips >= currentBet && playerStatus === 'playing';
  
  // Debug information
  console.log('Game Controls State:', {
    gamePhase,
    playerStatus,
    isBetting,
    isPlaying,
    canDoubleDown,
    chips,
    currentBet,
    isCurrentTurn
  });
  
  return (
    <ControlsContainer>
      {isBetting && (
        <BetControls>
          <BetInput 
            type="number" 
            value={betAmount} 
            onChange={handleBetChange}
            min="1"
            max={chips}
          />
          <BetButton 
            onClick={handlePlaceBet}
            disabled={betAmount <= 0 || betAmount > chips}
          >
            Place Bet
          </BetButton>
        </BetControls>
      )}
      
      {isPlaying && isCurrentTurn && (
        <ButtonGroup>
          <Button 
            onClick={onHit}
            disabled={!isPlaying}
            variant="primary"
          >
            Hit
          </Button>
          <Button 
            onClick={onStand}
            disabled={!isPlaying}
          >
            Stand
          </Button>
          {canDoubleDown && (
            <Button 
              onClick={onDoubleDown}
              variant="primary"
            >
              Double Down
            </Button>
          )}
        </ButtonGroup>
      )}
      
      <div>
        Chips: {chips} | Current Bet: {currentBet}
      </div>
    </ControlsContainer>
  );
};

export default GameControls; 