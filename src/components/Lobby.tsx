import { useState } from "react";

// The lobby needs to knwo that it's not part of a game
// It needs a list of all games
// Then renders them out
const Lobby = (props: {
  listOfGames: Array<string>;
  opensLiveGame: (targetGameID: string) => void;
  createsNewGame: () => void;
}) => {
  return (
    <>
      <p>You. Are. In. The. Lobby</p>
      <button
        onClick={() => {
          props.createsNewGame();
        }}
      >
        Start a new game
      </button>
      <div className="games-container">
        {props.listOfGames?.map((element: string) => (
          <button
            key={element}
            className="game-button"
            onClick={() => {
              props.opensLiveGame(element);
            }}
          >
            {element ?? " "}
          </button>
        ))}
      </div>
    </>
  );
};

export default Lobby;
