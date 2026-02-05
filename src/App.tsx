import { useState, useEffect } from "react";
import { type Cell, type GameState } from "./tic-tac-toe";
import "./styling/grid.css";

function App() {
  //let [gameState, setGameState] = useState(createGame());

  // This is the server gameState
  const [gameState, setGameState] = useState<null | GameState>(null); //Set this on the client side...?
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState(null);

  const [winner, setWinner] = useState(false);
  const [draw, setDraw] = useState(false);

  const [currentGameID, setCurrentGameID] = useState<string>("");

  //const winner = false; //getWinner(gameState);
  //const draw = false; //checkDraw(gameState);

  const resetGameClick = () => {
    const url: URL = new URL("http://localhost:3000/reset");
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: "",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to get game state`);
        } else {
          return response.json();
        }
      })
      .then((json) => {
        setGameState(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  const makeMoveToServer = (cellID: number) => {
    // Hit move endpoint with position

    // Let's construct the post request
    const url: URL = new URL("http://localhost:3000/move");

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ position: cellID }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to get game state`);
        } else {
          return response.json();
        }
      })
      .then((json) => {
        setGameState(json.currentGame);
        setWinner(json.winner);
        setDraw(json.draw);
        // Added to look for winner or draw
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetch("http://localhost:3000/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: "",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch`);
        } else {
          return response.json();
        }
      })
      .then((json) => {
        console.log(json);
        setGameState(json.gameState);
        setCurrentGameID(json.gameID);
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
            {gameState?.board.map((element: string | Cell, id: number) => (
              <div
                key={id}
                className={`${element}-symbol`}
                onClick={() => {
                  makeMoveToServer(id);
                }}
              >
                {element ?? " "}
              </div>
            ))}
          </div>
        )}
        <div className="update-text">
          <div className="current-player">
            Current player:{" "}
            {loading ? <div>Loading...</div> : gameState?.currentPlayer}
          </div>

          <div className="winner-text">
            {winner ? `Player ${winner} won the game!!` : "NO WINNER YET"}
          </div>
          <div>
            {(winner || draw) && (
              <button onClick={resetGameClick}>RESET</button>
            )}
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
