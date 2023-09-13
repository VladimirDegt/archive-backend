const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const authRouter = require("./routes/api/auth");
const filesRouter = require("./routes/api/file");
const archiveRouter = require("./routes/api/archive");
const multiDataStoreRouter = require("./routes/api/multi-data-store");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use("/users", authRouter);
app.use("/api/file", filesRouter);
app.use("/api/archive", archiveRouter);
app.use("/api/multiDataStore", multiDataStoreRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _, res, __) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
