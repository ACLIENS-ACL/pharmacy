import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SearchMedicine() {
    const [medicines, setMedicines] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Define a function to fetch medicines based on the search query
        const fetchMedicines = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/search-medicine?searchQuery=${searchQuery}`);
                setMedicines(response.data);
            } catch (error) {
                console.error(error);
                setMessage('Error retrieving medicines');
            }
        };

        // Call the fetchMedicines function when searchQuery changes
        fetchMedicines();
    }, [searchQuery]);

    const handleSearch = (event) => {
        const input = event.target.value;
        setSearchQuery(input);
    }

    return (
        <div>
            <h1>Search for Medicines</h1>
            <input type="text" placeholder="Search for a medication" value={searchQuery} onChange={handleSearch} />
            {medicines.map(medicine => (
                <div key={medicine.id}>
                    <h2>{medicine.name}</h2>
                    <p>{medicine.description}</p>
                    <p>Medicinal Use: {medicine.medicinalUse}</p>
                </div>
            ))}
            {message && <p>{message}</p>}
        </div>
    );
}

export default SearchMedicine;
