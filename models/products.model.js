// models/user.model.js
// load những thư viện chúng ta cần
var mongoose = require('mongoose');

// định nghĩ cấu trúc user model
var Schema = mongoose.Schema;
var products = new Schema({
   
    image: {type: String, required: true},
    name: {type: String, required: true},
    soluong: {type: String, required: true},
    gianhap: {type: String, required: true},
    giaban: {type: String, required: true},
    ngaynhap: {type: Date, required:true}
}); 
module.exports = mongoose.model('products', products);