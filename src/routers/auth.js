const express = require("express");
const AfricasTalking = require("africastalking")({
  apiKey: "9226591bd449da342c47729778b10799687afdbfb25eb36c683d281616457c65", // use your sandbox app API key for development in the test environment
  username: "sandbox"
});

const { User } = require("../schemas");

const getFourDigits = require("../utils/getFourDigits");

const sms = AfricasTalking.SMS;
const router = express.Router();

router.post("/phone", async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  try {
    // return if phoneNumber exists;
    // const user = await User.findOne().where({ phoneNumber });

    //save number with code in environment
    const code = getFourDigits(1000, 9000);
    process.env[phoneNumber] = code;

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
    console.log("sent code .....: ", sentCode);

    if (sentCode !== code)
      return res.status(403).send("Code doesn't match with what we sent");

    res.send({ message: "Success!, Welcome to the family.", user });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.put("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    role,
    skills,
    skillTags,
    avatar,
    id
  } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body
      },
      { new: true, runValidators: true }
    );
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
