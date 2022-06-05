var mongoose = require("mongoose");
let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let fulldate = year + "-" + month + "-" + date;
var complaintSchema = new mongoose.Schema({
  userEmail: {
    type: String,
  },
  userPhone: {
    type: Number,
  },
  doi: {
    type: String,
  },
  subject: {
    type: String,
  },
  location: {
    type: String,
  },
  description: {
    type: String,
  },
  doc: {
    type: String,
    default: fulldate,
  },
  status: {
    type: String,
    enum: ["pending", "forwared", "rejected", "action taken"],
    default: "pending",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});
module.exports = mongoose.model("complaints", complaintSchema);
