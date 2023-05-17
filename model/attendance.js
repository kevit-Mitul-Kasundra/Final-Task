const mongoose = require("mongoose");
const { Schema } = mongoose;

const attendanceSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
    totalLecturesByFaculty: {
      type: Number,
      default: 0,
    },
    lectureAttended: {
      type: Number,
      default: 0,
    },
    department: {
      type: String,
    },
    batch: {
      type: Number,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
