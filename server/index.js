// Import necessary modules and models
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PatientsModel = require('./models/patients');
const PharmacistsModel = require('./models/pharmacists');
const AdminsModel = require('./models/admins');
const MedicineModel = require('./models/medicines');
const multer= require('multer');
var session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const PDFParser = require('pdf-parse');
const uploadDirectory = './uploads';
const multer = require('multer');
const path = require('path');
const mammoth = require('mammoth');
const pdf = require('html-pdf');
app.use(express.urlencoded({ extended: true }));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "anyrandomstring",
  })
); 
mongoose.connect('mongodb://127.0.0.1:27017/pharmacy',{useNewUrlParser: true,
useUnifiedTopology: true});
var logged = {
  username: "",
  in: "",
  type: ""
};

app.get('/editmed', async (req, res) => {
  res.json(logged);
})
app.get('/admin', async (req, res) => {
  res.json(logged);
})

app.get('/pharmacist', async (req, res) => {
  res.json(logged);
})

app.get('/patient', async (req, res) => {
  res.json(logged);
})

app.get('/typeformed', async (req, res) => {
  console.log(logged)
  res.json(logged);
})

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
  logged.username = pharmacistData.username;
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
  logged.username = username;
  logged.in = true;
  logged.type = "pharmacist"

  if (logged.type !== "pharmacist") {
    res.json("Success");
    req.session.loggedIn = true;
    req.session.user = "pharmacist";
    req.session.save();
  }
  else {
    PharmacistsModel.findOne({ username: username })
      .then(user => {
        if (user) {
          if (user.password === password) {
            if (user.enrolled !== "accepted") {
              res.status(200).json({ message: "Success But Not Enrolled", enrolledStatus: user.enrolled });
            } else {
              res.status(200).json({ message: "Success" });
            }
            req.session.loggedIn = true;
            req.session.user = "pharmacist";
            req.session.save();
          } else {
            res.json("Password incorrect");
          }
        } else {
          res.json("user isn't registered");
        }
      })
      .catch(err => res.status(400).json(err));
  }
});

