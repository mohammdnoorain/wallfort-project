
const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
  plotid: {
    type:mongoose.Schema.Types.ObjectId,
      ref:"plotdetail"
  },
    name: {
      type: String,
      required: true
    }, 
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    query: {
      type: String // Removed the extra period after String
    },
    visitorstatus: {
       type: Boolean,
    default: false// Removed the extra period after String
    },
    querytype:{
      type:Boolean,
      default:true
    }
  },
  { timestamps: true }
);

const visitorcontact = mongoose.model("visitor", visitorSchema);
module.exports = visitorcontact;

