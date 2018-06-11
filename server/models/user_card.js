const mongoose = require('mongoose');

const UserCardSchema = new mongoose.Schema({
  cardId: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  userId: {
    type: String,
    required: true,
  }
});

const UserCard = mongoose.model('UserCard', UserCardSchema);
module.exports = UserCard;