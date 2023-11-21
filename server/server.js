const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");

// imports from other files
const keys = require("./keys");       //keys.js not uploaded
const api_routes = require("./routes/api_routes");
const auth_routes = require("./routes/auth_routes");

const server = express();

const corsOptions = {
    //origin: 'http://localhost:3000',
    origin: 'https://stocksimulation.onrender.com/',
    credentials: true, 
};

//Middlewares
server.set("trust proxy", 1);

server.use(cors(corsOptions));
server.use(`/api`, api_routes);
server.use(`/auth`, auth_routes);

//Connect to MongoDB Atlas
mongoose.connect(keys.mongoDB.mongodbURI);

server.get("/", async (req, res) => {
    res.send("HELLO WORLD");
})

server.listen(keys.PORT, () => {
    console.log("Listening...");
})