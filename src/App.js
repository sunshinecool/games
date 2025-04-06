import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import GameGrid from './components/games/GameGrid';
import BlackjackGame from './components/games/blackjack/BlackjackGame';
import { GameProvider } from './context/GameContext';
import { SocketProvider } from './context/SocketContext';
import './styles/App.css';

function App() {
  return (
    <Router>
      <SocketProvider>
        <GameProvider>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<GameGrid />} />
                <Route path="/games/blackjack" element={<BlackjackGame />} />
              </Routes>
            </main>
          </div>
        </GameProvider>
      </SocketProvider>
    </Router>
  );
}

export default App; 