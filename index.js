const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 4000;
const cors = require("cors");
const corsOrigin = process.env.CORS_ORIGIN.split(',');
const user = require("./route/userroute.js");
const clientroute = require("./route/clientroute.js");
const visitorRoute = require("./route/visitorRoute.js")

const image = require("./modal/imageSchema.js");
const connect = require("./connection/db2.js")




app.use(
  cors({
    credentials: true,
    origin: corsOrigin,
  })
);


app.use(express.json({ limit: '50mb' }));
app.use("/", user);
app.use("/", clientroute)
app.use("/", visitorRoute)

// Health check endpoint
// app.get('/health', (req, res) => {
//   res.status(200).send('Server is healthy');
// });

// Delete images endpoint
// app.delete("/delete", async (req, res) => {
//
//   const deleteImages = async () => {
//     try {
//       const images = await image.find({})
//       const deleted = await Promise.all(images.map(async (e) => {
//         await image.updateOne({ _id: e._id }, { $set: { image: [] } })
//       }))
//       console.log("images deleted")
//     } catch (error) {
//       console.log(error)
//     }
//   }
//   await deleteImages()
//   res.send("images deleted")
// })

app.listen(PORT, () => {
  console.log("server running")
})

connect()

