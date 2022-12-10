const express = require("express");
const router = express.Router();

const {
  createLocation,
  fetchAllLocations,
  updateById,
  deleteById,
} = require("../api/controllers/location");

router.get("/", fetchAllLocations);
router.post("/create", createLocation);
router.patch("/update/:id", updateById);
router.delete("/delete/:id", deleteById);

module.exports = router;
