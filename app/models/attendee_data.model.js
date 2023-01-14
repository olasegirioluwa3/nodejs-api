const sql = require("./db.js");

// constructor
const Attendee = function(attendee) {
  this.name = attendee.name;
  this.email = attendee.email;
  this.phonenumber = attendee.phonenumber;
  this.company = attendee.company;
  this.designation = attendee.designation;
  this.event_id = attendee.event_id; // session while creating
};

// wprking now
Attendee.create = (newAttendee, result) => {
  sql.query("INSERT INTO attendee_data SET ?", newAttendee, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created attendee: ", { id: res.insertId, ...newAttendee });
    result(null, { id: res.insertId, ...newAttendee });
  });
};

//working now
Attendee.findById = (id, result) => {
  sql.query(`SELECT * FROM attendee_data WHERE id = '${id}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found attendee: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Attendee with the id
    result({ kind: "not_found" }, null);
  });
};

// not needed not tested
Attendee.findAllAttendeeByEventId = (id, result) => {
  sql.query(`SELECT * FROM attendee_data WHERE event_id = '${id}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found attendee: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Attendee with the id
    result({ kind: "not_found" }, null);
  });
};

// not tested: not yet in use
Attendee.getAll = (email, result) => {
  let query = "SELECT * FROM attendee_data";

  if (email) {
    query += ` WHERE email LIKE '%${email}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("attendees: ", res);
    result(null, res);
  });
};

Attendee.getAllAttendeeByEventId = (id, result) => {
  sql.query(`SELECT * FROM attendee_data WHERE event_id = '${id}'`, (err, res) => {
    
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("attendees: ", res);
    result(null, res);
  });
};

Attendee.updateById = (id, attendee, result) => {
  sql.query(
    "UPDATE attendee_data SET name = ?, email = ?, phonenumber = ?, company = ?, designation = ? WHERE id = ?",
    [attendee.name, attendee.email, attendee.phonenumber, attendee.company, attendee.designation, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Attendee with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated attendee: ", { id: id, ...attendee });
      result(null, { id: id, ...attendee });
    }
  );
};

Attendee.remove = (id, result) => {
  sql.query("DELETE FROM attendee_data WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Attendee with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted attendee with id: ", id);
    result(null, res);
  });
};

/*
// Caution (Danger): This model should not be activated 
Attendee.removeAll = result => {
  sql.query("DELETE FROM attendees", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} attendees`);
    result(null, res);
  });
};
*/

module.exports = Attendee;