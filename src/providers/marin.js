const _ = require('lodash');
const axios = require('axios');

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

const marinBaseUrl = "https://marintransit.net";

function getVehicles(/* config */) {
    return axios.get('/Region/0/Routes', {
      baseURL: marinBaseUrl
    })
      .then((response) => {
        const routes = response.data;
        return Promise.all(
          routes.map((route) => {
            routeNames[route.ID] = route.Name;
            return axios.get(`/Route/${route.ID}/Vehicles`, {
              baseURL: marinBaseUrl
            }).then((response) => {
              const vehicles = response.data;
              return vehicles.map(marinObject => makeVehicle(marinObject));
            });
          })
        );
      })
      .then((vehiclesArrays) => {
        return _.flatten(vehiclesArrays);
      });
}

function makeVehicle(marinObject) {
    // example vehicle:   {"ID":911,"APCPercentage":0,"RouteId":1237,"PatternId":12369,"Name":"620","HasAPC":true,"IconPrefix":"","DoorStatus":0,"Latitude":37.882944533652967,"Longitude":-122.52480902816679,"Coordinate":{"Latitude":37.882944533652967,"Longitude":-122.52480902816679},"Speed":26,"Heading":"S","Updated":"3:41:49P","UpdatedAgo":"2s ago"}

    // todo parse UpdatedAgo to secsSinceReport (could be e.g. 28m55s ago)

    const { ID, RouteId, Latitude, Longitude, Heading, PatternId } = marinObject;
    return {
      rid: routeNames[RouteId],
      vid: String(ID),
      lat: Latitude,
      lon: Longitude,
      heading: headingInDegrees[Heading],
      did: String(PatternId),
    };
}

module.exports = {
    getVehicles,
};
