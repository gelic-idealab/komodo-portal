import baseRequest from "./base";

// Get metrics data
export const getInteractionData = () => {
  return baseRequest.get("/data/interactions");
};

// Get raw position and interaction data by course id
export const getAllRawCourse = params => {
  const { courseId } = params;
  return baseRequest.get(`/data/export/raw/course/${courseId}`);
};

// Get raw position and interaction data by lab id
export const getAllRawLab = params => {
  const { labId } = params;
  return baseRequest.get(`/data/export/raw/lab/${labId}`);
};

// Get raw position and interaction data by capture id
export const getAllRawCapture = params => {
  const { captureId } = params;
  return baseRequest.get(`/data/export/raw/capture/${captureId}`);
};

//post params to get csv file for metric page
export const exportMetricCsv = params => {
  return baseRequest.post("/data/", params);
}

//Get data request by user id
export const getAllDataRequest = params => {
  return baseRequest.post("/data/request", params);
}

//Get download link by request id
export const getDownloadLink = params => {
  return baseRequest.post("/data/download", params);
}