const jwt = require("jsonwebtoken");
const Admin = require("../model/admin");
const Faculty = require("../model/faculty");

const auth = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    let decodedData;
    if (token) {
      decodedData = jwt.verify(token, "Task-3");
      req.userId = decodedData?.id;
      console.log(decodedData);
    }
    // const userType = decodedData.userType;

    // if (userType === "admin") {
    //   const existingAdmin = await Admin.findOne({ email: decodedData.email });
    //   if (!existingAdmin) {
    //     return res.status(404).send({ message: "Admin not found" });
    //   }
    // } else if (userType === "faculty") {
    //   const existingFaculty = await Faculty.findOne({
    //     email: decodedData.email,
    //   });
    //   if (!existingFaculty) {
    //     return res.status(404).send({ message: "Faculty not found" });
    //   }
    // } else {
    //   return res.status(401).send({ message: "Unauthorized access" });
    // }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send("Invalid Token!");
  }
};

module.exports = auth;
