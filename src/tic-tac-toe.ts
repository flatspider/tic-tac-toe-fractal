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
  // state is currently a board. 0 1 2 3...as you would expect. 
  // When I get a position number, I need to change that to the current player name
  // Does this modify the state properly?
  state.board[position] = state.currentPlayer;

  return state;
}

export function getWinner(state: GameState): Player | null {
  return null;
}
