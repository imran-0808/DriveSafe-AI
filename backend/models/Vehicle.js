const mongoose = require("mongoose");

/*
 Vehicle schema
 - Ek vehicle = ek driver (current)
 - Driver change ho sakta hai (simple update)
*/
const vehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: true,
      unique: true, // har vehicle unique honi chahiye
    },

    // Driver details (editable by owner)
    driverName: {
      type: String,
      required: true,
    },

    driverPhone: {
      type: String,
      required: true,
    },

    // Live data (future mein driver app se update hoga)
    speed: {
      type: Number,
      default: 0,
    },

    location: {
      type: String,
      default: "Unknown",
    },

    riskStatus: {
      type: String,
      enum: ["NORMAL", "MEDIUM", "HIGH"],
      default: "NORMAL",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
