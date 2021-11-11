const express = require("express");
const { getAllInteractions, getAllRawCapture, getAllRawLab, getAllRawCourse, getAllCsvExport, exportMetricCsv, getDownloadLink } = require("../service/data");
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

dataController.get("/export/raw/capture/:captureId",
async (req, res) => {
  const { captureId } = req.params;
  let results = await getAllRawCapture(captureId);
  res.status(200).json(results.data);
});

dataController.get("/export/raw/lab/:labId",
async (req, res) => {
  const { labId } = req.params;
  let results = await getAllRawLab(labId);
  res.status(200).json(results.data);
});

dataController.get("/export/raw/course/:courseId",
async (req, res) => {
  const { courseId } = req.params;
  let results = await getAllRawCourse(courseId);
  res.status(200).json(results.data);
});

dataController.post("/",
async (req, res) => {
  const data = req.body;
  let results = await exportMetricCsv(data);
  res.status(200).json(results.data);
});

dataController.post("/request",
async (req, res) => {
  const data = req.body;
  let results = await getAllCsvExport(data);
  //console.log(results.data);
  res.status(200).json(results.data);
});

dataController.post("/download",
async (req, res) => {
  const data = req.body;
  let results = await getDownloadLink(data);
  console.log(results.data);
  res.status(200).json(results.data);
});

module.exports = dataController;
