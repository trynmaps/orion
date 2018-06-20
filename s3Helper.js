const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const fs = require('fs');


AWS.config.loadFromPath('./prod-s3.json');

function writeToS3(agency, currentTime, data) {
  return new Promise((resolve, reject) => {
    s3.putObject({
      Bucket: agency,
      Key: `${agency}_${currentTime}.json`,
      Body: JSON.stringify(data), 
      ContentType: "application/json",
    }, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
};


module.exports = writeToS3;
