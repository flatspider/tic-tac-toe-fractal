import { useState } from "react";

// The lobby needs to knwo that it's not part of a game
// It needs a list of all games
// Then renders them out
const Lobby = () => {
  console.log("hello from the LOBBY");
  return (
    <>
      <p>You. Are. In. The. Lobby</p>
    </>
  );
};

export default Lobby;
