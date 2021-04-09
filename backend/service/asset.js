const moment = require("moment");
const AWS = require("aws-sdk");
const config = require("../config");

const pool = require("./index");
const assetQuery = require("../query/asset");

AWS.config.update(config.aws);
const s3 = new AWS.S3();
const BUCKET_NAME = config.aws.bucket;

/**
 * Todo: add function description
 * @param {string} uuid 
 */
const presignAssetPost = async uuid => {
  let results;
  s3.createPresignedPost(
    {
      Bucket: BUCKET_NAME,
      Conditions: [
        ["starts-with", "$key", uuid + "/"]
      ]
    },
    (err, data) => {
      if (err) {
        results = {
          code: 403,
          message: `Presigning post data encountered an error, ${err}`
        }
      }

      data.fields = {
        key: uuid + "/${filename}",
        ...data.fields
      };
      results = {
        code: 200,
        data
      }
    });
  return results;
};

/**
 * Create asset 
 * @param {string} uuid
 * @param {string} assetName
 * @param {string} description
 * @param {integer} creatorId
 * @param {boolean} isPublic
 * @param {boolean} isWholeObject
 * @param {string} path
 * @param {float} scale
 */
const createAsset = async ({ uuid, assetName, description, creatorId, isPublic, isWholeObject, path, scale }) => {
  const results = await pool.execute(
    assetQuery.createAsset,
    [uuid, assetName, description, creatorId, isPublic, isWholeObject, moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'), path, scale]
  );
  const assetId = results[0].insertId;

  return {
    data: { assetId }
  }
};

/**
 * Get asset list by creator id
 * @param {integer} creatorId 
 */
const getAssetList = async ({ creatorId }) => {
  const results = await pool.execute(
    assetQuery.getAssetList,
    [creatorId]
  );
  const assetList = results[0];

  return {
    data: assetList
  }
};

/**
 * Get asset detailed information by asset id
 * @param {integer} assetId 
 */
const getAssetDetail = async ({ assetId }) => {
  const results = await pool.execute(
    assetQuery.getAssetDetail,
    [assetId]
  );
  const asset = results[0][0];

  return {
    data: asset
  }
};

/**
 * Delete asset by asset id
 * @param {integer} assetId 
 */
const deleteAsset = async({assetId}) => {
  // Delete all the sessions involved with the asset id
  await pool.execute(
    assetQuery.deleteSessionAssetByAssetId,
    [assetId]
  );
  // Delete the asset
  const deleteLabResults = await pool.execute(
    assetQuery.deleteAssetQuery, 
    [assetId]
  );
  return {
    data: true
  }
}

module.exports = {
  presignAssetPost,
  createAsset,
  getAssetList,
  getAssetDetail,
  deleteAsset
};
