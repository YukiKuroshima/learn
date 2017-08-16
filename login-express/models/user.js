var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  name: {
    type: String,
  }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = (newUser, callBack) => {
  // from bcryptjs doc
  // https://www.npmjs.com/package/bcrypt
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newUser.password, salt, function (err, hash) {
      newUser.password = hash;
      newUser.save(callBack);
    });
  });
}

module.exports.getUserById = (id, callback) => {
  // mongoose method
  User.findById(id, callback);
}

module.exports.getUserByUsername = (username, callback) => {
  var query = { username: username };
  User.findOne(query, callback);
}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  // https://www.npmjs.com/package/bcrypt

  // Load hash from your password DB. 
  bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
    if(err) throw err;
    callback(null, isMatch);
  });
}