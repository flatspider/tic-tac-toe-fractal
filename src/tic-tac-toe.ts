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
  

  



 
