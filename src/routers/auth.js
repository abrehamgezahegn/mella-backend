const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("shit is working baba");
});

module.exports = router;
