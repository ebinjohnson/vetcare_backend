var mongoose = require("mongoose");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");
var OrderSchema = new mongoose.Schema({
  isPaid: Boolean,
  amount: Number,
  razorpay: {
    orderId: String,
    paymentId: String,
    signature: String,
  },
});
module.exports = mongoose.model("Order", OrderSchema);
