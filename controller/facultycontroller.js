const Faculty = require("../model/faculty");
const Student = require("../model/student");
const Attendance = require("../model/attendance");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const facultyLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingFaculty = await Faculty.findOne({ username });
    if (!existingFaculty) {
      return res.status(404).send({ message: "Faculty not found!" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingFaculty.password
    );
    if (!isPasswordCorrect) {
      return res.status(404).send({ message: "Invalid Credentials" });
    }
    const token = jwt.sign(
      {
        userType: "faculty",
        email: existingFaculty.email,
        id: existingFaculty._id,
      },
      "Task-3",
      { expiresIn: "1h" }
    );
    res.status(200).send({ result: existingFaculty, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const updatedPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, email } = req.body;
    if (newPassword !== confirmPassword) {
      return res.status(400).send({
        message: "Your password and confirmation password do not match",
      });
    }

    const faculty = await Faculty.findOne({ email });
    let hashedPassword;
    hashedPassword = await bcrypt.hash(newPassword, 10);
    faculty.password = hashedPassword;
    await faculty.save();
    if (faculty.passwordUpdated === false) {
      faculty.passwordUpdated = true;
      await faculty.save();
    }

    res.status(200).send({
      success: true,
      message: "Password updated successfully",
      response: faculty,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateFaculty = async (req, res) => {
  try {
    const { name, email, department, contactNumber } = req.body;
    const updatedFaculty = await Faculty.findOne({ email });
    if (name) {
      updatedFaculty.name = name;
      await updatedFaculty.save();
    }
    if (department) {
      updatedFaculty.department = department;
      await updatedFaculty.save();
    }
    if (contactNumber) {
      updatedFaculty.contactNumber = contactNumber;
      await updatedFaculty.save();
    }
    res.status(200).send(updatedFaculty);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getStudent = async (req, res) => {
  try {
    const { department, batch } = req.body;
    const students = await Student.find({ department, batch });
    if (students.lenght === 0) {
      return res.status(404).send({ message: "Student not found!" });
    }
    res.status(200).send({ result: students });
  } catch (error) {
    res.status(500).send(error);
  }
};

const markAttendance = async (req, res) => {
  try {
    const { selectedStudent, department, batch } = req.body;

    const dep = await Student.findOne({ department }).select("_id");

    const allStudents = await Student.find({ department, batch });

    const updatedAttendance = [];

    for (let i = 0; i < allStudents.length; i++) {
      const attendance = await Attendance.findOne({
        student: allStudents[i]._id,
        department: dep._id,
      });

      if (!attendance) {
        const newAttendance = new Attendance({
          student: allStudents[i]._id,
          department: dep._id,
          lectureAttended: 0,
          totalLecturesByFaculty: 1,
        });
        await newAttendance.save();
        updatedAttendance.push(newAttendance);
      } else if (!updatedAttendance.includes(attendance)) {
        attendance.totalLecturesByFaculty += 1;
        await attendance.save();
        updatedAttendance.push(attendance);
      }
    }

    if (selectedStudent && selectedStudent.length > 0) {
      for (let i = 0; i < selectedStudent.length; i++) {
        const attendance = await Attendance.findOne({
          student: selectedStudent[i],
          department: dep._id,
        });

        if (!attendance) {
          const newAttendance = new Attendance({
            student: selectedStudent[i],
            department: dep._id,
            lectureAttended: 0,
            totalLecturesByFaculty: 1,
          });
          await newAttendance.save();
          updatedAttendance.push(newAttendance);
        } else if (!updatedAttendance.includes(attendance)) {
          attendance.lectureAttended += 1;
          await attendance.save();
          updatedAttendance.push(attendance);
        }
      }
    }

    res.status(200).send({ message: "Attendance marked successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  facultyLogin,
  updateFaculty,
  getStudent,
  markAttendance,
  updatedPassword,
};
