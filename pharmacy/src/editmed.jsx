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
                <label className="form-label">Name:</label>
                <input type="text" className="form-control" name="name" value={editedMedicine.name} onChange={handleEditMedicine} />
              </div>
              <div className="mb-3">
                <label className="form-label">Price:</label>
                <input type="number" className="form-control" name="price" value={editedMedicine.price} onChange={handleEditMedicine} />
              </div>
              <div className="mb-3">
                <label className="form-label">Quantity:</label>
                <input type="number" className="form-control" name="quantity" value={editedMedicine.quantity} onChange={handleEditMedicine} />
              </div>
              {/* Add other fields that match the backend */}
              <button className="btn btn-primary" onClick={handleSaveChanges}>Save Changes</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditMed;
