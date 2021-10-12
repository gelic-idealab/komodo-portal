const createAsset = `
INSERT INTO
  KP_Asset (uuid, asset_name, description, creator_id, is_public, is_whole_object, create_at, path, scale)
VALUES
  (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const getAssetList = `
SELECT *
FROM KP_Asset
WHERE creator_id = ? OR is_public = TRUE
`;

const getUserAssetList = `
SELECT *
FROM KP_Asset
WHERE creator_id = ?
`;

const getAssetDetail = `
SELECT
  a.asset_id, a.uuid, a.asset_name, a.description, a.creator_id,
  CONCAT(u.first_name, ' ', u.last_name) AS creator_name,
  a.is_public, a.is_whole_object, a.create_at, a.update_at, a.path, a.scale
FROM KP_Asset a
JOIN KP_User u
  ON a.creator_id = u.user_id
WHERE asset_id = ?
`;

const getSessionAssetList = `
SELECT
  a.asset_id, a.uuid, a.asset_name, a.description, a.creator_id,
  a.is_public, a.is_whole_object, a.create_at, a.update_at, a.path, a.scale, a.config
FROM KP_Session_Asset sa
JOIN KP_Asset a
  ON sa.asset_id = a.asset_id
WHERE session_id = ?
`;

const createSessionAsset = `
INSERT INTO
  KP_Session_Asset (session_id, asset_id, session_type)
VALUES
  
`;

const deleteSessionAssetBySessionId = `
DELETE FROM KP_Session_Asset 
WHERE session_id = ?
`

const deleteSessionAssetByAssetId = `
DELETE FROM KP_Session_Asset 
WHERE asset_id = ?
`

const deleteAssetQuery = `
DELETE FROM KP_Asset
WHERE asset_id = ?
`

module.exports = {
  createAsset,
  getAssetList,
  getAssetDetail,
  getSessionAssetList,
  createSessionAsset,
  deleteSessionAssetBySessionId,
  deleteSessionAssetByAssetId,
  deleteAssetQuery,
  getUserAssetList
};

