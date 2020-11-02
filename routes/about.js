var express = require("express")
var about = express.Router()

about.get("/about",(req,res)=>{
  
    res.render("user/about")
    
});
module.exports = about