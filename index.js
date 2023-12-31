const express = require("express");
const app = express();
const port = 3001;
const databaseRouter = require("./routes/database");

const authRouter = require("./routes/auth");
const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");
const cors = require("cors");
const corsConfig = {
  origin: "http://localhost:3000",
  optionSuccessStatus: 200,
  credentials: true,
};

app.use(express.json({ limit: "50mb" }));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());
app.use(cors(corsConfig));
app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use("/database", databaseRouter);
app.use("/auth", authRouter);
app.use(express.static("public"));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

app.listen(port, () => {
  console.log(`Database listening at http://localhost:${port}`);
});
