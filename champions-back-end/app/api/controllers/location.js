const locationModal = require("../models/location");
const createLocation = async (req, res) => {
  const { city } = req.body;
  try {
    const location = await getLocation(city);
    if (location) {
      console.log("inside create location");
      res.status(400).json({
        status: "Error",
        message: "City already exist",
      });
    } else {
      const createLocation = await create(city);
      if (createLocation) {
        res.json({
          status: "success",
          message: "Location created successfully!!!",
        });
      }
    }
  } catch (err) {
    throw err;
  }
};

//To find a city from DB
const getLocation = async (city) => {
  try {
    const location = await locationModal.findOne({ city });
    if (location) return location;
  } catch (err) {
    throw err;
  }
};

//To create location
const create = async (city) => {
  try {
    const location = await locationModal.create({
      city,
    });
    if (location) {
      return location;
    }
  } catch (err) {
    throw err;
  }
};

//To fetch all the locations
const fetchAllLocations = async ({}, res) => {
  try {
    const locations = await locationModal.find({});
    console.log("getLocation", locations);
    if (locations) {
      res.json({
        status: "Success",
        message: "Get all locations !!!",
        data: { locations: locations },
      });
    }
  } catch (err) {
    throw err;
  }
};

//Update location by ID
const updateById = async (req, res) => {
  const { id } = req.params;
  const { city } = req.body;
  try {
    await locationModal.findByIdAndUpdate(
      id,
      {
        city,
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
    await locationModal.findByIdAndRemove(req.params.id, {}, function (err) {
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
  createLocation,
  fetchAllLocations,
  updateById,
  deleteById,
};
