const express = require("express");
const { presignAssetPost, createAsset, getAssetList, getAssetDetail, deleteAsset } = require("../service/asset");
const assetController = express.Router();


assetController.post("/presign",
  async (req, res) => {
    const { uuid } = req.body;

    const results = await presignAssetPost(uuid);
    res.status(results.code || 200).json(results.data);
  });

// Create new asset 
assetController.post("/",
  async (req, res) => {
    const { uuid, assetName, description, creatorId, isPublic, isWholeObject, path, scale } = req.body;

    const results = await createAsset({
      uuid,
      assetName,
      description,
      creatorId,
      isPublic,
      isWholeObject,
      path,
      scale
    });
    res.status(200).json(results.data);
  });

// Get asset list
assetController.get("/",
  async (req, res) => {
    const { creatorId } = req.query;

    const results = await getAssetList({
      creatorId,
    });
    res.status(200).json(results.data);
  });

// Query asset detail information by asset id
assetController.get("/:assetId",
  async (req, res) => {
    const { assetId } = req.params;

    const results = await getAssetDetail({
      assetId,
    });
    res.status(200).json(results.data);
  });

// Delete asset by asset id
assetController.delete("/delete",
  async (req, res) => {
    const{ assetId } = req.body;
    const results = await deleteAsset({assetId});
    res.status(results.code || 200).json(results.data);
  }
)
module.exports = assetController;
