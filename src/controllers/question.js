var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

//models for db
const User = require("../models/userModel");
const Question = require("../models/questionModel");
const Answer = require("../models/answerModel");

exports.getquestion = (token, req, res, next) => {
  if (token != undefined) {
    User.findOne({ username: token })
      .then((data) => {
        if (data.username != undefined) {
          const userid = data._id;
          const questionid = req.body.questionid;
          if (!questionid || typeof questionid != "string") {
            res.json({ sucess: false, msg: "Question ID Incorrect" });
          } else {
            if (!questionid.match(/^[0-9a-fA-F]{24}$/)) {
              res.json({ sucess: false, msg: "Wrong Format of Question ID" });
            } else {
              Question.find({ _id: questionid })
                .then((data) => {
                  if (data.length == 0) {
                    res.json({ sucess: false, msg: "No Data Found" });
                  } else {
                    Question.findOneAndUpdate(
                      { _id: questionid },
                      { $set: { popularity: data[0].popularity + 1 } },
                      { new: true }
                    )
                      .then((data) => {
                        const answerid = data.answerid;
                        Answer.find({ _id: { $in: answerid } })
                          .then((newdata) => {
                            res.json({
                              sucess: true,
                              data: data,
                              answers: newdata,
                            });
                          })
                          .catch((err) => {
                            res.json({
                              sucess: false,
                              msg: err,
                              block: "Answer.find",
                            });
                          });
                      })
                      .catch((err) => {
                        res.json({
                          sucess: false,
                          msg: err,
                          block: "Question.findOneAndUpdate",
                        });
                      });
                  }
                })
                .catch((err) => {
                  res.json({
                    sucess: false,
                    msg: err,
                    block: "Question.find",
                  });
                });
            }
          }
        } else {
          console.log({ sucess: false, msg: "User Not Found!" });
        }
      })
      .catch((err) => {
        res.json({ sucess: false, msg: err, block: "User.find" });
      });
  }
};

exports.createquestion = (token, req, res, next) => {
  if (token != undefined) {
    User.findOne({ username: token })
      .then((data) => {
        if (data.username != undefined) {
          const userid = data._id;
          const questiondesc = req.body.questiondesc;
          if (!questiondesc || typeof questiondesc != "string") {
            res.json({ sucess: false, msg: "Question Description Incorrect" });
          } else {
            const obj = {
              questiondesc: questiondesc,
              createdby: userid,
            };
            Question.create(obj)
              .then((data) => {
                res.json({ sucess: true, data: data });
              })
              .catch((err) => {
                res.json({ sucess: false, msg: err, block: "Question.create" });
              });
          }
        } else {
          res.json({ sucess: false, msg: "User Not Found!" });
        }
      })
      .catch((err) => {
        res.json({ sucess: false, msg: err, block: "User.find" });
      });
  }
};

exports.updatequestion = (token, req, res, next) => {
  if (token != undefined) {
    User.findOne({ username: token })
      .then((data) => {
        if (data.username != undefined) {
          const userid = data._id;
          const questionid = req.body.questionid;
          const createdby = req.body.userid;
          const questiondesc = req.body.questiondesc;
          if (
            !questionid ||
            typeof questionid != "string" ||
            !questionid.match(/^[0-9a-fA-F]{24}$/)
          ) {
            res.json({ sucess: false, msg: "Question ID Incorrect" });
          } else if (
            !createdby ||
            typeof createdby != "string" ||
            !createdby.match(/^[0-9a-fA-F]{24}$/)
          ) {
            res.json({ sucess: false, msg: "User ID Incorrect" });
          } else if (!questiondesc || typeof questiondesc != "string") {
            res.json({ sucess: false, msg: "Question Description Incorrect" });
          } else if (userid != createdby) {
            res.json({
              sucess: false,
              msg: "Pusblisher of this question is not same",
            });
          } else {
            Question.findOneAndUpdate(
              { _id: questionid, createdby: createdby },
              { $set: { questiondesc: questiondesc } },
              { new: true }
            )
              .then((data) => {
                if (data == null) {
                  res.json({ sucess: false, msg: "No Data Found" });
                } else {
                  res.json({ sucess: true, data: data });
                }
              })
              .catch((err) => {
                res.json({ sucess: false, msg: err, block: "Question.create" });
              });
          }
        } else {
          res.json({ sucess: false, msg: "User Not Found!" });
        }
      })
      .catch((err) => {
        res.json({ sucess: false, msg: err, block: "User.find" });
      });
  } else {
    res.json([{ sucess: false, msg: "Please Login Again!" }]);
  }
};
