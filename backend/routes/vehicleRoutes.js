const express = require("express");
const router = express.Router();
const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateDriverDetails,
} = require("../controllers/vehicleController");

// Create vehicle
router.post("/", createVehicle);

// List all vehicles (dashboard)
router.get("/", getAllVehicles);

// Single vehicle detail
router.get("/:id", getVehicleById);

// Update driver name & phone
router.put("/:id/driver", updateDriverDetails);

module.exports = router;
