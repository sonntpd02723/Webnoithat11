var express = require("express")
var client = express.Router()

client.get("/client",(req,res)=>{
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
  client.get("/admin/clientadmin",(req,res)=>{
    if(req.session.loggin){
      res.render('admin/clientadmin', {   
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
module.exports = client