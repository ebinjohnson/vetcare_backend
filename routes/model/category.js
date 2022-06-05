var mongoose = require("mongoose");
var categorylistSchema = new mongoose.Schema({
  catName: {
    type: String,
    unique: true,
  },
});
module.exports = mongoose.model("Category", categorylistSchema);
