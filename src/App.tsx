import { useState, useEffect } from "react";
import { createGame, makeMove, getWinner, checkDraw } from "./tic-tac-toe";
import "./styling/grid.css";

function App() {
  let [gameState, setGameState] = useState(createGame());

  const [data, setData] = useState(null); //Set this on the client side...?
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const winner = getWinner(gameState);
  const draw = checkDraw(gameState);

  const handleClick = () => {
    // Need to setGameState to empty
    // This will be a post to an endpoint
    setGameState(createGame());
  };

  useEffect(() => {
    fetch("http://localhost:3000/initialize")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch`);
        } else {
          return response.json();
        }
      })
      .then((json) => {
        setData(json);
        console.log(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="app">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="container">
            {data?.board.map((element, id) => (
              <div
                key={id}
                className={`${element}-symbol`}
                onClick={() => {
                  setGameState(makeMove(gameState, id));
                }}
              >
                {element ?? " "}
              </div>
            ))}
          </div>
        )}
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
