const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const UserModel = mongoose.model('admins', UsersSchema);
module.exports = UserModel;