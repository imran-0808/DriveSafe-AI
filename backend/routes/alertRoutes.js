const express = require("express");
const router = express.Router();
const {
  createAlert,
  getAllAlerts,
} = require("../controllers/alertController");

router.post("/", createAlert);     // create alert
router.get("/", getAllAlerts);     // list alerts

module.exports = router;
