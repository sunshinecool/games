import React from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  padding: 30px;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  color: white;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
`;

const Label = styled.label`
  color: white;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #45a049;
  }
`;

const JoinGameForm = ({ 
  playerName, 
  setPlayerName, 
  roomId, 
  setRoomId, 
  handleJoinGame 
}) => {
  return (
    <FormContainer>
      <Title>Join Blackjack Game</Title>
      <Form onSubmit={handleJoinGame}>
        <InputGroup>
          <Label htmlFor="playerName">Your Name</Label>
          <Input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="roomId">Room ID</Label>
          <Input
            id="roomId"
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room ID or leave empty for new room"
          />
        </InputGroup>
        
        <Button type="submit">Join Game</Button>
      </Form>
    </FormContainer>
  );
};

export default JoinGameForm; 