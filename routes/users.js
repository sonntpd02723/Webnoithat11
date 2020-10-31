const { render } = require('ejs');
const { response } = require('express');
var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var  passport = require('passport');
var jwt = require("jsonwebtoken")
var mongoose = require("mongoose");
var nodemailer = require("nodemailer");
mongoose.connect('mongodb://localhost/BanHang', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
const products = require("../models/products.model");
var multer  = require('multer');
const userModel = require('../models/user.model');
const { update } = require('../models/products.model');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()  + "-" + file.originalname)
  }
}); 
var upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
      console.log(file);
      if(file.mimetype=="image/jpg" || file.mimetype=="image/PNG" || file.mimetype=="image/jpeg" || file.mimetype=="image/png"){
          cb(null, true)
      }else{
          return cb(new Error('Only image are allowed!'))
      }
  }
}).single("image");
/* GET home page. */

router.get('/', function(req,res,next){
  products.find().sort({ngaynhap:"descending"}).exec(function(err,data){
    if(err){
      res.json({"kq":0, "errMsg":err});
    }else{
      res.render("index",{ danhsach:data });
    }
  })
})
 
/* GET sign-in page. */
router.get('/login', function(req, res, next) {
  // Hiển thị trang và truyển lại những tin nhắn từ phía server nếu có
  var message = req.flash('error')
  res.render('login',{ 
    message: message,
    hasErrors: message.length > 0,
   })
});
/* Post sign-up page. */
// Xử lý thông tin khi có người đăng nhập
router.post('/signin',
  passport.authenticate('local.signin', {successRedirect: '/client',
                                  failureRedirect: '/login',
                                  failureFlash: true })
                                
);

/*---------------Xoá tài khoản ------------------------*/


router.get("/deleteuser/:id",(req,res)=>{
  if(req.session.loggin){
    userModel.deleteOne( {_id:req.params.id}, function(err,data){
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    })
  }
});
/* Post sign-up page. */
// Xử lý thông tin khi có người đăng nhập
/* Post sign-up page. */
// Xử lý thông tin khi có người đăng ký
router.post('/signup', 
[
  check('email', 'Email không được để trống').isEmail(),
  check('password', 'Mật khẩu phải có ít nhất 5 ký tự').isLength({ min: 5 })
  ],
  (function (req, res, next) {

  var message = req.flash('error');
  const result= validationResult(req);
  var errors=result.errors;
  if (!result.isEmpty()) {
    var message = [];
    errors.forEach(function(error){
      message.push(error.msg);
    });
    res.render('login',{
      message: message,
      hasErrors: message.length > 0,
    });
  }else{
     next();
  }
  }),
  passport.authenticate('local.signup', { successRedirect: '/login',
                                  failureRedirect: 'login',
                                  failureFlash: true })
);

router.get("/product",(req,res)=>{
  let perPage = 4; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 1; 

  products
    .find() // find tất cả các data
    .sort({ngaynhap: "descending"})
    .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
    .limit(perPage)
    .exec((err, data) => {
      products.countDocuments((err, count) => { // đếm để tính có bao nhiêu trang
        if (err) return next(err);
         res.render("product",{
           danhsach :data, 
           current: page, // page hiện tại
           pages: Math.ceil(count / perPage)
         }) // Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
      });
    });
})
router.get("/product/:page",(req,res)=>{
  let perPage = 4; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.params.page || 2; 

  products
    .find() // find tất cả các data
    .sort({ngaynhap: "descending"})
    .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
    .limit(perPage)
    .exec((err, data) => {
      products.countDocuments((err, count) => { // đếm để tính có bao nhiêu trang
        if (err) return next(err);
         res.render("product",{
           danhsach :data, 
           current: page, // page hiện tại
           pages: Math.ceil(count / perPage)
         }) // Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
      });
    });
})
// router.get("/listproduct",(req,res)=>{
//  var page = req.query.page || 1;
//  var PAGE_SIZE = 2;
// if(page){
//   page = parseInt(page) 
//   if(page <1){
//     page = 1
//   }
//   var skip = (page -1) * PAGE_SIZE
//   products.find()
//   .sort({ngaynhap: "descending"})
//   .skip(skip)
  
//   .limit(PAGE_SIZE)
//   .then(data=>{
//     res.send(data);
//   })
//   .catch(err=>{
//     res.status(500).json("lỗi");
//   })
// }else{
//   products.find()
//   .then(data=>{
// res.send(data);
//   })
//   .catch(err=>{
//     res.status(500).json("lỗi");
//   })
// }
// })
router.get("/admin/insertproduct",(req,res)=>{
  res.render("admin/insertproduct")
})
router.post("/insert",(req,res)=>{
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log("A Multer error occurred when uploading."); 
    } else if (err) {
      console.log("An unknown error occurred when uploading." + err);
    }else{
   var product = products({
 
    image: req.file.filename,
    name: req.body.name,
    soluong: req.body.soluong,
    gianhap:req.body.gianhap,
    giaban: req.body.giaban,
    ngaynhap: Date.now()
   });
   product.save(function(err){
     if(err){
console.log("lỗi")
     }
     else{
       res.redirect("/product");
     }
   })
    }
});
})
router.get("/admin/editproduct/:id",(req,res)=>{
  products.findById( req.params.id, function(err,data){
      res.render("admin/editproduct",{ danhsach:data });
  })
  });

router.post("/editproduct",(req,res)=>{
upload(req,res,function(err){
  if(!req.file){
    products.updateOne({_id: req.body.id},{
    
    name: req.body.name,
    soluong: req.body.soluong,
    gianhap:req.body.gianhap,
    giaban: req.body.giaban,
    ngaynhap: Date.now()
    },function(err){
      if(err){
        res.json({"kq":0, "errMsg": err});
      }else{
        res.redirect("../product");
      }
    })
  
  }else{
  if(err instanceof multer.MulterError){
    res.json({"kq":0, "errMsg": "aaaaa"})
  }else{
    products.updateOne({_id: req.body.id},{
      image: req.file.filename,
    name: req.body.name,
    soluong: req.body.soluong,
    gianhap:req.body.gianhap,
    giaban: req.body.giaban,
    ngaynhap: Date.now()
    },function(err){
      if(err){
        res.json({"kq":0, "errMsg": err});
      }else{
        res.redirect("../product");
      }
    })
  }}
})
})
router.get("/delete/:id",(req,res)=>{
  products.deleteOne( {_id:req.params.id}, function(err,data){
    if(err){
      res.json({"kq":0, "errMsg": err});
    }else{
      res.redirect("../product");
    }
  })
})
router.get("/about",(req,res)=>{

res.render("about")

  });


router.get("/contact",(req,res)=>{
if(req.session.role =="admin"){
  res.render("contact");
}else{
  res.send("admin ms đc")
}
     
 
  
})
router.get("/test",(req,res,next)=>{
  console.log(req.cookies.token)
 next() 
},(req,res,next)=>{
  res.json("test")
})
router.get("/client",(req,res)=>{
  if(req.session.loggin){
    res.render('client', {   

      user : req.user   
 
  })
 
  }else{
    var message = req.flash('error');
    
   res.render("login",{
    message: message,
    hasErrors: message.length > 0,
   })
  }
})
router.get('/logout', function (req, res, next) {
  
  req.logout();
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/login');
      }
    });
  }
});



  

module.exports = router;
