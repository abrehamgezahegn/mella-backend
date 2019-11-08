const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  job: {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job"
    },
    required: true
  },
  pro: {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    required: true
  },
  client: {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    required: true
  },
  scheduled: {
    type: Boolean
  },
  scheduleTime: {
    type: String,
    required: this.scheduled
  },
  note: {
    type: String
  },
  longitude: {
    type: String,
    required: true
  },
  latitude: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "canceled", "matched"],
    default: "pending",
    required: true
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
