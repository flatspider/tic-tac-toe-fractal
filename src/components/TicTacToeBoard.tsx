import { useState } from "react";
import type { GameState, Cell } from "../tic-tac-toe";

// This requires you to props. to get to the object
const TicTacToeBoard = (props: {
  gameState: GameState;
  makeMoveToServer: (CellID: number) => void;
}) => {
  return (
    <>
      <div className="container">
        {props.gameState?.board.map((element: Cell, id: number) => (
          <div
            key={id}
            className={`${element}-symbol`}
            onClick={() => {
              props.makeMoveToServer(id);
            }}
          >
            {element ?? " "}
          </div>
        ))}
      </div>
    </>
  );
};

export default TicTacToeBoard;
