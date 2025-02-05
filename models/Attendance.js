const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  checkIn: { type: Date, default: Date.now },
  checkOut: { type: Date },
});

module.exports = mongoose.model('Attendance', attendanceSchema);
