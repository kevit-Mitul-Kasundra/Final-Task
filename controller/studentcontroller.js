const Student = require("../model/student");
const Attendance = require("../model/attendance");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const studentLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingStudent = await Student.findOne({ username });
    if (!existingStudent) {
      return res.status(404).send({ message: "Student not found!" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingStudent.password
    );
    if (!isPasswordCorrect) {
      return res.status(404).send({ message: "Invalid Credentials" });
    }
    // const token = jwt.sign(
    //   {
    //     email: existingStudent.email,
    //     id: existingStudent._id,
    //   },
    //   "Task-3",
    //   { expiresIn: "1h" }
    // );
    res.status(200).send({ result: existingStudent });
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

    const student = await Student.findOne({ email });
    let hashedPassword;
    hashedPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedPassword;
    await student.save();
    if (student.passwordUpdated === false) {
      student.passwordUpdated = true;
      await student.save();
    }

    res.status(200).send({
      success: true,
      message: "Password updated successfully",
      response: student,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateStudent = async (req, res) => {
  try {
    const { name, phoneNo, batch, department, currentSem, email } = req.body;
    const updatedStudent = await Student.findOne({ email });
    if (name) {
      updatedStudent.name = name;
      await updatedStudent.save();
    }
    if (phoneNo) {
      updatedStudent.phoneNo = phoneNo;
      await updatedStudent.save();
    }
    if (batch) {
      updatedStudent.batch = batch;
      await updatedStudent.save();
    }
    if (department) {
      updatedStudent.department = department;
      await updatedStudent.save();
    }
    if (currentSem) {
      updatedStudent.currentSem = currentSem;
      await updatedStudent.save();
    }
    await updatedStudent.save();
    res.status(200).send(updatedStudent);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports = {
  studentLogin,
  updateStudent,
  updatedPassword,
};
