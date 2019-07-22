const mongoose = require('mongoose');
const connection = require('../libs/connection');

const messageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },

  chat: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  text: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

});

messageSchema.methods.toJSONFor = function() {
  return {
    date: this.date,
    text: this.text,
    id: this._id,
    user: this.user,
  };
};

module.exports = connection.model('Message', messageSchema);
