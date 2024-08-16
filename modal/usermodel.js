const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String,required:true },
    email: { type: String,required: true,unique: true,   },

    password: { type: String,required:true },
    mobile:{type:String},
  otp: {
      type: String,
    },
    otpExpiration: {
      type: Date,
    },

  
  },

);
const Login = mongoose.model("practiceschemas", userSchema);
module.exports = Login;
