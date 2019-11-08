const express = require("express");

// Routers
const rootRouter = require("./src/routers/root");

const app = express();

app.use("/", rootRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
