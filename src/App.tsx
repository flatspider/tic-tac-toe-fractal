import { useState } from "react";
import { createGame, makeMove, getWinner } from "./tic-tac-toe";

function App() {
  let [gameState, setGameState] = useState(createGame());

  const winner = getWinner(gameState);

  // TODO: Check for the winner and display a pop up
  return (
    <>
      <div>Current player: {gameState.currentPlayer}</div>
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto auto",
          fontSize: "2em",
        }}
      >
        {gameState.board.map((element, id) => (
          <div
            key={id}
            onClick={() => {
              setGameState(makeMove(gameState, id));
            }}
          >
            {element ?? "_"}
          </div>
        ))}
      </div>

      {winner ? `${winner} has won the game!!` : "NO WINNER YET"}
    </>
  );
}

function getInitialGame() {
  let initialGameState = createGame();
  initialGameState = makeMove(initialGameState, 3);
  initialGameState = makeMove(initialGameState, 0);
  return initialGameState;
}

export default App;
