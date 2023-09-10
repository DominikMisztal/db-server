const db = require("./db");
const helper = require("../helper");
const config = require("../config");

async function getMultipleDoctors(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * 
    FROM doctors LIMIT ${offset},${config.listPerPage}`
  );
  console.log(rows[0].ID);
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

async function getMultiplePatients(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT *
    FROM patients LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

async function getMultiplePatientsByID(ID, page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT *
    FROM patients WHERE ID = ${ID.substring(1)} LIMIT ${offset},${
      config.listPerPage
    }`
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

async function getMultiplePatientsByDoctorID(ID, page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT *
    FROM patients WHERE doctor = ${ID.substring(1)} LIMIT ${offset},${
      config.listPerPage
    }`
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

async function getTeethByID(ID, page = 1) {
  const rows = await db.query(
    `SELECT *
    FROM teeth WHERE ID = ${ID.substring(1)}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

async function getPhotosByID(ID, page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT *
    FROM photos WHERE ID = ${ID.substring(1)} LIMIT ${offset},${
      config.listPerPage
    }`
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

async function getVisits(ID, page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT *
    FROM visits LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

async function getVisitsByDoctorID(ID, page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT *
    FROM visits WHERE doctor = ${ID.substring(1)} LIMIT ${offset},${
      config.listPerPage
    }`
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

async function createPatient(patient) {
  const result = await db.query(
    `INSERT INTO patients 
    (Name, Surname, Age, Pesel, Birthday, Gender) 
    VALUES 
    ("${patient.name}", ${patient.surname}, ${patient.age}, ${patient.pesel}, ${patient.birthday}, ${patient.gender}, ${patient.birthday})`
  );

  let message = "Error in creating patient";

  if (result.affectedRows) {
    message = "patient created successfully";
  }
  let row = await db.query(`SELECT * from patients order by ID desc LIMIT 1`);

  let patient_id = row[0].ID;
  await db.query(
    `INSERT INTO teeth 
    (patient) 
    VALUES 
    ("${patient_id}")`
  );

  row = await db.query(`SELECT * from teeth order by ID desc LIMIT 1`);

  teeth_id = row[0].ID;
  await db.query(
    `UPDATE patients
    SET teeth = ${teeth_id}
    WHERE ID = ${patient_id}`
  );

  return { message };
}

async function createVisit(visit) {
  const result = await db.query(
    `INSERT INTO visits 
    (patient, doctor, date, duration, teeth) 
    VALUES 
    ("${visit.patient}", ${visit.doctor}, ${visit.date}, ${visit.duration}, ${visit.teeth}, ${patient.gender}, ${patient.birthday})`
  );

  let message = "Error in creating patient";

  if (result.affectedRows) {
    message = "patient created successfully";
  }

  return { message };
}

async function createNewPhoto(filename, visitId) {
  const result = await db.query(
    `INSERT INTO photos (filename, visitID) VALUES ("${filename}", ${visitId})`
  );

  if (result.affectedRows) {
    return { message: "photo created successfully" };
  } else {
    return { message: "shit broke" };
  }
}

async function createNewTeethForPatientByID(ID, patient) {
  const result = await db.query(
    `INSERT INTO teeth 
    (patient) 
    VALUES 
    ("${patient.ID}")`
  );

  row = await db.query(`SELECT * from teeth order by ID desc LIMIT 1`);

  teeth_id = row[0].ID;
  await db.query(
    `UPDATE patients
    SET teeth = ${teeth_id}
    WHERE ID = ${patient.id}`
  );

  let message = "Error in creating patient";

  if (result.affectedRows) {
    message = "Patient created successfully";
  }

  return { message };
}

async function updatePatient(id, patient) {
  const result = await db.query(
    `UPDATE patients 
    SET Name="${patient.name}", Surname="${patient.surname}", Age="${patient.age}", Pesel="${patient.pesel}",
    Birthday="${patient.birthday}", Gender="${patient.gender}", TeethLatest="${patient.teeth}", 
    Doctor="${patient.doctor}"
    WHERE id=${id}`
  );

  let message = "Error in updating patient data";

  if (result.affectedRows) {
    message = "Patient data updated successfully";
  }

  return { message };
}

async function updateTeeth(id, teeth) {
  const result = await db.query(
    `UPDATE teeth
    SET t1="${teeth.t1}", t2="${teeth.t2}", t3="${teeth.t3}", 
    t4="${teeth.t4}", t5="${teeth.t5}", t6="${teeth.t6}", 
    t7="${teeth.t7}", t8="${teeth.t8}", t9="${teeth.t9}", 
    t10="${teeth.t10}", t11="${teeth.t11}", t12="${teeth.t12}", 
    t13="${teeth.t13}", t14="${teeth.t14}", t15="${teeth.t15}", 
    t16="${teeth.t16}", t17="${teeth.t17}", t18="${teeth.t18}", 
    t19="${teeth.t19}", t20="${teeth.t20}", t21="${teeth.t21}",
    t22="${teeth.t22}", t23="${teeth.t23}", t24="${teeth.t24}",
    t25="${teeth.t25}", t26="${teeth.t26}", t27="${teeth.t27}",  
    t28="${teeth.t28}", t29="${teeth.t29}", t30="${teeth.t30}"
    t31="${teeth.t31}", t32="${teeth.t32}"
    WHERE id=${id}`
  );

  let message = "Error in updating teeth";

  if (result.affectedRows) {
    message = "Teeth updated successfully";
  }

  return { message };
}

async function remove(id) {
  const result = await db.query(`DELETE FROM * WHERE id=${id}`);

  let message = "Error in deleting data";

  if (result.affectedRows) {
    message = "Data deleted successfully";
  }

  return { message };
}

module.exports = {
  getMultipleDoctors,
  getMultiplePatients,
  getMultiplePatientsByID,
  getMultiplePatientsByDoctorID,
  getTeethByID,
  getPhotosByID,
  getVisits,
  getVisitsByDoctorID,
  createNewTeethForPatientByID,
  createPatient,
  createNewPhoto,
  createVisit,
  updatePatient,
  updateTeeth,
  remove,
};
