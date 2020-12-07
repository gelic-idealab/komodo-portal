const wipeInteractionsTable = 'TRUNCATE KP_Interactions'
const loadData = `INSERT INTO KP_Interactions (capture_id, capture_start, session_id, client_id, source_id, target_id, type, count) VALUES   (?, ?, ?, ?, ?, ?, ?, ?)`;
const getAllInteractions = `SELECT * FROM KP_Interactions WHERE capture_id IS NOT NULL`

module.exports = { wipeInteractionsTable, loadData, getAllInteractions }