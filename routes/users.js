// var express = require('express');
import express from 'express';
var userRouter = express.Router();
import userController from '../controllers/user.controllers.js'
import {handleJwt} from '../middlewares/handleJwt.js'
/* GET users listing. */
/*
userRouter.get('/', function(req, res, next) {
  res.send('respond with a resource get');
});
*/
/*
const middlwareFunction = (req,res,next) => {
  console.log('Middleware executed');
  console.log(req.body)
  next()
}
*/

userRouter.get('/', userController.get);
userRouter.post('/signup', userController.signup);
userRouter.post('/login', handleJwt.verifyToken, userController.login);
userRouter.post('/friends', handleJwt.verifyGetToken, userController.friends);
userRouter.post('/datos', userController.bulkInsert);
// userRouter.post('/login',middlwareFunction , userController.login);
userRouter.put('/:id', userController.put);
userRouter.delete('/:id', userController.delete);
export default userRouter;
