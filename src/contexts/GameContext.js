import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [playerState, setPlayerState] = useState(null);
  const [gameMessage, setGameMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Connect to the game server
    const newSocket = io('http://localhost:3001');

    newSocket.on('connect', () => {
      console.log('Connected to game server');
      setSocket(newSocket);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from game server');
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      setError(error);
    });

    newSocket.on('gameStateUpdate', ({ gameState }) => {
      console.log('Game state update:', gameState);
      setGameState(gameState);
      setGameMessage(gameState.message || '');
    });

    newSocket.on('playerJoined', ({ player, gameState }) => {
      console.log('Player joined:', player);
      if (player.id === newSocket.id) {
        setPlayerState(player);
      }
      setGameState(gameState);
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  const joinGame = (playerName, roomId) => {
    if (socket) {
      socket.emit('joinGame', { playerName, roomId });
    }
  };

  const readyToPlay = () => {
    if (socket && gameState) {
      socket.emit('playerReady', { roomId: gameState.id });
    }
  };

  const placeBet = (amount) => {
    if (socket && gameState) {
      socket.emit('placeBet', { amount, roomId: gameState.id });
    }
  };

  const hit = () => {
    if (socket && gameState) {
      socket.emit('hit', { roomId: gameState.id });
    }
  };

  const stand = () => {
    if (socket && gameState) {
      socket.emit('stand', { roomId: gameState.id });
    }
  };

  const doubleDown = () => {
    if (socket && gameState && gameState.gamePhase === 'playing') {
      socket.emit('doubleDown', { roomId: gameState.id });
    }
  };

  const nextGame = () => {
    if (socket && gameState && gameState.gamePhase === 'gameOver') {
      console.log('Starting next game');
      socket.emit('nextGame');
    }
  };

  const value = {
    socket,
    gameState,
    playerState,
    gameMessage,
    error,
    joinGame,
    placeBet,
    readyToPlay,
    hit,
    stand,
    doubleDown,
    nextGame
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export default GameContext; 