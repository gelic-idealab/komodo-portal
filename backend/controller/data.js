const express = require("express");
const { wipeInteractionsTable, loadData, getAllInteractions } = require("../service/data");
const dataController = express.Router();
const INTERACTION_TABLE_COLUMNS = 8;

dataController.post("/",
  async (req, res) => {
    // TODO(rob): require X-API-KEY header with correct value
    const data = req.body;
    console.log('receiving data:', data.length, 'rows', data[0], '...');
    if (data) {
      console.log('Refreshing data...')
      await wipeInteractionsTable();
      data.forEach(async row => {
        // validate data schema
        if (Object.keys(row).length === INTERACTION_TABLE_COLUMNS) {
          // console.log('inserting data:', row)
          const result = await loadData(row);
          // TODO(rob): check return value
        } else {
          console.error('data has incorrect shape: ', row);
          res.sendStatus(500);  
        }
      });
      console.log('Done.')
      res.sendStatus(200);
    }
  });

dataController.get("/", 
  async (req, res) => {
    res.send("/data is working");
});

dataController.get("/interactions",
  async (req, res) => {
    let results = await getAllInteractions();
    res.status(200).json(results.data);
  })

module.exports = dataController;
