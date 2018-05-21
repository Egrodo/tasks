const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Clear out Mongoose cache.
mongoose.models = {};
mongoose.modelSchema = {};

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/hw');

const Todos = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    requried: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Todo', Todos);
