var jwt = require("jsonwebtoken");
require("dotenv").config();

exports.getToken = (req, event) =>
  new Promise((resolve, reject) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(`{ event: ${event} --- username: ${req.body.username} }`);
    if (username && typeof username == "string" && password && typeof password == "string") {
      resolve(
        jwt.sign({ username: username }, process.env.SECRET_KEY, {
          expiresIn: "1h",
        })
      );
    } else {
      var resObj = {};
      if (!username || typeof username !== "string") {
        resObj = {
          ...resObj,
          msg1: "Invalid UserName",
        };
      }
      if (!password || typeof password !== "string") {
        resObj = {
          ...resObj,
          msg2: "Invalid Password",
        };
      }
      reject({sucess: false, resObj});
    }
  });

exports.verifyToken = (req, res, next) => {
  const verifyToken = () => {
    const parse_auth_header = req.header("authorization");
    if (parse_auth_header) {
      const parse_token = parse_auth_header.split(" ")[1];

      const decodedData = jwt.verify(
        parse_token,
        process.env.SECRET_KEY,
        function (err, decoded) {
          if (err) {
            res.sucessCode = 505;
            res.setHeader("Content-Type", "application/json");
            res.json([{ sucess: false, msg: err.name }]);
          } else {
            return decoded.username;
          }
        }
      );
      return decodedData;
    } else {
      res.sucessCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.json([{ sucess: false, msg: "Token Undefined" }]);
    }
  };

  return verifyToken();
};
