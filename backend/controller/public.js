const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { upload } = require("../service/public");

const publicController = express.Router();

publicController.post("/upload",
  async (req, res) => {
    if (req.header("X-API-KEY") !== "test") {
      res.status(401).json({ message: "Invalid API key" });
      return;
    }

    const uuid = uuidv4();
    const results = await upload(uuid);
    res.status(results.code || 200).json(results.data);
  });

module.exports = publicController;
