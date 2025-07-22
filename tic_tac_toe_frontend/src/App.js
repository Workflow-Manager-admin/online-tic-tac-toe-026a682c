import React, { useState, useEffect } from 'react';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  /**
   * Top-level App component for Tic Tac Toe game.
   * Handles theme toggling and renders navigation + game UI.
   */
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <nav className="ttt-navbar">
        <span className="ttt-brand">Tic Tac Toe</span>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </nav>
      <main className="ttt-main">
        <GameBoard />
      </main>
      <footer className="ttt-footer">
        <span>
          Minimalist Tic Tac Toe | Built with React
        </span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function GameBoard() {
  /**
   * Main game board and controls for Tic Tac Toe.
   * Handles state and logic for two-player gameplay.
   */
  const blankBoard = () => Array(9).fill(null);
  const [board, setBoard] = useState(blankBoard());
  const [isXNext, setIsXNext] = useState(true);
  const [gameActive, setGameActive] = useState(false);
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);

  // PUBLIC_INTERFACE
  function startGame() {
    setBoard(blankBoard());
    setIsXNext(true);
    setGameActive(true);
    setWinner(null);
    setDraw(false);
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    setBoard(blankBoard());
    setIsXNext(true);
    setGameActive(false);
    setWinner(null);
    setDraw(false);
  }

  // PUBLIC_INTERFACE
  function handleCellClick(index) {
    if (!gameActive || winner || board[index]) return;
    const nextBoard = board.slice();
    nextBoard[index] = isXNext ? 'X' : 'O';
    setBoard(nextBoard);
    setIsXNext(!isXNext);
  }

  // PUBLIC_INTERFACE
  function checkWinner(bd) {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],        // rows
      [0,3,6],[1,4,7],[2,5,8],        // cols
      [0,4,8],[2,4,6]                 // diags
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) {
        return bd[a];
      }
    }
    return null;
  }

  useEffect(() => {
    if (!gameActive) return;
    const win = checkWinner(board);
    setWinner(win);
    if (win) {
      setGameActive(false);
    } else if (board.every(cell => cell)) {
      setDraw(true);
      setGameActive(false);
    }
  }, [board, gameActive]);

  // Visual feedback state
  let status;
  if (!gameActive && !winner && !draw) {
    status = <span className="ttt-status-neutral">Press <b>Start</b> to play</span>;
  } else if (winner) {
    status = <span className="ttt-status-win">{winner} wins!</span>;
  } else if (draw) {
    status = <span className="ttt-status-draw">It's a draw!</span>;
  } else {
    status = <span className="ttt-status-turn">Next: {isXNext ? 'X' : 'O'}</span>;
  }

  return (
    <div className="ttt-container">
      <section className="ttt-controls">
        <h2 className="ttt-title">Tic Tac Toe</h2>
        <div className="ttt-status">{status}</div>
        <div className="ttt-controls-buttons">
          {!gameActive
            ? <button className="ttt-button ttt-accent" onClick={startGame}>Start</button>
            : <button className="ttt-button ttt-secondary" onClick={resetGame}>Reset</button>
          }
        </div>
      </section>
      <section className={`ttt-board-wrapper${gameActive || winner || draw ? ' ttt-board-active' : ''}`}>
        <Board
          board={board}
          onCellClick={handleCellClick}
          winLine={winner ? getWinningLine(board) : null}
          disabled={!gameActive && !winner}
        />
      </section>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ board, onCellClick, winLine, disabled }) {
  /**
   * Renders 3x3 grid of cells. Highlights winning cells if winLine provided.
   */
  return (
    <div className="ttt-board">
      {board.map((cell, idx) => (
        <Cell
          key={idx}
          value={cell}
          onClick={() => onCellClick(idx)}
          highlight={winLine && winLine.includes(idx)}
          disabled={disabled || board[idx]}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Cell({ value, onClick, highlight, disabled }) {
  /**
   * Single square/cell in the game board.
   */
  let btnClass = "ttt-cell";
  if (highlight) btnClass += " ttt-cell-highlight";
  if (disabled) btnClass += " ttt-cell-disabled";
  return (
    <button
      className={btnClass}
      onClick={onClick}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      aria-label={value ? `Filled: ${value}` : 'Empty cell'}
    >
      {value}
    </button>
  );
}

// Utility - find the winning line if present
function getWinningLine(bd) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],        // rows
    [0,3,6],[1,4,7],[2,5,8],        // cols
    [0,4,8],[2,4,6]                 // diags
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) {
      return line;
    }
  }
  return null;
}

export default App;
