const mongoose = require('mongoose');

const newroomSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patients',
    required: true,
  },
  pharmacistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'pharmacists',
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  // You can add other properties to your room schema if needed
});


const newRoom = mongoose.model('newRoom', newroomSchema);

module.exports = newRoom;
