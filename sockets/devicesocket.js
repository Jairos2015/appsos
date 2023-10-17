// The above code handles updating the database with the user
// location and broadcasting it to the listening driver.
console.log("device-location")
console.log('Connection established');
import {updateDbWithNewLocation} from './helpers.js';
import {db} from '../models/index.js'
const hoistedIODevice = (io, socket) => {
  console.log("devicesocket"+ socket);
  return async function deviceLocation(payload) {
    console.log(
      `device-move event has been received with ${payload} 🍅🍋`
    );
    const pyl = JSON.parse(payload)
    console.log(pyl.id)
    // console.log(payload.id)
    // const isOnline = await db.Geolocation.findByPk(pyl);
    // console.log(payload.id)
    const isOnline = await db.Geolocation.findByPk(pyl.id);
    if (isOnline.dataValues.online) {
      const recipient = await updateDbWithNewLocation(payload, isOnline);
      if (recipient.trackerID) {
        const deliverTo = await db.Geolocation.findOne({
          where: { trackerID: recipient.trackerID },
        });
        const { socketID } = deliverTo.dataValues;
        io.to(socketID).emit("device-location", {
          location: recipient.location,
        });
      }
    }
  };
};
export { hoistedIODevice };