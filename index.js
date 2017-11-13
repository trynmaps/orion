const axios = require('axios');
const config = require('./config');

const muni = require('./agencies/muni/muni');
const marin = require('./agencies/marin/marin');

setInterval(updateVehicles, 15000);

function updateVehicles() {
  return Promise.all([muni, marin].map((agency) => {
    return agency();
  })).catch((err) => {
    console.log(err);
  });
}
