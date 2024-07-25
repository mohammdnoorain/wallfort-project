const express = require("express"); 
const multer=require("multer");

const storage=multer.memoryStorage();
const upload=multer({storage:storage});

const clientcontroller = require("../controller/clientcontroller.js");
const {verifyToken}=require("../middleware/verifytoken.js")
const clientroute = express.Router(); // Define userRoute as an instance of express.Router()


clientroute.post("/registeraddress",upload.any(),clientcontroller.Registeraddress);
clientroute.get("/plot-details",verifyToken,clientcontroller.PlotDetails);
clientroute.get("/searchingapicall/:word",clientcontroller.SearchingData);
clientroute.delete("/plot-delete/:id",verifyToken,clientcontroller.DeletePlot);
clientroute.post("/updateaddress/:id",upload.any(),verifyToken,clientcontroller.Updateaddress);
// clientroute.post("/copyaddress/:id",verifyToken,clientcontroller.copyAndInsertToDB);
clientroute.put("/edit/image/:imageId",upload.any(),verifyToken,clientcontroller.editImage);
clientroute.delete("/delete/image/:imageId",verifyToken,clientcontroller.deleteImage)
clientroute.put("/upload/image",upload.any(),verifyToken,clientcontroller.uploadImage);



//////
clientroute.get("/deck-plot-details",clientcontroller.DeckPlotDetails);
module.exports =clientroute;
