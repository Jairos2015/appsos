// const db = require("../models");
// import db from '../models/index.js'
import {db} from '../models/index.js'
const updateDbWithNewLocation = async (payload, oldGeoLocationInfo) => {
  const { id, socketID } = payload;
  // const [, [newLocation]] = await db.Geolocation.update(
    const [, [newLocation]] = await db.Geolocation.update(
    {
      online: oldGeoLocationInfo.online,
      socketID,
      trackerID: oldGeoLocationInfo.trackerID,
      location: {
        type: "Point",
        coordinates: [payload.coords.longitude, payload.coords.latitude],
      },
    },
    { where: { id }, returning: true }
  );
  return newLocation;
};
// module.exports = { updateDbWithNewLocation };
export { updateDbWithNewLocation }