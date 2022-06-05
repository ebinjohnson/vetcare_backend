var mongoose = require("mongoose");
var cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
  },
  quantity: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["pending", "ordered","cancelled"],
    default: "pending",
  },
  orderDate:{
    type:String,
  }
});
module.exports = mongoose.model("Cart", cartSchema);
