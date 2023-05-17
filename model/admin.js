const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
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
    username: {
      type: String,
      // required: true,
    },
    password: {
      type: String,
      // required: true,
    },
    contactNumber: {
      type: Number,
    },
    department: {
      type: String,
    },
    passwordUpdated: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("admin", adminSchema);
