import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditMed() {
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [editedMedicine, setEditedMedicine] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch admin data from the server
    axios.get(`http://localhost:3001/admin`)
      .then((response) => {
        const logged = response.data;
        if (logged.type === "pharmacist" && logged.in === true) {
          
        }
        else{navigate('/login')}
      })
  }, []);
  useEffect(() => {
    axios.get('http://localhost:3001/medicines')
      .then(response => {
        setMedicines(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  function handleSelectMedicine(medicine) {
    setSelectedMedicine(medicine);
    setEditedMedicine({ ...medicine });
  }

  function handleEditMedicine(event) {
    const { name, value } = event.target;
    setEditedMedicine(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  function handleSaveChanges() {
    const updatedQuantity = editedMedicine.quantity;
    const difference = selectedMedicine.quantity - updatedQuantity;
  
    if (difference > 0) {
      editedMedicine.sales = selectedMedicine.sales + difference;
    }
    console.log(editedMedicine)
    axios.put(`http://localhost:3001/medicines/${selectedMedicine.name}`, editedMedicine)
      .then(response => {
        setSelectedMedicine(null);
        setEditedMedicine(null);
        setSuccessMessage('Medicine edited successfully');
        navigate("/medicines");
      })
      .catch(error => {
        console.error(error);
      });
  }
  

  return (
    <div className="container">
      {successMessage && <p className="alert alert-success">{successMessage}</p>}
      <h1 className="my-4">Edit Medicine</h1>
      <div className="row">
        <div className="col-6">
          <ul className="list-group">
            {medicines.map(medicine => (
              <li key={medicine.name} onClick={() => handleSelectMedicine(medicine)} className={`list-group-item ${selectedMedicine === medicine ? 'active' : ''}`}>
                {medicine.name}
              </li>
            ))}
          </ul>
        </div>

        {selectedMedicine && (
          <div className="col-6">
            <h2>{selectedMedicine.name}</h2>
            <form>
              <div className="mb-3">
                <label className="form-label">Price:</label>
                <input type="number" className="form-control" name="price" value={editedMedicine.price} onChange={handleEditMedicine} />
              </div>
              <div className="mb-3">
                <label className="form-label">Quantity:</label>
                <input type="number" className="form-control" name="quantity" value={editedMedicine.quantity} onChange={handleEditMedicine} />
              </div>
              <button className="btn btn-primary" onClick={handleSaveChanges}>Save Changes</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditMed;
