"use strict";

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const app = express();
const router = express.Router();

const port = process.env.PORT || 8080;

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
