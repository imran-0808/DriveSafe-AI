const VideoSession = require("../models/VideoSession");
const Alert = require("../models/Alert");

// Configuration (teacher-approved limits)
const MAX_SESSIONS_PER_24H = 100;
const SESSION_DURATION_MIN = 5; // minutes
const ALERT_SESSION_DURATION_MIN = 3;//Alert session duration

/*
 Check how many sessions owner used in last 24 hours
*/
async function sessionsUsedLast24h(vehicleId) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  return VideoSession.countDocuments({
    vehicle: vehicleId,
    sessionType: "NORMAL",
    startedAt: { $gte: since },
  });
}

/*
 Start a normal (manual) video session
*/
exports.startSession = async (req, res) => {
  try {
    const { vehicleId } = req.body;

    const used = await sessionsUsedLast24h(vehicleId);

    if (used >= MAX_SESSIONS_PER_24H) {
      return res.status(403).json({
        message: "Daily video session limit reached",
      });
    }

    const now = new Date();
    const expires = new Date(
      now.getTime() + SESSION_DURATION_MIN * 60 * 1000
    );

    const session = await VideoSession.create({
      vehicle: vehicleId,
      sessionType: "NORMAL",
      startedAt: now,
      expiresAt: expires,
    });

    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


/*
 Start video session based on alert
*/
exports.startAlertSession = async (req, res) => {
  try {
    const { alertId } = req.body;

    const alert = await Alert.findById(alertId).populate("vehicle");

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    // 1️⃣ Already used
    if (alert.videoAccessUsed) {
      return res
        .status(403)
        .json({ message: "Video already used for this alert" });
    }

    // 2️⃣ Expired
    if (new Date() > alert.videoValidTill) {
      return res
        .status(403)
        .json({ message: "Alert video access expired" });
    }

    const now = new Date();
    const expires = new Date(
      now.getTime() + ALERT_SESSION_DURATION_MIN * 60 * 1000
    );

    // Create alert-based session
    const session = await VideoSession.create({
      vehicle: alert.vehicle._id,
      sessionType: "ALERT",
      startedAt: now,
      expiresAt: expires,
    });

    // Mark alert as consumed
    alert.videoAccessUsed = true;
    await alert.save();

    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};