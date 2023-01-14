const { isNumber, isEmpty } = require("underscore");
const Event = require("../models/event.model.js");
const Attendee = require("../models/attendee_data.model.js");

// Working: Create and Save a new Event
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
      message: "Content can not be empty!"
      });
    }

    // Create a Event
    const event = new Event({
        name: req.body.name,
        description: req.body.description,
        slug: req.body.slug,
        logo: req.body.logo,
        cover: req.body.cover,
        event_by: req.body.event_by,
    });
    
    // Save Event in the database
    Event.create(event, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Event."
        });
        else res.send(data);
    });
};

// Working: Create and Save a new Attendee based on event
exports.createAttendee = (req, res) => {
  // declare slug from params
  var myslug = req.params.id; // security fix needed
  var myeventid = 0;

  // verifying the :id as slug
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

      console.log(req.body);

      // Save Attendee in the database
      Attendee.create(attendee, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Event."
        });
        else res.send(data);
      });

      
      // res.send(data);
    }
  });
};

// Retrieve all Events from the database (with condition).
// Retrieve all Events from the database (with condition).
exports.findAll = (req, res) => {
    const email = req.query.email;

    Event.getAll(email, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving events."
        });
        else res.send(data);
    });
};

exports.findAllActivated = (req, res) => {
    Event.getAllActivated((err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving events."
        });
        else res.send(data);
    });
};

// Find a single Event with a id
// Working: find single event
exports.findOne = (req, res) => {
  if (isNumber(req.params.id)){
    
  console.log("i was called");
    Event.findById(req.params.id, (err, data) => {
      if (err) {
      if (err.kind === "not_found") {
          res.status(404).send({
          message: `Not found Event with id ${req.params.id}.`
          });
      } else {
          res.status(500).send({
          message: "Error retrieving Event with id " + req.params.id
          });
      }
      } else res.send(data);
    });
  } else {
    Event.findByEventslug(req.params.id, (err, data) => {
      if (err) {
      if (err.kind === "not_found") {
          res.status(404).send({
          message: `Not found Event with id ${req.params.id}.`
          });
      } else {
          res.status(500).send({
          message: "Error retrieving Event with id " + req.params.id
          });
      }
      } else res.send(data);
    });
  }
};

// find all activated Events
exports.findAllActivated = (req, res) => {
  
};

// Update a Event identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    console.log(req.body);
  
    Event.updateById(
      req.params.id,
      new Event(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Event with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Event with id " + req.params.id
            });
          }
        } else res.send(data);
      }
    );
};

// Delete a Event with the specified id in the request
exports.delete = (req, res) => {
// Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Event.remove(
        req.params.id,
        new Event(req.body),
        (err, data) => {
          if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                message: `Not found Event with id ${req.params.id}.`
              });
            } else {
              res.status(500).send({
                message: "Error updating Event with id " + req.params.id
              });
            }
          } else res.send(data);
        }
    );
};

// Caution Danger: do not use except necessary
// Delete all Events from the database.
exports.deleteAll = (req, res) => {
    Event.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all events."
        });
      else res.send({ message: `All Events were deleted successfully!` });
    });
};