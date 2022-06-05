var mongoose = require("mongoose");
var vaccinelistSchema = new mongoose.Schema({
  hospitalId: {
    type: String,
  },
  hospitalName: {
    type: String,
  },
  vaccineName: {
    type: String,
  },
  vaccineAnimal: {
    type: String,
  },
  vaccineDate: {
    type: String,
  },
  vaccineNumber: {
    type: String,
  },
});
module.exports = mongoose.model("vaccinelist", vaccinelistSchema);
