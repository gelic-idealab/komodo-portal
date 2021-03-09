const express = require("express");
const { getAllInteractions, getAllRaw } = require("../service/data");
const dataController = express.Router();


dataController.get("/", 
  async (req, res) => {
    res.send("/data is working");
});

dataController.get("/interactions",
  async (req, res) => {
    let results = await getAllInteractions();
    res.status(200).json(results.data);
  });

dataController.get("/export/raw/:labId",
async (req, res) => {
  const { labId } = req.params;
  let results = await getAllRaw(labId);
  res.status(200).json(results.data);
});

module.exports = dataController;
