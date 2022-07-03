var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

//models for db
const User = require("../models/userModel");
const Question = require("../models/questionModel");
const Answer = require("../models/answerModel");

exports.login = (token, req, res, next) => {
  if (token.sucess == false) {
    res.sucessCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.json([{ data: token }]);
    return;
  } else {
    //true
    const { username, password } = req.body;
    //findone start
    User.findOne({ username })
      .then((data) => {
        if (!data) {
          return res.json({
            sucess: "error",
            error: "Invalid username/password",
          });
        }
        //bcrypt start
        bcrypt
          .compare(password, data.password)
          .then((result) => {
            if (result == true) {
              res.send({ sucess: true, data: token });
            } else {
              res.send({ sucess: false, message: "Password didn't matched" });
            }
          })
          .catch((err) => {
            res.send({ sucess: false, error: err, block: "bcrypt" });
          });
        //bcrypt end
      })
      .catch((err) => {
        res.send({ sucess: false, error: err, block: "findone" });
      });
    //findone end
  }
};
