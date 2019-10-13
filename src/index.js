const axios = require('axios');
const fs = require('fs');
const s3Helper = require('./s3Helper');

const interval = 15000; // ms

const configPath = process.env.ORION_CONFIG_PATH;
const configJson = process.env.ORION_CONFIG_JSON;

if (!configJson && !configPath) {
    throw new Error("Missing ORION_CONFIG_JSON or ORION_CONFIG_PATH environment variable");
}

let config;
if (configJson) {
    console.log("reading config from ORION_CONFIG_JSON");
    config = JSON.parse(configJson);
} else {
    console.log("reading config from " + configPath);
    config = JSON.parse(fs.readFileSync(configPath));
}

if (!config || !config.agencies || !config.agencies.length) {
    throw new Error("No agencies specified in config.");
}

if (!config.s3_bucket) {
    throw new Error("No s3_bucket specified in config.");
}

const providerNames = [
    'nextbus',
    'marin',
    'gtfs-realtime',
];

const s3Bucket = config.s3_bucket;
console.log("S3 bucket: " + s3Bucket);

var agenciesInfo = config.agencies.map((agencyConfig) => {
    const providerName = agencyConfig.provider;
    if (!providerNames.includes(providerName)) {
        throw new Error("Invalid provider: " + providerName);
    }

    const provider = require('./providers/' + providerName);

    const agencyId = agencyConfig.id;
    if (!agencyId) {
        throw new Error("Agency missing id");
    }

    console.log("Agency: " + agencyId + " (" + providerName + ")");

    return {
        provider: provider,
        id: agencyId,
        config: agencyConfig
    };
});

// wait until the next multiple of 15 seconds
setTimeout(function() {
    setInterval(saveVehicles, interval);
    saveVehicles();
}, interval - Date.now() % interval);

function saveVehicles() {
  const currentTime = Date.now();

  const promises = agenciesInfo.map((agencyInfo) => {
    return agencyInfo.provider.getVehicles(agencyInfo.config)
      .then((vehicles) => {
        return s3Helper.writeToS3(s3Bucket, agencyInfo.id, currentTime, vehicles);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  Promise.all(promises);
}
