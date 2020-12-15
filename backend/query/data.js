const getAllInteractions = `SELECT * FROM KP_Interactions WHERE capture_id IS NOT NULL`

module.exports = { getAllInteractions }