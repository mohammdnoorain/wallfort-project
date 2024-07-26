require("dotenv").config();
const address = require("../modal/addressschema.js")
const image = require("../modal/imageSchema.js")
const nanoid = require("nanoid");
const { uploadImageToAzure, deleteImageFromAzure } = require("../thirdpartyapi/azurefunction.js")
const Registeraddress = async (req, res) => {
  try {



    const imagebuffer = await Promise.all(req.files.map(async (e) => {
      const uuid = nanoid.nanoid(6);
      const obj = {};
      // console.log(Buffer.isBuffer(e.buffer))
      const url = await uploadImageToAzure(e.buffer, uuid);
      obj["blobName"] = uuid;
      obj["imageUrl"] = url;
      return obj;
    }));


    const register = new address({

      Plotnumber: req.body.Plotnumber,
      Rate: req.body.Rate,
      // BasicAmount:req.body.BasicAmount,



      PropertySize: req.body.PropertySize,
      Availability: req.body.Availability,
      Club: req.body.Club,
      Maintainance: req.body.Maintainance,
      Electricity: req.body.Electricity,
      ElectricityRate: req.body.ElectricityRate,
      Plc: JSON.parse(req.body.Plc),
      PlcAmount: req.body.PlcAmount,
      Other: req.body.Other,

      Gst: req.body.Gst,

    });

    const result = await register.save();
    // console.log(imagebuffer)
    const registerimage = new image({

      image: imagebuffer,
      plotid: result._id
    });
    const saveimage = await registerimage.save();

    return res
      .status(201)
      .send({ success: true, result, saveimage, message: "Registered successfully." });
  } catch (error) {
    if (error.code === 11000) {

      console.log('Error Details:', {
        keyPattern: error.keyPattern,
        keyValue: error.keyValue
      })
      return res.status(207).send({ message: "Request Failed.Please enter a unique Plot Number" })
    }
    console.error(error);
    res.status(500).send({ message: "Internal server error." });
  }
};



const Updateaddress = async (req, res) => {
  try {
    let { Rate, TotalAmount, PropertySize, Availability, Club, Maintainance, Electricity, ElectricityRate, Plc, Other, Gst } = req.body;
    const { id } = req.params;


    let data = await address.findByIdAndUpdate(
      id,
      {
        $set: {
          Rate,
          // BasicAmount,
          TotalAmount,

          PropertySize,
          Availability,
          Club,
          Maintainance,
          Electricity,

          ElectricityRate,
          Plc,
          Other,
          Gst,
          // SoldDate,




        },
      },
      { new: true }
    );

    // let alldata=await address.find() 
    //     console.log("alldata",alldata);
    res.send({ success: true, message: "Updated successfully", data: data });
  } catch (error) {

    res.status(500).send("Error updating client");
  }
};
// heyyyyy noorain    
// const copyAndInsertToDB =async(req,res)=>{
//
//  try {
//     const { street, city, state, country, postalCode, streetumber, plotnumber,sellingstatus } = req.body;
//
//     const data = {
//       street,
//       city,
//       state,
//       country,
//       postalCode,
//       streetumber,
//       plotnumber,
//       sellingstatus
//     };
//
//     const results = await copy(data);
//
//     return res.status(201).send({ results, message: "Registered successfully." });
//   } catch (error) {
//     console.error("Error registering address:", error);
//     res.status(500).send({ message: "Internal server error." });
//   }
// }
// new comment ``



// const copyAndInsertToDB = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { numberofcopy } = req.body;
//     // console.log("iddd",id);
//     // console.log("length",numberofcopy);
//     let data = await address.findById(id);
//     // console.log("Data:", data);
//     // console.log("Data:", {...data});
//     if (!data) {
//       return res.status(404).json({ message: 'Data not found' });
//     }
//     const numLength = parseInt(numberofcopy, 10) //|| 2;
//
//     // Create copies of the data with required fields
//     // const copies = Array.from({ length: numLength }, () => ({
//     //   street: data.street,
//     //   city: data.city,
//     //   state: data.state,
//     //   country: data.country,
//     //   postalCode: data.postalCode,
//     //   streetumber: data.streetumber,
//     //   plotnumber: data.plotnumber,
//     //   sellingstatus: data.sellingstatus // Assuming sellingstatus is required
//     // }));
//
//     delete data._doc._id
//     const copies = Array.from({ length: numLength }, () => ({ ...data._doc }));
//
//     const insertedData = await address.insertMany(copies);
//
//
//     const imagearr = insertedData.map(e => {
//
//       const newobj = {
//         image: [],
//         plotid: e._id,
//       }
//       return newobj;
//     })
//
//     const insertedimageData = await image.insertMany(imagearr);
//
//     res.status(200).json({ success: true, message: "Data copied and inserted successfully", data: insertedData, imagedata: insertedimageData });
//   } catch (error) {
//     // Handle errors
//     console.error("Error:", error);
//     res.status(500).json({ success: false, message: "Failed to copy and insert data" });
//   }
// }

// just for check  

