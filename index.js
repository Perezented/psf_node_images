"use strict";

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const app = express();
const router = express.Router();

const port = process.env.PORT || 8080;

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

// get by image filename in the images folder
router.get("/images/:imagename", (req, res) => {
  let imagename = req.params.imagename;
  let imagepath = __dirname + "/images/" + imagename;
  let image = fs.readFileSync(imagepath);
  res.end(image, "binary");
});

app.use("/", router);

app.use((err, req, res, next) => {
  if (err.code == "ENOENT") {
    res.status(404).json({ message: "Image Not Found !" });
  } else {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port);
console.log(`App Runs on localhost:${port}`);
