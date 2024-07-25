require("dotenv").config();
const jwt = require("jsonwebtoken");
const visitorInfo = require("../modal/VisitorSchema.js");
const image = require("../modal/imageSchema.js")

const RegisterVisitor = async (req, res) => {
  try {
    const { name, email, phone, query, querystatus } = req.body;
    const { id } = req.params;
    // console.log("ggggggg",req.body.email)
    // const hash = await bcrypt.hash(password,10);

    const registerVisitor = new visitorInfo({
      name: name,
      email: email,
      phone: phone,
      plotid: id,
      query: query,
      querytype: querystatus

    });

    const result = await registerVisitor.save();
    // console.log("jii",result)
    return res
      .status(201)
      .send({ data: result, message: "Registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error." });
  }
};

const VisitorDetails = async (req, res) => {
  try {

    const { page } = req.query;

    const newpage = parseInt(page) - 1;

    const dataperpage = 40;
    const visitor = await visitorInfo.find().sort({ _id: -1 }).skip(newpage * dataperpage).limit(dataperpage).populate('plotid');
    const vistorplotid = visitor.reduce((acc, e) => {

      acc.push(e.plotid?._id);
      return acc
    }, []);
    // console.log("visitor hai",vistorplotid)
    const images = await image.find({ plotid: { $in: vistorplotid } }).populate('plotid');
    // console.log("lggae",images);
    const count = await visitorInfo.countDocuments({});


    res.status(200).send({ data: visitor, count: count, images: images, success: true });
  } catch (err) {
    console.error("Error fetching plot details:", err);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};


const SearchingVisitor = async (req, res) => {
  try {

    const { page } = req.query;

    const newpage = parseInt(page) - 1;

    const dataperpage = 40;
    const { word } = req.params;
    const data = await visitorInfo.find({
      "$or": [
        { "name": { $regex: word, $options: 'i' } },
        { "email": { $regex: word, $options: 'i' } },
        { "phone": { $regex: word, $options: 'i' } },
        { "query": { $regex: word, $options: 'i' } },
      ]
    }).skip(newpage * dataperpage).limit(dataperpage).populate('plotid');

    if (data.length === 0) {
      return res.status(404).send({ success: false, message: "No data found" });
    }

    const plotIds = data.map(item => item._id);
    const allData = await visitorInfo.find({ plotid: { $in: plotIds } }).populate('plotid');
    const count = plotIds.length;

    res.status(200).send({ data: data, count: count, imagedata: allData, success: true, message: "Data sent successfully" });
  } catch (err) {
    console.error("Error fetching plot details:", err);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};
const DeleteVisitor = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await visitorInfo.deleteOne({ _id: id });
    // const imagedata=await image.deleteOne({ plotid: id });
    // console.log("kkk",user)

    // Respond with success message
    res.send({ message: "user deleted", user: user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
const Visitorstatuschange = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("idddddd",id)
    // const {visitorstatus}=req.body;
    // console.log("visiii",visitorstatus)
    const data = await visitorInfo.findByIdAndUpdate(
      id,
      {
        $set: {
          visitorstatus: true,

        },
      },
      { new: true }
    );
    res.send({ success: true, viewstatus: data, message: "Updated successfully" });

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error updating client");

  }




}

module.exports = {

  RegisterVisitor,
  VisitorDetails,
  DeleteVisitor,
  SearchingVisitor,
  Visitorstatuschange
}


