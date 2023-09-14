const express = require("express");
const router = express.Router();
const database = require("../services/database");
const crypto = require("crypto");
const { activeSessions, newSession } = require("../services/sessions");

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    console.log(email);
    console.log(password);
    console.error("missing credentials");
    res.status(400).json({ message: "missing credentials" });
    return;
  }

  try {
    const rows = await database.getDoctorByCredentials(email, password);
    if (!rows) {
      res.status(304).json({ message: "incorrect credentials" });
    } else {
      const sessionId = newSession(rows.data[0]);
      res.json({ session: sessionId });
    }
  } catch (err) {
    console.error("something went wrong with db");
    next(err);
  }
});

router.post("/me", async (req, res, next) => {
  const { sessionId } = req.cookies;
  if (!sessionId) {
    res.status(400).json({ message: "missing sessionData" });
    return;
  }

  const doctor = activeSessions.get(sessionId);
  if (!doctor) {
    res.status(400).json({
      message: "Session expired. Please log in again.",
    });
  } else {
    res.json({
      email: doctor.Email,
      name: doctor.Name,
      surname: doctor.Surname,
    });
  }
});

module.exports = router;
