import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 


function ViewPharmacist() {
    const [pharmacists, setPharmacists] = useState([]);
    const [filteredPharmacists, setFilteredPharmacists] = useState([]);
    const [message, setMessage] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate(); 
  
    useEffect(() => {
      // Fetch pharmacist requests from the server
      axios.get('http://localhost:3001/view-pharmacist')
        .then((response) => {
          const responseData = response.data;
          if (responseData.userType === "admin"&&responseData.sessi===true) {
            setPharmacists(responseData.pharmacistRequests);
          }
          else{
            navigate('/login')
          }
        })
        .catch((error) => {
          console.error(error);
          setMessage('An error occurred while fetching pharmacist requests.');
        });
    }, []);
  
    useEffect(() => {
      // Whenever patients change, update filteredPharmacists with the initial list
      setFilteredPharmacists(pharmacists);
    }, [pharmacists]);
    
    const handleSearch = () => {
      // Filter pharmacists based on the search input
      const searchTerm = searchInput; // Convert searchTerm to lowercase for case-insensitive search
      const filtered = [];
  
      pharmacists.forEach((pharmacist) => {
        // Define an array of keys to exclude from the search
        const excludedKeys = ['id', 'password', 'enrolled', '__v'];
        let includePharmacist = false; // Initialize flag to false
  
        // Check if any property in the pharmacist object includes the searchTerm
        for (const key in pharmacist) {
          if (
            !excludedKeys.includes(key) &&
            pharmacist[key] &&
            pharmacist[key].includes(searchTerm)
          ) {
            includePharmacist = true; // Set the flag to true if a match is found
            break; // Exit the loop early if a match is found
          }
        }
        console.log(filtered)
        // Include the pharmacist in filtered if the flag is true
        if (includePharmacist) {
          filtered.push(pharmacist);
        }
      });
  
      setFilteredPharmacists(filtered);
    };
  

    return (
      <div>
        <h2>pharmacists</h2>
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
          {filteredPharmacists.map((request) => (
            <li key={request._id}>
              <strong>Name:</strong> {request.name}<br />
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
  
  export default ViewPharmacist;
  