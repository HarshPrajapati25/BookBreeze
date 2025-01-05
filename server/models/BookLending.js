const mongoose = require('mongoose');

const bookLendingSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrowerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lenderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED','RETURNED'],
    default: 'PENDING'
  }
}, { timestamps: true });

const BookLending = mongoose.model('BookLending', bookLendingSchema);
module.exports = BookLending;