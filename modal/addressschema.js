
const mongoose = require("mongoose");

const allSchema = new mongoose.Schema(
  {
    Plotnumber: {
      type: String,
      required: true,
      unique: true,
    },
    Rate: {
      type: Number,
      required: true,
    },
    BasicAmount: {
      type: Number,
   
    },

    PropertySize: {
      type: String,
      required: true,
    },
    Availability: {
      type: String,
      default: false,
    },
    Club: {
      type: String,
      // required: true,
    },
    Maintainance: {
      type: String,
      // required: true,
    },
    Electricity: {
      type: String,
      required: true,
    },
    ElectricityRate:{

      type:String,
      required:true,
    },
    Plc: {
      type: [String],
      required: true,
    },
    PlcAmount: {
      type: Number,
      required: true,
    
    },
    Other: {
      type: String,
      required: true,
    },
    SoldDate: {
      type: Date,
   
    },
    Gst: {
      type: String,
      // required: true,
    },
    Imageid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "image",
    },
  },
  { timestamps: true }
);

const address = mongoose.model("plotdetail", allSchema);
module.exports = address;

