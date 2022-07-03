const express = require("express");
const app = express();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
app.use(express.json());
const PORT = process.env.PORT || 8080;

//start to connect db
const url = process.env.MONGO_URL;
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
connect.then(
  (db) => {
    console.log("DB -> Connected");
  },
  (err) => {
    console.log("DB Error -> " + err);
  }
);
//end db connection

//define routes
const apiRouter = require("./routes/mainRoute");
const { use } = require("./routes/mainRoute");
app.use("/api", apiRouter);

app.listen(
    PORT,
    console.log(`Server running on: ${PORT}`)
)