const express = require("express");
const router = express.Router();
const { startSession } = require("../controllers/videoSessionController");
const { startAlertSession } = require("../controllers/videoSessionController");

router.post("/start", startSession);
router.post("/start-from-alert", startAlertSession);

module.exports = router;
