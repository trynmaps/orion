const cassandraBatch = require('./cassandraHelper');

function addVehiclesToCassandra(vehicles, keyspace, table) {
  const vtime = new Date(Date.now());
  const vhour = vtime.getHours();
  const vdate = vtime.toISOString().slice(0, 10);
  const queries = vehicles
    .map(vehicle => {
      const { rid, vid, lat, lon, heading } = vehicle;
      return rid, vid, lat, lon, heading && {
        query: `INSERT INTO ${keyspace}.${table} (vdate, vhour, rid, vid, vtime, lat, lon, heading) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [vdate, vhour, rid, vid, vtime, lat, lon, heading],
      };
    })
    .filter(vehicle => vehicle);
  return cassandraBatch(queries);
}

module.exports = addVehiclesToCassandra;
