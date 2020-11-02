var express = require('express');
var product = express.Router();
const products = require("../models/products.model");
var multer  = require('multer');


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
        if(file.mimetype=="image/jpg" || file.mimetype=="image/PNG" || file.mimetype=="image/jpeg" || file.mimetype=="image/png" || file.mimetype=="image/gif"){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
  }).single("image");


  product.get("/product",(req,res)=>{
    let perPage = 12; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1; 
  
    products
      .find() // find tất cả các data
      .sort({ngaynhap: "descending"})
      .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
      .limit(perPage)
      .exec((err, data) => {
        products.countDocuments((err, count) => { // đếm để tính có bao nhiêu trang
          if (err) return next(err);
           res.render("user/product",{
             danhsach :data, 
             current: page, // page hiện tại
             pages: Math.ceil(count / perPage)
           }) // Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
        });
      });
  })
  product.get("/product/:page",(req,res)=>{
    let perPage = 12; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.params.page || 1; 
  
    products
      .find() // find tất cả các data
      .sort({ngaynhap: "descending"})
      .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
      .limit(perPage)
      .exec((err, data) => {
        products.countDocuments((err, count) => { // đếm để tính có bao nhiêu trang
          if (err) return next(err);
           res.render("user/product",{
             danhsach :data, 
             current: page, // page hiện tại
             pages: Math.ceil(count / perPage)
           }) // Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
        });
      });
  })

  product.get("/admin/list-product",(req,res)=>{
      if(req.session.loggin){
          user = req.user
          if(user.role =="admin"){
            let perPage = 12; // số lượng sản phẩm xuất hiện trên 1 page
            let page = req.params.page || 1; 
           
            products
              .find() // find tất cả các data
              .sort({ngaynhap: "descending"})
              .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
              .limit(perPage)
              .exec((err, data) => {
                
                products.countDocuments((err,count) => { // đếm để tính có bao nhiêu trang
                  if (err) return next(err);
                  var message = req.flash('error')
                   res.render("admin/list-product",{
                     danhsach :data, 
                     current: page, // page hiện tại
                     pages: Math.ceil(count / perPage)
                     
                   }) // Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
                });
              });
          }else{
              res.redirect("/home")
          }
      
      }else{
          res.redirect("/home")
      }
  
  })
  product.get("/admin/list-product/:page",(req,res)=>{

   if(req.session.loggin){
    user = req.user
       if(user.role =="admin"){
        let perPage = 12; // số lượng sản phẩm xuất hiện trên 1 page
        let page = req.params.page || 1; 
      
        products
          .find() // find tất cả các data
          .sort({ngaynhap: "descending"})
          .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
          .limit(perPage)
          .exec((err, data) => {
            products.countDocuments((err, count) => { // đếm để tính có bao nhiêu trang
              if (err) return next(err);
               res.render("admin/list-product",{
                 danhsach :data, 
                 current: page, // page hiện tại
                 pages: Math.ceil(count / perPage)
               }) // Trả về dữ liệu các sản phẩm theo định dạng như JSON, XML,...
            });
          });
       }else{
        res.redirect("/home")
    }
  
   }else{
       res.redirect("/home")
   }
  })

  product.get("/admin/insert-product",(req,res)=>{
      if(req.session.loggin){
          user = req.user
          if(user.role =="admin"){
            var message = req.flash('error')
            res.render("admin/insert-product",{
              message: message,
              hasErrors: message.length > 0,
             })
          }
          else{
            res.redirect("/home")}
      }else{
          res.redirect("/home")
      }
    
  })
  product.post("/insert",(req,res)=>{
    upload(req, res, function (err) {
      
      
      if (err instanceof multer.MulterError) {
        res.render("admin/insert-product",{
        message : "Không thể tải lên!!!"
      })
        
      } else if (err) {
        res.render("admin/insert-product",{
        message : "Định dạng file tải lên không hỗ trợ!!!"
      })
       
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
        res.render("admin/insert-product",{message : "Lỗi tải lên!!!"})
       }
       else{
         res.redirect("/admin/list-product");
       }
     })
      }
  });
  })
  product.get("/admin/edit-product/:id",(req,res)=>{
    if(req.session.loggin){
        user = req.user
        if(user.role =="admin"){
          var message = req.flash('error')
            products.findById( req.params.id, function(err,data){
                res.render("admin/edit-product",{ danhsach: data,
                  message: message,
                  hasErrors: message.length > 0,
                 });
            })
        }
        else{
          res.redirect("/home")}
    }else{
        res.redirect("/home")
    }
  
    });
  
  product.post("/edit-product",(req,res)=>{

    if(req.session.loggin){
        user = req.user
        if(user.role =="admin"){
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
                      res.render("admin/edit-product",{
                        message: "Cập nhật không thành công"
                      })
                    }else{
                      res.redirect("/admin/list-product");
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
                      res.redirect("/admin/edit-product",{
                        message: "Cập nhật không thành công"
                      })
                    }else{
                      res.redirect("/admin/list-product");
                    }
                  })
                }}
              })

        }
        else{
          res.redirect("/home")}
    }else{
        res.redirect("/home")
    }
  
  })
  product.get("/delete-product/:id",(req,res)=>{
    if(req.session.loggin){
      products.deleteOne( {_id:req.params.id}, function(err){
        if(err){
          res.redirect("/admin/list-product")
        
        }else{
         
          res.redirect("/admin/list-product")
    }


    })
  }
    else{
      res.redirect("/home")
    }
 


  })

module.exports = product