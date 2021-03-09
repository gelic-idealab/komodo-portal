const getAllInteractions = `SELECT * FROM KP_Interactions WHERE capture_id IS NOT NULL`
const getRawPos = `SELECT * FROM positions WHERE session_id = ?`;
const getRawInt = `SELECT * FROM interactions WHERE session_id = ?`;

module.exports = { getAllInteractions, getRawPos, getRawInt }