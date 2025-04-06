import React, { useState, useEffect } from 'react';
import { useGame } from '../../../context/GameContext';
import styled from 'styled-components';
import Card from './Card';
import PlayerHand from './PlayerHand';
import DealerHand from './DealerHand';
import GameControls from './GameControls';
import PlayerList from './PlayerList';
import GameMessage from './GameMessage';
import JoinGameForm from './JoinGameForm';
import GameRulesPanel from './GameRulesPanel';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  background-color: #1a1a1a;
  color: white;
`;

const GameContent = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  gap: 20px;
`;

const MainGameArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const GameTable = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const DealerArea = styled.div`
  margin-bottom: 40px;
`;

const PlayersArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
`;

const ControlsArea = styled.div`
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: ${props => props.variant === 'danger' ? '#f44336' : '#4CAF50'};
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 20px;
  
  &:hover {
    background-color: ${props => props.variant === 'danger' ? '#d32f2f' : '#45a049'};
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const GameArea = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  gap: 20px;
`;

const CardArea = styled.div`
  display: flex;
  gap: 10px;
`;

const Score = styled.div`
  margin-top: 10px;
`;

const PlayerArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border: ${props => props.isCurrentPlayer ? '2px solid #4CAF50' : 'none'};
  padding: 10px;
  border-radius: 5px;
`;

const PlayerInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PlayerName = styled.div`
  font-weight: bold;
`;

const PlayerChips = styled.div`
  font-size: 0.8em;
  color: #999;
`;

const PlayerBet = styled.div`
  font-size: 0.8em;
  color: #999;
`;

const PlayerStatus = styled.div`
  font-size: 0.8em;
  color: ${props => props.status === 'ready' ? '#4CAF50' : props.status === 'betPlaced' ? '#999' : '#f44336'};
`;

const BettingControls = styled.div`
  display: flex;
  gap: 10px;
`;

const BetInput = styled.input`
  padding: 8px;
  border: 1px solid #999;
  border-radius: 5px;
`;

const MessageOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Message = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const BlackjackGame = () => {
  const { 
    gameState, 
    playerState, 
    joinGame, 
    placeBet, 
    hit, 
    stand, 
    doubleDown,
    socket 
  } = useGame();
  
  const [showJoinForm, setShowJoinForm] = useState(true);
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [betAmount, setBetAmount] = useState(0);

  const handleJoinGame = (e) => {
    e.preventDefault();
    if (playerName.trim() && roomId.trim()) {
      joinGame(playerName, roomId);
      setShowJoinForm(false);
    }
  };

  const handleReady = () => {
    console.log('Ready button clicked. Socket:', socket ? 'connected' : 'not connected', 'RoomId:', roomId);
    if (socket && roomId) {
      console.log('Emitting playerReady event with roomId:', roomId);
      socket.emit('playerReady', { roomId });
    } else {
      console.error('Cannot emit playerReady: socket or roomId is missing', { socket: !!socket, roomId });
    }
  };

  const handleReset = () => {
    if (socket && roomId) {
      socket.emit('resetGame', { roomId });
    }
  };

  const handleDebug = () => {
    console.log('Game State:', {
      id: gameState.id,
      gamePhase: gameState.gamePhase,
      currentPlayer: gameState.currentPlayer,
      message: gameState.message,
      dealer: {
        cards: gameState.dealer.cards,
        score: gameState.dealer.score
      },
      players: gameState.players.map(p => ({
        id: p.id,
        name: p.name,
        bet: p.bet,
        chips: p.chips,
        status: p.status
      }))
    });
    
    console.log('Player State:', {
      id: playerState.id,
      name: playerState.name,
      status: playerState.status,
      chips: playerState.chips,
      bet: playerState.bet,
      cards: playerState.cards,
      score: playerState.score,
      isCurrentTurn: gameState.currentPlayer === playerState.id
    });
    
    // Force a game state update
    if (socket && roomId) {
      socket.emit('debugGameState', { roomId });
    }
  };

  // Listen for game state updates
  useEffect(() => {
    if (socket) {
      socket.on('gameStateUpdate', ({ gameState }) => {
        // Check if game is resetting
        if (gameState.gamePhase === 'waiting' && gameState.message.includes('reset')) {
          setIsResetting(true);
          setTimeout(() => setIsResetting(false), 5000);
        }
      });
    }
    
    return () => {
      if (socket) {
        socket.off('gameStateUpdate');
      }
    };
  }, [socket]);

  // Update roomId when gameState.id changes
  useEffect(() => {
    if (gameState.id) {
      setRoomId(gameState.id);
    }
  }, [gameState.id]);

  // If player hasn't joined yet, show join form
  if (showJoinForm) {
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

  // Debug information
  console.log('Game State:', {
    id: gameState.id,
    gamePhase: gameState.gamePhase,
    currentPlayer: gameState.currentPlayer,
    message: gameState.message,
    dealer: {
      cards: gameState.dealer.cards,
      score: gameState.dealer.score
    },
    players: gameState.players.map(p => ({
      id: p.id,
      name: p.name,
      bet: p.bet,
      chips: p.chips,
      status: p.status
    }))
  });
  
  console.log('Player State:', {
    id: playerState.id,
    name: playerState.name,
    status: playerState.status,
    chips: playerState.chips,
    bet: playerState.bet,
    cards: playerState.cards,
    score: playerState.score,
    isCurrentTurn: gameState.currentPlayer === playerState.id
  });

  return (
    <GameContainer>
      <GameContent>
        <MainGameArea>
          <GameHeader>
            <h1>Blackjack</h1>
            <GameMessage>{gameState.message}</GameMessage>
          </GameHeader>

          <GameArea>
            <DealerArea>
              <h2>Dealer</h2>
              <CardArea>
                {gameState.dealer.cards.map((card, index) => (
                  <Card key={index} value={card.value} suit={card.suit} />
                ))}
              </CardArea>
              <Score>Score: {gameState.dealer.score}</Score>
            </DealerArea>

            <PlayersArea>
              {gameState.players.map((player) => (
                <PlayerArea key={player.id} isCurrentPlayer={player.id === playerState.id}>
                  <PlayerInfo>
                    <PlayerName>{player.name}</PlayerName>
                    <PlayerChips>Chips: {player.chips}</PlayerChips>
                    {player.bet > 0 && <PlayerBet>Bet: {player.bet}</PlayerBet>}
                  </PlayerInfo>
                  <CardArea>
                    {player.cards.map((card, index) => (
                      <Card key={index} value={card.value} suit={card.suit} />
                    ))}
                  </CardArea>
                  <Score>Score: {player.score}</Score>
                  <PlayerStatus status={player.status}>
                    {player.status.toUpperCase()}
                  </PlayerStatus>
                </PlayerArea>
              ))}
            </PlayersArea>

            <ControlsArea>
              {gameState.gamePhase === 'waiting' && playerState.status !== 'ready' && (
                <Button onClick={handleReady}>Ready to Play</Button>
              )}
              
              {gameState.gamePhase === 'betting' && playerState.status !== 'betPlaced' && (
                <BettingControls>
                  <BetInput
                    type="number"
                    min="1"
                    max={playerState.chips}
                    value={betAmount}
                    onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
                  />
                  <Button onClick={() => placeBet(betAmount)}>Place Bet</Button>
                </BettingControls>
              )}
              
              {gameState.gamePhase === 'playing' && gameState.currentPlayer === playerState.id && (
                <GameControls
                  gamePhase={gameState.gamePhase}
                  playerStatus={playerState.status}
                  chips={playerState.chips}
                  currentBet={playerState.bet}
                  onPlaceBet={placeBet}
                  onHit={hit}
                  onStand={stand}
                  onDoubleDown={doubleDown}
                  isCurrentTurn={gameState.currentPlayer === playerState.id}
                />
              )}
              
              <Button onClick={handleReset}>Reset Game</Button>
              <Button onClick={handleDebug}>Debug Game State</Button>
            </ControlsArea>
          </GameArea>
        </MainGameArea>
        
        <GameRulesPanel gameState={gameState} playerState={playerState} />
      </GameContent>
      
      {isResetting && (
        <MessageOverlay>
          <Message>Game Resetting...</Message>
        </MessageOverlay>
      )}
    </GameContainer>
  );
};

export default BlackjackGame; 