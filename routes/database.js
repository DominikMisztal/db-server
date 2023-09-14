const express = require("express");
const router = express.Router();
const database = require("../services/database");

const { activeSessions } = require("../services/sessions");

//authorize requests
router.use((req, res, next) => {
  const { sessionId } = req.cookies;
  if (!sessionId) {
    next({ statusCode: 403, message: "user not logged in" });
    return;
  }

  if (activeSessions.has(sessionId)) {
    next();
  } else {
    next({ statusCode: 403, message: "session expired" });
  }
});

const fs = require("fs");
const crypto = require("crypto");

/* GET */
router.get("/doctors", async function (req, res, next) {
  try {
    res.json(await database.getMultipleDoctors(req.query.page));
  } catch (err) {
    console.error(`Error while getting data `, err.message);
    next(err);
  }
});

router.get("/patients", async function (req, res, next) {
  try {
    res.json(await database.getMultiplePatients(req.query.page));
  } catch (err) {
    console.error(`Error while getting data `, err.message);
    next(err);
  }
});

router.get("/patients:id", async function (req, res, next) {
  try {
    res.json(
      await database.getMultiplePatientsByID(req.params.id, req.query.page)
    );
  } catch (err) {
    console.error(`Error while getting data `, err.message);
    next(err);
  }
});

router.get("/my_patients", async function (req, res, next) {
  const { sessionId } = req.cookies;
  const doctorId = activeSessions.get(sessionId).ID;
  const page = req.params.page;
  console.log(req.query.page);
  try {
    res.json(
      await database.getMultiplePatientsByDoctorID(doctorId, req.query.page)
    );
  } catch (err) {
    console.error(`Error while getting data `, err.message);
    next(err);
  }
});

router.get("/teeth:id", async function (req, res, next) {
  try {
    res.json(await database.getTeethByPatientID(req.params.id, req.query.page));
  } catch (err) {
    console.error(`Error while getting data `, err.message);
    next(err);
  }
});

router.get("/photos:id", async function (req, res, next) {
  try {
    res.json(await database.getPhotosByID(req.params.id, req.query.page));
  } catch (err) {
    console.error(`Error while getting data `, err.message);
    next(err);
  }
});

router.get("/operations", async function (req, res, next) {
  try {
    res.json(await database.getOperations(req.query.page));
  } catch (err) {
    console.error(`Error while getting data `, err.message);
    next(err);
  }
});

router.get("/operations:id", async function (req, res, next) {
  try {
    res.json(await database.getOperationsByID(req.params.id, req.query.page));
  } catch (err) {
    console.error(`Error while getting data `, err.message);
    next(err);
  }
});

/* POST */
router.post("/patient", async function (req, res, next) {
  const sessionId = req.cookies.sessionId;

  const id = activeSessions.get(sessionId).ID;
  try {
    res.json(await database.createPatient(req.body, id));
  } catch (err) {
    console.error(`Error while creating data`, err.message);
    next(err);
  }
});

router.post("/visit", async function (req, res, next) {
  const doctor = activeSessions.get(req.cookies.sessionId).ID;
  const { data: teeth } = await database.getTeethByPatientID(req.body.patient);
  const data = { ...req.body, doctor, teeth: teeth[0].ID };

  try {
    res.json(await database.createVisit(data));
  } catch (err) {
    console.error(`Error while creating data`, err.message);
    next(err);
  }
});

router.post("/teeth:id", async function (req, res, next) {
  try {
    res.json(
      await database.createNewTeethForPatientByID(req.params.id, req.body)
    );
  } catch (err) {
    console.error(`Error while creating data`, err.message);
    next(err);
  }
});

router.post("/upload_photo:id", async function (req, res, next) {
  const visitId = req.params.id;
  //get just base64 encoded data
  const trimmedData = req.body.data.replace(/^data:image\/\w+;base64,/, "");
  const photoData = Buffer.from(trimmedData, "base64");
  const filename = crypto.randomUUID() + ".jpg";
  fs.writeFile(`public/${filename}`, photoData, async (err) => {
    if (err) {
      console.error("failed to save file to local filesystem");
      next(err);
      return;
    }

    try {
      res.json(await database.createNewPhoto(filename, visitId));
    } catch (err) {
      console.error(`Error while creating data`, err.message);
      next(err);
    }
  });
});

/* PUT */
router.put("/patient:id", async function (req, res, next) {
  try {
    res.json(await database.updatePatient(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating data`, err.message);
    next(err);
  }
});

router.put("/teeth:id", async function (req, res, next) {
  try {
    res.json(await database.updateTeeth(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating data`, err.message);
    next(err);
  }
});

/* DELETE */
router.delete("/:id", async function (req, res, next) {
  try {
    res.json(await database.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting data`, err.message);
    next(err);
  }
});

module.exports = router;
