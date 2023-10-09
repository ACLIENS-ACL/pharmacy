import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



function EditMed() {
    const [medicines, setMedicines] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [editedMedicine, setEditedMedicine] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/medicines')
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
        axios.put(`/api/medicines/${selectedMedicine.id}`, editedMedicine)
            .then(response => {
                setSelectedMedicine(null);
                setEditedMedicine(null);
                navigate('/medicines');
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <div>
            <h1>Edit Medicine</h1>
            <ul>
                {medicines.map(medicine => (
                    <li key={medicine.id} onClick={() => handleSelectMedicine(medicine)}>
                        {medicine.name}
                    </li>
                ))}
            </ul>
            {selectedMedicine && (
                <div>
                    <h2>{selectedMedicine.name}</h2>
                    <form>
                        <label>
                            Name:
                            <input type="text" name="name" value={editedMedicine.name} onChange={handleEditMedicine} />
                        </label>
                        <label>
                            Price:
                            <input type="number" name="price" value={editedMedicine.price} onChange={handleEditMedicine} />
                        </label>
                        <label>
                            Quantity:
                            <input type="number" name="quantity" value={editedMedicine.quantity} onChange={handleEditMedicine} />
                        </label>
                    </form>
                    <button onClick={handleSaveChanges}>Save Changes</button>
                </div>
            )}
        </div>
    );
}

export default EditMed;


