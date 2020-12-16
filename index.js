"use strict";

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const app = express();
const router = express.Router();

const port = process.env.PORT || 8080;

const upload = multer({
  dest: "images/",
  limits: { fileSize: 10000000, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|JPG)$/)) {
      return callback(new Error("Only jpg, jpeg, JPG allowed!"), false);
    }
    callback(null, true);
  }
}).single("image");

router.post("/images/upload", (req, res) => {
  upload(req, res, function (err) {
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
