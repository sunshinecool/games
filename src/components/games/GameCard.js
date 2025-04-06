import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/GameCard.css';

const GameCard = ({ title, description, imageUrl, path }) => {
  const placeholderStyle = {
    backgroundColor: `hsl(${Math.random() * 360}, 70%, 75%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    fontSize: '2rem',
    color: '#fff',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
  };

  return (
    <div className="game-card">
      <div className="game-card-image">
        {imageUrl ? (
          <img src={imageUrl} alt={title} />
        ) : (
          <div style={placeholderStyle}>
            {title.split(' ')[0]}
          </div>
        )}
      </div>
      <div className="game-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <Link to={path} className="play-button">Play Now</Link>
      </div>
    </div>
  );
};

export default GameCard; 