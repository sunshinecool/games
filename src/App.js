import React from 'react';
import { GameProvider } from './context/GameContext';
import BlackjackLayout from './components/games/blackjack/BlackjackLayout';
import './styles/App.css';

function App() {
  return (
    <GameProvider>
      <div className="App">
        <main className="main-content">
          <BlackjackLayout />
        </main>
      </div>
    </GameProvider>
  );
}

export default App; 