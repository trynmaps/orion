const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const config = require('./config');
AWS.config.loadFromPath('./prod-s3.json');

function writeToS3(agency, currentTime, data, isRaw) {
  // TODO - in the future, gzip isRaw files
  const currentDateTime = new Date(currentTime);
  const year = currentDateTime.getUTCFullYear();
  const month = currentDateTime.getUTCMonth()+1;
  const day = currentDateTime.getUTCDate();
  const hour = currentDateTime.getUTCHours();
  const minute = currentDateTime.getUTCMinutes();
  const second = currentDateTime.getUTCSeconds();
  return new Promise((resolve, reject) => {
    s3.putObject({
      Bucket: `${isRaw ? "orion-raw" : "orion-vehicles"}${config.dev ? "-dev" : ""}`,
      Key: `${agency}/${year}/${month}/${day}/${hour}/${minute}/${second}/${agency}-${currentTime}.json`,
      Body: JSON.stringify(data), 
      ContentType: "application/json",
    }, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
};


module.exports = writeToS3;
