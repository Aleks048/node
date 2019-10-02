var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require("express-session")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var register = require("./routes/register")
var messages = require("./lib/messages")
var login = require("./routes/login")
var entries = require("./routes/entries")


var user = require("./lib/middleware/user")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));//for logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));//like bodyparser
app.use(cookieParser("secret"));//cookieParser
app.use(express.static(path.join(__dirname, 'public')));//statics folder


app.use(session())//should be before the router
app.use('/', entries.list);
//app.use(user)
app.use('/users', usersRouter);
app.get("/register",register.form)
app.post("/register",register.submit)
app.get("/login",login.form)
app.post("/login",login.submit)
app.get("/logout",login.logout)
app.get("/post",entries.form)
app.post("/post",entries.submit)

//app.use(express.methodOverride)//???

app.use(messages)//should be behind the router


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

app.listen(3000)
module.exports = app;
