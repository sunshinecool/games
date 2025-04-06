import React, { useState, useEffect } from 'react';
import { useGame } from '../../../context/GameContext';
import styled from 'styled-components';
import BlackjackLayout from './BlackjackLayout';
import JoinGameForm from './JoinGameForm';
import GameMessage from './GameMessage';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a472a 0%, #0a1f12 100%);
  color: white;
  padding: 20px;
`;

const GameMessageContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
`;

const BlackjackGame = () => {
  const { 
    gameState, 
    playerState, 
    joinGame, 
    leaveGame, 
    placeBet, 
    hit, 
    stand, 
    doubleDown, 
    readyToPlay,
    gameMessage,
    nextGame
  } = useGame();
  
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [betAmount, setBetAmount] = useState(0);
  
  useEffect(() => {
    console.log('Game State Updated:', gameState);
    console.log('Player State Updated:', playerState);
  }, [gameState, playerState]);
  
  // Handle player actions
  const handleAction = (action) => {
    console.log('Player Action:', action);
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
      case 'nextGame':
        console.log('Starting next game');
        nextGame();
        break;
      default:
        console.log('Unknown action:', action);
    }
  };
  
  // Handle joining a game
  const handleJoinGame = (e) => {
    e.preventDefault();
    if (playerName.trim() && roomId.trim()) {
      console.log('Joining game with:', { playerName, roomId });
      joinGame(playerName, roomId);
    }
  };
  
  // If not in a game, show join form
  if (!playerState?.id || !gameState?.id) {
    console.log('Showing join form - No active game');
    return (
      <GameContainer>
        <JoinGameForm 
          playerName={playerName}
          setPlayerName={setPlayerName}
          roomId={roomId}
          setRoomId={setRoomId}
          handleJoinGame={handleJoinGame}
        />
      </GameContainer>
    );
  }
  
  console.log('Rendering game layout');
  return (
    <GameContainer>
      {gameMessage && (
        <GameMessageContainer>
          <GameMessage message={gameMessage} />
        </GameMessageContainer>
      )}
      
      <BlackjackLayout 
        gameState={gameState}
        playerState={playerState}
        onAction={handleAction}
      />
    </GameContainer>
  );
};

export default BlackjackGame; 