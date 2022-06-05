var mongoose = require("mongoose");
var productSchema = new mongoose.Schema({
  productCategory: {
    type: String,
  },
  productName: {
    type: String,
  },
  productPrice: {
    type: Number,
  },
  productDescription: {
    type: String,
  },
  productQuantity: {
    type: Number,
  },
  productImage: {
    type: String,
  },
  status: {
    type: String,
    enum: ["instock", "outofstock"],
    default: "instock",
  },
});
module.exports = mongoose.model("products", productSchema);
