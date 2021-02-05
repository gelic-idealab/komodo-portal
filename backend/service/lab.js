const pool = require("./index");
const moment = require("moment");
const labQuery = require("../query/lab");
const assetQuery = require("../query/asset");

// Get lab list for the specific course id
const getLabList = async ({ courseId }) => {
  const results = await pool.execute(
    labQuery.getLabList,
    [courseId]
  );
  const labList = results[0];

  return {
    data: labList
  };
};

// Get lab detailed information by lab id
const getLabDetail = async ({ labId }) => {
  // Get lab information
  const labResults = await pool.execute(
    labQuery.getLabDetail,
    [labId]
  );
  const lab = labResults[0][0];
  // Get asset list for the lab id
  const assetResults = await pool.execute(
    assetQuery.getSessionAssetList,
    [labId]
  );
  const assetList = assetResults[0];
  // Get lab users for the lab id
  const labUsers = await pool.execute(
    labQuery.getLabUsers,
    [labId]
  )
  const users = labUsers[0];

  return {
    data: { ...lab, assetList, users }
  };
};

// Get asset list for the lab id
const getLabAssetList = async ({ labId }) => {
  const results = await pool.execute(
    assetQuery.getSessionAssetList,
    [labId]
  );
  const assetList = results[0];

  return {
    data: assetList
  }
};

// Create lab 
const createLab = async ({ title, courseId, description, startTime, endTime, assetList, build }) => {
  const now = moment().utc().format("YYYY-MM-DD HH:mm:ss");
  const start = moment(startTime).utc().format("YYYY-MM-DD HH:mm:ss");
  const end = moment(endTime).utc().format("YYYY-MM-DD HH:mm:ss");
  // Create lab
  const createLabResults = await pool.execute(
    labQuery.createLab,
    [title, courseId, description, now, start, end, build]
  );
  const labId = createLabResults[0].insertId;
  // Create session for the asset and lab
  if (assetList.length) {
    let values = "";
    for (const assetId of assetList) {
      values += `(${labId}, ${assetId}, 1),`
    }
    await pool.execute(
      assetQuery.createSessionAsset + values.slice(0, values.length - 1)
    );
  }

  return {
    data: { labId }
  }
};

// Edit lab by lab id
const editLab = async ({ title, description, startTime, endTime, assetList, build, labId }) => {
  startTime = moment(startTime).utc().format("YYYY-MM-DD HH:mm:ss");
  endTime = moment(endTime).utc().format("YYYY-MM-DD HH:mm:ss");
  // Edit lab information
  await pool.execute(
    labQuery.editLabQuery, [title, description, startTime, endTime, build, labId]
  );
  // Remove the connection between asset and lab
  await pool.execute(
    assetQuery.deleteSessionAssetBySessionId,
    [labId]
  );
  // Create new connection between asset and lab
  let values = "";
  for (const assetId of assetList) {
    values += `(${labId}, ${assetId}, 1),`
  }
  await pool.execute(
    assetQuery.createSessionAsset + values.slice(0, values.length - 1)
  );
  return {
    data: true
  };
}

// Delete lab by lab id
const deleteLab = async({labId}) => {
  // Remove the connection between asset and lab by lab id
  await pool.execute(
    assetQuery.deleteSessionAssetBySessionId,
    [labId]
  );
  // Delete lab information by lab id
  await pool.execute(
    labQuery.deleteLabQuery, 
    [labId]
  );
  return {
    data: true
  }
}

// Get captures for the specific course id
const getCaptures = async ({ courseId }) => {
  const results = await pool.execute(
    labQuery.capturesQuery,
    [courseId || 0]
  );
  const captures = results[0];
  return {
    data: captures
  };
};


module.exports = {
  getLabList,
  getLabDetail,
  getLabAssetList,
  createLab,
  editLab,
  deleteLab,
  getCaptures
};
