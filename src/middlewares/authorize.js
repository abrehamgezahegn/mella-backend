const authorize = (req, res, next) => {
  const token = req.header("auth_token");
  if (!token) return res.status(401).send("You are unauthorized baba :).");

  req.body.user = { juke: "ross" };
  next();
};

module.exports = authorize;
