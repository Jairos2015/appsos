// const express = require('express');
import express from 'express'
const indexRouter = express.Router();
// import indexController from '../controllers/index.controllers.js'
import { listar } from '../controllers/index.controllers.js'

/* GET home page. */
indexRouter.get('/', listar);

// module.exports = indexRouter;
export default indexRouter;
