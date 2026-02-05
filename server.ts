import express from "express";
import ViteExpress from "vite-express";
import cors from "cors";

const PORT = 3000;

const app = express();

app.use(cors());
app.use(express.json());


export type Player = "X" | "O";

export type Cell = Player | null;

// Board is a 3x3 grid, represented as a 9-element array.
// Indices map to positions:
//  0 | 1 | 2
//  ---------
//  3 | 4 | 5
//  ---------
//  6 | 7 | 8
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];

export type GameState = {
  board: Board;
  currentPlayer: Player;
};

export function createGame(): GameState {
  return {
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: "X",
  };
}

export function getWinner(state: GameState): Player | null {
   
  let winArray = [
    [0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6],[0,3,6],[1,4,7],[2,5,8]
  ]
  //Iterate through the 8 win states
  for(let i = 0; i < winArray.length; i++) {
      
    //If all values are equal and not null, that's a win!
    if(state.board[winArray[i][0]] != null && state.board[winArray[i][0]] == state.board[winArray[i][1]] && state.board[winArray[i][1]] == state.board[winArray[i][2]]) {
      return state.board[winArray[i][0]];
    } 

  }
    return null;
  }

export function checkDraw(state: GameState): Boolean {

    if(!state.board.includes(null)) {
      return true;
    } else {
      return false;
    }
  }

export function makeMove(state: GameState, position: number): GameState {
  // Need to modify the state of the game with the position
  // Check state of board position
  // Probably need an intermediate state
  // Check for winner

  let futureState: GameState = {board: [...state.board], currentPlayer: state.currentPlayer };

  //console.log("Current game state", state);

  if(position < 0 || position > 8) {
    throw new Error('Position must be between 0 and 8')
  }

  if(!Number.isInteger(position)) {
    throw new Error('Position must be an integer')
  }

  if(state.board[position] != null) {
    throw new Error('Position is already occupied')
  }
  
  futureState.board[position] = state.currentPlayer;

  // Check if there is a winner, not if there is a null
  if(getWinner(state) != null) {
    throw new Error('Game is already over');
  }
  
  // Alternate to next player
  if (state.currentPlayer == "X") {
    futureState.currentPlayer = "O";
  } else {
    futureState.currentPlayer = "X";
  }
    
  return futureState;
}

let currentGame: GameState = createGame();


// Move, post endpoint. IN: Cell ID. OUT: Current game state
app.post("/move", (req,res) => {
    let position = req.body.position;
    let newGameState = makeMove(currentGame, position);
    currentGame = newGameState;
    let response = {currentGame, winner: getWinner(currentGame), draw: checkDraw(currentGame) }
    res.json(response);
});

// Reset the game
app.post("/reset", (_req,res) => {
    // update currentGame
    currentGame = createGame();
    res.json(currentGame);
});

app.get("/game", (_req,res) => res.json({currentGame, winner: getWinner(currentGame), draw: checkDraw(currentGame) }));

ViteExpress.listen(app, PORT, ()=> console.log("Vite server is listening"))