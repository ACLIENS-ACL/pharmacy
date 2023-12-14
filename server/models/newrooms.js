const mongoose = require('mongoose');

const newroomSchema = new mongoose.Schema({
    patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patients', // Assuming you have a User model for patients
    required: true,
  },
  pharmacistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'pharmacists', // Assuming you have a User model for doctors
    required: true,
  },
  // You can add other properties to your room schema if needed
});

const newRoom = mongoose.model('newRoom', newroomSchema);

module.exports = newRoom;
