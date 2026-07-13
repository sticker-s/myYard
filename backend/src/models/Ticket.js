const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tierName: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['paid', 'used', 'cancelled'], default: 'paid' },
  purchaseDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
