const express = require("express");
const at = require("africastalking");
const moment = require("moment");
const errorDebugger = require("debug")("app:error");

const AfricasTalking = at({
  apiKey: process.env.AFRICAS_TALKING_API_KEY,
  username: "sandbox",
});

const { User, PhoneNumberList } = require("../schemas");
const passwordHash = require("../utils/passwordHash");
const getFourDigits = require("../utils/getFourDigits");
const bcrypt = require("bcrypt");

const sms = AfricasTalking.SMS;
const router = express.Router();

router.post("/register_phone", async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  console.log("phone number", phoneNumber);
  try {
    // return if phoneNumber exists;
    const user = await User.findOne().where({ phoneNumber });
    if (user) return res.send("Phone number already exists");

    //save number with code in db
    const code = getFourDigits(1000, 9000);
    console.log("random code is ", code);

    const expiryDate = moment().add(
      process.env.REGISTRATION_CODE_EXPIRATION_LIFE,
      "m"
    );

    const phoneNumberDb = await PhoneNumberList.findOne().where({
      phoneNumber,
    });
    if (phoneNumberDb) {
      await PhoneNumberList.findByIdAndUpdate(
        {
          _id: phoneNumberDb._id,
        },
        { code, expiryDate },
        { new: true, runValidators: true, useFindAndModify: false }
      );
    } else {
      const phoneNumberList = new PhoneNumberList({
        code,
        expiryDate,
        phoneNumber,
      });
      await phoneNumberList.save();
    }

    // send code to number
    const response = await sms.send({
      from: "8082",
      to: phoneNumber,
      message: `${code} is your mella account verification code.`,
    });

    if (response.SMSMessageData.Recipients[0].status !== "Success")
      return res.status(500).send("Something went south. Please try again.");

    res.send({
      status: "success",
      message: "code sent successfully",
      response,
    });
  } catch (err) {
    console.log("err", err);
    errorDebugger(err);
    res.status(500).send(err);
  }
});

router.post("/confirm_phone", async (req, res) => {
  const { code, phoneNumber } = req.body;

  try {
    const phoneNumberDb = await PhoneNumberList.findOne().where({
      phoneNumber,
    });

    if (moment().isAfter(phoneNumberDb.expiryDate))
      return res
        .status(404)
        .send({ status: "expired", message: "Code has expired." });

    if (phoneNumberDb.code !== code)
      return res.status(403).send("Code doesn't match with what we sent");

    const user = new User({ phoneNumber });
    await user.save({ validateBeforeSave: false });

    const token = user.generateAuthToken();
    res.send({ message: "Success!, Welcome to the family.", user, token });
  } catch (err) {
    console.log(err);
    errorDebugger(err);
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
        $set: req.body,
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
      role: updatedUser.role,
    };

    const token = updatedUser.generateAuthToken();

    res.send({ data, token });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.post("/signin", async (req, res) => {
  // fetch email || phone_number  and password
  const { emailOrPhoneNumber, password } = req.body;

  // find by email || phone
  const user = await User.findOne({
    $or: [{ email: emailOrPhoneNumber }, { phoneNumber: emailOrPhoneNumber }],
  });

  if (!user) return res.status(404).send("email or password not correct!");

  // bcrypt password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(404).send("email or password not correct!");

  // generate token
  const token = user.generateAuthToken();

  // return user and token
  res.send({ user, token });
});

module.exports = router;
