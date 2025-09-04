const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");

// const multer = require("multer");

const server = express();

// Session configuration (in-memory store, not for production)
const sessionConfig = {
  name: "monster",
  secret: process.env.SESSION_SECRET || "keep it secret, keep it safe!",
  cookie: {
    maxAge: 1000 * 600, // 10 min in milliseconds
    secure: process.env.COOKIE_SECURE || false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false, // GDPR compliance
};

// Multer configuration
// const upload = multer({ dest: "./images" });

// Middleware
server.use(session(sessionConfig));
server.use(cors());
server.use(helmet());
server.use(morgan("combined"));
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));
const router = express.Router();

// Use the router
server.use(router);

module.exports = server;
