import { describe, it, expect } from "vitest";
import supertest from "supertest";
import {app, GameList, type GameState} from './server.ts'

const request = require('supertest');

// First test. Post to create a new game. 

describe("POST to /create game", ()=>{
    it("Create a new game and return the new id", async () => {
        const res = await request(app)
        .post("/create")
        .send({}).expect(201).expect("Content-Type", /json/);

        const game = res.body as GameState;
        expect(game).toHaveProperty("gameID");

        expect(game.board).toEqual([null, null, null, null, null, null, null, null, null]);
    })
});

describe("GET to /games for list", ()=>{
    it("Return a list of games", async () => {

        await request(app).post("/create").send({}).expect(201);

        const res = await request(app)
        .get("/games")
        .send({}).expect(200).expect("Content-Type", /json/);

        // There should be one game
        const games = res.body as Array<String>;
        expect(games.length).toBeGreaterThanOrEqual(1);

    })
});

describe("GET to /game/:ID", ()=>{
    it("Return a specific game", async () => {
        // Creating a new game within the test
        const newGameResponse = await request(app).post("/create").send({}).expect(201);
        // Pulling the gameID off the response
        const {gameID} = newGameResponse.body as GameState;

        const res = await request(app)
        .get(`/game/${gameID}`)
        .send({}).expect(200).expect("Content-Type", /json/);

        // Check there is a GameState coming back from the specific ID endpoint
        const game = res.body as GameState;
        expect(game).toHaveProperty("gameID", gameID);
        expect(game).toHaveProperty("board");
    })
});

describe("POST to /move", () => {
  it("Accept a valid move and return updated game state", async () => {
    const newCreatedGame = await request(app).post("/create").send({}).expect(201);
    const { gameID } = newCreatedGame.body as GameState;

    const res = await request(app)
      .post("/move")
      .send({ gameID, position: 0 })
      .expect(200)
      .expect("Content-Type", /json/);

    const game = res.body as GameState;
    expect(game).toHaveProperty("board");
    expect(game).toHaveProperty("currentPlayer");
  });

  it("Return 404 for a non-existent game", async () => {
    await request(app)
      .post("/move")
      .send({ gameID: 999999, position: 0 })
      .expect(404);
  });
});

describe("POST to /reset", () => {
  it("Reset a game and return the fresh game state", async () => {
    const newCreatedGame = await request(app).post("/create").send({}).expect(201);
    const { gameID } = newCreatedGame.body as GameState;

    const res = await request(app)
      .post("/reset")
      .send({ gameID })
      .expect(200)
      .expect("Content-Type", /json/);

    const game = res.body as GameState;
    expect(game).toHaveProperty("gameID", gameID);
    expect(game).toHaveProperty("board");
    expect(game).toHaveProperty("currentPlayer");
  });

  it("Return 404 for a non-existent game", async () => {
    await request(app)
      .post("/reset")
      .send({ gameID: 999999 })
      .expect(404);
  });
});