const sql = require("./db.js");
var md5 = require("md5");

// constructor
const User = function(user) {
  this.email = user.email;
  this.username = user.username;
  this.password = md5(user.password); //hash this password
  this.firstname = user.firstname;
  this.lastname = user.lastname;
  this.company = user.company || '';
  this.activated = user.activated || 0;
  this.user_type = user.user_type || '';
  this.profile_picture = user.profile_picture || '';
  //this.date_created = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  this.confirmation_code = user.confirmation_code || '';
  this.activated = user.activated || 0;
  this.verified = user.verified || 0;
  this.about = user.about || '';
  this.company = user.company || '';
  this.job = user.job || '';
  this.country	= user.country || '';
  this.address	= user.address || '';
  this.social_twitter = user.social_twitter || '';
  this.social_facebook	= user.social_facebook || '';
  this.social_instagram = user.social_instagram || '';
  this.social_linkedin = user.social_linkedin || '';
  this.social_tiktok = user.social_tiktok || '';
};

// wprking now
User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};

//working now
User.findById = (id, result) => {
  sql.query(`SELECT * FROM users WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the id
    result({ kind: "not_found" }, null);
  });
};

//working now
User.findByUsername = (username, result) => {
  sql.query(`SELECT * FROM users WHERE username = '${username}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the id
    result({ kind: "not_found" }, null);
  });
};

// not tested: not yet in use
User.getAll = (email, result) => {
  let query = "SELECT * FROM users";

  if (email) {
    query += ` WHERE email LIKE '%${email}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};

User.getAllActivated = result => {
  sql.query("SELECT * FROM users WHERE activated=true", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};

User.updateById = (id, user, result) => {
  console.log(id + user);
  sql.query(
    "UPDATE users SET email = ?, username = ?, password = ?, firstname = ?, lastname = ?, activated = ?, user_type = ?, profile_picture = ?, confirmation_code	= ?, activated = ?, verified = ?, about	= ?, company	= ?, job	= ?, country	= ?, address	= ?, social_twitter = ?, social_facebook	= ?, social_instagram = ?, social_linkedin = ? WHERE id = ?",
    [user.email, user.username, user.password, user.firstname, user.lastname, user.activated, user.user_type, user.profile_picture, user.confirmation_code, user.activated, user.verified, user.about, user.company, user.job, user.country, user.address, user.social_twitter, user.social_facebook, user.social_instagram, user.social_linkedin, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found User with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated user: ", { id: id, ...user });
      result(null, { id: id, ...user });
    }
  );
};

User.remove = (id, result) => {
  sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with id: ", id);
    result(null, res);
  });
};

/*
// Caution (Danger): This model should not be activated 
User.removeAll = result => {
  sql.query("DELETE FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} users`);
    result(null, res);
  });
};
*/

module.exports = User;