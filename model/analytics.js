const mongoose = require("mongoose");

const branchSchema = mongoose.Schema(
  {
    departmentname: { type: String, required: true },
    numberOfStudents: { type: Number, required: true },
  },
  { _id: false, versionKey: false }
);

const analyticsSchema = mongoose.Schema(
  {
    batch: { type: Number, required: true },
    totalStudents: { type: Number, required: true },
    departments: { type: [branchSchema], required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Analytics", analyticsSchema);
