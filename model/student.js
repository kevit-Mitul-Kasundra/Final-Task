const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rollNo: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNo: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    batch: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    currentSem: {
      type: Number,
      required: true,
    },
    attendance: {
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

module.exports = mongoose.model("Student", studentSchema);
