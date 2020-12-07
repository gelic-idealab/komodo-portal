const AWS = require('aws-sdk');
const config = require("./config");
AWS.config.update(config.aws);
const s3 = new AWS.S3();
const BUCKET_NAME = "vrcat-assets";

createPresignedPost = function(name, callback){
    s3.getObject({
        Bucket : BUCKET_NAME,
        Key: name + '/model.json',
    }, function(err, data) {
        if (!err) {
            callback("already exist", null);
        } else {
            s3.createPresignedPost({Bucket: BUCKET_NAME,
                key: config.aws.accessKeyId,
                Conditions: [
                    ['starts-with', '$key', name + "/"]
                ]
            }, function (err, data) {
                if(err){
                    callback(err, null);
                } else {
                    callback(null, JSON.stringify(data));
                }
            });
        }
    });

}