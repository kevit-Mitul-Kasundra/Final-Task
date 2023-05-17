const express = require("express");
const auth = require("../middleware/auth");
const studentController = require("../controller/studentcontroller");

const router = express.Router();

router.post("/studentlogin", studentController.studentLogin);
router.put("/updatepassword", studentController.updatedPassword);
router.put("/updatestudent", studentController.updateStudent);

module.exports = router;
