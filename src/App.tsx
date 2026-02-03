import { useState } from "react";
import { createGame, makeMove } from "./tic-tac-toe";

function App() {
  let [gameState, setGameState] = useState(createGame());

  // TODO: display the gameState, and call `makeMove` when a player clicks a button
  // Not passing in the state properly. I need to pass in the return value...?
  // You can map over the gamestate.board.
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
