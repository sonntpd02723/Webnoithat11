var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var  passport = require('passport');
const userModel = require('../models/user.model');
const products = require('../models/products.model');
/* GET home page. */
router.get('/home', function(req,res,next){
  if(req.session.loggin){
    user = req.user
    if(user.role == "admin"){
           res.render("admin/index-admin")
         }else{
          products.find().sort({ngaynhap:"descending"}).exec(function(err,data){
            if(err){
              res.json({"kq":0, "errMsg":err});
            }else{
              res.render("user/index",{ danhsach:data });
            }
          })
         }
  
}else{
  products.find().sort({ngaynhap:"descending"}).exec(function(err,data){
    if(err){
      res.json({"kq":0, "errMsg":err});
    }else{
      res.render("user/index",{ danhsach:data });
    }
  })
}
})
 
/* GET sign-in page. */
router.get('/login', function(req, res, next) {
  // Hiển thị trang và truyển lại những tin nhắn từ phía server nếu có
  var message = req.flash('error')
  res.render('login',{ 
    message: message,
    hasErrors: message.length > 0,
   })
})
/* Post sign-up page. */
// Xử lý thông tin khi có người đăng nhập
router.post('/signin',
  passport.authenticate('local.signin', {
    successRedirect: '/home',
                                  failureRedirect: '/login',
                                  failureFlash: true })
                                
)

/*---------------Xoá tài khoản ------------------------*/

router.get("/delete-user/:id",(req,res)=>{
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
})

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
)

// =------------------ Đăng xuất ----------------------------//
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
})

module.exports = router
