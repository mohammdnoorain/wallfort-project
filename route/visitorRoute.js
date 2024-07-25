const express = require("express"); 



const visitorcontroller=require("../controller/VisitorController.js")

const {verifyToken}=require("../middleware/verifytoken.js")
const visitorRoute = express.Router(); 


visitorRoute.post("/registervisitor/:id",visitorcontroller.RegisterVisitor);
visitorRoute.get("/visitor-details",visitorcontroller.VisitorDetails);
visitorRoute.get("/searchingvisitorapicall/:word",visitorcontroller.SearchingVisitor);
visitorRoute.delete("/visitor-delete/:id",verifyToken,visitorcontroller.DeleteVisitor);
visitorRoute.put("/visitor-statuschange/:id",verifyToken,visitorcontroller.Visitorstatuschange)


module.exports =visitorRoute;
