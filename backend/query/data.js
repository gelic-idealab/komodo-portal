const getAllInteractions = `SELECT * FROM KP_Interactions WHERE capture_id IS NOT NULL`
const getRawPos = `SELECT * FROM positions`;
const getRawInt = `SELECT * FROM interactions`;

module.exports = { getAllInteractions, getRawPos, getRawInt }