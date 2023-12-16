## Project Title
El7a2ny Pharmacy🏥

## Motivation
The goal of this project is to streamline interactions between patients and pharmacists, offering features such as medicine browsing, ordering, and real-time chat with pharmacists.

## Build Status
[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)
* All user requirements are met and fulfilled, but more testing is needed to ensure the best service and UX.
* This project is currently a work-in-progress.
* The project requires further testing

## Code Style

In this project, we adhere to standardized JavaScript coding style conventions to enhance code readability and maintainability. Here are the key aspects of our coding style:

- **Function Declarations:** All functions are declared above the code that uses them.
- **Variable Naming Conventions:** We follow naming conventions for local variables, utilizing camelCase lettering starting with a lowercase letter.

- **Formatting in Visual Studio Code:**
  - The code is formatted in Visual Studio Code using the Alt + Shift + F command.
  - **Tab Size:** Set to 4 spaces.

These practices contribute to a consistent and organized codebase, making it easier to collaborate and maintain the project.

## Screenshots
- **Landing Page**
![Landing Page](https://github.com/ACLIENS-ACL/pharmacy/blob/main/screenshots/LandingPage.png)
- **Admin Home**
![Admin Home](https://github.com/ACLIENS-ACL/pharmacy/blob/main/screenshots/Admin.png)

- **Pharmacist's Home**
![Pharmacist's Home](https://github.com/ACLIENS-ACL/pharmacy/blob/main/screenshots/Pharmacist.png)
- **Add Medicine Pharmcist's Inteface**
![Add Medicine Pharmcist's Inteface](https://github.com/ACLIENS-ACL/pharmacy/blob/main/screenshots/AddMedicine.png)
- **Edit Medicine Pharmcist's Inteface**
![Edit Medicine Pharmcist's Inteface](https://github.com/ACLIENS-ACL/pharmacy/blob/main/screenshots/EditMedicine.png)
- **Patient Home**
![Patient Home](https://github.com/ACLIENS-ACL/pharmacy/blob/main/screenshots/Patient.png)
- **View Medicines**
![View Medicines](https://github.com/ACLIENS-ACL/pharmacy/blob/main/screenshots/Medicines.png)
- **View Cart**
![View Cart](https://github.com/ACLIENS-ACL/pharmacy/blob/main/screenshots/Cart.png)
- **View Past Orders**
![View Past Orders](https://github.com/ACLIENS-ACL/pharmacy/blob/main/screenshots/Orders.png)

# Tech/Framework Used 🖥️

1. <details><summary>In Back-end</summary> 
    
    * NodeJS
    
    * Nodemailer
    
    * Postman
    
    * MongoDB
    
    * Mongoose
  
    * Express
  
    * Body-parser
  
    * Cors
  
    * Fs
  
    * Html-pdf
  
    * Jsonwebtoken
  
    * Nodejs-nodemailer
  
    * Nodemon
  
    * pdf-parse
  
    * randomstring
    
    * Socket.io
  
</details>

2. <details><summary>In Front-end</summary> 
  
    * ReactJS
  
    * Material UI
  
    * Axios
  
    * bootstrap
  
    * Dateformat
  
    * Jsonwebtoken
  
    * redux
  
    * stripe
    
    * Jwt-decode
    
    * Socket.io-client
  
</details>

# Features 🌟

The system serves different type of users (Admins, Patients, and Pharmacists)

1. <details><summary>As an Admin, you can</summary> 
    
    * View Pharmacist's Request to join the Platform
    
    * Remove any System user ( Pharmacist, or patient)
    
    * View and filter all medicines.
    
    * Add another Admin to the system.

    * View Sales Chart.
</details>


2. <details><summary>As a Pharmacist, you can</summary> 
    
    * Add Medicine.
  
    * Edit your Medicines.
    * View and filter Medicines.
    * Chat with Doctor regarding a Prescription.
    * View Sales Report for your Medicines.
  
    * View Wallet due to monthly salary.
  
    * Change/Reset Password
    * View notifications regarding medicines being out of stock.
  
</details>  

3. <details><summary>As a Patient, you can</summary> 
    
    * View and filter Medicines.
    * Add Medicines to Cart.
    
    * Pay using wallet/credit card or Cash on Delivery.
    * View wallet.
    * View Past Orders.
    * Change/Reset Password.
    * Chat with a Pharmacist.
    
</details>

# Code Examples 💽

```javascript
app.post('/approve-pharmacist/:id', async (req, res) => {
  try {
    const pharmacistId = req.params.id;

    await PharmacistsModel.findByIdAndUpdate(pharmacistId, { enrolled: "accepted", lastAcceptedDate: new Date() });

    res.json({ message: 'pharmacist approved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
```

```javascript
app.get('/adminsales-report', verifyToken, async (req, res) => {
  try {

    // Find the user's orders based on the username
    const orders = await OrderModel.find({});
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
```

```javascript
app.post('/add-medicine', verifyToken, upload.single('image'), async (req, res) => {
  try {
    // Get the medicine data from the request body
    const { name, activeIngredients, medicinalUse, price, quantity, isPrescriptionRequired, description } = req.body;

    // Get the file information from the request
    const { originalname, filename } = req.file;
    const filePath = path.join(__dirname, 'uploads', filename);

    const ingredientsArray = activeIngredients.split(',').map((ingredient) => ingredient.trim());
    arr = []
    for (var i = 0; i < ingredientsArray.length; i++) {
      arr[i] = ingredientsArray[i]
    }

    const pharmacist = await PharmacistsModel.findOne({ username: logged.username });
    if (!pharmacist) {
      console.error('Pharmacist not found');
      return; // or handle the case where the pharmacist is not found
    }
    // Create a new medicine object
    const newMedicine = new MedicineModel({
      name,
      activeIngredients: arr,
      pharmacistId: pharmacist._id,
      medicinalUse,
      price,
      quantity,
      imageUrl: { fileName: filename, filePath },
      isPrescriptionRequired,
      description,
    });

    // Save the new medicine to the database
    await newMedicine.save();

    if (pharmacist) {
      pharmacist.medicines.push(newMedicine._id);
      await pharmacist.save();
    }

    // Return a success response
    res.json({ message: 'Medicine added successfully' });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
```

```javascript
app.get('/medicines', verifyToken, async (req, res) => {
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

```
```javascript
app.put('/add-to-cart/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order by its ID
    const order = await OrderModel.findById(orderId);
    const cart = order.items

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the order status is "Processing" and can be added back to the cart
    if (order.status === 'Processing') {
      // Retrieve the items from the order
      const items = order.items;

      // Find the user (patient) by username (you should replace this with actual authentication logic)
      const patient = await PatientsModel.findOne({ username: order.patientName });

      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      // Add the items back to the user's cart in the database
      patient.cart.push(...items);

      // Save the updated patient document
      await patient.save();
      await OrderModel.findByIdAndRemove(orderId);

      // Send a success response
      return res.json({ message: 'Order added back to the cart successfully' });
    } else {
      return res.status(400).json({ message: 'Order cannot be added back to the cart or status is not "Processing"' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

```

```javascript
app.post('/place-order', verifyToken, async (req, res) => {
  try {
    // Get order data from the request body
    const { cart, deliveryAddress, paymentMethod } = req.body;
    // You can add the username from the authenticated user if available

    if (!cart || !deliveryAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Missing order data' });
    }
    const token = req.header('Authorization');
    const username = req.user.username;  // Access the username from the request object

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if the user (patient) exists
    const patient = await PatientsModel.findOne({ username: username });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Extract the selected items from the cart for the order
    const items = cart.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    // Calculate the total
    const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Create a new order
    const order = new OrderModel({
      patientName: username, // You can associate the order with the patient's ID
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
    });

    // Save the order to the database
    await order.save();
    patient.cart = [];
    // You may want to update other information like the patient's order history
    // For example, you can add this order to the patient's order history array

    await patient.save();
    res.json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
```


```javascript
app.post('/reset-password', async (req, res) => {
  const { username, newPassword } = req.body;
  try {
    let patient = await PatientsModel.updateOne({ username: username }, { password: newPassword });
    // If the user is not found in PatientsModel, check in PharmacistsModel
    if (patient.modifiedCount === 0) {
      patient = await PharmacistsModel.updateOne({ username: username }, { password: newPassword });
      // If the user is not found in PharmacistsModel, check in AdminsModel
      if (patient.modifiedCount === 0) {
        await AdminsModel.updateOne({ username: username }, { password: newPassword });

        // If the user is not found in any of the databases, return a message
        if (patient.modifiedCount === 0) {
          return res.status(404).json({ message: 'User not found' });
        }
      }
    }

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
```

```html
    <div>
      <h1 className="h3 mb-2 text-gray-800">Charts</h1>
      <p className="mb-4">Dummy data is used in this section for illustration purposes.</p>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <div className="d-flex justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Bar Chart</h6>
                <div>
                  <label htmlFor="monthFilter" className="mr-2">
                    Select Date:
                  </label>
                  <DatePicker
                    id="monthFilter"
                    className="form-control"
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                    filterDate={(date) => date <= new Date()} // Only allow dates up to the current date
                  />
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="chart-bar">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>

            <div className="card-footer">
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-primary"
                  onClick={handlePreviousMonths}
                  title="Previous 24 Months"
                >
                  <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Previous
                </button>
                <div>
                  <button
                    className="btn btn-primary ml-2"
                    onClick={handleNextMonths}
                    disabled={isNextButtonDisabled}
                    title="Next 24 Months"
                  >
                    Next <FontAwesomeIcon icon={faArrowAltCircleRight} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
```
# Installation 📩
  * Open two separate terminals.
  * In the first terminal, go to the Backend folder and type the command: `npm install`
      ```bash
      cd server && npm install
      ```
  * In the second terminal, go to the Frontend folder and type the command: `npm install`
      ```bash
      cd pharmacy && npm install
      ```
      
# API Reference 📋
Here is a list of all the routes available in the project:

- **GET:** `/editmed`
- **GET:** `/admin`
- **GET:** `/pharma`
- **GET:** `/adminadmin`
- **GET:** `/pharmacist`
- **GET:** `/patientData`
- **GET:** `/pharmacistData`
- **GET:** `/adminData`
- **GET:** `/typeformed`
- **GET:** `/logout`
- **GET:** `/getType`
- **POST:** `/register-patient`
- **POST:** `/register-pharmacist`
- **POST:** `/login-pharmacist`
- **GET:** `/get-pharmacist-info`
- **PUT:** `/update-pharmacist-info`
- **POST:** `/login-patient`
- **POST:** `/login-admin`
- **GET, POST:** `/register-admin`
- **GET:** `/pharmacist-requests`
- **POST:** `/approve-pharmacist/:id`
- **POST:** `/reject-pharmacist/:id`
- **GET:** `/remove-pharmacist`
- **POST:** `/remove-pharmacist/:id`
- **GET:** `/remove-patient`
- **POST:** `/remove-patient/:id`
- **GET:** `/view-pharmacist`
- **POST:** `/view-pharmacist/:id`
- **GET:** `/view-patient`
- **POST:** `/view-patient/:id`
- **PUT, GET:** `/medicines/:name`
- **GET:** `/filter-medicines`
- **GET:** `/medicinal-uses`
- **GET, POST:** `/add-medicine`
- **GET:** `/search-medicine`
- **GET:** `/medicines`
- **GET:** `/medicinespatient`
- **GET:** `/medicinespharmacist`
- **POST:** `/patient/:id/cart`
- **GET:** `/current-user`
- **GET:** `/view-cart`
- **POST:** `/remove-item`
- **POST:** `/update-quantity`
- **GET:** `/change-password`
- **POST:** `/update-password`
- **GET:** `/delivery-addresses`
- **POST:** `/add-address`
- **POST:** `/place-order`
- **GET:** `/user-orders`
- **PUT:** `/cancel-order/:orderId`
- **GET:** `/wallet-balance`
- **POST:** `/update-wallet-balance`
- **PUT:** `/add-to-cart/:orderId`
- **GET:** `/update-medicine-quantities`
- **POST:** `/send-otp`
- **POST:** `/verify-otp`
- **POST:** `/reset-password`
- **POST:** `/upload-id-document/:username`
- **POST:** `/upload-medical-licenses/:username`
- **POST:** `/upload-medical-degree/:username`
- **GET:** `/uploads/:filename`
- **GET:** `/sales-report`
- **GET:** `/adminsales-report`
- **POST:** `/place-order-clinic`
- **GET:** `/prescriptions`
- **POST:** `/createRoom`
- **POST:** `/createRoomPharmacist`
- **POST:** `/createRoompp`
- **GET:** `/allrooms`
- **GET:** `/roomsToJoin`

# Tests
![Testing doctor Requests](https://github.com/ACLIENS-ACL/pharmacy/blob/main/screenshots/TestingPharmacistRequest.png)
![Testing Adding family Members](https://github.com/ACLIENS-ACL/pharmacy/blob/main/screenshots/TestingSalesReport.png)
![Testing health Packages](https://github.com/ACLIENS-ACL/pharmacy/blob/main/screenshots/TestingPatientOrders.png)

# How to Use
  * Open two separate terminals.
  * In the first terminal, go to the Backend folder and type the command: `npm strt`
      ```bash
      cd server && npm start
      ```
  * In the second terminal, go to the Frontend folder and type the command: `npm run dev`
      ```bash
      cd pharmacy && npm run dev
      ``
# Contribute

## UI/UX Improvement

We welcome contributions to enhance the user interface (UI) and user experience (UX) of our application. Feel free to suggest or implement improvements that can make the application more visually appealing, user-friendly, and efficient.

### Document Validation

Another valuable contribution would be to enhance the document upload functionality. We aim to implement a validation mechanism to detect if the uploaded document contains the required information and is valid. This will ensure a more streamlined and error-free process for users.

# Credits

Special thanks to the following contributors and resources:

- [YouTube - Login and Register using MERN](https://youtu.be/ZVyIIyZJutM?si=DBLOMQhy0oj-AGvW)

- [YouTube - Chat App using Socket.io and Node.js](https://youtu.be/rxzOqP9YwmM?si=tJ6b6x93pSjlqRVT)

# License

- **Stripe**:
  - The payment processing in this project involves the use of Stripe services.
  - Please review [Stripe's licensing information](https://stripe.com/legal/spc/licenses) for details on their terms and conditions.

