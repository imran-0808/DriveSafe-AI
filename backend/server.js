const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const alertRoutes = require("./routes/alertRoutes");
const videoSessionRoutes = require("./routes/videoSessionRoute");





const vehicleRoutes = require("./routes/vehicleRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/vehicles", vehicleRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/video-sessions", videoSessionRoutes);

app.listen(8080, () => {
  console.log("Backend running on port 8080");
});
