"use strict";
require("dotenv/config");
const fs = require("fs");
const path = require("path");
const express = require("express");
// const multer = require("multer");
const bodyParser = require("body-parser");

const app = express();
const router = express.Router();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// Multer storage configs
// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => cb(null, "./compressed_images"),
//   filename: (_req, file, cb) => cb(null, file.originalname)
// });

// const upload = multer({ storage }).single("image");

// const compressed_upload = multer({
//   dest: "compressed_images/",
//   limits: { fileSize: 10000000, files: 1 },
//   fileFilter: (_req, file, cb) => {
//     if (!file.originalname.match(/\.(jpg|jpeg|JPG)$/)) {
//       return cb(new Error("Only jpg, jpeg, JPG allowed!"), false);
//     }
//     cb(null, true);
//   }
// }).single("image");

// Root endpoint
router.get("/", (_req, res) => {
  res.status(200).json({
    message: "Welcome to the home slash of this server",
  });
});


// Error handling
app.use((err, _req, res, _next) => {
  if (err.code === "ENOENT") {
    res.status(404).json({ message: "Image Not Found!" });
  } else {
    res.status(500).json({ message: err.message });
  }
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
app.use("/", router);

app.listen(port, () => {
  console.log(`App Runs on localhost:${port}`);
});
