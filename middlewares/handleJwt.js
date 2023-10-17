// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// const db = require("../models");
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {db} from '../models/index.js'

const handleJwt = {
  signToken: (data) => {
    try {
      const token = jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
      // console.log(token);
      return token;
    } catch (error) {
      console.log({ error });
      throw new Error("There was a problem verifying your token", error);
    }
  },

  verifyToken: async (req, res, next) => {
    const { body: { phone, password }, } = req;
    console.log(phone, password)
    console.log("VERIFICANDO TOKEN: ")
    const authHeader = req.headers['authorization'];
    // IF no auth headers are provided
    // THEN return 401 Unauthorized error
    if (!authHeader) {
      return res.status(401).json({
        status: false,
        error: {
          message: 'Auth headers not provided in the request.'
        }
      });
    }

    // IF bearer auth header is not provided
    // THEN return 401 Unauthorized error
    if (!authHeader.startsWith('Bearer')) {
      return res.status(401).json({
        status: false,
        error: {
          message: 'Invalid auth mechanism.'
        }
      });
    }

    const token = authHeader.split(' ')[1];
    // IF bearer auth header is provided, but token is not provided
    // THEN return 401 Unauthorized error
    if (!token) {
      ///
      // const { body: { phone, password }, } = req;
      if(phone) {
        try {
          
          // console.log("!token userVerify: ")
          const userVerify = await db.User.findOne({ where: { phone } });
          // console.log("userVerify: ")
          // console.log(userVerify)
          const verify = {
            nombre: userVerify.nombre,
            phone: userVerify.phone,
            lastFriends: userVerify.lastFriends,
            lastLocation: userVerify.lastLocation
          }
          req.userVerify = verify
          console.log("!token userVerify: " + JSON.stringify(userVerify));
          if ( req.body.phone !== userVerify.phone || !bcrypt.compareSync(req.body.password, userVerify.password)) {
            // console.log("req.body.password: " + req.body.password)
            // console.log("bcrypt: " + bcrypt.hashSync(req.body.password,10))
            console.log("userVerify.password: " + userVerify.password)
            // console.log('Credentials wrong')
            return res.status(403).json({
              status: false,
              error: 'Invalid credentias provided, please login again.'
            });
          } 
          console.log('fecha de expiración: ' + new Date(userVerify.exp * 1000) );
          next()
        } catch (e) {
          console.log("!token ERROR: " + e)
        }
        ///
        /*
        return res.status(401).json({
          status: false,
          error: {
            message: 'Bearer token missing in the authorization headers.'
          }
        })
        */
      } else {
        console.log('error: Invalid access token provided, please login again.')
        return res.status(403).json({
          status: false,
          error: 'Invalid access token provided, please login again.'
        });
      }
    } else {
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
          console.log('EXiste token: ' + token)
          console.log('Existe usuario: ' + JSON.stringify(user))
          let userVerify={}
          if (err) {
            // console.log("Desde jwt.verify: ", err)
            console.log('Credentials wrong')
            console.log('error: Invalid access token provided, please login again.' + err)
            return res.status(403).json({
              status: false,
              error: 'Invalid access token provided, please login again.'
            });
          }
          // Agregado para caso de uso con token diferente
          // console.log("req.body: " + JSON.stringify(req.body))
          // console.log("user: " + JSON.stringify(user))

          // user.set("password", undefined, { strict: false });
          try {
            const { body: { phone, password }, } = req;
            console.log("Jwt userVerify: ")
            console.log(phone,'  ',password)
            const userVerify = await db.User.findOne({ where: { phone } });
            console.log(userVerify.dataValues)
            const verify = {
              nombre: userVerify.nombre,
              phone: userVerify.phone,
              lastFriends: userVerify.lastFriends,
              lastLocation: userVerify.lastLocation
            }
            req.userVerify = verify
            console.log("userVerify: " + JSON.stringify(userVerify));
            if ( req.body.phone !== userVerify.phone || !bcrypt.compareSync(req.body.password, userVerify.password)) {
              // console.log("req.body.password: " + req.body.password)
              // console.log("bcrypt: " + bcrypt.hashSync(req.body.password,10))
              console.log("userVerify.password: " + user.password)
              // console.log('Credentials wrong')
              return res.status(403).json({
                status: false,
                error: 'Invalid credentias provided, please login again.'
              });
            } 
            console.log('fecha de expiración: ' + new Date(userVerify.exp * 1000) );
            next()
          } catch (e) {
            console.log("ERROR: " + e)
          }
          ///////
          // req.user = user; // Save the user object for further use
          // console.log('req.user: ' + JSON.stringify(req.user))
      });
    }
  },
  verifyGetToken: async (req, res, next) => {
    try {
      const BearerToken = req.headers.authorization;
      const token = BearerToken.split(" ")[1];
      console.log({ token });
      const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = user;
      return next();
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "there was a problem decoding the token",
        error,
      });
    }
  },
};

export { handleJwt };
