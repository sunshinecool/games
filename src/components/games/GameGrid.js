import React from 'react';
import GameCard from './GameCard';
import '../../styles/GameGrid.css';

const GameGrid = () => {
  const games = [
    {
      id: 1,
      title: 'Multiplayer Blackjack',
      description: 'Play the classic card game against other players. Try to beat the dealer without going over 21!',
      path: '/games/blackjack'
    },
    {
      id: 2,
      title: 'Flappy Bird',
      description: 'Navigate your bird through pipes by tapping. How far can you go?',
      path: '/games/flappy-bird'
    },
    {
      id: 3,
      title: 'Dangerous Dave',
      description: 'Help Dave collect trophies and jetpacks while avoiding enemies in this classic platformer.',
      path: '/games/dave'
    }
  ];

  return (
    <div className="game-grid">
      {games.map(game => (
        <GameCard
          key={game.id}
          title={game.title}
          description={game.description}
          path={game.path}
        />
      ))}
    </div>
  );
};

export default GameGrid; 