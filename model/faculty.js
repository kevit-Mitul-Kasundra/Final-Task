const mongoose = require("mongoose");

const facultySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
    },
    password: {
      type: String,
    },
    username: {
      type: String,
    },
    department: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: Number,
    },
    joiningYear: {
      type: Number,
      required: true,
    },
    passwordUpdated: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Faculty", facultySchema);
