const express = require("express");
const { User } = require("../schemas");

const router = express.Router();

router.put("/", async (req, res) => {
  try {
    const { id, longitude, latitude } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body
      },
      { new: true, runValidators: true }
    );
    res.send(updatedUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
  res.send("i hear!");
});

module.exports = router;
