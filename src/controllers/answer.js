var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

//models for db
const User = require("../models/userModel");
const Question = require("../models/questionModel");
const Answer = require("../models/answerModel");

exports.createanswer = (token, req, res, next) => {
  if (token != undefined) {
    User.findOne({ username: token })
      .then((data) => {
        const userid = data._id;
        const questionid = req.body.questionid;
        const answerdesc = req.body.answerdesc;
        if (!questionid || typeof questionid != "string") {
          res.json({ sucess: false, msg: "Question ID Incorrect" });
        } else if (!answerdesc || typeof answerdesc != "string") {
          res.json({ sucess: false, msg: "Answer Description Incorrect" });
        } else {
          Answer.find({ questionid: questionid, createdby: userid })
            .then((data) => {
              if (data.length == 0) {
                //create answer
                const obj = {
                  answerdesc: answerdesc,
                  questionid: questionid,
                  createdby: userid,
                };
                Answer.create(obj)
                  .then((data) => {
                    //answer created and now update question answers ID array and its popularity
                    const answerid = data._id;
                    Question.findOneAndUpdate(
                      { _id: questionid },
                      { $push: { answerid: answerid } },
                      { new: true }
                    )
                      .then((newdata) => {
                        Question.findOneAndUpdate(
                          { _id: questionid },
                          { $set: { popularity: newdata.popularity + 1 } },
                          { new: true }
                        ).then((newdata) => {
                          res.json({ sucess: true, data: data });
                        });
                      })
                      .catch((err) => {
                        res.json({
                          sucess: false,
                          msg: err,
                          block: "Question.findByIdAndUpdate",
                        });
                      });
                  })
                  .catch((err) => {
                    res.json({
                      sucess: false,
                      msg: err,
                      block: "Answer.create",
                    });
                  });
              } else {
                res.json({
                  sucess: false,
                  msg: "Answer already exists",
                  block: "Answer.find",
                });
              }
            })
            .catch((err) => {
              res.json({ sucess: false, msg: err, block: "Answer.find" });
            });
        }
      })
      .catch((err) => {
        res.json({ sucess: false, msg: err, block: "User.find" });
      });
  }
};
