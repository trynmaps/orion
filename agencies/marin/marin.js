const _ = require('lodash');
const axios = require('axios');
const addVehiclesToCassandra = require('../../vehicleUpdater');
const marinConfig = require('./marinConfig');

/*
 * Marin API requires us to get all their routes,
 * and then get vehicle by route
 * 
 * Sample:
 * 
 * GET https://marintransit.net/Region/0/Routes
 * GET https://marintransit.net/Route/16/Vehicles
 * 
 * TODO - add documentation once it becomes available
 * (these endpoints were found via Chrome Devtools on 
 * their website, so this could break at any time)
 */

const routeNames = {}
function updateMarinVehicles() {
  return axios.get('/Region/0/Routes', {
    baseURL: marinConfig.baseURL
  })
    .then((response) => {
      const routes = response.data;
      return Promise.all(
        routes.map((route) => {
          routeNames[route.ID] = route.Name;
          return axios.get(`/Route/${route.ID}/Vehicles`, {
            baseURL: marinConfig.baseURL
          }).then((response) => {
            return response.data;
          });
        })
      );
    })
    .then((vehicles) => {
      console.log(vehicles);
      return _.flatten(vehicles).map(makeOrionVehicleFromMarin);
    })
    .then((vehicles) => {
      return addVehiclesToCassandra(
        vehicles,
        marinConfig.keyspace,
        marinConfig.vehicleTable,
      );
    })
    .catch((error) => {
      console.log(error);
    });
}

const headingInDegrees = {
  N: 0,
  NE: 45,
  E: 90,
  SE: 135,
  S: 180,
  SW: 225,
  W: 270,
  NW: 315,
};
function makeOrionVehicleFromMarin(marinObject) {
  const { ID, RouteId, Latitude, Longitude, Heading, PatternID } = marinObject;
  return {
    rid: routeNames[RouteId],
    vid: String(ID),
    lat: Latitude,
    lon: Longitude,
    heading: headingInDegrees[Heading],
    did: PatternID,
  };
}

module.exports = updateMarinVehicles;
