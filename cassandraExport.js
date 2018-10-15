const _ = require('lodash');
const writeToS3 = require('./s3Helper');
const executeQuery = require('./cassandraQueryHelper');
const getPrimaryKeys = require('./getPrimaryKeys');

// Export vehicles from Cassandra to S3 store

//for each hour of each day from October 1, 2017 to October 14, 2018
const startEpoch = 1506816000000;
const endEpoch = 1539475200000;

['muni', 'ttc', 'marin'].map(async agency => {
  for (time = startEpoch; time <= endEpoch; time += 1000 * 60 * 5) {
    // every 5 minute
    console.log(`${agency} - ${time}`);
    console.log(`${(time - startEpoch) / (endEpoch - startEpoch) * 100}%`);
  
    // this block ripped off from API resolver
    const primaryKeys = getPrimaryKeys(time, time + 1000 * 60 * 5);
    // TODO - get these from config file using agency name
    const keyspace = agency;
    const vehicleTableName = `${agency}_realtime_vehicles`;
    const responses = await Promise.all(primaryKeys.map(({vdate, vhour}) =>
        executeQuery(
        `SELECT * FROM ${keyspace}.${vehicleTableName} WHERE vdate = ? AND vhour = ? AND vtime > ? AND vtime < ?`,
        [vdate, vhour, new Date(time - 1000), new Date(time + 1000 * 60 * 5)],
    )));
    // vehicles are clustered by primary key - so put them into the same list
    const vehicles = _.flatten(responses.map(({rows}) => rows));

    // group by vtime, each vtime is its own file
    const vtimeToVehicles = {}
    for(vehicle in vehicles) {
      if (vtimeToVehicles[vehicle.vtime]) {
        vtimeToVehicles[vehicle.vtime].push(vehicle); 
        continue;
      }
      vtimeToVehicles[vehicle.vtime] = [];
    }
    await Promise.all(Object.keys(vtimeToVehicles).map(vtime => {
      return writeToS3(
        agency,
        vtime,
        vtimeToVehicles[vtime],
        false,
      );
    }));
  }
});




