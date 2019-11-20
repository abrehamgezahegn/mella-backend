const jwt = require("jsonwebtoken");

const authorize = (req, res, next) => {
  try {
    const token = req.header("auth_token");
    if (!token) return res.status(401).send("You are unauthorized baba :).");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.body.token_body = decoded;

    next();
  } catch (err) {
    res.status(500).send({ message: "Something went wrong", error: err });
  }
};

module.exports = authorize;
