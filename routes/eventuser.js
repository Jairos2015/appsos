// La tabla eventuser muestra las diferentes posiciones del usuario que activa un aviso
import express from 'express';
var eventuserRouter = express.Router();
import eventuserController from '../controllers/eventuser.controllers.js'
import {handleJwt} from '../middlewares/handleJwt.js'
///
eventuserRouter.get('/myfriends', eventuserController.listmyfriends);
eventuserRouter.post('/addevent', userController.addevent);