const express = require("express");
const path = require("path");

const { getAllInteractions, getCaptureJSONFile, getAllRawCapture, getAllRawLab, getAllRawCourse, getAllCsvExport, exportMetricCsv, getDownloadLink } = require("../service/data");
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

dataController.get("/export/json/capture/:captureId",
  async (req, res) => {
    const { captureId } = req.params;

    let results = await getCaptureJSONFile(captureId);

    if (!results || results == undefined) {
      console.error("results.data was null or undefined");

      return;
    }

    if (!results.data || results.data == undefined) {
      console.error("results.data was null or undefined");

      return;
    }

    const filename = "data";

    const ext = ""; // ext must start with a "." unless there's no extension

    const fullFilename = `${filename}${ext}`;

    const pathAndFilename = path.join(results.data, fullFilename);
    
    const options = {
      root: results.data,
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    };

    // res.sendFile(fullFilename, options, function (err) {
    //   if (err) {
    //     console.error(err);
    //   } else {
    //     console.log('Sent:', fullFilename);
    //   }
    // });

    res.download(pathAndFilename, function (err) {
      if (err) {
        console.error(err);
      } else {
        //console.log('Sent:', fullFilename);
      }
    })
  }
);

dataController.get("/export/raw/capture/:captureId",
  async (req, res) => {
    const { captureId } = req.params;
    let results = await getAllRawCapture(captureId);
    res.status(200).json(results.data);
  }
);

dataController.get("/export/raw/lab/:labId",
  async (req, res) => {
    const { labId } = req.params;
    let results = await getAllRawLab(labId);
    res.status(200).json(results.data);
  }
);

dataController.get("/export/raw/course/:courseId",
  async (req, res) => {
    const { courseId } = req.params;
    let results = await getAllRawCourse(courseId);
    res.status(200).json(results.data);
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
