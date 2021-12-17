const express = require("express");
const path = require("path");

const { getAllInteractions, getRawExportFilePath, getAllCsvExport, exportMetricCsv, getDownloadLink } = require("../service/data");
const dataController = express.Router();

dataController.get("/", 
  async (req, res) => {
    res.send("/data is working");
  }
);

dataController.get("/interactions",
  async (req, res) => {
    let results = await getAllInteractions();
    res.status(200).json(results.data);
  }
);

dataController.get("/export/raw/capture/:captureId",
  async (req, res) => {
    const { captureId } = req.params;

    let results = await getRawExportFilePath(captureId);

    if (!results || results == undefined) {
      console.error("results was null or undefined");

      return;
    }

    if (!results.data || results.data == undefined) {
      console.error("results.data was null or undefined");

      return;
    }

    res.download(results.data, function (err) {
      if (err) {
        console.error(err);
      }
    });
  }
);

dataController.post("/",
  async (req, res) => {
    const data = req.body;
    let results = await exportMetricCsv(data);
    res.status(200).json(results.data);
  }
);

dataController.post("/request",
  async (req, res) => {
    const data = req.body;
    let results = await getAllCsvExport(data);
    res.status(200).json(results.data);
  }
);

dataController.post("/download",
  async (req, res) => {
    const data = req.body;
    let results = await getDownloadLink(data);
    res.status(200).json(results.data);
  }
);

module.exports = dataController;
