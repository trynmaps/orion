const axios = require('axios');
const config = require('./config');

const muni = require('./agencies/muni/muni');
const marin = require('./agencies/marin/marin');
const ttc = require('./agencies/ttc/ttc');

setInterval(updateVehicles, 15000);

function updateVehicles() {
  return Promise.all([muni, marin, ttc].map((agency) => {
    return agency();
  })).catch((err) => {
    console.log(err);
  });
}
