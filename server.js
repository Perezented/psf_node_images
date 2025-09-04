const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const fs = require("fs");
const path = require("path");
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

// Serve compressed images
router.get("/compressed_images/:imagename", (req, res, next) => {
  const imagepath = path.join(__dirname, "compressed_images", req.params.imagename);
  fs.readFile(imagepath, (err, image) => {
    if (err) return next(err);
    res.end(image, "binary");
  });
});

// Serve original images
router.get("/images/:imagename", (req, res, next) => {
  const imagepath = path.join(__dirname, "images", req.params.imagename);
  fs.readFile(imagepath, (err, image) => {
    if (err) return next(err);
    res.end(image, "binary");
  });
});

// Helper to list images
function getImagesList(dir, urlPath) {
  const imagepath = path.join(__dirname, dir);
  const images_array = fs.readdirSync(imagepath);
  const baseUrl = process.env.URL.endsWith("/") ? process.env.URL : process.env.URL + "/";
  const images_urls = images_array.map(value => `${baseUrl}${urlPath}/${value}`);
  return { images_urls, images_array };
}

// List images endpoints
router.get("/images", (_req, res) => {
  res.status(200).json(getImagesList("images", "images"));
});

router.get("/compressed_images", (_req, res) => {
  res.status(200).json(getImagesList("compressed_images", "compressed_images"));
});

// Root endpoint
router.get("/", (_req, res) => {
  res.status(200).json({
    message: "Welcome to the home slash of this server",
  });
});

// Use the router
server.use(router);

module.exports = server;
