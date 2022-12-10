const departmentModal = require("../models/department");
const createDepartment = async (req, res) => {
  const { departmentName } = req.body;
  try {
    const neoDepartments = await getDepartment(departmentName);
    if (neoDepartments) {
      res.status(400).json({
        status: "Error",
        message: "Department already exist",
      });
    } else {
      const createDepartment = await create(departmentName);
      if (createDepartment) {
        res.json({
          status: "success",
          message: "Department created successfully!!!",
        });
      }
    }
  } catch (err) {
    throw err;
  }
};

//To find a department from DB
const getDepartment = async (department) => {
  try {
    const neoDepartment = await departmentModal.findOne({
      departmentName: department,
    });
    if (neoDepartment) return neoDepartment;
  } catch (err) {
    throw err;
  }
};

//To create department
const create = async (department) => {
  try {
    const neoDepartment = await departmentModal.create({
      departmentName: department,
    });
    if (neoDepartment) {
      return neoDepartment;
    }
  } catch (err) {
    throw err;
  }
};

//To fetch all the departments
const fetchAllDepartments = async ({}, res) => {
  try {
    const neoDepartments = await departmentModal.find({});
    if (neoDepartments) {
      res.json({
        status: "Success",
        message: "Get all departments !!!",
        data: { departments: neoDepartments },
      });
    }
  } catch (err) {
    throw err;
  }
};

//Update location by ID
const updateById = async (req, res) => {
  const { id } = req.params;
  const { department } = req.body;
  try {
    await departmentModal.findByIdAndUpdate(
      id,
      {
        department,
      },
      function (err) {
        if (!err) {
          res.json({
            status: "Success",
            message: "Updated successfully !!!",
          });
        } else {
          res.status(400).json({
            status: "Error",
            message: "No record found",
          });
        }
      }
    );
  } catch (err) {
    throw err;
  }
};

//Delete by ID
const deleteById = async (req, res) => {
  try {
    await departmentModal.findByIdAndRemove(req.params.id, {}, function (err) {
      if (err) {
        res.status(400).json({
          status: "Error",
          message: "No record found",
        });
      } else {
        res.json({
          status: "Success",
          message: "Deleted Successfully !!!",
        });
      }
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createDepartment,
  fetchAllDepartments,
  updateById,
  deleteById,
};
