import baseRequest from "./base";

// Get metrics data
export const getInteractionData = () => {
  return baseRequest.get("/data/interactions");
};
