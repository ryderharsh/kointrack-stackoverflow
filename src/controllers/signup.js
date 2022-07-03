var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

//models for db
const User = require("../models/userModel");
const Question = require("../models/questionModel");
const Answer = require("../models/answerModel");

exports.signup = async (token, req, res, next) => {
  if (token.sucess == false) {
    res.sucessCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.json([
      { data: token },
    ]);
    return;
  } else {
    //true
    const { username, password: plainTextPassword } = req.body;
    if (plainTextPassword.length < 8) {
        return res.json({
        sucess: "error",
        error: "Password must be of more than 8 characters",
        });
    }
    const password = await bcrypt.hash(plainTextPassword, 10);
    //start-
        User.create({
        username: username,
        password: password,
        })
        .then((data) => {
            res.send({data, sucess:true});
        })
        .catch((err) => {
            if (err.code === 11000) {
            res.send({ sucess: false, error: err, block: "create" });
            console.log("Error: ", err)
        }
        });
  }
};