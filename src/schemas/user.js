const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [1, "Why no name?"],
    maxLength: 30,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 30,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 40,
  },
  phoneNumber: {
    type: String,
    min: 10,
    max: 20,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["pro", "client"],
    required: true,
  },
  avatar: {
    type: String,
    required: function () {
      return this.role === "pro";
    },
  },
  skills: {
    type: [String],
    validate: {
      validator: function (skills) {
        return this.role !== "pro" || (skills && skills.length > 0);
      },
      message: "One atleast one skill is expected!",
    },
  },
  skillTags: {
    type: [String],
    validate: {
      validator: function (skillTags) {
        return this.role !== "pro" || (skillTags && skillTags.length > 0);
      },
      message: "One atleast one skill tag per skill is expected!",
    },
  },
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    require: true,
  },
  online: {
    type: Boolean,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET
  );
};

const User = mongoose.model("User", userSchema);

module.exports = User;
