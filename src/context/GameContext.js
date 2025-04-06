import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const { socket, connected } = useSocket();
  
  // Game state
  const [gameState, setGameState] = useState({
    id: null,
    players: [],
    currentPlayer: null,
    dealer: { cards: [], score: 0 },
    deck: [],
    gamePhase: 'waiting', // waiting, betting, playing, dealerTurn, gameOver
    pot: 0,
    currentBet: 0,
    message: 'Waiting for players...'
  });
  
  const [playerState, setPlayerState] = useState({
    id: null,
    name: '',
    chips: 1000,
    cards: [],
    score: 0,
    bet: 0,
    status: 'waiting', // waiting, ready, playing, bust, stand
    isDealer: false
  });

  // Join a game room
  const joinGame = (playerName, roomId) => {
    if (socket && connected) {
      socket.emit('joinGame', { playerName, roomId });
    }
  };

  // Place a bet
  const placeBet = (amount) => {
    if (socket && connected && gameState.gamePhase === 'betting') {
      console.log(`Placing bet of ${amount} in room ${gameState.id}`);
      socket.emit('placeBet', { amount, roomId: gameState.id });
    }
  };

  // Hit (take another card)
  const hit = () => {
    if (socket && connected && gameState.gamePhase === 'playing') {
      socket.emit('hit', { roomId: gameState.id });
    }
  };

  // Stand (end turn)
  const stand = () => {
    if (socket && connected && gameState.gamePhase === 'playing') {
      socket.emit('stand', { roomId: gameState.id });
    }
  };

  // Double down
  const doubleDown = () => {
    if (socket && connected && gameState.gamePhase === 'playing') {
      socket.emit('doubleDown', { roomId: gameState.id });
    }
  };

  // Listen for game updates
  useEffect(() => {
    if (socket) {
      // Player joined
      socket.on('playerJoined', (data) => {
        console.log('Player joined:', data);
        setGameState(prev => ({
          ...prev,
          id: data.gameState.id,
          ...data.gameState,
          players: [...prev.players, data.player],
          message: `${data.player.name} joined the game`
        }));
        
        // Update player state if this is the current player
        if (data.player.id === socket.id) {
          setPlayerState(data.player);
        }
      });

      // Player left
      socket.on('playerLeft', (data) => {
        console.log('Player left:', data);
        setGameState(prev => ({
          ...prev,
          ...data.gameState,
          players: prev.players.filter(p => p.id !== data.playerId),
          message: `${data.playerName} left the game`
        }));
      });

      // Game state update
      socket.on('gameStateUpdate', (data) => {
        console.log('Game state update:', data.gameState);
        setGameState(data.gameState);
        
        // Update player state if this player exists in the game
        const currentPlayer = data.gameState.players.find(p => p.id === socket.id);
        if (currentPlayer) {
          setPlayerState(currentPlayer);
        }
      });

      // Player state update
      socket.on('playerStateUpdate', (data) => {
        console.log('Player state update:', data.playerState);
        setPlayerState(data.playerState);
      });

      // Game message
      socket.on('gameMessage', (data) => {
        console.log('Game message:', data.message);
        setGameState(prev => ({
          ...prev,
          message: data.message
        }));
      });
    }

    return () => {
      if (socket) {
        socket.off('playerJoined');
        socket.off('playerLeft');
        socket.off('gameStateUpdate');
        socket.off('playerStateUpdate');
        socket.off('gameMessage');
      }
    };
  }, [socket]);

  return (
    <GameContext.Provider value={{
      gameState,
      playerState,
      socket,
      joinGame,
      placeBet,
      hit,
      stand,
      doubleDown
    }}>
      {children}
    </GameContext.Provider>
  );
}; 