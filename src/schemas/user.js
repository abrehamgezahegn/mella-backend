const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firsName: {
    type: String,
    required: true,
    minLength: [1, "Why no name?"],
    maxLength: 30
  },
  lastName: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 30
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    min: 10,
    max: 20,
    required: true
  },
  role: {
    type: String,
    enum: ["pro", "client"],
    required: true
  },
  avatar: {
    type: String,
    required: function() {
      return this.role === "pro";
    }
  },
  skills: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
      }
    ],
    required: [
      function() {
        return this.role === "pro";
      },
      "One skill is a must!"
    ]
  },
  skillTags: {
    type: [String],
    required: true,
    validate: {
      validator: function(skillTags) {
        return skillTags && skillTags.length > 0;
      },
      message: "One atleast one skill tag per skill is expected!"
    }
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
