const express = require("express");
const { getLabList, getLabDetail, getLabAssetList, createLab, editLab, deleteLab, getCaptures } = require("../service/lab");
const labController = express.Router();

// Get lab list for specific course by course id
labController.get("/",
  async (req, res) => {
    const { courseId } = req.query;

    const results = await getLabList({
      courseId,
    });
    res.status(results.code || 200).json(results.data);
  });

// get list of Lab captures
labController.get("/captures",
  async (req, res) => {
  const { courseId } = req.query;
    const results = await getCaptures({
      courseId,
    });
    res.status(results.code || 200).json(results.data);
  });

// Query lab detailed information by lab id
labController.get("/:labId",
  async (req, res) => {
    const { labId } = req.params;

    const results = await getLabDetail({ labId });
    res.status(results.code || 200).json(results.data);
  });

// Query asset list for the specific lab by lab id
labController.get("/:labId/assets",
  async (req, res) => {
    const { labId } = req.params;

    const results = await getLabAssetList({ labId });
    res.status(results.code || 200).json(results.data);
  });

// Create new lab
labController.post("/",
  async (req, res) => {
    const { courseId, title, description, startTime, endTime, assetList, build } = req.body;

    const results = await createLab({
      title,
      courseId,
      description,
      startTime,
      endTime,
      assetList,
      build
    });
    res.status(results.code || 200).json(results.data);
  });

// Edit lab information by lab id
labController.put("/edit", 
  async (req, res) => {
    const { title, description, startTime, endTime, assetList, build, labId } = req.body;
    const results = await editLab({ title, description, startTime, endTime, assetList, build, labId });
    res.status(results.code || 200).json(results.data);
});

// Delete lab by lab id
labController.delete("/delete",
  async (req, res) => {
    const {labId} = req.body;
    const results = await deleteLab({labId});
    res.status(results.code || 200).json(results.data);
  }
);


module.exports = labController;
