// Import necessary modules and models
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PatientsModel = require('./models/patients');
const PharmacistsModel = require('./models/pharmacists');
const AdminsModel=require('./models/admins');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/pharmacy');

// Register route for patients

app.post('/register-patient', async (req, res) => {
    const patientData = req.body;
    try {
        // Check if a user with the same username already exists
        const existingPatient = await PatientsModel.findOne({ username: patientData.username });

        if (existingPatient) {
            res.status(400).json({ error: 'Username already exists' });
        } else {
            const patient = await PatientsModel.create(patientData);
            res.json(patient);
        }
    } catch (err) {
        res.status(400).json(err);
    }
});

// Register route for pharmacists
app.post('/register-pharmacist', async (req, res) => {
    const pharmacistData = req.body;
    try {
        // Check if a user with the same username already exists
        const existingPharmacist = await PharmacistsModel.findOne({ username: pharmacistData.username });

        if (existingPharmacist) {
            res.status(400).json({ error: 'Username already exists, Please Chose a unique username' });
        } else {
            const pharmacist = await PharmacistsModel.create(pharmacistData);
            res.json(pharmacist);
        }
    } catch (err) {
        res.status(400).json(err);
    }
});

app.post('/login-pharmacist', (req, res) => {
    const { username, password } = req.body;
    PharmacistsModel.findOne({ username: username })
        .then(user => {
            console.log("idkkkk " + user)
            if (user) {
                if (user.password === password) {
                    res.json("Success");
                } else {
                    res.json("Password incorrect");
                }
            } else {
                res.json("user isn't registered");
            }
        })
        .catch(err => res.status(400).json(err));
});

app.post('/login-patient', (req, res) => {
    const { username, password } = req.body;
    PatientsModel.findOne({ username: username })
        .then(user => {
            console.log("idkkkk " + user)
            if (user) {
                if (user.password === password) {
                    res.json("Success");
                } else {
                    res.json("Password incorrect");
                }
            } else {
                res.json("user isn't registered");
            }
        })
        .catch(err => res.status(400).json(err));
});

app.post('/login-admin', (req, res) => {
    const {username, password} = req.body;
    if(username==="admin"&&password=="admin"){
        res.json("Success");
    }
    else{
        admins.findOne({ username: username })
        .then(user => {
          if (user) {
            if (user.password === password) {
              res.json("Success");
            } else {
              res.json("Password incorrect");
            }
          } else {
            res.json("Username isn't registered");
          }
        })
        .catch(err => res.status(400).json(err));
  }});
  app.post('/add-admin', async (req, res) => {
  try {
    const adminData = req.body;

    const existingAdmin = await AdminsModel.findOne({ username: adminData.username });

    if (existingAdmin) {
      // If username already exists, return an error response
      return res.json({ message: 'Username already exists' });
    }

    // If username doesn't exist, create a new admin
    const newAdmin = new AdminsModel(adminData);

    // Save the new admin to the admins collection
    await newAdmin.save();

    // Return a success response
    res.json({ message: 'Admin added successfully' });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.json({ message: 'Internal server error' });
  }
});

