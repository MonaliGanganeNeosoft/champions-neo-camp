const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const locationSchema = new Schema(
  {
    city: {
      type: String,
      trim: true,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Location", locationSchema);
