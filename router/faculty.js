const express = require("express");
const auth = require("../middleware/auth");
const facultyController = require("../controller/facultycontroller");

const router = express.Router();

router.post("/facultylogin", facultyController.facultyLogin);
router.put("/updatepassword", facultyController.updatedPassword);
router.put("/updatefaculty", facultyController.updateFaculty);
router.get("/getstudent", facultyController.getStudent);
router.post("/markattendance", facultyController.markAttendance);

module.exports = router;
