const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    pharmacistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'pharmacists', // Assuming you have a User model for patients
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctors', // Assuming you have a User model for doctors
    required: true,
  },
  // You can add other properties to your room schema if needed
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
