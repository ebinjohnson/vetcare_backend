var mongoose = require("mongoose");
var appointmentSchema = new mongoose.Schema({
  AppointName: {
    type: String,
  },
  AppointPhone: {
    type: Number,
  },
  AppointPet: {
    type: String,
  },
  AppointHospital: {
    type: String,
  },
  AppointDate: {
    type: String,
  },
  AppointTime: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "canceled"],
    default: "active",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});
module.exports = mongoose.model("appointments", appointmentSchema);
