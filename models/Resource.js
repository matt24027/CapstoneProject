const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: String,
  description: String,
  latitude: Number,
  longitude: Number
});

module.exports = mongoose.model('Resource', resourceSchema);
