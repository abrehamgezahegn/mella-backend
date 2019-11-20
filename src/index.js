require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
// Routers
const rootRouter = require("./routers/root");
const authRouter = require("./routers/auth");
const jobRouter = require("./routers/job");
const orderRouter = require("./routers/order");

//middlewares
const authorize = require("./middlewares/authorize");

const app = express();

// mongoose db
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
app.use("/order", authorize, orderRouter);
app.use("/", rootRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
