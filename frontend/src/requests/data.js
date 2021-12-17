import baseRequest from "./base";

const path = require("path");

// Get metrics data
export const getInteractionData = () => {
  return baseRequest.get("/data/interactions");
};

// Get raw position and interaction data by course id
export const getCombinedCourseCaptures = params => {
  const { courseId } = params;
  return baseRequest.get(`/data/export/combined/course/${courseId}`);
};

// Get raw position and interaction data by lab id
export const getCombinedLabCaptures = params => {
  const { labId } = params;
  return baseRequest.get(`/data/export/combined/lab/${labId}`);
};

// Get raw position and interaction data by capture id
export const getCombinedCapture = params => {
  const { captureId } = params;
  return baseRequest.get(`/data/export/combined/capture/${captureId}`);
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