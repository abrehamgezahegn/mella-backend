const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  job: {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    }
  },
  jobTags: {
    type: [String],
    required: true
  },
  candidatePros: {
    // pros that  accepted the request
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        res: "User"
      }
    ]
  },
  requestedPros: {
    // pros that received a request
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        res: "User"
      }
    ]
  },
  acceptedPro: {
    // pro chosen by the client
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  client: {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
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
    enum: ["pending", "canceled", "ongoing", "complete"],
    default: "pending",
    required: true
  }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
