import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FilterMedicines() {
    const [meds, setMeds] = useState([]);
    const [filteredMeds, setFilteredMeds] = useState([]);
    const [message, setMessage] = useState('');
    const [medicinalUse, setMedicinalUse] = useState('');

    useEffect(() => {
        // Define a function to fetch medicines based on the search query
        const fetchMedicines = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/filter-medicines`, {
                    params: { medicinalUse }
                });
                setMeds(response.data);
                console.log(response.data)
                setFilteredMeds(response.data);
            } catch (error) {
                console.error(error);
                setMessage('Error retrieving meds');
            }
        };

        // Call the fetchMedicines function when searchInput changes
        fetchMedicines();
    }, [medicinalUse]);

    const handleFilter = (event) => {
        const input = event.target.value;
        setMedicinalUse(input);
        const filtered = meds.filter(med => med.medicinalUse.toLowerCase().includes(input.toLowerCase()));
        setFilteredMeds(filtered);
    }

    return (
        <div>
            <h1>Filter Medicines by Medicinal Use</h1>
            <select onChange={handleFilter}>
                <option value="">Chose</option>
                <option value="Pain Relief">Pain Relief</option>
                <option value="Fever Reducer">Fever Reducer</option>
            </select>
            {filteredMeds.map(med => (
                <div>
                    <h2>{med.name}</h2>
                    <p>{med.description}</p>
                    <p>Medicinal Use: {med.medicinalUse}</p>
                </div>
            ))}
            {message && <p>{message}</p>}
        </div>
    );
}

export default FilterMedicines;
