const pool = require("./index");
const dataQuery = require("../query/data");

const wipeInteractionsTable = async() => {
  result = await pool.execute(dataQuery.wipeInteractionsTable);
  return result
}

const loadData = async (data) => {
  const results = await pool.execute(
    dataQuery.loadData,
    [data.capture_id, data.capture_start, data.session_id, data.client_id, data.source_id, data.target_id, data.type, data.count]
  );

  return {
    data: results
  }
};

const getAllInteractions = async() => {
  const results = await pool.execute(dataQuery.getAllInteractions);
  return {
    data: results[0]
  }
}

module.exports = {
  wipeInteractionsTable,
  loadData,
  getAllInteractions
};
