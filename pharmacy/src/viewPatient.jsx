import React, { useEffect, useState } from 'react';
import axios from 'axios';


function ViewPatient() {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [message, setMessage] = useState('');
    const [searchInput, setSearchInput] = useState('');
  
    useEffect(() => {
      // Fetch patient requests from the server
      axios.get('http://localhost:3001/view-patient')
        .then((response) => {
            console.log(response.data)
            setPatients(response.data);
        })
        .catch((error) => {
          console.error(error);
          setMessage('An error occurred while fetching patient requests.');
        });
    }, []);
  
    useEffect(() => {
      // Whenever patients change, update filteredPatients with the initial list
      setFilteredPatients(patients);
    }, [patients]);
    
    const handleSearch = () => {
      // Filter patients based on the search input
      const searchTerm = searchInput; // Convert searchTerm to lowercase for case-insensitive search
      const filtered = [];
  
      patients.forEach((patient) => {
        // Define an array of keys to exclude from the search
        const excludedKeys = ['id', 'password', 'enrolled', '__v'];
        let includePatient = false; // Initialize flag to false
  
        // Check if any property in the patient object includes the searchTerm
        for (const key in patient) {
          if (
            !excludedKeys.includes(key) &&
            patient[key] &&
            patient[key].includes(searchTerm)
          ) {
            includePatient = true; // Set the flag to true if a match is found
            break; // Exit the loop early if a match is found
          }
        }
        console.log(filtered)
        // Include the patient in filtered if the flag is true
        if (includePatient) {
          filtered.push(patient);
        }
      });
  
      setFilteredPatients(filtered);
    };
  

    return (
      <div>
        <h2>Patients</h2>
        {message && <div className="alert alert-danger">{message}</div>}
      <div>
        <input
          type="text"
          placeholder="Search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
        <ul>
          {filteredPatients.map((request) => (
            <li key={request._id}>
              <strong>Name:</strong> {request.name}<br />
              <strong>Specialization:</strong> {request.specialization}<br />
              <strong>Other Properties:</strong>
              <ul>
                {Object.keys(request)
                  .filter((key) => key !== 'id' && key !== 'password' && key !== 'enrolled' && key!== '__v' )
                  .map((key) => (
                    <li key={key}>
                      {key}: {request[key]}
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default ViewPatient;
  