// Server-side route to fetch pharmacist requests
app.get('/pharmacist-requests', async (req, res) => {
    try {
      // Find all pharmacists with "enrolled" set to false
      const pharmacistRequests = await PharmacistsModel.find({ enrolled: false });
      res.json(pharmacistRequests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Server-side route to approve a pharmacist
app.post('/approve-pharmacist/:id', async (req, res) => {
    try {
      const pharmacistId = req.params.id;
  
      // Update the pharmacist's "enrolled" status to true
      await PharmacistsModel.findByIdAndUpdate(pharmacistId, { enrolled: true });
  
      res.json({ message: 'pharmacist approved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Server-side route to reject and remove a pharmacist
  app.post('/reject-pharmacist/:id', async (req, res) => {
    try {
      const pharmacistId = req.params.id;
  
      // Remove the pharmacist from the database
      await PharmacistsModel.findByIdAndRemove(pharmacistId);
  
      res.json({ message: 'Pharmacist rejected and removed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Server-side route to reject and remove a pharmacist
  app.get('/remove-pharmacist', async (req, res) => {
    try {
      // Find all pharmacists with "enrolled" set to false
      const pharmacistRequests = await PharmacistsModel.find({ });
      res.json(pharmacistRequests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.post('/remove-pharmacist/:id', async (req, res) => {
    try {
      const pharmacistId = req.params.id;
  
      // Remove the pharmacist from the database
      await PharmacistsModel.findByIdAndRemove(pharmacistId);
  
      res.json({ message: 'Pharmacist rejected and removed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  // Server-side route to reject and remove a patient
  app.get('/remove-patient', async (req, res) => {
    try {
      // Find all patients with "enrolled" set to false
      const patientRequests = await PatientsModel.find({ });
      res.json(patientRequests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.post('/remove-patient/:id', async (req, res) => {
    try {
      const patientId = req.params.id;
  
      // Remove the patient from the database
      await PatientsModel.findByIdAndRemove(patientId);
  
      res.json({ message: 'patient removed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.get('/view-pharmacist', async (req, res) => {
    try {
      const viewPharmacist = await PharmacistsModel.find({ });
      res.json(viewPharmacist);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.post('/view-pharmacist/:id', async (req, res) => {
    try {
      const pharmacistId = req.params.id;
  
      await PharmacistsModel.findByIdAndRemove(pharmacistId);
  
      res.json({ message: 'pharmacist found successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.get('/view-patient', async (req, res) => {
    try {
      const viewPatient = await PatientsModel.find({ });
      res.json(viewPatient);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  app.post('/view-patient/:id', async (req, res) => {
    try {
      const patientId = req.params.id;
  
      await PatientsModel.findByIdAndRemove(patientId);
  
      res.json({ message: 'patient found successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

app.listen(3001, 'localhost');

// Server-side route to update a medicine by ID
app.put('/medicines/:id', async (req, res) => {
  try {
    // Get the medicine ID from the request parameters
    const { id } = req.params;

    // Get the updated medicine data from the request body
    const { name, activeIngredients, medicinalUse, price, quantity, sales, imageUrl } = req.body;

    // Find the medicine in the database by ID
    const medicine = await MedicineModel.findById(id);

    if (medicine) {
      // If the medicine is found, update its attributes
      medicine.name = name || medicine.name;
      medicine.activeIngredients = activeIngredients || medicine.activeIngredients;
      medicine.medicinalUse = medicinalUse || medicine.medicinalUse;
      medicine.price = price || medicine.price;
      medicine.quantity = quantity || medicine.quantity;
      medicine.sales = sales || medicine.sales;
      medicine.imageUrl = imageUrl || medicine.imageUrl;

      // Save the updated medicine to the database
      await medicine.save();

      // Return a success response
      res.json({ message: 'Medicine updated successfully' });
    } else {
      // Otherwise, return a 404 status code with an error message
      res.status(404).json({ message: 'Medicine not found' });
    }
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// filter medicines by medicinalUse
app.get('/filter-medicines', async (req, res) => {
  try {
    // Get the medicinalUse from the request query parameters
    const { medicinalUse } = req.query;

    // Find all medicines that match the medicinalUse
    const medicines = await MedicineModel.find({ medicinalUse });

    // Return the matched medicines
    res.json(medicines);
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Server-side route to add a new medicine or update an existing one's quantity
app.post('/add-medicine', async (req, res) => {
  try {
    // Get the medicine data from the request body
        medicinalUse,
        imageUrl
        const { name, activeIngredients,medicinalUse, price, quantity,imageUrl } = req.body;

    // Find the medicine in the database
    const existingMedicine = await MedicineModel.findOne({ name });

    if (existingMedicine) {
      // If the medicine already exists, update the quantity
      existingMedicine.quantity += quantity;
      await existingMedicine.save();
    } else {
      // Otherwise, create a new medicine object
      const newMedicine = new MedicineModel({
        name,
        activeIngredients,
        medicinalUse,
        price,
        quantity,
        imageUrl
      });

      // Save the new medicine to the database
      await newMedicine.save();
    }

    // Return a success response
    res.json({ message: 'Medicine added successfully' });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});