import express from 'express';
var trackerRouter = express.Router();
// import {db} from '../models/index.js'
// import handleJwt from '../middlewares/handleJwt.js'

import trackController from '../controllers/track.controllers.js'
// book-ride
// La tabla track guarda las diferentes posiciones de cada usuario del sistema
trackerRouter.get("/get", trackController.get);
// trackerRouter.update("/track-ride", trackController.post);
trackerRouter.post("/post", trackController.post);
trackerRouter.post("/update", trackController.update);
export default trackerRouter;
// module.exports = { route: trackerRouter, name: "track" };