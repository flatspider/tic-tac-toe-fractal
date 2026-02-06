import { useState, useEffect } from "react";
import { type Cell, type GameState } from "./tic-tac-toe";
import "./styling/grid.css";
import Lobby from "./components/Lobby";
import TicTacToeBoard from "./components/TicTacToeBoard";

function App() {
  // This is the server gameState
  const [gameState, setGameState] = useState<null | GameState>(null); //Set this on the client side...?
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState(null);

  const [winner, setWinner] = useState(false);
  const [draw, setDraw] = useState(false);

  const [currentGameID, setCurrentGameID] = useState<string>("");

  const [currentView, setCurrentView] = useState<string>("lobby");

  const [listOfGames, setListOfGames] = useState<string[]>([]);

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
      body: JSON.stringify({ gameID: currentGameID }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to get game state`);
        } else {
          return response.json();
        }
      })
      .then((json) => {
        setGameState(json.gameState);
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
      body: JSON.stringify({ position: cellID, gameID: currentGameID }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to get game state`);
        } else {
          return response.json();
        }
      })
      .then((json) => {
        setGameState(json.gameState);
        setWinner(json.winner);
        setDraw(json.draw);
        // Not sure if necessary to set the gameID every move.
        setCurrentGameID(json.gameID);
        // Added to look for winner or draw
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  // Do I need to go to a new game? Or just get one?
  // How do I go to a game with ID?
  const createsNewGame = () => {
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
        setCurrentView("game-view");
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  const opensLiveGame = (targetGameID: string) => {
    // When clicked by button in the lobby, this needs to take the game id from the list
    // And get the gameState for that particular board.
    // And then change the view to game-view
    const url: URL = new URL(`http://localhost:3000/game/${targetGameID}`);

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to get game state`);
        } else {
          return response.json();
        }
      })
      .then((json) => {
        setCurrentGameID(json.gameID);
        setGameState(json.gameState);
        setWinner(json.winner);
        setDraw(json.draw);
        setCurrentView("game-view");
        // Not sure if necessary to set the gameID every move.
        // Added to look for winner or draw
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetch("http://localhost:3000/games")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch`);
        } else {
          return response.json();
        }
      })
      .then((json) => {
        setListOfGames(json);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="app">
        {currentView === "lobby" && (
          <Lobby
            listOfGames={listOfGames}
            opensLiveGame={opensLiveGame}
            createsNewGame={createsNewGame}
          />
        )}
        {currentView === "game-view" && (
          <div className="game-play">
            {loading && <div>Loading...</div>}
            {!loading && !gameState && <div>Not there</div>}
            {!loading && gameState && (
              <TicTacToeBoard
                gameState={gameState}
                makeMoveToServer={makeMoveToServer}
              />
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
              <div>
                <button
                  onClick={() => {
                    setCurrentView("lobby");
                    fetch("http://localhost:3000/games")
                      .then((response) => {
                        if (!response.ok) {
                          throw new Error(`Failed to fetch`);
                        } else {
                          return response.json();
                        }
                      })
                      .then((json) => {
                        setListOfGames(json);
                      })
                      .catch((err) => {
                        setError(err);
                        setLoading(false);
                      });
                  }}
                >
                  Return to Lobby
                </button>
              </div>
            </div>
          </div>
        )}
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
