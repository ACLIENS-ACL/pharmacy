const mongoose = require('mongoose');
const cron = require('node-cron');

const UsersSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  dob: String,
  mobileNumber: String,
  idDocument:{
    fileName: String,
    filePath:Object
  },
  medicalDegree:{
    fileName: String,
    filePath:Object
  },
  medicalLicenses: [{
    fileName: String,
    filePath:Object
  }],
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
  medicines: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine' // Reference to the Medicine model
  }],
  wallet:  {
    type: Number,
    default: 0, // Set the default value to 0 or any other appropriate default value
  },
  
  latestNotifications: [{
    message: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  lastAcceptedDate: {
    type: Date,
    default: null,
  },
});

const UserModel = mongoose.model('pharmacists', UsersSchema);




const updateWalletBalance = async () => {
  const users = await UserModel.find({ enrolled: 'accepted' });

  users.forEach(async (user) => {
    // Check if the lastAcceptedDate is not null
    if (user.lastAcceptedDate) {
      const currentDate = new Date();
      const thirtyDaysAgo = new Date(user.lastAcceptedDate);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() + 30);

      // Check if 30 days have passed since the lastAcceptedDate
      if (currentDate >= thirtyDaysAgo) {
        // Update the wallet balance by adding 5000
        user.wallet += 5000;

        // Update the lastAcceptedDate to the current date
        user.lastAcceptedDate = currentDate;

        // Save the changes to the user
        await user.save();
      }
    }
  });
};

// Schedule the wallet update to run every day
cron.schedule('23 18 * * *', async () => {
  await updateWalletBalance();
  console.log('Wallet balances updated');
});

module.exports = UserModel;

