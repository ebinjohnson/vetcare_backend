var mongoose = require("mongoose");
var hospitalSchema = new mongoose.Schema({
  hospitalName: {
    type: String,
  },
  hospitalEmail: {
    type: String,
  },
  hospitalPhone: {
    type: String,
  },
  hospitalAddress: {
    type: String,
  },
  hospitalPincode: {
    type: Number,
  },
  hospitalType: {
    type: String,
  },
  status:{
    type:String,
    enum:["active","inactive"],
    default:"active"
  }
});
module.exports = mongoose.model("hospital", hospitalSchema);
