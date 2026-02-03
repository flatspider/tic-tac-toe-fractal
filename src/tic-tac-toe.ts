import type { expectTypeOf } from "vitest";

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

//Looks good as initial function
export function createGame(): GameState {
  return {
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: "X",
  };
}


export function makeMove(state: GameState, position: number): GameState {
  // Need to modify the state of the game with the position
  // Check state of board position
  // Probably need an intermediate state
  // Check for winner

  let futureState: GameState = {board: [...state.board], currentPlayer: state.currentPlayer };


  
  // Check position validity
  if(position >= 0 && position <= 8) {

      if(state.board[position] != null) {
        throw new Error('Position is already occupied')
  } else {
    futureState.board[position] = state.currentPlayer;

    // Update to next player
    if (state.currentPlayer == "X") {
      futureState.currentPlayer = "O";
    } else {
      futureState.currentPlayer = "X";
    }
    
  }

  } else {
    
    throw new Error('Position must be between 0 and 8')
  }


  return futureState;
}

export function getWinner(state: GameState): Player | null {
  return null;
}
