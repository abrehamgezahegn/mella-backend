const express = require("express");
const mongoose = require("mongoose");
// Routers
const rootRouter = require("./routers/root");
const jobRouter = require("./routers/job");
const authRouter = require("./routers/auth");

//middlewares
const authorize = require("./middlewares/authorize");

const app = express();

// mongoose db connection
mongoose
  .connect("mongodb://localhost/mella", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("connected to mongoose");
  })
  .catch(err => {
    console.log(err);
  });

app.use(express.json());

app.use("/job", jobRouter);
app.use("/auth", authRouter);
app.use("/", rootRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
