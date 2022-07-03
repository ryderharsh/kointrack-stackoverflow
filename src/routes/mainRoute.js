const express = require("express");

//import controllers
const jwtauthController = require("../controllers/jwtauth");
const loginController = require("../controllers/login");
const signupController = require("../controllers/signup");
const questionController = require("../controllers/question");
const answercontroller = require("../controllers/answer");

//router setup
const apiRouter = express.Router();
apiRouter.use(express.json());

//for login
apiRouter.post("/login", function (req, res, next) {
  jwtauthController
    .getToken(req, "login")
    .then((token) => loginController.login(token, req, res, next))
    .catch((token) => loginController.login(token, req, res, next));
});

//for signup
apiRouter.post("/signup", function (req, res, next) {
  jwtauthController
    .getToken(req, "signup")
    .then((token) => signupController.signup(token, req, res, next))
    .catch((token) => signupController.signup(token, req, res, next));
});

//for get question
apiRouter.get("/getquestion", (req, res, next) => {
  const token_userid = jwtauthController.verifyToken(req, res, next);
  questionController.getquestion(token_userid, req, res, next);
});

//for create question
apiRouter.post("/createquestion", (req, res, next) => {
  const token_userid = jwtauthController.verifyToken(req, res, next);
  questionController.createquestion(token_userid, req, res, next);
});

//for upadate question
apiRouter.put("/upadatequestion", (req, res, next) => {
  const token_userid = jwtauthController.verifyToken(req, res, next);
  questionController.updatequestion(token_userid, req, res, next);
});

//for create answer
apiRouter.post("/createanswer", (req, res, next) => {
  const token_userid = jwtauthController.verifyToken(req, res, next);
  answercontroller.createanswer(token_userid, req, res, next);
});

module.exports = apiRouter;
