import baseRequest from "./base";

const path = require("path");

// Get metrics data
export const getInteractionData = () => {
  return baseRequest.get("/data/interactions");
};

// Get raw position and interaction data by capture id
export const downloadCaptureJSONFile = params => {
  const { captureId } = params;

  let pathName = path.join("data", "export", "raw", "capture", captureId);

  window.open(`${baseRequest.defaults.baseURL}${pathName}`);
};

//post params to get csv file for metric page
export const exportMetricCsv = params => {
  return baseRequest.post("/data/", params);
};

//Get data request by user id
export const getAllDataRequest = params => {
  return baseRequest.post("/data/request", params);
};

//Get download link by request id
export const getDownloadLink = params => {
  return baseRequest.post("/data/download", params);
};