const mongoose = require("mongoose");

const phoneNumberList = new mongoose.Schema({
  phoneNumber: {
    type: Number,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  }
});

const PhoneNumberList = mongoose.model("PhoneNumberList", phoneNumberList);

module.exports = PhoneNumberList;
