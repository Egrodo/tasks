const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Clear out Mongoose cache.
mongoose.models = {};
mongoose.modelSchema = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/hw');

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    requried: true,
  },
  passwordHash: {
    type: String,
  },
});

module.exports = mongoose.model('User', UserSchema);
