// The above code handles updating the database with the user
// location and broadcasting it to the listening driver.
console.log("track-location")
console.log('Connection established');
import {updateDbWithNewLocation} from './helpers.js';
import {db} from '../models/index.js'
const hoistedIOTrack = (io, socket) => {
  console.log("tracksocket"+ socket);
  return async function trackLocation(payload) {
    console.log(`track-location event has been received with ${payload} 🍅🍋`);
    const pyl = JSON.parse(payload)
    console.log(pyl.id)
    const deliverTo = await db.Geolocation.findOne({
        where: { phonetrack: pyl.phonetrack },
    });
    //
    //
    if( deliverTo ) {
      try {
        await db.Geolocation.update({  
          socketID: socket.id,
          online: true,
          phonetrack: value.phone 
        }, {
          where: {
            phonetrack: value.phone
          }
        })
      } catch (e) {
        console.log(e)
      }
      const { socketID } = deliverTo.dataValues;
      io.to(socketID).emit("track-location", {
        location: deliverTo.location,
      });
    }
  }
}
export { hoistedIOTrack};