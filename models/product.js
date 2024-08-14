const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Product', productSchema);