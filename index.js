const axios = require('axios');
const s3Helper = require('./s3Helper');

const interval = 15000; // ms

var providerId = process.env.ORION_PROVIDER;

if (!providerId) {
    throw new Error("Missing ORION_PROVIDER environment variable");
}

console.log("Provider: " + providerId);

var providerIds = [
    'nextbus',
    'marin',
];

if (!providerIds.includes(providerId)) {
    throw new Error("Invalid provider: " + providerId);
}

const provider = require('./providers/' + providerId);
const agencyId = process.env.ORION_AGENCY_ID;
const providerAgencyId = process.env.ORION_PROVIDER_AGENCY_ID;

console.log("Provider agency id: " + providerAgencyId);
console.log("OpenTransit agency id: " + agencyId);
console.log("S3 bucket: " + process.env.ORION_S3_BUCKET);

// wait until the next multiple of 15 seconds
setTimeout(function() {
    setInterval(saveVehicles, interval);
    saveVehicles();
}, interval - Date.now() % interval);

function saveVehicles() {
  const currentTime = Date.now();

  provider.getVehicles(providerAgencyId)
    .then((vehicles) => {
        return s3Helper.writeToS3(agencyId, currentTime, vehicles);
    })
    .catch((err) => {
        console.log(err);
    });
}
