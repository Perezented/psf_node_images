"use strict";
require("dotenv/config");

const express = require("express");
const multer = require("multer");
const fs = require("fs");

const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const FileType = require("file-type");

const app = express();
app.use(express.json());

const router = express.Router();

const port = process.env.PORT || 8080;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(fileUpload());

// Defining CORS
app.use(function (req, res, next) {
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
const upload = multer({
  dest: "images/",
  limits: { fileSize: 10000000, files: 1 },
  fileFilter: (req, file, callback) => {
    // file type check
    if (!file.originalname.match(/\.(jpg|jpeg|JPG)$/)) {
      return callback(new Error("Only jpg, jpeg, JPG allowed!"), false);
    }
    callback(null, true);
  }
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
router.post("/images/upload", (req, res) => {
  upload(req, res, function (err) {
    // stored as filename
    const curr_img = req.file.filename;
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      let path = `/images/${curr_img}`;
      res
        .status(200)
        .json({ message: "Image Uploaded Successfully!", path: path });
    }
  });
});
router.post("/compressed_images/upload", (req, res) => {
  compressed_upload(req, res, function (err) {
    // stored as filename
    const curr_img = req.file.filename;
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      let path = `/compressed_images/${curr_img}`;
      res
        .status(200)
        .json({ message: "Image Uploaded Successfully!", path: path });
    }
  });
});

// get by image filename in the images folder
router.get("/images/:imagename", (req, res) => {
  let imagename = req.params.imagename;
  let imagepath = __dirname + "/images/" + imagename;
  let image = fs.readFileSync(imagepath);
  res.end(image, "binary");
});
// get by image filename in the compressed_images folder
router.get("/compressed_images/:imagename", (req, res) => {
  let imagename = req.params.imagename;
  let imagepath = __dirname + "/compressed_images/" + imagename;
  let image = fs.readFileSync(imagepath);
  res.end(image, "binary");
});

// gets all images names through the images directory
router.get("/images/", (req, res) => {
  let imagepath = __dirname + "/images/";
  let images_array = fs.readdirSync(imagepath);
  let images_urls = images_array.map((value) => {
    return `${process.env.URL}images/${value}`;
  });
  res.status(200).json({ images_urls, images_array });
});

// gets all compressed images names through the compressed_images directory
router.get("/compressed_images/", (req, res) => {
  let imagepath = __dirname + "/compressed_images/";
  let images_array = fs.readdirSync(imagepath);
  let images_urls = images_array.map((value) => {
    return `${process.env.URL}compressed_images/${value}`;
  });
  res.status(200).json({ images_urls, images_array });
});

app.use("/", router);

app.use((err, req, res, next) => {
  if (err.code == "ENOENT") {
    res.status(404).json({ message: "Image Not Found!" });
  } else {
    res.status(500).json({ message: err.message });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    Message: "Congrats the servers up, look at images on the /images endpoint."
  });
});

app.listen(port);
console.log(`App Runs on localhost:${port}`);
