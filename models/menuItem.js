const mongoose = require('mongoose');
const config = require('../config/database');


const MenuSchema = mongoose.Schema({
    name: {
      type: String
    },
    price: {
      type: Number,
      required: true
    },
    priceTag: {
      type: String,
      required: true
    },
    
    category: {
      type: String,
      required: true
    }
  });

  const menuItem = module.exports = mongoose.model('menuItem', MenuSchema);

//module.exports.addItem = function(newItem, callback) {
 // newItem.save(callback);
//}