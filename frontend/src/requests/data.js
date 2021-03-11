import baseRequest from "./base";

// Get metrics data
export const getInteractionData = () => {
  return baseRequest.get("/data/interactions");
};

// Get raw position and interaction data
export const getAllRaw = params => {
  const { captureId } = params;
  return baseRequest.get(`/data/export/raw/${captureId}`);
};
