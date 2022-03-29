import axios from "axios";

const baseRequest = axios.create();

baseRequest.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
baseRequest.defaults.timeout = 2500;
baseRequest.defaults.withCredentials = true;
baseRequest.defaults.headers = { "Content-Type": "application/json" };

const toCamel = data => {
  if (typeof data !== "object" || data === null) {
    return data;
  }

  if (data instanceof Array) {
    return data.map(value => toCamel(value));
  }

  const newData = {};
  for (const key in data) {
    // eslint-disable-next-line
    if (data.hasOwnProperty(key)) {
      const splitted = key.split("_");
      let newKey = splitted[0];
      for (let i = 1; i < splitted.length; i++) {
        newKey += splitted[i][0].toUpperCase() + splitted[i].slice(1);
      }

      newData[newKey] = toCamel(data[key]);
    }
  }

  return newData;
};

baseRequest.defaults.transformResponse = [
  data => {
    return toCamel(JSON.parse(data));
  }
];

export default baseRequest;
