// PharmacistNavbar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

import PharmacistNavbar from './PharmacistNavBar'
import PharmacistFooter from './PharmacistFooter'
import departmentImage1 from './images/s1.png';
import departmentImage2 from './images/s2.png';
import departmentImage3 from './images/s3.png';
import departmentImage4 from './images/s4.png';

import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import './css/font-awesome.min.css'; // Import Font Awesome CSS
import './css/style.css'; // Import your custom styles
import './css/responsive.css';
const EditMed = () => {
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
                //   const logged = response.data.logged;
                //   if (logged.type === "pharmacist" && logged.in === true) {

                //   }
                //   else { navigate('/login') }
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
        if (name === "archived") {
            if (editedMedicine.archived) {
                console.log(editedMedicine.archived)
                console.log("hiii")
                setEditedMedicine((prevState) => ({
                    ...prevState,
                    [name]: false,
                }));
            }
            else {
                setEditedMedicine((prevState) => ({
                    ...prevState,
                    [name]: true,
                }));
            }
        }
        else {

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

    return (
        <div>
          <PharmacistNavbar />
          <div className="container mt-5 mb-5">
            {successMessage && <p className="alert alert-success">{successMessage}</p>}
            <h1 className="mb-4 d-flex justify-content-center">Edit Medicine</h1>
            <p className="mb-3 text-center">Choose one of your medicines:</p>
            <div className="d-flex flex-wrap justify-content-center">
              {medicines.map(medicine => (
                pharmaMedicines.includes(medicine._id) && (
                  <button
                    key={medicine.name}
                    onClick={() => handleSelectMedicine(medicine)}
                    className={`btn btn-primary m-2`}
                  >
                    {medicine.name}
                  </button>
                )
              ))}
            </div>
    
            {selectedMedicine && (
              <div className="card mt-3">
                <div className="card-header">{selectedMedicine.name}</div>
                <div className="card-body">
                  <h2 className="card-title">{selectedMedicine.name}</h2>
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Price:</label>
                      <input type="number" className="form-control" name="price" value={editedMedicine.price} onChange={handleEditMedicine} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Quantity:</label>
                      <input type="number" className="form-control" name="quantity" value={editedMedicine.quantity} onChange={handleEditMedicine} />
                    </div>
                    <div className="mb-3 form-check">
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
    
                    <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>
                      Save Changes
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
          <PharmacistFooter />
        </div>
    );
};

export default EditMed;
