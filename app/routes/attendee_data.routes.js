module.exports = app => {
  const attendees = require("../controllers/attendee_data.controller.js");

  var router = require("express").Router();

  // Create a new AttendeeData depreciated
  router.post("/", attendees.create); //working now

  // Create a new AttendeeData
  router.post("/events/:id", attendees.createAttendee); //working now

  // Retrieve all AttendeeDatas
  router.get("/", attendees.findAll);

  // Retrieve all AttendeeDatas of an event
  router.get("/events/:id", attendees.findAllPerEvent);
  
  // Retrieve a single AttendeeData with id
  router.get("/:id", attendees.findOne);

  // Update a AttendeeData with id
  router.put("/:id", attendees.update);

  // Delete a AttendeeData with id
  router.delete("/:id", attendees.delete);

  // Delete all AttendeeDatas
  router.delete("/", attendees.deleteAll);

  app.use('/api/attendees', router);
};