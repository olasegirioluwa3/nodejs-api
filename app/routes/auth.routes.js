module.exports = app => {
  const authy = require("../controllers/auth.controller.js");

  var router = require("express").Router();

  // check account exist
  router.post("/", authy.create);

  // activate account from account info
  router.get("/:id", authy.findOne);

  // Update auth information session cookie
  router.put("/:id", authy.update);

  // logout
  router.delete("/:id", authy.delete);

  app.use('/auth', router);
};