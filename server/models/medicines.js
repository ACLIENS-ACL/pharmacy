const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  activeIngredients: {
    type: [String],
    required: true,
  },
  medicinalUse: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  sales: {
    type: Number,
    default: 0,
    required: false,
  },
  imageUrl: {
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String, // Change this to String if storing the file path as a string
      required: true,
    },
  },
  isPrescriptionRequired: {
    type: Boolean,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  pharmacistId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming the pharmacistId is ObjectId
    ref: 'Pharmacist', // Reference to Pharmacist model
    
  },
});

const MedicineModel = mongoose.model('Medicine', medicineSchema);

module.exports = MedicineModel;
