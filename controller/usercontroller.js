
require("dotenv").config();
const Userschema = require("../modal/usermodel.js");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../thirdpartyapi/nodemailer.js")




const LoginClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Userschema.findOne({ email: email });
    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }

    if (!user.password) {
      return res.send({
        success: false,
        message: "Password is required",
      });
    }

    if (user.password.toString() !== password.toString()) {
      return res.send({
        success: false,
        message: "Password does not match",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.secretkey, { expiresIn: "4d" });
    // console.log("Generated token:", token);

    return res.send({
      success: true,
      user: user,
      token: token,

      message: "Login successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};


const RegisterClient = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // const hash = await bcrypt.hash(password,10);

    const register = new Userschema({
      name: name,
      email: email,
      password: password,

    });

    const result = await register.save();
    // console.log("jii",result)
    return res
      .status(201)
      .send({ result, message: "Registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error." });
  }
};

//
// const RegisterClientschemaless = async (req, res) => {
//   try {
//     // Check if required properties exist in req.body
//     if (!req.body || !req.body.name || !req.body.email || !req.body.password) {
//       return res.status(400).send({ message: "Name, email, and password are required." });
//     }
//
//     // Destructure properties from req.body
//     const { name, email, password } = req.body;
//
//     // Create a new document without enforcing a specific schema
//     const registerschemaless = new User({
//       name: name,
//       email: email,
//       password: password
//     });
// console.log("milaaa", email);
//
//     // Save the document to the database
//     const result2 = await registerschemaless.save();
//
//     console.log("milaaa", result2);
//
//     return res.status(201).send({ result2, message: "Registered successfully." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: "Internal server error." });
//   }
// };

const Forgetpassword = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email)
    const user = await Userschema.findOne({ email: email });
    // console.log("user mila", user);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    } else {
      // req.session.userid = user._id;
      // req.session.user_type = user.user_type;
      const OTP = Math.random().toString().substring(2, 8);
      // console.log("otp",OTP)

      let data = await Userschema.findByIdAndUpdate(
        user._id,
        {
          $set: {
            otp: OTP,

          },
        },
        { new: true }
      );



      const email = user.email;
      await sendEmail(email, OTP);



      return res.status(201).send({ success: true, message: "otp sended", userid: user._id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("otp not send");
  }
}

const VerifyOtp = async (req, res) => {
  try {
    const { otp, id } = req.body; // Destructuring otp and id from request body
    // console.log("Received OTP:", otp);

    const user = await Userschema.findById(id); // Assuming Userschema is the model for your user collection

    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    if (user.otp === otp) {
      return res.status(201).send({ success: true, message: "OTP verified", user: user._id });
    } else {
      return res.status(404).send({ success: false, message: "OTP not verified" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).send({ success: false, message: "Internal server error" });
  }
};


const CreatePassword = async (req, res) => {

  try {
    // console.log(req.body)
    const { id, newpassword } = req.body;
    // console.log("id",id)
    // console.log(newpassword);
    const updatedUser = await Userschema.findByIdAndUpdate(
      id,
      {
        $set: {
          password: newpassword,
        },
      },
      { new: true }
    )

    if (updatedUser) {
      const token = jwt.sign({ _id: updatedUser._id }, process.env.secretkey, { expiresIn: "4d" });
      // console.log("Generated token:", token);

      res.status(200).send({
        success: true,
        message: "Password updated successfully",
        token: token,

      });
    } else {
      res.status(404).send({ success: false, message: "user not found" });
    }
  } catch (error) {
    console.error("Error updating password:", error);
    // Internal server error
    res.status(500).send("Internal server error");
  }


}

const VerifyToken = (req, res) => {
  try {
    res.send({ success: true, message: "token verified" })

  } catch (error) {
    console.log(error)
  }

}

module.exports = {

  RegisterClient,
  // RegisterClientschemaless,
  LoginClient,
  Forgetpassword,
  VerifyOtp,
  CreatePassword,
  VerifyToken

}