const PlotDetails = async (req, res) => {
  try {
    const { page } = req.query;
    // console.log("page", page);
    const newpage = parseInt(page) - 1;

    const dataperpage = 40;

    const images = await image.aggregate([
      {
        $lookup: {
          from: 'plotdetails', // The collection where plot details are stored
          localField: 'plotid',
          foreignField: '_id',
          as: 'plotid'
        }
      },
      { $unwind: '$plotid' },
      {
        $addFields: {
          plotNumberParts: {
            $regexFindAll: {
              input: '$plotid.Plotnumber',
              regex: /(\d+|\D+)/g // Separate numeric and alphabetic parts
            }
          }
        }
      },
      {
        $addFields: {
          plotNumberParts: {
            $map: {
              input: '$plotNumberParts.match',
              as: 'part',
              in: {
                $cond: {
                  if: { $regexMatch: { input: '$$part', regex: /^\d+$/ } }, // Check if part is numeric
                  then: { $toInt: '$$part' },
                  else: '$$part'
                }
              }
            }
          }
        }
      },
      {
        $sort: {
          'plotNumberParts': 1 // Sort by plotNumberParts array
        }
      },
      { $skip: newpage * dataperpage },
      { $limit: dataperpage }
    ]);

    const count = await image.countDocuments({});
    // console.log("coooo", count);

    res.status(200).send({ imagedata: images, count: count, success: true });
  } catch (err) {
    console.error("Error fetching plot details:", err);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

const DeckPlotDetails = async (req, res) => {


  try {
    const images = await image.aggregate([
      {
        $lookup: {
          from: 'plotdetails', // The collection where plot details are stored
          localField: 'plotid',
          foreignField: '_id',
          as: 'plotid'
        }
      },
      { $unwind: '$plotid' },
      {
        $addFields: {
          plotNumberParts: {
            $regexFindAll: {
              input: '$plotid.Plotnumber',
              regex: /(\d+|\D+)/g // Separate numeric and alphabetic parts
            }
          }
        }
      },
      {
        $addFields: {
          plotNumberParts: {
            $map: {
              input: '$plotNumberParts.match',
              as: 'part',
              in: {
                $cond: {
                  if: { $regexMatch: { input: '$$part', regex: /^\d+$/ } }, // Check if part is numeric
                  then: { $toInt: '$$part' },
                  else: '$$part'
                }
              }
            }
          }
        }
      },
      {
        $sort: {
          'plotNumberParts': 1 // Sort by plotNumberParts array
        }
      },

    ]);


    res.status(200).send({ success: true, message: "data sended successfully", imagedata: images, });

  } catch (err) {
    console.error("Error fetching plot details:", err);
    res.status(500).send({ success: false, message: "Internal server error" });

  }
}


const SearchingData = async (req, res) => {
  try {
    const { page } = req.query;
    // console.log("page", page)
    const newpage = parseInt(page) - 1;

    const dataperpage = 40;
    const { word } = req.params;
    const data = await address.find({
      "$or": [

        { "Plotnumber": { $regex: word, $options: 'i' } },
        // { "Rate": { $regex: word, $options: 'i' } },
        { "Availability": { $regex: word, $options: 'i' } },
        // { "TotalAmount": { $regex: word, $options: 'i' } },
        // { "PropertySize": { $regex: word, $options: 'i' } },

      ]
    });

    if (data.length === 0) {
      return res.status(404).send({ success: false, message: "No data found" });
    }


    const plotIds = data.map(item => item._id);
    const allData = await image.find({ plotid: { $in: plotIds } }).skip(newpage * dataperpage).limit(dataperpage).populate('plotid');
    // const count = await image.countDocuments({ plotid: { $in: plotIds } }); 
    const count = plotIds.length;
    // console.log("coooo searcxh", allData);

    res.status(200).send({ count: count, imagedata: allData, success: true, message: "Data sent successfully" });
  } catch (err) {
    console.error("Error fetching plot details:", err);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};
const DeletePlot = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await address.deleteOne({ _id: id });
    const imagedata = await image.deleteOne({ plotid: id });
    // console.log("kkk", imagedata)

    // Respond with success message
    res.send({ message: "user deleted", user: user, imagedata: imagedata });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params
    const { blobName } = req.body;
    // console.log(imageId, blobName)
    const deltedImage = await deleteImageFromAzure(blobName);
    const deltedImageFromDoc = await image.updateOne({ "image._id": imageId }, { $pull: { image: { _id: imageId } } })
    // console.log(deltedImageFromDoc)
    res.status(201).send({ sucess: true, message: "deleted sucessfully" })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}

const editImage = async (req, res) => {
  try {
    const { blobName, plotId } = req.body;
    const { imageId } = req.params
    const imagebuffer = req.files[0].buffer;
    // console.log(blobName, imageId)
    await deleteImageFromAzure(blobName);
    const deltedImageFromDoc = await image.updateOne({ "image._id": imageId }, { $pull: { image: { _id: imageId } } })
    // console.log(deltedImageFromDoc)
    const newBlobName = nanoid.nanoid(6)
    // console.log(newBlobName)
    const editedimage = await uploadImageToAzure(imagebuffer, newBlobName)
    const obj = {
      imageUrl: editedimage,
      blobName: newBlobName
    }
    const imageUploaded = await image.findOneAndUpdate({ plotid: plotId }, { $push: { image: obj } }, { new: true });
    // console.log(editedimage)
    // console.log(deltedImageFromDoc)
    res.status(201).send({ data: imageUploaded, success: true, message: "image updated sucessfully" })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}

const uploadImage = async (req, res) => {
  try {
    const { plotId } = req.body;
    const imagebuffer = req.files[0].buffer;
    const plot = await address.findOne({ _id: plotId })
    const blobName = nanoid.nanoid(6)
    const uploadedImage = await uploadImageToAzure(imagebuffer, blobName)
    const obj = {
      imageUrl: uploadedImage,
      blobName: blobName
    }
    const imageUploaded = await image.findOneAndUpdate({ plotid: plotId }, { $push: { image: obj } }, { new: true });
    res.status(201).send({ success: true, data: imageUploaded, message: "image updated sucessfully" })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}


module.exports = {
  deleteImage,
  editImage,
  uploadImage,
  Registeraddress,
  Updateaddress,
  // copyAndInsertToDB,
  PlotDetails,
  DeletePlot,
  SearchingData,
  DeckPlotDetails
}
