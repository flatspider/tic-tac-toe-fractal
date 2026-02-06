import express from "express";
import ViteExpress from "vite-express";
import expressWs from "express-ws";
import WebSocket from 'ws';
//import cors from "cors";

const PORT = process.env.port || 3000;


const app = express();
const wsApplication = expressWs(app);


app.use(express.json());
//var expressWs = require('express-ws')(app);
expressWs(app);

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
/*
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
*/

// Reset the game. 
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

app.get("/game/:ID", (req,res) => {
  // take in the query parameters from the url
  let targetID = req.params.ID;
  console.log(targetID);
  let targetGame = gameCollection.get(targetID);

  if(targetGame != null) {
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

/* Switching to websocket management
app.post("/game/:ID/", (req,res)=>{
  // take in the query parameters from the url
  let targetID = req.params.ID;
  //let webSocket = req.params.ws;

  // Add game ID and ws id to the set

  console.log(targetID);
  let targetGame = gameCollection.get(targetID);

  if(targetGame != null) {
    res.json({gameState: targetGame, winner: getWinner(targetGame), draw: checkDraw(targetGame), gameID: targetID});
  } else {
    res.status(400).json({error: "No game found"});
  }
})
  */

wsApplication.app.ws('/websocket', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
  });
  console.log('socket', req.headers);
});


// I want a set of games...so that new ones are attached to the same websocket
let gameBroadcasts = new Map<string, Set<WebSocket>>();

wsApplication.app.ws('/game/:ID/ws', function(ws, req) {
  let targetID = req.params.ID as string;
  let targetWebSocket = ws;

  if(!gameBroadcasts.has(targetID)){
    gameBroadcasts.set(targetID, new Set());
    gameBroadcasts.get(targetID)?.add(targetWebSocket);
  } else {
        gameBroadcasts.get(targetID)?.add(targetWebSocket)
  }
    
  // This should be the current gamestate
  let targetGame = gameCollection.get(targetID);
  let setOfWebSockets = gameBroadcasts.get(targetID);

  //Broadcast to all websockets contained in the target
  if(targetGame != null && setOfWebSockets) {
    for(const aWebSocket of setOfWebSockets){
    aWebSocket.send(JSON.stringify({gameState: targetGame, winner: getWinner(targetGame), draw: checkDraw(targetGame), gameID: targetID}))
    }
  }
  
  ws.on('message', function(position) {
    //It's coming in as a string. 
    //Use toString
    //Then convert it into a json
    let stringPosition = position.toString();
     let positionJSON = JSON.parse(stringPosition);
     if(targetGame != null && setOfWebSockets) {
      // I need to pull out the position
      let newGameState = makeMove(targetGame, positionJSON.position);
      gameCollection.set(targetID,newGameState);
      let response = {gameState: newGameState, winner: getWinner(newGameState), draw: checkDraw(newGameState), gameID: targetID}
      
      //Broadcast gamestate to all websockets
      for(const aWebSocket of setOfWebSockets) {
        aWebSocket.send(JSON.stringify(response));
      }
      //res.status(200).json(response);
    } else {
      //res.status(404).json({error: "Game not found"});
    }
  });

  console.log('socket', req.headers);
});

ViteExpress.listen(app, PORT, ()=> console.log("Vite server is listening"));

export default app;