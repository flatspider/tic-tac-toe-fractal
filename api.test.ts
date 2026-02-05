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