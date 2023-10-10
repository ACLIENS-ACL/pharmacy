import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

function Meds() {
    const [meds, setMeds] = useState([]);
    const [filteredMeds, setFilteredMeds] = useState([]);
    const [message, setMessage] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [medicinalUse, setMedicinalUse] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Define a function to fetch medicines based on the search query
        const fetchMedicines = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/search-medicine?searchQuery=${searchInput}`);
                setMeds(response.data);
                setFilteredMeds(response.data);
            } catch (error) {
                console.error(error);
                setMessage('Error retrieving meds');
            }
        };

        // Call the fetchMedicines function when searchInput changes
        fetchMedicines();
    }, [searchInput]);

    const handleSearch = (event) => {
        const input = event.target.value;
        setSearchInput(input);
    }

    const handleFilter = (event) => {
        const input = event.target.value;
        setMedicinalUse(input);
        const filtered = meds.filter(med => med.medicinalUse.toLowerCase().includes(input.toLowerCase()));
        setFilteredMeds(filtered);
    }

    return (
        <div>
            <input type="text" placeholder="Search for a medication" value={searchInput} onChange={handleSearch} />
            <button value="pain" onClick={handleFilter}>Pain Relief</button>
            <button value="fever" onClick={handleFilter}>Fever Reducer</button>
            {filteredMeds.map(med => (
                <div key={med.id}>
                    <h2>{med.name}</h2>
                    <p>{med.description}</p>
                    <p>Medicinal Use: {med.medicinalUse}</p>
                    <button onClick={() => navigate(`/meds/${med.id}`)}>View Details</button>
                </div>
            ))}
            {message && <p>{message}</p>}
        </div>
    );
}

export default Meds;
