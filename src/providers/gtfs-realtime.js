var request = require('request');
var GtfsRealtimeBindings = require('gtfs-realtime-bindings');

function getVehicles(config) {
    const url = config.gtfs_realtime_url;
    console.log('fetching vehicles from ' + url);

    var requestSettings = {
      method: 'GET',
      url: url,
      encoding: null
    };

    return new Promise((resolve, reject) => {
        request(requestSettings, function (error, response, body) {
          if (error) {
            reject(error);
          } else if (response.statusCode == 200) {
            const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
            const vehicles = [];
            const feedTimestamp = feed.header.timestamp;
            feed.entity.forEach(function(entity) {
              const gtfsVehiclePosition = entity.vehicle;
              if (gtfsVehiclePosition
                && gtfsVehiclePosition.trip
                && gtfsVehiclePosition.position
                && gtfsVehiclePosition.vehicle) {
                vehicles.push(makeVehicle(gtfsVehiclePosition, feedTimestamp));
              }
            });
            resolve(vehicles);
          } else {
            reject(new Error("HTTP " + response.statusCode + " fetching gtfs-realtime feed from " + url));
          }
        });
    });
}

function makeVehicle(gtfsVehiclePosition, feedTimestamp) {
    // GTFS-Realtime API returns vehicles like this:
    // VehiclePosition {
    //   trip: TripDescriptor { tripId: '9420711', routeId: '190' },
    //   position:
    //    Position {
    //      latitude: 45.52998733520508,
    //      longitude: -122.66744232177734,
    //      bearing: 121 },
    //   currentStopSequence: 10,
    //   currentStatus: 1,
    //   timestamp: 1571000916,
    //   stopId: '11507',
    //   vehicle: VehicleDescriptor { id: '230', label: 'Yellow Line to City Ctr/Milw' } }

    const {
      trip,
      position,
      stopId,
      vehicle,
      timestamp,
      currentStopSequence,
      currentStatus,
    } = gtfsVehiclePosition;

    const orionVehicle = {
      rid: trip.routeId,
      vid: vehicle.id,
      lat: Math.round(position.latitude*100000)/100000, // 14 digits of lat/lon precision is a bit overkill :0 https://xkcd.com/2170/
      lon: Math.round(position.longitude*100000)/100000,
      heading: position.bearing,
      tripId: trip.tripId,
      stopIndex: currentStopSequence,
      status: currentStatus,
      secsSinceReport: (feedTimestamp != null && timestamp != null) ? Math.max(0, feedTimestamp - timestamp) : null,
    };

    if (stopId != '') {
      orionVehicle.stopId = stopId;
    }
    if (vehicle.label != '') {
      orionVehicle.label = vehicle.label;
    }

    return orionVehicle;
}

module.exports = {
   getVehicles,
};
