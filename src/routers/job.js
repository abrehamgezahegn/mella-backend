const express = require("express");
const { Job } = require("../schemas");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Jobs router is working kitfo fine :)");
});

router.get("/all", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.send(jobs);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, tags } = req.body;
    const job = new Job({ title, tags });
    await job.save();
    res.status(201).send("Job has been added!");
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const job = await Job.findById(id);
    res.send(job);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/", async (req, res) => {
  try {
    const { id, title, tags } = req.body;
    const updatedJob = await Job.findByIdAndUpdate(
      { _id: id },
      {
        title,
        tags
      },
      { new: true, runValidators: true }
    );
    res.send(updatedJob);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const confirm = await Job.findByIdAndDelete({ _id: id });
    if (!confirm) res.status(400).send("Item not found :(.");
    res.send(confirm);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
