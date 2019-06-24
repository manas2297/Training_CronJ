var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
var index = require('./routes/index');
let users = require('./routes/users');
let admin  = require('./routes/admin');
const config = require('./config/database');
var expressHbs = require('express-handlebars');
var mongoose = require ('mongoose');
const Validator = require('express-validator');
const flash = require('connect-flash'); 
const session = require('express-session');


mongoose.connect(config.database,{useNewUrlParser : true});
let db  = mongoose.connection;



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
  saveUninitialized : false

}));
app.use(flash());
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*',function(req,res,next){
  res.locals.user = req.isAuthenticated() || null;
  next();
})
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
