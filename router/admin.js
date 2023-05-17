const express = require("express");
const auth = require("../middleware/auth");
const adminController = require("../controller/admincontroller");
const router = express.Router();

router.post("/adminlogin", adminController.adminLogin);
router.put("/updatepassword", auth, adminController.updatePassword);
router.get("/getallstudent", auth, adminController.getAllStudent);
router.get("/getallfaculty", auth, adminController.getAllFaculty);
router.get("/getalldepartment", auth, adminController.getAllDepartment);
router.get("/getalladmin", auth, adminController.getAllAdmin);
router.put("/updateadmin", auth, adminController.updateAdmin);
router.post("/addadmin", auth, adminController.addAdmin);
router.post("/adddepartment", auth, adminController.addDepartment);
router.post("/addfaculty", auth, adminController.addFaculty);
router.get("/getfaculty", auth, adminController.getFaculty);
router.post("/addstudent", auth, adminController.addStudent);
router.get("/getstudent", auth, adminController.getStudent);
router.get("/getadmin", auth, adminController.getAdmin);
router.delete("/deleteadmin", auth, adminController.deleteAdmin);
router.delete("/deletefaculty", auth, adminController.deleteFaculty);
router.delete("/deletestudent", auth, adminController.deleteStudent);
router.delete("/deletedepartment", auth, adminController.deleteDepartment);
router.post("/addanalytics", auth, adminController.addAnalytics);
router.put("/updateanalytics", auth, adminController.updateAnalytics);
router.delete("/deleteanalytics", auth, adminController.deleteAnalytics);
router.get("/lowattendancestudents", auth, adminController.getLowAttendanceStudents)

module.exports = router;
