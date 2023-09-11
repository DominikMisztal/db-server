const express = require("express");
const app = express();
const port = 3001;
const databaseRouter = require("./routes/database");
const authRouter = require("./routes/auth");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use("/database", databaseRouter);
app.use("/auth", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

app.listen(port, () => {
  console.log(`Database listening at http://localhost:${port}`);
});
