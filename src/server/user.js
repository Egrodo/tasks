const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Clear out Mongoose cache.
mongoose.models = {};
mongoose.modelSchema = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/hw');

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    requried: true,
    index: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
