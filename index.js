"use strict";
require("dotenv/config");

const express = require("express");
const multer = require("multer");
const fs = require("fs");

const bodyParser = require("body-parser");

const app = express();
app.use(express.json());

const router = express.Router();

const port = process.env.PORT || 8080;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Defining CORS
app.use((_req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
// uploading using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./compressed_images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const comp_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./compressed_images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({
  storage: storage
}).single("image");
const compressed_upload = multer({
  dest: "compressed_images/",
  limits: { fileSize: 10000000, files: 1 },
  fileFilter: (req, file, callback) => {
    // file type check
    if (!file.originalname.match(/\.(jpg|jpeg|JPG)$/)) {
      return callback(new Error("Only jpg, jpeg, JPG allowed!"), false);
    }
    callback(null, true);
  }
}).single("image");
// Upload images using this endpoint
// router.post("/images/upload", (req, res) => {
//   upload(req, res, function (err) {
//     // stored as filename
//     const curr_img = req.file.filename;
//     if (err) {
//       res.status(400).json({ message: err.message });
//     } else {
//       const path = `/images/${curr_img}`;
//       res
//         .status(200)
//         .json({ message: "Image Uploaded Successfully!", path: path });
//     }
//   });
// });
// router.post("/compressed_images/upload", (req, res) => {
//   compressed_upload(req, res, function (err) {
//     // stored as filename
//     const curr_img = req.file.filename;
//     if (err) {
//       res.status(400).json({ message: err.message });
//     } else {
//       const path = `/compressed_images/${curr_img}`;
//       res
//         .status(200)
//         .json({ message: "Image Uploaded Successfully!", path: path });
//     }
//   });
// });

// get by image filename in the images folder
router.get("/images/:imagename", (req, res) => {
  const imagename = req.params.imagename;
  const imagepath = `${__dirname}/images/${imagename}`;
  const image = fs.readFileSync(imagepath);
  res.end(image, "binary");
});
// get by image filename in the compressed_images folder
router.get("/compressed_images/:imagename", (req, res) => {
  const imagename = req.params.imagename;
  const imagepath = `${__dirname}/compressed_images/${imagename}`;
  const image = fs.readFileSync(imagepath);
  res.end(image, "binary");
});

// gets all images names through the images directory
router.get("/images/", (_req, res) => {
  const imagepath = `${__dirname}/images/`;
  const images_array = fs.readdirSync(imagepath);
  const images_urls = images_array.map((value) => {
    return `${process.env.URL.slice(-1).endsWith('/') ? process.env.URL : process.env.URL + "/"}images/${value}`;
  });
  res.status(200).json({ images_urls, images_array });
});

// gets all compressed images names through the compressed_images directory
router.get("/compressed_images/", (_req, res) => {
  const imagepath = `${__dirname}/compressed_images/`;
  const images_array = fs.readdirSync(imagepath);
  const images_urls = images_array.map((value) => {
    return `${process.env.URL.slice(-1).endsWith('/') ? process.env.URL : process.env.URL + "/"}compressed_images/${value}`;
  });
  res.status(200).json({ images_urls, images_array });
});

app.use("/", router);

app.use((err, _req, res, _next) => {
  if (err.code == "ENOENT") {
    res.status(404).json({ message: "Image Not Found!" });
  } else {
    res.status(500).json({ message: err.message });
  }
});

app.get("/", (_req, res) => {
  res.status(200).json({
    Message: "Congrats the servers up, look at images on the /images endpoint."
  });
});

app.listen(port);
console.log(`App Runs on localhost:${port}`);
