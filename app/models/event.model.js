const sql = require("./db.js");

// constructor
const Event = function(event) {
  this.name = event.name;
  this.description = event.description;
  this.slug = event.slug;
  this.logo = event.logo;
  this.cover = event.cover;
  this.event_by = event.event_by; // session while creating
};

// working now
Event.create = (newEvent, result) => {
  sql.query("INSERT INTO events SET ?", newEvent, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created event: ", { id: res.insertId, ...newEvent });
    result(null, { id: res.insertId, ...newEvent });
  });
};

//working now
Event.findById = (id, result) => {
  sql.query(`SELECT * FROM events WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found event: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Event with the id
    result({ kind: "not_found" }, null);
  });
};

//working now
Event.findByEventslug = (slug, result) => {
  slug = slug;
  sql.query(`SELECT * FROM events WHERE slug = '${slug}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found event: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Event with the id
    result({ kind: "not_found" }, null);
  });
};

// not tested: not yet in use
Event.getAll = (email, result) => {
  let query = "SELECT * FROM events";

  if (email) {
    query += ` WHERE email LIKE '%${email}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("events: ", res);
    result(null, res);
  });
};

Event.getAllActivated = result => {
  sql.query("SELECT * FROM events WHERE activated=true", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("events: ", res);
    result(null, res);
  });
};

Event.updateById = (id, event, result) => {
  sql.query(
    "UPDATE events SET name = ?, description = ?, slug = ?, logo = ?, cover = ?, event_by = ?, created_datetime = ? WHERE id = ?",
    [event.name, event.description, event.slug, event.logo, event.cover, event.event_by, event.created_datetime, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Event with the id
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id, ...event });
    }
  );
};

Event.remove = (id, somereq, result) => {
  sql.query("DELETE FROM events WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Event with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted event with id: ", id);
    result(null, res);
  });
};

/*
// Caution (Danger): This model should not be activated 
Event.removeAll = result => {
  sql.query("DELETE FROM events", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} events`);
    result(null, res);
  });
};
*/

module.exports = Event;