const getAllInteractions = `SELECT * FROM KP_Interactions WHERE capture_id IS NOT NULL`
const getRawPos = `SELECT * FROM positions p JOIN captures c ON p.session_id = c.session_id WHERE c.capture_id = ?`;
const getRawInt = `SELECT * FROM interactions i JOIN captures c ON i.session_id = c.session_id WHERE c.capture_id = ?`;

module.exports = { getAllInteractions, getRawPos, getRawInt }