import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquare) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquare];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Let's start the game!";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);

  let status;
  renderStatus();

  const board = [];
  renderBoard();

  function renderStatus() {
    if (winner) {
      status = "Winner is: " + winner;
    } else {
      status = "Next player: " + (xIsNext ? "X" : "O");
    }
  }

  function renderBoard() {
    const rowsNum = 3;
    const squaresNum = 3;

    for (let i = 0; i < rowsNum; i++) {
      const row = [];

      for (let j = 0; j < squaresNum; j++) {
        row.push(renderSquare(i * rowsNum + j));
      }
      board.push(
        <div className="board-row" key={i}>
          {row}
        </div>
      );
    }
  }

  function renderSquare(i) {
    return (
      <Square value={squares[i]} onSquareClick={() => handleClick(i)} key={i} />
    );
  }

  function handleClick(i) {
    if (squares[i] || winner) return;

    const nextSquare = squares.slice();
    if (xIsNext) {
      nextSquare[i] = "X";
    } else {
      nextSquare[i] = "O";
    }
    onPlay(nextSquare);
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
