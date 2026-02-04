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

// When the server starts, create the game?
// This is turning it into a string...?
let currentGame: GameState = createGame();

// The endpoints will exist here. Think of the inputs. 

// Where is the gamestate living?

// Input on REQUEST: only the position
// Output RESPONSE is going to be the new gamestate.
app.post("/move", (req,res) => res.json(currentGame));

app.get("/initialize", (req,res) => res.json(currentGame));



ViteExpress.listen(app, PORT, ()=> console.log("Vite server is listening"))