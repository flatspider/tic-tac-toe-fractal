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
      <button
        className="new-game-button"
        onClick={() => {
          props.createsNewGame();
        }}
      >
        New Game!
      </button>
      <div className="games-container">
        {props.listOfGames?.map((element: string, id: number) => (
          <button
            key={element}
            className="game-button"
            onClick={() => {
              props.opensLiveGame(element);
            }}
          >
            {`Game #${id + 1}`}
          </button>
        ))}
      </div>
    </>
  );
};

export default Lobby;
