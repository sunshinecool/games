import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../context/GameContext';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #1a472a 0%, #0a1f12 100%);
  min-height: auto;
`;

const Form = styled.form`
  background: rgba(0, 0, 0, 0.8);
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  color: #ffd700;
  text-align: center;
  margin-bottom: 15px;
  font-size: 1.6rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 2px solid #2c5338;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #45a049;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 0.9rem;
  margin-top: -15px;
  margin-bottom: 15px;
  text-align: left;
`;

const Label = styled.label`
  color: #ffd700;
  display: block;
  margin-bottom: 8px;
  font-size: 1rem;
`;

const StatusMessage = styled.div`
  color: ${props => props.$error ? '#f44336' : '#4CAF50'};
  background: ${props => props.$error ? 'rgba(244, 67, 54, 0.1)' : 'rgba(76, 175, 80, 0.1)'};
  border: 1px solid ${props => props.$error ? '#f44336' : '#4CAF50'};
  padding: 8px;
  border-radius: 5px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 0.9rem;
`;

const LoadingSpinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid #4CAF50;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin-left: 10px;
  display: inline-block;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const JoinGameForm = () => {
  const { 
    joinGame, 
    error: contextError, 
    isConnecting,
    socket,
    playerState 
  } = useGame();
  
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('blackjack_username') || '';
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (contextError) {
      setFormError(contextError);
      setIsJoining(false);
    }
  }, [contextError]);

  useEffect(() => {
    if (playerState) {
      setIsJoining(false);
    }
  }, [playerState]);

  // Auto-join if username exists
  useEffect(() => {
    const savedUsername = localStorage.getItem('blackjack_username');
    if (savedUsername && socket && !isJoining && !playerState) {
      console.log('Auto-joining with saved username:', savedUsername);
      setIsJoining(true);
      joinGame(savedUsername, 'room1');
    }
  }, [socket, isJoining, playerState, joinGame]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!playerName.trim()) {
      newErrors.playerName = 'Player name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (validateForm()) {
      const trimmedName = playerName.trim();
      localStorage.setItem('blackjack_username', trimmedName);
      setIsJoining(true);
      joinGame(trimmedName, 'room1');
    }
  };

  const getStatusMessage = () => {
    if (isConnecting) return 'Establishing connection...';
    if (!socket) return 'Connecting to game server...';
    if (formError) return formError;
    if (isJoining) return 'Joining game...';
    if (contextError) return contextError;
    return null;
  };

  const isDisabled = isConnecting || !socket || isJoining;
  const statusMessage = getStatusMessage();

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <Title>Join Blackjack Game</Title>
        
        {statusMessage && (
          <StatusMessage $error={!!formError || !!contextError}>
            {statusMessage}
          </StatusMessage>
        )}
        
        <InputGroup>
          <Label htmlFor="playerName">Your Name</Label>
          <Input
            id="playerName"
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            minLength={2}
            maxLength={20}
            required
            disabled={isDisabled}
          />
          {errors.playerName && <ErrorMessage>{errors.playerName}</ErrorMessage>}
        </InputGroup>

        <Button 
          type="submit" 
          disabled={isDisabled || !playerName.trim()}
        >
          <ButtonContent>
            {isConnecting ? 'Connecting...' : 
             !socket ? 'Waiting for connection...' :
             isJoining ? 'Joining...' : 'Join Game'}
            {(isConnecting || isJoining) && <LoadingSpinner />}
          </ButtonContent>
        </Button>
      </Form>
    </FormContainer>
  );
};

export default JoinGameForm; 