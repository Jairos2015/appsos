// The above code handles updating the database with the user
// location and broadcasting it to the listening driver.
console.log("user-location")
console.log('Connection established');
import {updateDbWithNewLocation} from './helpers.js';
import {db} from '../models/index.js'
const hoistedIOUser = (io, socket) => {
  console.log("usersocket"+ socket);
  return async function userLocation(payload) {
    console.log(
      `user-location event has been received with ${payload} 🍅🍋 from ${payload.nombre}`
    );
    // const pyl = JSON.parse(payload)
    // const pyl = payload
    // payload llega como objeto
    // console.log(pyl.nombre)
    // io.to(pyl.nombre).emit("user-location", {
    // socket.join(pyl.nombre)
    // io.emit('user-location', {
      await socket.broadcast.emit('user-location', {
    //io.to(pyl.nombre).emit({
      eventName: payload.eventName,
      tipo: payload.tipo,
      location: payload.myLocation,
      phoneEvent: payload.phoneEvent,
      name: payload.nombre,
      msg: payload.msg
    });
    // const user = await db.User.create({  pais, dpto,  ciudad, barrio, vereda,nombre, phone, password: encryptedPassword, lastFriends,role: "user", lastLocation }, { transaction: t });
    try {
      const isEventUser = await db.EventUser.create({ 
        eventName:payload.eventName,
        estado:payload.estado,
        tipo:payload.tipo,
        phoneEvent: payload.phoneEvent,
        activa: true,
        comments: payload.msg,
        location: payload.myLocation
      });
      if (isEventUser) {
        await socket.broadcast.emit('monitor-location', {
          //io.to(pyl.nombre).emit({
            eventName: payload.eventName,
            location: payload.myLocation,
            phoneEvent: payload.phoneEvent,
            name: payload.nombre,
            msg: payload.msg
          });
      }
    } catch(e){

    }
    // console.log(payload.id)
    // const isOnline = await db.Geolocation.findByPk(pyl);
    // console.log(payload.id)
    /*
    const isOnline = await db.Geolocation.findByPk(pyl.id);
    if (isOnline.dataValues.online) {
      const recipient = await updateDbWithNewLocation(payload, isOnline);
      if (recipient.trackerID) {
        const deliverTo = await db.Geolocation.findOne({
          where: { trackerID: recipient.trackerID },
        });
        const { socketID } = deliverTo.dataValues;
        io.to(socketID).emit("user-location", {
          location: recipient.location,
        });
      }
    }
    */
  };
};
const otroIOUser = (io, socket) => {

}
export { hoistedIOUser };