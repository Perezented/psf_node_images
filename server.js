//  Main imports
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
var bodyparser = require("body-parser");
var fs = require("fs");
var multer = require("multer");
var sharp = require("sharp");

// defining the server
const server = express();

// setting up knex to express-session
const session = require("express-session");
const KnexSessionsStore = require("connect-session-knex")(session);
// setting up the data base connection
const dbConnection = require("./data/connection");

// CUSTOM ROUTES ADDDDDDD  HHHHHEEEEEEERRRRRREEEEEEE

//  Session configuration for knex
const sessionConfig = {
  name: "monster",
  secret: process.env.SESSION_SECRET || "keep it secret, keep it safe!",
  cookie: {
    maxAge: 1000 * 600,
    secure: process.env.COOKIE_SECURE || false, //  true means only use over https //  true in production
    httpOnly: true //JS code on the client cannot access the session cookie
  }, // 10 min in milliseconds
  resave: false,
  saveUninitialiezed: false, //  GDPR compliance
  store: new KnexSessionsStore({
    knex: dbConnection,
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 30000 //  delete expired sessions - in milliseconds
  })
};

// setting up the desination for multer uploads
var upload = multer({ dest: "./images" });

//  make sure to use the sessionConfig
server.use(session(sessionConfig));
server.use(cors());
server.use(helmet());
server.use(morgan("combined"));
server.use(express.json());
// Use body-parser to parse incoming data
server.use(bodyparser.urlencoded({ extended: true }));

// Use the upload middleware containing
// our file configuration, with the name
// of input file attribute as "image"
// to the desired configuration.

//  Actual endpoints for the server
server.get("/", (req, res) => {
  res.status(200).json({
    Message: "Welcome to the home slash of this server"
  });
});
server.post("/upload", upload.single("image"), (req, res) => {
  fs.rename(req.file.path, "./images/image.jpg", (err) => {
    console.log(err);
  });

  sharp(__dirname + "/images/image.jpg")
    .resize(200, 200)
    .jpeg({ quality: 50 })
    .toFile(__dirname + "/images/image_thumb.jpg");

  sharp(__dirname + "/images/image.jpg")
    .resize(640, 480)
    .jpeg({ quality: 80 })
    .toFile(__dirname + "/images/image_preview.jpg");

  return res.json("File Uploaded Successfully!");
});

module.exports = server;
