const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

const adminRouters = require("./router/admin");
const facultyRoutes = require("./router/faculty");
const studentRouters = require("./router/student");

app.use(bodyParser.json());

app.use(adminRouters);
app.use(facultyRoutes);
app.use(studentRouters);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-origin", "*");

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE"
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Origin",

    "X-Requested-With",
    "Content-Type",
    "Accept"
  );
  next();
});

const port = process.env.PORT || 1234;
mongoose
  .connect("mongodb://127.0.0.1:27017/Task-3", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((error) => console.log(error));

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
