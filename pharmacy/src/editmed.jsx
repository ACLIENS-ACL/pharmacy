import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditMed() {
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [pharmaMedicines, setpharmaMedicines] = useState(null);
  const [editedMedicine, setEditedMedicine] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('pharmacistToken');
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  useEffect(() => {
    if (token === null) {
      navigate('/login');
    }
  }, [token, navigate]);
  useEffect(() => {
    // Fetch admin data from the server
    axios.get(`http://localhost:3002/pharma`, { headers })
      .then((response) => {
        setpharmaMedicines(response.data.medicines)
        const logged = response.data.logged;
        if (logged.type === "pharmacist" && logged.in === true) {

        }
        else { navigate('/login') }
      })
  }, []);
  useEffect(() => {
    axios.get('http://localhost:3002/medicines', { headers })
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
    console.log(name)

    // If the input is a checkbox, handle it differently
      if (name==="archived"){
        if(editedMedicine.archived){
          console.log(editedMedicine.archived)
          console.log("hiii")
          setEditedMedicine((prevState) => ({
            ...prevState,
            [name]: false,
          }));
        }
        else{
          setEditedMedicine((prevState) => ({
            ...prevState,
            [name]: true,
          }));
        }
      }
      else{
        
      setEditedMedicine((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      }
    console.log(editedMedicine)
  }


  function handleSaveChanges() {
    const updatedQuantity = editedMedicine.quantity;
    const difference = selectedMedicine.quantity - updatedQuantity;

    if (difference > 0) {
      editedMedicine.sales = selectedMedicine.sales + difference;
    }
    console.log(editedMedicine)
    axios.put(`http://localhost:3002/medicines/${selectedMedicine.name}`, editedMedicine, { headers })
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


  const handleLogout = () => {
    // Perform any necessary logout actions (e.g., clearing session or tokens).
    // After logging out, navigate to the login page.
    // Fetch admin data from the server
    axios.get(`http://localhost:3002/logout`, { headers })
      .then((response) => {
        const responseData = response.data;
        if (responseData.type == "") {
          navigate('/login');
        }
      })
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-end mb-2">
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
      {successMessage && <p className="alert alert-success">{successMessage}</p>}
      <h1 className="my-4">Edit Medicine</h1>
      <div className="row">
        <div className="col-6">
          <ul className="list-group">
            {medicines.map(medicine => (
              pharmaMedicines.includes(medicine._id) && (
                <li key={medicine.name} onClick={() => handleSelectMedicine(medicine)} className={`list-group-item ${selectedMedicine === medicine ? 'active' : ''}`}>
                  {medicine.name}
                </li>
              )
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
              <div className="mb-3">
                <label className="form-check-label">Archive:</label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="archiveSwitch"
                    name="archived"
                    checked={editedMedicine.archived}
                    onChange={handleEditMedicine}
                  />
                  <label className="form-check-label" htmlFor="archiveSwitch">
                    Archive
                  </label>
                </div>
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
