const AWS = require('aws-sdk');
var zlib = require('zlib');

const s3 = new AWS.S3();

function compressData(data) {
  return new Promise((resolve, _) => {
    return zlib.gzip(JSON.stringify(data), (_, encoded) => resolve(encoded));
  });
}

function writeToS3(agency, currentTime, data) {
  const currentDateTime = new Date(currentTime);
  const year = currentDateTime.getUTCFullYear();
  const month = currentDateTime.getUTCMonth()+1;
  const day = currentDateTime.getUTCDate();
  const hour = currentDateTime.getUTCHours();
  const minute = currentDateTime.getUTCMinutes();
  const second = currentDateTime.getUTCSeconds();
  const s3Bucket = process.env.ORION_S3_BUCKET;
  const s3Key = `${agency}/${year}/${month}/${day}/${hour}/${minute}/${second}/${agency}-${currentTime}.json.gz`;

  console.log(`writing s3://${s3Bucket}/${s3Key}`);

  return compressData(data).then(encodedData => {
    return new Promise((resolve, reject) => {
      s3.putObject({
        Bucket: s3Bucket,
        Key: s3Key,
        Body: encodedData,
        ContentType: "application/json",
        ContentEncoding: "gzip",
      }, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  });
};

module.exports = {
    writeToS3
};