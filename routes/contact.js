var express = require("express")
var contact = express.Router()

contact.get("/contact",(req,res)=>{
  
    res.render("user/contact")
    
});

module.exports = contact