const express = require("express");
const router = express.Router();
const database = require("../services/database");

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
router.get("/patients-dr:id", async function (req, res, next) {
  try {
    res.json(
      await database.getMultiplePatientsByDoctorID(
        req.params.id,
        req.query.page
      )
    );
  } catch (err) {
    console.error(`Error while getting data `, err.message);
    next(err);
  }
});

router.get("/teeth:id", async function (req, res, next) {
  try {
    res.json(await database.getTeethByID(req.params.id, req.query.page));
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

/* POST */
router.post("/patient", async function (req, res, next) {
  try {
    res.json(await database.createPatient(req.body));
  } catch (err) {
    console.error(`Error while creating data`, err.message);
    next(err);
  }
});

router.post("/visit", async function (req, res, next) {
  try {
    res.json(await database.createVisit(req.body));
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
