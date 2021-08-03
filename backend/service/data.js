const pool = require("./index");
const dataQuery = require("../query/data");

const getAllInteractions = async() => {
  const results = await pool.execute(dataQuery.getAllInteractions);
  return {
    data: results[0]
  }
}

const getAllRawCapture = async(id) => {
  const results = {}
  results.pos = await pool.execute(dataQuery.getRawPosCapture, [id]);
  results.int = await pool.execute(dataQuery.getRawIntCapture, [id]);
  return {
    data: results
  }
}

const getAllRawLab = async(id) => {
  const results = {}
  results.pos = await pool.execute(dataQuery.getRawPosLab, [id]);
  results.int = await pool.execute(dataQuery.getRawIntLab, [id]);
  return {
    data: results
  }
}

const getAllRawCourse = async(id) => {
  const results = {}
  results.pos = await pool.execute(dataQuery.getRawPosCourse, [id]);
  results.int = await pool.execute(dataQuery.getRawIntCourse, [id]);
  return {
    data: results
  }
}


module.exports = {
  getAllInteractions,
  getAllRawCapture,
  getAllRawLab,
  getAllRawCourse
};
