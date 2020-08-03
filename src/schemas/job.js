const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  tags: {
    type: [String],
    validate: {
      validator: function(tags) {
        return tags && tags.length > 0;
      },
      message: "Atleast one job tag is expected"
    }
  }
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
