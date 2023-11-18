const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");

// imports from other files
const keys = require("../src/keys");       //keys.js not uploaded
const api_routes = require("./routes/api_routes");
const auth_routes = require("./routes/auth_routes");

const server = express();

//Middlewares
server.use(cors());
server.use(`/${keys.url_encrypt.key}/api`, api_routes);
server.use(`/${keys.url_encrypt.key}/auth`, auth_routes);
server.use(session({
    cookie: {maxAge: 24 * 60 * 60 * 1000},  //milliseconds in a day
    secret: [keys.session.secret],
    saveUninitialized: false,
    resave: false
}));

//Connect to MongoDB Atlas
mongoose.connect(keys.mongoDB.mongodbURI);

server.listen(8080, () => {
    console.log("Listening...");
})