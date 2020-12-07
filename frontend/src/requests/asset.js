import axios from "axios";
import baseRequest from "./base";
import store from "../plugins/store";

export const awsPresignAssetPost = params => {
  return baseRequest.post(
    "/assets/presign",
    params
  );
};

export const awsUploadAsset = (baseURL, url, data) => {
  return axios({
    baseURL,
    url,
    data,
    method: "post",
    headers: { "Content-Type": "multipart/form-data" }
  });
};

// Create a new asset
export const createAsset = params => {
  return baseRequest.post(
    "/assets",
    {
      ...params,
      creatorId: store.getters.user.userId
    }
  );
};

// Get asset list
export const getAssetList = () => {
  return baseRequest.get(
    "/assets",
    {
      params: {
        creatorId: store.getters.user.userId
      }
    }
  );
};

// Get asset details by asset id
export const getAssetDetail = params => {
  const { assetId } = params;
  return baseRequest.get(
    `/assets/${assetId}`
  );
};

// Delete the asset by asset id
export const deleteAsset = params => {
  return baseRequest.delete(
    `/assets/delete`,
    {
      data: params
    }
  );
}
