const AWS = require("aws-sdk");
const config = require("../config");
AWS.config.update(config.aws);
const s3 = new AWS.S3();
const BUCKET_NAME = "vrcat-assets";

const upload = async uuid => {
  let results;
  s3.createPresignedPost(
    {
      Bucket: BUCKET_NAME,
      Conditions: [
        ["starts-with", "$key", `public/${uuid}/`]
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
        key: "public/" + uuid + "/${filename}",
        ...data.fields
      };
      results = {
        code: 200,
        data
      }
    });
  return results;
};

module.exports = {
  upload,
};
