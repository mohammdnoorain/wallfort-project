const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  image:[{
    type:{
      blobName:{type:String,required:true},
      imageUrl:{type:String},
    }
  }],
  plotid: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"plotdetail"
  },

},
  { timestamps: true }
);
const  image= mongoose.model("image", imageSchema);
module.exports = image;
