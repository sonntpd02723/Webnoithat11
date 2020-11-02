var express = require("express");
var cart = express.Router()

cart.get("/cart",(req,res)=>{
    res.render("user/cart")
  })
  cart.get("/Detailproducts",(req,res)=>{
    res.render("user/Detailproducts")
  })

module.exports = cart