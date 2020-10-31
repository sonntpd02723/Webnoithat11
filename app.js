require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var logger = require('morgan');
var ejs = require("ejs");
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var app = express();
var indexRouter = require('./routes/users');
var jwt =require("jsonwebtoken")
// path database
mongoose.connect('mongodb://localhost/BanHang', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
require('./config/passport'); //vượt qua passport để config trang đăng nhâp/đăng ký
app.use(session({
  secret: 'adsa897adsa98bs',
  resave: false,
  saveUninitialized: false,
}))
app.use(flash());
app.use(passport.initialize())
app.use(passport.session());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler


// error handler

http.createServer(function (req, res) { 
  res.writeHead(200, { 'Content-Type': 'text/html' }); 

  // req.url stores the path in the url 
  var url = req.url; 
  if (url === "/") { 
// fs.readFile looks for the html file 
// the first parameter is the path to the html page 
// the second is the call back function 
// if no file is found the function gives an err 
// if the file is successfully found, the content of the file are contained in pgres 
      fs.readFile("head.html", function (err, pgres) { 
          if (err) 
              res.write("HEAD.HTML NOT FOUND"); 
          else { 
              // The following 3 lines 
              // are reponsible for sending the html file 
              // and ends the response process 
              res.writeHead(200, { 'Content-Type': 'text/html' }); 
              res.write(pgres); 
              res.end(); 
          } 
      }); 
  } 
  else if (url === "/tailPage") { 
      fs.readFile("tail.html", function (err, pgres) { 
          if (err) 
              res.write("TAIL.HTML NOT FOUND"); 
          else { 
              res.writeHead(200, { 'Content-Type': 'text/html' }); 
              res.write(pgres); 
              res.end(); 
          } 
      }); 
  } 

}).listen(process.env.PORT || 3000, function () { 
  console.log("SERVER STARTED PORT: 3000"); 
});

