const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password:{
        type:String,
        required: true,
        default: "null"
    },
    creation_date:{
      type: Date,
      required: true,
      default: Date
  }
  },
  {
    timestamps: true,
  }
); 

var userModel = mongoose.model("user", userSchema, "user");

module.exports = userModel;