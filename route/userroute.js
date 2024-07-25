const express = require("express");
const usercontroller = require("../controller/usercontroller");

const user = express.Router(); 

user.post("/register-client", usercontroller.RegisterClient);

// user.post("/register-client-schema""less", usercontroller.RegisterClientschemaless);

user.post("/login-client", usercontroller.LoginClient);
user.post("/forget",usercontroller.Forgetpassword);
user.post("/verify-otp",usercontroller.VerifyOtp);
user.post("/newpassword",usercontroller.CreatePassword)
user.post("/verify-token",usercontroller.VerifyToken)

module.exports = user;
