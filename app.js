var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors = require('cors');
var mysql = require('mysql')
require('dotenv').config();
const dbName = 'node'
var app = express();
// var Database = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   // database:dbName
// })

// Database.connect(function(err) {
//   if (err) throw err;
//   Database.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, function (err, result) {
//     if (err) console.log(JSON.stringify(err));
//     console.log("Connected!");
//     // console.log("Database created", result);
//   });
// });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(cors());


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
