require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var logger = require('morgan');
var ejs = require("ejs");

var products = require("./models/products.model");
var passport = require('passport');
var flash = require('connect-flash');
var app = express();
// var indexRouter = require('./routes/users');
var jwt =require("jsonwebtoken");
var router = require("./routes/users.js")
var product = require('./routes/product.js');
var client = require('./routes/client.js');
var about = require('./routes/about.js');
var cart = require('./routes/cart.js');
var contact = require('./routes/contact.js');
// var router = require('./routes/client.js');
// path database
var config = require('./config/server.js');
var mongoose = require('mongoose');
mongoose.connect(config.url);

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


app.get('/', function(req,res,next){
  // if(req.session.loggin){
  products.find().sort({ngaynhap:"descending"}).exec(function(err,data){
    if(err){
      res.json({"kq":0, "errMsg":err});
    }else{
      res.render("user/index",{ danhsach:data });
    }
  })
// }else{

// }
})
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use("/", router);
app.use("/", contact);
app.use("/", about);
app.use("/", client);
app.use("/", cart);
app.use("/", product);
// catch 404 and forward to error handler


// error handler
app.listen(3000,(req,res)=>{
  console.log("truy cập localhost:3000")
})

