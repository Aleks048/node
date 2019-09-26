var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var photos = require("./routes/photos")
var multipart = require("connect-multiparty")

var app = express();

// view engine setup
if (process.env.NODE_ENV =="dev"){//to check what is the environment
  console.log("dev")
  app.set("photos",__dirname+"/public/photos")
  app.enable(trSetting)//the same as app.set(setting,true)
}
app.get("/",photos.list)

app.set("photos",__dirname+"/public/photos")//add the photos variable to app.local //where the uploaded photos will be saved
app.set('views', path.join(__dirname, 'views'));//sets the lookup directory for the views
app.set('view engine', 'ejs');// this sets the main template engine// this way we can use it without extensions

//the upload form
app.get("/upload",photos.form)
app.post("/upload",multipart(),photos.submit(app.get("photos")))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
