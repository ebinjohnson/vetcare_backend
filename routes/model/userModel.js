var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique:true
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
  },
  status:{
    type:String,
    enum:["active","inactive"],
    default:"active"
  },
  role:{
    type:String,
    enum:["admin","user"],
    default:"user"
  }
});

userSchema.pre("save", function (next) {
  var user = this;
  var SALT_FACTOR = 10; // 12 or more for better security

  if (!user.isModified("password")) return next();

  //console.log(user.password); // Check accident password update

  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      //console.log(user.password);
      next();
    });
  });
});
module.exports = mongoose.model("users", userSchema);
