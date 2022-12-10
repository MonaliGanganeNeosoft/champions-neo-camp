const express = require("express");
const router = express.Router();

const {
  createDepartment,
  fetchAllDepartments,
  updateById,
  deleteById,
} = require("../api/controllers/department");

router.get("/", fetchAllDepartments);
router.post("/create", createDepartment);
router.patch("/update/:id", updateById);
router.delete("/delete/:id", deleteById);

module.exports = router;
