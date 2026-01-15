const Alert = require("../models/Alert");

/*
 1️⃣ Create new alert (driver system se call hoga)
*/
exports.createAlert = async (req, res) => {
  try {
    const now = new Date();

    const alert = await Alert.create({
      ...req.body,

      // Alert-based video access rules
      videoAccessUsed: false,
      videoValidTill: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24h
    });

    res.status(201).json(alert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


/*
 2️⃣ Get all alerts (Owner dashboard)
*/
exports.getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find()
  .populate("vehicle")   // 👈 THIS IS MANDATORY
  .sort({ createdAt: -1 });


    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
