const Admin = require("../model/admin");
const Department = require("../model/department");
const Faculty = require("../model/faculty");
const Student = require("../model/student");
const department = require("../model/department");
const Analytics = require("../model/analytics");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ username });
    if (!existingAdmin) {
      return res.status(404).send({ message: "Admin not found" });
    }
    const isPassworfCorrect = await bcrypt.compare(
      password,
      existingAdmin.password
    );
    if (!isPassworfCorrect) {
      return res.status(404).send({ message: "Invalide Credentials" });
    }
    const token = jwt.sign(
      {
        userType: "admin",
        email: existingAdmin.email,
        id: existingAdmin._id,
      },
      "Task-3",
      { expiresIn: "1h" }
    );
    res.status(200).send({ result: existingAdmin, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, email } = req.body;
    if (newPassword !== confirmPassword) {
      return res.status(400).send({ message: "Your password is not match!" });
    }
    const admin = await Admin.findOne({ email });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    if (admin.passwordUpated === false) {
      admin.passwordUpated = true;
      await admin.save();
    }
    res.status(200).send({
      success: true,
      message: "Password updated Successfully!",
      response: admin,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { name, contactNumber, department, email } = req.body;
    const updatedAdmin = await Admin.findOne({ email });
    if (name) {
      updatedAdmin.name = name;
      await updatedAdmin.save();
    }
    if (contactNumber) {
      updatedAdmin.contactNumber = contactNumber;
      await updatedAdmin.save();
    }
    if (department) {
      updatedAdmin.department = department;
      await updatedAdmin.save();
    }
    if (email) {
      updatedAdmin.email = email;
      await updatedAdmin.save();
    }
    res.status(200).send(updatedAdmin);
  } catch (error) {
    res.status(500).send(error);
  }
};

const addAdmin = async (req, res) => {
  try {
    const { name, email, username, password, contactNumber, department } =
      req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).send({ message: "Email is already exists!" });
    }
    const existingDepartment = await Department.findOne({ department });
    if (!existingDepartment) {
      return res.status(400).send({ message: "Department not found" });
    }

    let hashedPassword;
    hashedPassword = await bcrypt.hash(password, 10);
    var passwordUpdated = false;
    const newAdmin = await new Admin({
      name,
      email,
      password: hashedPassword,
      username,
      department,
      contactNumber,
      passwordUpdated,
    });
    await newAdmin.save();
    return res.status(200).send({
      success: true,
      message: "Admin created Successfully!",
      response: newAdmin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const addDepartment = async (req, res) => {
  try {
    const { department, departmentCode } = req.body;
    const existingDepartment = await Department.findOne({ department });
    if (existingDepartment) {
      return res.status(400).send({ message: "Department already exists" });
    } else {
      const newDepartment = new Department({
        department,
        departmentCode,
      });

      await newDepartment.save();
      return res.status(200).send({
        success: true,
        message: "Department added successfully",
        response: newDepartment,
      });
    }
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized: Invalid token" });
  }
};

const addFaculty = async (req, res) => {
  try {
    const {
      name,
      email,
      gender,
      username,
      password,
      department,
      contactNumber,
      joiningYear,
    } = req.body;

    const userType = req.headers["user-type"];
    if (userType !== "admin") {
      return res.status(401).send({ message: "Unauthorized access" });
    }

    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty) {
      return res.status(400).send({ message: "Already Exists!" });
    }

    let hashedPassword;
    hashedPassword = await bcrypt.hash(password, 10);
    var passwordUpdated = false;

    const newFaculty = await new Faculty({
      name,
      email,
      password: hashedPassword,
      joiningYear,
      username,
      department,
      contactNumber,
      gender,
      passwordUpdated,
    });
    await newFaculty.save();
    return res.status(200).send({
      success: true,
      message: "Faculty registered successfully",
      response: newFaculty,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const addStudent = async (req, res) => {
  try {
    const {
      name,
      rollNo,
      phoneNo,
      username,
      password,
      department,
      batch,
      currentSem,
      email,
      attendance,
    } = req.body;

    // const userType = req.headers["user-type"];
    // if (userType !== "admin" && userType !== "faculty") {
    //   return res.status(401).send({ message: "Unauthorized access" });
    // }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).send({ message: "Student already exists!" });
    }

    let hashedPassword;
    hashedPassword = await bcrypt.hash(password, 10);
    var passwordUpdated = false;

    const newStudent = await new Student({
      name,
      rollNo,
      password: hashedPassword,
      username,
      department,
      phoneNo,
      email,
      batch,
      currentSem,
      attendance,
      passwordUpdated,
    });
    await newStudent.save();
    return res.status(200).send({
      success: true,
      message: "Student registerd Successfully!",
      response: newStudent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getLowAttendanceStudents = async (req, res) => {
  try {
    const students = await Student.find({ attendance: { $lt: 75 } });
    return res.status(200).send(students);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getFaculty = async (req, res) => {
  try {
    const { department } = req.body;
    const faculties = await Faculty.findOne({ department });
    if (faculties.length === 0) {
      return res.status(404).send({ message: "Faculty not found!" });
    }
    res.status(200).send({ result: faculties });
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAdmin = async (req, res) => {
  try {
    const { department } = req.body;
    const admins = await Admin.findOne({ department });
    if (admins.length === 0) {
      return res.status(404).send({ message: "Admin not Found!" });
    }
    res.status(200).send({ result: admins });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getStudent = async (req, res) => {
  try {
    const { department, batch } = req.body;
    const students = await Student.find({ department, batch });
    if (!students) {
      return res.status(404).send({ message: "Student not found!" });
    }
    res.status(200).send({ result: students });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getAllStudent = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).send(students);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).send(admins);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllFaculty = async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.status(200).send(faculties);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllDepartment = async (req, res) => {
  try {
    const departments = await department.find();
    res.status(200).send(departments);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    await Admin.findOneAndDelete({ email });

    res.status(200).send({ message: "Admin Deleted!" });
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const { email } = req.body;
    await Faculty.findOneAndDelete({ email });

    res.status(200).send({ message: "Faculty Deleted!" });
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { email } = req.body;
    await Student.findOneAndDelete({ email });
    res.status(200).send({ message: "Student Deleted!" });
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { department } = req.body;
    await Department.findOneAndDelete({ department });

    res.status(200).send({ message: "Department deleted!" });
  } catch (error) {
    res.status(500).send(error);
  }
};

const addAnalytics = async (req, res) => {
  try {
    const { batch, totalStudents, departments } = req.body;
    const newAnalyticas = await Analytics({
      batch,
      totalStudents,
      departments,
    });
    await newAnalyticas.save();
    res.status(200).send({
      success: true,
      message: "Analytics created Successfully!",
      response: newAnalyticas,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateAnalytics = async (req, res) => {
  try {
    const { batch, totalStudents, departments } = req.body;
    const updatedAnalytics = await Analytics.findOne({ batch });
    if (totalStudents) {
      updatedAnalytics.totalStudents = totalStudents;
      await updatedAnalytics.save();
    }
    if (departments) {
      updatedAnalytics.departments = departments;
      await updatedAnalytics.save();
    }
    res.status(200).send(updatedAnalytics);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteAnalytics = async (req, res) => {
  try {
    const { batch, departments } = req.body;
    await Analytics.findOneAndDelete({ batch, departments });

    res.status(200).send({ message: "Analytics deleted!" });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  adminLogin,
  updatePassword,
  updateAdmin,
  addAdmin,
  addDepartment,
  addFaculty,
  addStudent,
  getFaculty,
  getAdmin,
  getStudent,
  getAllAdmin,
  getAllDepartment,
  getAllFaculty,
  getAllStudent,
  deleteAdmin,
  deleteFaculty,
  deleteStudent,
  deleteDepartment,
  addAnalytics,
  updateAnalytics,
  deleteAnalytics,
  getLowAttendanceStudents,
};
