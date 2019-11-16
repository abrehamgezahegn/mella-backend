const express = require("express");
const AfricasTalking = require("africastalking")({
  apiKey: "9226591bd449da342c47729778b10799687afdbfb25eb36c683d281616457c65",
  username: "sandbox"
});

const { User } = require("../schemas");
const passwordHash = require("../utils/passwordHash");
const getFourDigits = require("../utils/getFourDigits");

const sms = AfricasTalking.SMS;
const router = express.Router();

router.post("/register_phone", async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  try {
    // return if phoneNumber exists;
    const user = await User.findOne().where({ phoneNumber });
    if (user) return res.send("Phone number already exists");

    //save number with code in environment
    const code = getFourDigits(1000, 9000);
    process.env[phoneNumber] = code; // TODO: save to database

    // send code to number
    const response = await sms.send({
      from: "8082",
      to: phoneNumber,
      message: `${code} is your mella account verification code.`
    });

    if (response.SMSMessageData.Recipients[0].status !== "Success")
      return res.status(500).send("Something went south. Please try again.");

    res.send({
      status: "success",
      message: "code sent successfully",
      response
    });
  } catch (err) {
    res.send(err);
  }
});

router.post("/confirm_phone", async (req, res) => {
  const { code, phoneNumber, role } = req.body;

  try {
    const sentCode = process.env[phoneNumber];

    if (sentCode !== code)
      return res.status(403).send("Code doesn't match with what we sent");

    const user = new User({ phoneNumber });
    await user.save({ validateBeforeSave: false });
    res.send({ message: "Success!, Welcome to the family.", user });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/signup", async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).send("user not found.");

    const hash = await passwordHash(req.body.password);
    req.body.password = hash;

    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: req.body
      },
      { new: true }
    );

    const data = {
      skills: updatedUser.skills,
      skillTags: updatedUser.skillTags,
      _id: updatedUser._id,
      phoneNumber: updatedUser.phoneNumber,
      avatar: updatedUser.avatar,
      email: updatedUser.email,
      lastName: updatedUser.lastName,
      firstName: updatedUser.firstName,
      role: updatedUser.role
    };

    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
