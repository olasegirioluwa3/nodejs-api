const { isNumber, isEmpty } = require("underscore");
const Attendee = require("../models/attendee_data.model.js");
const Event = require("../models/event.model.js");

// DO NOT CALL CREATE METHOD DIRECTLY
// Working: Create and Save a new Attendee
exports.create = (req, res) => {
  console.log(req.body);
    // Validate request
    if (!req.body) {
      res.status(400).send({
      message: "Content can not be empty!"
      });
    }

    // Create a Attendee
    const attendee = new Attendee({
        name: req.body.name,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        company: req.body.company,
        designation: req.body.designation,
        event_id: req.body.event_id,
    });
    
    // Save Attendee in the database
    Attendee.create(attendee, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Attendee."
        });
        else res.send(data);
    });
};

// Working: Create and Save a new Attendee based on event
exports.createAttendee = (req, res) => {
  // declare slug from params
  var myslug = req.params.id; // security fix needed
  var myeventid = 0;
  
  // verifying the :id as slug exist
  Event.findByEventslug(myslug, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
          res.status(404).send({
          message: `Not found Event with id ${myslug}.`
          });
      } else {
          res.status(500).send({
          message: "Error retrieving Event with id " + myslug
          });
      }
    } else {
      // update event_id needed to create attendee
      myeventid = data.id;

      console.log(req.body);
      // Validate request
      if (isEmpty(req.body)) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
      }

      // Create a Event
      const attendee = new Attendee({
        name: req.body.name,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        company: req.body.company,
        designation: req.body.designation,
        event_id: myeventid,
      });

      // Save Attendee in the database
      Attendee.create(attendee, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Event."
        });
        else res.send(data);
      });
    }
  });
}
  
// Retrieve all Attendees from the database (with condition).
exports.findAll = (req, res) => {
    const email = req.query.email;

    Attendee.getAll(email, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving attendees."
        });
        else res.send(data);
    });
};

// Retrieve all Attendees from the database (with condition).
exports.findAllPerEvent = (req, res) => {
  const email = req.query.email;
  
  // declare slug from params
  var myslug = req.params.id; // security fix needed
  var myeventid = 0;
  
  // verifying the :id as slug exist
  Event.findByEventslug(myslug, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
          res.status(404).send({
          message: `Not found Event with id ${myslug}.`
          });
      } else {
          res.status(500).send({
          message: "Error retrieving Event with id " + myslug
          });
      }
    } else {
      // update event_id needed to create attendee
      myeventid = data.id;

      Attendee.getAllAttendeeByEventId(myeventid, (err, data) => {
          if (err)
          res.status(500).send({
              message:
              err.message || "Some error occurred while retrieving attendees."
          });
          else res.send(data);
      });
    }
  });
};

exports.findAllActivated = (req, res) => {
    Attendee.getAllActivated((err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving attendees."
        });
        else res.send(data);
    });
};

// Find a single Attendee with a id
// Working: find single attendee
exports.findOne = (req, res) => {
  if (isNumber(parseInt(req.params.id))){
    Attendee.findById(req.params.id, (err, data) => {
      if (err) {
      if (err.kind === "not_found") {
          res.status(404).send({
          message: `Not found Attendee with id ${req.params.id}.`
          });
      } else {
          res.status(500).send({
          message: "Error retrieving Attendee with id " + req.params.id
          });
      }
      } else res.send(data);
    });
  } else 
  res.status(404).send({
    message: `Must be a number ${req.params.id}.`
  });
};

// find all activated Attendees
exports.findAllActivated = (req, res) => {
  
};

// Update a Attendee identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    console.log(req.body);
  
    Attendee.updateById(
      req.params.id,
      new Attendee(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Attendee with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Attendee with id " + req.params.id
            });
          }
        } else res.send(data);
      }
    );
};

// Delete a Attendee with the specified id in the request
exports.delete = (req, res) => {
// Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    console.log(req.body);

    Attendee.remove(
        req.params.id,
        //new Attendee(req.body),
        (err, data) => {
          if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                message: `Not found Attendee with id ${req.params.id}.`
              });
            } else {
              res.status(500).send({
                message: "Error updating Attendee with id " + req.params.id
              });
            }
          } else res.send(data);
        }
    );
};

// Caution Danger: do not use except necessary
// Delete all Attendees from the database.
exports.deleteAll = (req, res) => {
    Attendee.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all attendees."
        });
      else res.send({ message: `All Attendees were deleted successfully!` });
    });
};