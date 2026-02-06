import { useState, useEffect, useRef } from "react";
import { type GameState } from "./tic-tac-toe";
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
    fetch("/reset", {
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
    //const url: URL = new URL("/move");

    console.log("BEING CLICKED", cellID);

    //So now, we need to send this information to the websocket:
    if (wsRef.current != null && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("NOT NULL");
      wsRef.current.send(JSON.stringify({ position: cellID }));
    }
  };

  // Do I need to go to a new game? Or just get one?
  // How do I go to a game with ID?
  const createsNewGame = () => {
    fetch("/create", {
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
        opensLiveGame(json.gameID);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  const wsRef = useRef<WebSocket | null>(null);

  const opensLiveGame = (targetGameID: string) => {
    /*
    wsRef.current = new WebSocket(
      `ws://localhost:3000/game/${targetGameID}/ws`,
    );
    */

    // Deployed websocket URL:
    wsRef.current = new WebSocket(
      `ws://${window.location.host}/game/${targetGameID}/ws`,
    );

    //const wsCurrent = wsRef.current;

    //Open the websocket
    wsRef.current.onopen = () => {
      console.log("ws opened");
    };
    wsRef.current.onclose = () => console.log("ws closed");

    //wsRef.current.onmessage = (event) => console.log("ws msg", event.data);
    wsRef.current.onerror = (e) => console.log("ws errer", e);

    wsRef.current.onmessage = (rawjson) => {
      let json = JSON.parse(rawjson.data);
      if (json.error) {
        console.error(json.error);
        return;
      }
      console.log(json);
      setCurrentGameID(json.gameID);
      setGameState(json.gameState);
      setWinner(json.winner);
      setDraw(json.draw);
      // Not sure if necessary to set the gameID every move.
      // Added to look for winner or draw
      setLoading(false);
    };

    setCurrentView("game-view");
  };

  useEffect(() => {
    fetch("/games")
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
                    wsRef.current?.close();
                    fetch("/games")
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
