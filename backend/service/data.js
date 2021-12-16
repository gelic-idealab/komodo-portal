'esversion: 6';

const fs = require('fs');
const AWS = require('aws-sdk');
const config = require("../config");
AWS.config.update(config.aws);
const s3 = new AWS.S3();
const BUCKET_NAME = config.aws.bucket;
const path = require('path');
const pool = require("./index");
const dataQuery = require("../query/data");

const getAllInteractions = async() => {
  const results = await pool.execute(dataQuery.getAllInteractions);
  return {
    data: results[0]
  };
};

const getCaptureJSONFile = async(idAndTimestamp) => {
  // from express, generate the capture path directory
  // return that file?
  // return a download URL?

  const splitIdAndTimestamp = idAndTimestamp.split("_");

  if (splitIdAndTimestamp.length != 2) {
    console.error("string should be formatted like <string>_<timestamp>");

    return;
  }

  const id = splitIdAndTimestamp[0];

  const timestamp = splitIdAndTimestamp[1];

  const directory = path.join(config.captures, id, timestamp);

  return {
    data: directory
  };
};

const getAllRawCapture = async(id) => {
  const results = {}
  results.pos = await pool.execute(dataQuery.getRawPosCapture, [id]);
  results.int = await pool.execute(dataQuery.getRawIntCapture, [id]);
  return {
    data: results
  };
};

const getAllRawLab = async(id) => {
  const results = {}
  results.pos = await pool.execute(dataQuery.getRawPosLab, [id]);
  results.int = await pool.execute(dataQuery.getRawIntLab, [id]);
  return {
    data: results
  };
};

const getAllRawCourse = async(id) => {
  const results = {}
  results.pos = await pool.execute(dataQuery.getRawPosCourse, [id]);
  results.int = await pool.execute(dataQuery.getRawIntCourse, [id]);
  return {
    data: results
  };
};

const exportMetricCsv = async(data) => {
  let request = [data.captureId, data.clientId, data.type, 0, data]
  results = await pool.execute(dataQuery.insertRequest,request);
  return {
    data: {
      status: "success"
    }
  };
};

const getAllCsvExport = async(data) => {
  let userId = data.userId;
  results = await pool.query(dataQuery.getAllDataRequest,userId);
  if(results[0].length > 0){
    for(i=0;i<results[0].length;i++){
      results[0][i].message = JSON.parse(results[0][i].message);
    }

    return {
      data: results[0]
    };
  }else{
    return {
      data: []
    };
  }
};

const getDownloadLink = async(request) => {
  let requestId = request.requestId;
  results = await pool.execute(dataQuery.getDownloadLink,[requestId]);
  if(results[0][0].file_location == null){
    return({
      data: {
        status: "processing"
      }
    });
  }else{
    if(results[0][0].url == null){
      // Read content from the file
      let fileName = results[0][0].file_location.split('/');
      const fileContent = fs.readFileSync(results[0][0].file_location);
      // Setting up S3 upload parameters
      const params = {
          Bucket: BUCKET_NAME+"/dataRequest/",
          Key: Date.now()+fileName[fileName.length-1], // File name you want to save as in S3
          Body: fileContent
      };
      // Uploading files to the bucket
      let fileLocation;
      let s3upload = s3.upload(params, async function(err, data) {
        if (err) {
          console.log(err);
        }else{
          fileLocation = data.Location;
        }
      }).promise();
      return s3upload
      .then(async result =>{
        pool.execute(dataQuery.updateDownloadLink,[result.Location,requestId]);
        return({
          data: {
            status: "success",
            url: result.Location
          }
        })
      })
    }else{
      return({
        data: {
          status: "success",
          url: results[0][0].url
        }
      })
    }
  }
}

module.exports = {
  getAllInteractions,
  getCaptureJSONFile,
  getAllRawCapture,
  getAllRawLab,
  getAllRawCourse,
  getAllCsvExport,
  exportMetricCsv,
  getDownloadLink
};
