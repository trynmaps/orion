module.exports = {
  makeOrionVehicleFromNextbus: function (nextbusObject) {
    const {
      id,
      routeId,
      lat,
      lon,
      heading,
      directionId,
      secsSinceReport,
      leadingVehicleId,
    } = nextbusObject;
    return {
      rid: routeId,
      vid: id,
      lat,
      lon,
      heading,
      did: directionId,
      secsSinceReport,
      leadingVid: leadingVehicleId,
    };
  },
}
