import type { UUID } from "crypto";
import express from "express";
import ViteExpress from "vite-express";
//import cors from "cors";

const PORT = 3000;

export const app = express();

// No cors needed when all requests are coming from the same port
//app.use(cors());

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


// Does the gameID have to live on the game state?
export type GameState = {
  board: Board;
  currentPlayer: Player;
};

export type GameList = Map<string, GameState>;

let gameCollection: GameList = new Map();

//Creating a game with a random ID
export function createGame(): GameState {
  return {
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: "X",
  };
}

// Does this need to have an ID attached to it? I feel like no. Not how it should be used. 
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

// I think there will need to be a new input argument for game ID.
export function makeMove(state: GameState, position: number): GameState {
  
  // Create copy of state to directly modify
  let futureState: GameState = {board: [...state.board], currentPlayer: state.currentPlayer, gameID: state.gameID };

  if(position < 0 || position > 8) {
    throw new Error('Position must be between 0 and 8')
  }

  if(!Number.isInteger(position)) {
    throw new Error('Position must be an integer')
  }

  if(state.board[position] != null) {
    throw new Error('Position is already occupied')
  }
  
  // This writes the X or O to the board array. 
  futureState.board[position] = state.currentPlayer;

  // Check if there is a winner. Maybe check for draw after this?
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

app.post("/create", (_req,res) => {
  // Create an initial blank game
  // Does this need to be added to our list of games? Yes.
  let newGame: GameState = createGame();
  let newGameID = crypto.randomUUID();
  gameCollection.set(newGameID,newGame);

  let response = {
    gameState: newGame,
    gameID: newGameID,
  }
  
  res.status(201).json(response);

});

// Move, post endpoint. IN: Cell ID. OUT: Current game state
// Maybe ID should be in query params
app.post("/move", (req,res) => {
    let position = req.body.position;
    let gameID = req.body.gameID;
    let targetGame = gameCollection.get(gameID);

    if(targetGame != null) {
      let newGameState = makeMove(targetGame, position);
      gameCollection.set(gameID,newGameState);
      let response = {gameState: newGameState, winner: getWinner(newGameState), draw: checkDraw(newGameState), gameID: gameID}
      res.status(200).json(response);
    } else {
      res.status(404).json({error: "Game not found"});
    }
    
});

// Reset the game. TO-DO: Which game? Going to need to input gameID
app.post("/reset", (req,res) => {
    // update currentGame
    let targetGameID = req.body.gameID;
    //let targetGame = gameCollection.get(targetGameID);
    let resetGame = createGame();
    // This could be null. Need to check for valid ID
    if(gameCollection.has(targetGameID)){
      gameCollection.set(targetGameID, resetGame)
      res.status(200).json({gameID: targetGameID, gameState: resetGame});
    } else {
      res.status(404).send();
    }
});

// TO-DO: Get which game? Will need gameID to be input.
// Input: just the UUID. Then look it up in the map
app.get("/game/:ID", (req,res) => {
  // take in the req.body
  let targetID = req.params.ID;
  let targetGame = gameCollection.get(targetID);

  if(targetGame != null) {
    // Do I not need to send back the ID?
    res.json({gameState: targetGame, winner: getWinner(targetGame), draw: checkDraw(targetGame), gameID: targetID});
  } else {
    res.status(400).json({error: "No game found"});
  }

}) 

app.get("/games",(_req,res)=>{
  let games = gameCollection.keys();
  let gamesArray = Array.from(games);
  // Return the list of keys for the map
  res.json(gamesArray);
});

ViteExpress.listen(app, PORT, ()=> console.log("Vite server is listening"));

export default app;