// const { hoistedIODriver } = require("./driversocket");
// const { hoistedIOUser } = require("./usersocket");
// const { hoistedIODevice } = require("./devicesocket");
import {hoistedIOAdmin} from './adminsocket.js'
import {hoistedIODevice} from './devicesocket.js'
import {hoistedIODriver} from './driversocket.js'
import {hoistedIOMonitor} from './monitorsocket.js'
import {hoistedIOUser} from './usersocket.js'
import {hoistedIOVisor} from './visorsocket.js'

const configureSockets = (io, socket) => {
  return {
    adminLocation: hoistedIOAdmin(io, socket),
    deviceLocation: hoistedIODevice(io, socket),
    driverLocation: hoistedIODriver(io, socket),
    monitorLocation: hoistedIOMonitor(io, socket),
    userLocation: hoistedIOUser(io, socket),
    visorLocation: hoistedIOVisor(io, socket),
  };
};
const onConnection = (io) => (socket) => {
  console.log("Datos socket")
  console.log(socket.id)
  const { userLocation, driverLocation, deviceLocation, monitorLocation, adminLocation, visorLocation } = configureSockets(io, socket);
  console.log("Sistema de conexion sockets.io...");
  socket.on("user-location", userLocation);
  socket.on("monitor-location", monitorLocation);
  socket.on("visor-location", visorLocation);
  socket.on("device-location", deviceLocation);
  socket.on("admin-location", adminLocation);
  socket.on("driver-location", driverLocation);
  socket.on('disconnect', () => {
    console.log('Disconnected');
  });
};
export { onConnection };