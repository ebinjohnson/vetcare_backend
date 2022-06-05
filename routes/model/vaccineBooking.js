var mongoose = require("mongoose");
var vaccinelistSchema = new mongoose.Schema({
  hospitalId: {
    type: String,
  },
  userName: {
    type: String,
  },
  userId: {
    type: String,
  },
  hospitalName: {
    type: String,
  },
  vaccineName: {
    type: String,
  },
  vaccineDate: {
    type: String,
  },
  vaccineAnimal: {
    type: String,
  },
});
module.exports = mongoose.model("vaccineBooking", vaccinelistSchema);
