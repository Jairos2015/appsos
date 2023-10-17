// The above code handles updating the database
//  with the driver location and broadcasting it to the listening user.
// const { updateDbWithNewLocation } = require("./helpers");
// const db = require("../models");
import {updateDbWithNewLocation} from './helpers.js';
// const { updateDbWithNewLocation } = require("./helpers");
// const db = require("../models");
import {db} from '../models/index.js'
const hoistedIODriver = (io, socket) => {
  console.log("driversocket"+ socket);
  return async function driverLocation(payload) {
    console.log(`driver-location event has been received with ${payload} 🐥🥶`);
    // const isOnline = await db.Geolocation.findByPk(payload.id);
    const pyl = JSON.parse(payload)
    console.log(pyl.id)
    // console.log(payload.id)
    const isOnline = await db.Geolocation.findByPk(pyl.id);
    if (isOnline.dataValues.online) {
      const recipient = await updateDbWithNewLocation(payload, isOnline);
      if (recipient.trackerID) {
        const deliverTo = await db.Geolocation.findOne({
          where: { trackerID: recipient.trackerID },
        });
        const { socketID } = deliverTo.dataValues;
        // Envie a todos los clientes excepto al emisor
        io.to(socketID).emit("driver-location", {
          location: recipient.location,
        });
      }
    }
  };
};
export { hoistedIODriver };