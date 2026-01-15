const mongoose = require("mongoose");

/*
 Alert history for owner
 Each alert is linked to ONE vehicle
*/
const alertSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    alertType: {
      type: String,
      enum: ["DROWSINESS", "OVERSPEED"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    speed: {
      type: Number,
      default: null,
    },

    riskStatus: {
      type: String,
      enum: ["NORMAL", "MEDIUM", "HIGH"],
      default: "NORMAL",
    },
    // Video access control for this alert
videoAccessUsed: {
  type: Boolean,
  default: false, // ek hi baar allow
},

// Alert ke 24h ke baad video invalid
videoValidTill: {
  type: Date,
},

  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
