const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  dob: String,
  mobileNumber: String,
  userType: {
    type: String,
    default: 'pharmacist', // Set the default user type to 'doctor'
  },
  hourlyRate: Number,
  affiliation: String,
  educationalBackground: String,
  enrolled: {
    type: String,
    default: "request not made",
  },
  extraNotes:{
    type:String,
    default:""
  }, 
});

const UserModel = mongoose.model('pharmacists', UsersSchema);
module.exports = UserModel;
