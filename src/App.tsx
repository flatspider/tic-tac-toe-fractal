import { useState } from "react";
import { createGame, makeMove, getWinner, checkDraw } from "./tic-tac-toe";
import "./styling/grid.css";

function App() {
  let [gameState, setGameState] = useState(createGame());

  const winner = getWinner(gameState);
  const draw = checkDraw(gameState);

  const handleClick = () => {
    // Need to setGameState to empty
    setGameState(createGame());
  };

  // TODO: Check for the winner and display a pop up
  return (
    <>
      <div className="app">
        <div className="container">
          {gameState.board.map((element, id) => (
            <div
              key={id}
              onClick={() => {
                setGameState(makeMove(gameState, id));
              }}
            >
              {element ?? " "}
            </div>
          ))}
        </div>
        <div className="update-text">
          <div className="current-player">
            Current player: {gameState.currentPlayer}
          </div>

          <div className="winner-text">
            {winner ? `Player ${winner} won the game!!` : "NO WINNER YET"}
          </div>
          <div>
            {(winner || draw) && <button onClick={handleClick}>RESET</button>}
          </div>
        </div>
      </div>
    </>
  );
}

// No longer necessary
/*
function getInitialGame() {
  let initialGameState = createGame();
  initialGameState = makeMove(initialGameState, 3);
  initialGameState = makeMove(initialGameState, 0);
  return initialGameState;
}
  */

export default App;
