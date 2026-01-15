const Vehicle = require("../models/Vehicle");

/*
 1️⃣ Create new vehicle
*/
exports.createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/*
 2️⃣ Get all vehicles (Owner dashboard list)
*/
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/*
 3️⃣ Get single vehicle details (on click)
*/
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/*
 4️⃣ Update driver (IMPORTANT FEATURE)
 - Driver change easily ho sake
*/
exports.updateDriverDetails = async (req, res) => {
  try {
    const { driverName, driverPhone } = req.body;

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { driverName, driverPhone },
      { new: true }
    );

    res.json(vehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
