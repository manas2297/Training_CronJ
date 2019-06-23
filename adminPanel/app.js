var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var index = require('./routes/index');
let users = require('./routes/users');
var expressHbs = require('express-handlebars');
var mongoose = require ('mongoose');
let db = mongoose.connection;
const expressValidator = require('express-validator');
const flash = require('connect-flash'); 
const session = require('express-session');


db.once('open',function(){
  console.log('Connected to MongoDB');
})
db.on('error',function(err){
  console.log(err);
})
// var usersRouter = require('./routes/users');

var app = express();
mongoose.connect('mongodb://localhost:27017/adminP',{useNewUrlParser:true});
// view engine setup
app.engine('.hbs', expressHbs({defaultLayout : 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');
// const expressValidator = require('express-validator');
// app.use(expressValidator(customValidators));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//Express session

app.use(session({
  secret : 'keyboard cat',
  resave:false,
  saveUninitialized : true,
  cookie: {secure : true}

}));

// app.use(require('connect-flash')());
// app.use(function(req,res,next){
//   res.locals.messages = required('express-messages')(req,res);
//   next();
// })



//home route

app.use('/', index);

app.use('/users',users);
// app.use('/users', usersRouter);

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

module.exports = app;
