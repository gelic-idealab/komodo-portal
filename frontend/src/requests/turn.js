import baseRequest from "./base";

// Get TURN server credentials 
export const getTurnCredentials = () => {
  return baseRequest.get("/turn");
};
