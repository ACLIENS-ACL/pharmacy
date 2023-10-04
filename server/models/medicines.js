const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const medicineSchema = new mongoose.Schema({
  identity: {
    type: String,
    required: true,
    unique: true,
  },
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
    required: false
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

// Pre-save hook to generate a unique identity for each new medicine object
medicineSchema.pre('save', async function (next) {
  try {
    // Generate a new identity using nanoid
    const newIdentity = nanoid();

    // Check if the identity is already in use
    const existingMedicine = await this.constructor.findOne({ identity: newIdentity });

    if (existingMedicine) {
      // If the identity is already in use, generate a new one recursively
      return this.save();
    }

    // If the identity is unique, assign it to the medicine object
    this.identity = newIdentity;

    next();
  } catch (error) {
    next(error);
  }
});

const MedicineModel = mongoose.model('Medicine', medicineSchema);

module.exports = MedicineModel;