import express from "express";
import ViteExpress from "vite-express";

const PORT = 3000;

const app = express();

app.get("/message", (req,res) => res.send("Hello World"));


ViteExpress.listen(app, PORT, ()=> console.log("Vite server is listening"))