app.get('/get-pharmacist-info', async (req, res) => {
  try {
    const pharmacistInfo = await PharmacistsModel.findOne({ username: logged.username });
    res.json(pharmacistInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching pharmacist info.' });
  }
});

app.put('/update-pharmacist-info', async (req, res) => {
  try {
    console.log(req.body)
    await PharmacistsModel.updateOne({ username: req.body.username }, req.body);
    res.json({ message: 'pharmacist info updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating pharmacist info.' });
  }
});

app.post('/login-patient', (req, res) => {
  const { username, password } = req.body;
  logged.username = username;
  logged.in = true;
  logged.type = "patient"
  console.log(logged)
  console.log(username, password)
  PatientsModel.findOne({ username: username })
    .then(user => {
      console.log("success")
      console.log(user)
      if (user) {
        console.log("success")
        if (user.password === password) {
          console.log("success")
          res.json("Success");
          req.session.loggedIn = true;
          req.session.user = "patient";
          req.session.save();
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
  const { username, password } = req.body;
  logged.username = username;
  logged.in = true;
  logged.type = "admin"
  if (username == "admin" && password == "admin")
    res.json("Success");
  else {
    AdminsModel.findOne({ username: username })
      .then(user => {
        if (user) {
          if (user.password === password) {
            res.json("Success");
            req.session.loggedIn = true;
            req.session.user = "admin";
            req.session.save();
          } else {
            res.json("Password incorrect");
          }
        } else {
          res.json("Username isn't registered");
        }
      })
      .catch(err => res.status(400).json(err));
  }
});

app.get('/register-admin', async (req, res) => {
  res.json(logged);
})
app.post('/register-admin', async (req, res) => {
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
  var sess = logged.in
  var type = logged.type
  var responseData = {
    pharmacistRequests: [],
    userType: type,
    sessi: sess
  }
  try {
    // Find all pharmacists with "enrolled" set to false
    const PharmacistRequests = await PharmacistsModel.find({ enrolled: "pending" });
    type = logged.type
    responseData.pharmacistRequests = PharmacistRequests
    res.json(responseData);
  } catch (error) {
    console.error("error");
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Server-side route to approve a pharmacist
app.post('/approve-pharmacist/:id', async (req, res) => {
  try {
    const pharmacistId = req.params.id;

    // Update the pharmacist's "enrolled" status to true
    await PharmacistsModel.findByIdAndUpdate(pharmacistId, { enrolled: "accepted" });

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
    const deletedPharmacist = await PharmacistsModel.findOneAndRemove({ _id: pharmacistId });

    if (deletedPharmacist) {
      res.json({ message: 'Pharmacist rejected and removed successfully' });
    } else {
      res.status(404).json({ message: 'Pharmacist not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Server-side route to reject and remove a pharmacist
app.get('/remove-pharmacist', async (req, res) => {
  var sess = logged.in
  var type = logged.type
  var responseData = {
    pharmacistRequests: [],
    userType: type,
    sessi: sess
  }
  try {
    // Find all pharmacists with "enrolled" set to false
    const pharmacistRequests = await PharmacistsModel.find({});
    responseData.pharmacistRequests = pharmacistRequests
    res.json(responseData);
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
  var sess = logged.in
  var type = logged.type
  var responseData = {
    patientRequests: [],
    userType: type,
    sessi: sess
  }
  try {
    // Find all patients with "enrolled" set to false
    const patientRequests = await PatientsModel.find({});
    responseData.patientRequests = patientRequests
    res.json(responseData);
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
  var sess = logged.in
  var type = logged.type
  var responseData = {
    pharmacistRequests: [],
    userType: type,
    sessi: sess
  }
  try {
    const viewPharmacist = await PharmacistsModel.find({});
    responseData.pharmacistRequests = viewPharmacist
    res.json(responseData);
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
  var sess = logged.in
  var type = logged.type
  var responseData = {
    patientRequests: [],
    userType: type,
    sessi: sess
  }
  try {
    const viewPatient = await PatientsModel.find({});
    responseData.patientRequests = viewPatient
    res.json(responseData);
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

// Server-side route to update a medicine by ID// Server-side route to update a medicine by name
app.put('/medicines/:name', async (req, res) => {
  try {
    // Get the medicine name from the request parameters
    const { name } = req.params;

    // Get the updated medicine data from the request body
    const { Nname,activeIngredients, medicinalUse, price, quantity, sales, imageUrl } = req.body;
    console.log(name)
    console.log(Nname,activeIngredients, medicinalUse, price, quantity, sales, imageUrl)
    // Find the medicine in the database by name
    const medicine = await MedicineModel.findOne({ name });

    if (medicine) {
      // If the medicine is found, update its attributes
      medicine.name = Nname || medicine.name;
      medicine.activeIngredients = activeIngredients || medicine.activeIngredients;
      medicine.medicinalUse = medicinalUse || medicine.medicinalUse;
      medicine.price = price || medicine.price;
      medicine.quantity = quantity || medicine.quantity;
      medicine.sales = sales || medicine.sales;
      medicine.imageUrl = imageUrl || medicine.imageUrl;

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
    res.status(500).json({ message: 'Internal sserver error' });
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

app.get('/medicinal-uses', async (req, res) => {
  var sess = logged.in
  var type = logged.type
  var responseData = {
    medicinalUses: [],
    userType: type,
    sessi: sess
  }
  try {
    const medicinalUses = await MedicineModel.distinct('medicinalUse');
    responseData.medicinalUses = medicinalUses
    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/add-medicine', async (req, res) => {
  res.json(logged);
});

// Server-side route to add a new medicine or update an existing one's quantity
app.post('/add-medicine', async (req, res) => {
  try {
    // Get the medicine data from the request body
    const { name, activeIngredients, medicinalUse, price, quantity, imageUrl, isPrescriptionRequired, description } = req.body;

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
        imageUrl, isPrescriptionRequired,
        description
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

// to search for a medicine
app.get('/search-medicine', async (req, res) => {
  try {
    // Get the search query from the request query parameters
    const { searchQuery } = req.query;

    // Find all medicines that match the search query
    const medicines = await MedicineModel.find({
      name: { $regex: searchQuery, $options: 'i' },
    });

    // Return the matched medicines
    res.json(medicines);
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: 'Internall server error' });
  }
});

// Server-side route to view a list of all available medicines in the database
app.get('/medicines', async (req, res) => {
  try {
    // Find all medicines in the database
    const medicines = await MedicineModel.find({});
    res.json(medicines);
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/medicinespharmacist', async (req, res) => {
  try {
    // Find all medicines in the database
    const medicines = await MedicineModel.find({});

    // Return the medicines
    res.json(medicines);
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/uploadPhoto", upload.single(req.name), (req, res) => {
  const obj = {
    img: {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  };
  const medName= req.name;
  const newImage = new ImageModel({
    image: obj.img,
  });
  newImage.save((err) => {
    err ? console.log(err) : res.redirect("/");
  });
});

app.get("/", (req, res) => {
  ImageModel.find({}, (err, images) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      res.render("index", { images: images });
    }
  });
});

app.post('/uploadPdf', upload.single('file'), async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Retrieve the uploaded file from the request body
    const uploadedFile = req.file;

    // Write the file to the upload directory
    const fileName = `${uploadedFile.originalname}`;
    const filePath = `${uploadDirectory}/${fileName}`;
    const fileData = fs.readFileSync(filePath, 'utf8');
    await processFileData(fileData);

    // Determine the file type
    const fileExtension = uploadedFile.mimetype ?uploadedFile.mimetype : null;

    // Check if the file is already in PDF format
    if (fileExtension === 'application/pdf') {
        await processPDF(filePath, res);
    } else {
        const convertedFilePath = await convertToPDF(filePath);
        await processPDF(convertedFilePath, res);
    }
} catch (error) {
     console.error('An error occurred while processing the file:', error);
     res.status(500).json({ error: 'Failed to process the file' });
}

});

