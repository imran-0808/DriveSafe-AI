const mongoose = require("mongoose");

/*
 Video viewing session by owner
 Controls how many times & how long video can be viewed
*/
const videoSessionSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    // Normal / Alert (alert baad mein use hoga)
    sessionType: {
      type: String,
      enum: ["NORMAL", "ALERT"],
      default: "NORMAL",
    },

    startedAt: {
      type: Date,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    consumed: {
      type: Boolean,
      default: false, // session over or not
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VideoSession", videoSessionSchema);
