// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
import createError from 'http-errors'
import express from 'express'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import logger from 'morgan'
import cors from 'cors'
dotenv.config();
/// ReferenceError: __dirname is not defined in ES module scope; __filename?
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
///
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
import indexRouter from './routes/index.js'
import userRouter from './routes/users.js'
import trackerRouter from './routes/tracks.js'
// var history = require('connect-history-api-fallback');
import history from 'connect-history-api-fallback'
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(history)
app.use(history({
  rewrites: [
    {
      from: /^\/api\/v1\/.*$/,
      to: function(context) {
          return context.parsedUrl.path
      }
    }
  ]
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
})
app.use(cors({
  origin: '*'
}));
app.use('/', indexRouter);
app.use('/api/v1', indexRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/track', trackerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('Error', { title: 'AppError' });
  // next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;
export default app;