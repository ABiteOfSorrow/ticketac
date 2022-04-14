const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    firstName: String,
    email: String,
    password: String,
    journeys: [{ type: mongoose.Schema.Types.ObjectId, ref:'journeys' }]
  });
  
  var userModel = mongoose.model('user', userSchema);

  module.exports = userModel;