var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

// Mongodb+Monk
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/DB1');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var dbOperatonsRouter = require('./routes/dbOperations');
var restaurantsRouter = require('./routes/restaurantsDAO');
var reviewsRouter = require('./routes/reviewsDAO');
var photosRouter = require('./routes/photoDAO');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function (req, res, next) {
    req.db = db;
    next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
//dbOperatonsRouter仅仅测试用
// app.use('/restaurants', dbOperatonsRouter);
app.use('/restaurants', restaurantsRouter);
app.use('/reviews', reviewsRouter);
app.use('/photos', photosRouter);

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
