const { isNumber } = require("underscore");
const User = require("../models/user.model.js");

// Working: Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
    }

    // Create a User
    const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        company: req.body.company,
        activated: req.body.activated || false
    });
    
    // Save User in the database
    User.create(user, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the User."
        });
        else res.send(data);
    });
};

// Retrieve all Users from the database (with condition).
exports.findAll = (req, res) => {
    const email = req.query.email;

    User.getAll(email, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving users."
        });
        else res.send(data);
    });
    };

    exports.findAllActivated = (req, res) => {
    User.getAllActivated((err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving users."
        });
        else res.send(data);
    });
};

// Find a single User with a id
// Working: find single user
exports.findOne = (req, res) => {
  if (isNumber(parseInt(req.params.id))){
    User.findById(req.params.id, (err, data) => {
      if (err) {
      if (err.kind === "not_found") {
          res.status(404).send({
          message: `Not found User with id ${req.params.id}.`
          });
      } else {
          res.status(500).send({
          message: "Error retrieving User with id " + req.params.id
          });
      }
      } else res.send(data);
    }); 
  } else {
    User.findByUsername(req.params.id, (err, data) => {
      if (err) {
      if (err.kind === "not_found") {
          res.status(404).send({
          message: `Not found User with id ${req.params.id}.`
          });
      } else {
          res.status(500).send({
          message: "Error retrieving User with id " + req.params.id
          });
      }
      } else res.send(data);
    });
  }
};

// find all activated Users
exports.findAllActivated = (req, res) => {
  
};

// Update a User identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    
    User.updateById(
      req.params.id,
      new User(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found User with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating User with id " + req.params.id
            });
          }
        } else res.send(data);
      }
    );
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
// Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    
    User.remove(
        req.params.id,
        (err, data) => {
          if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                message: `Not found User with id ${req.params.id}.`
              });
            } else {
              res.status(500).send({
                message: "Error updating User with id " + req.params.id
              });
            }
          } else res.send(data);
        }
    );
};

// Caution Danger: do not use except necessary
// Delete all Users from the database.
exports.deleteAll = (req, res) => {
    User.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all users."
        });
      else res.send({ message: `All Users were deleted successfully!` });
    });
};