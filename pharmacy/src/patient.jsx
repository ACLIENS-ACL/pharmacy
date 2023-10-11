import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import axios from 'axios';

function PatientDashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch admin data from the server
    axios.get(`http://localhost:3001/patient`)
      .then((response) => {
        const responseData = response.data;
        if (responseData.type !== "patient" || responseData.in !== true) {
          navigate('/login')
        }
      })
  }, []);

  return (
    <MDBContainer className="mt-5">
      <MDBRow className="justify-content-center">

        <MDBCardBody>
          <MDBCardTitle>Medicines</MDBCardTitle>
          <MDBCardText>Search medicines by name or filter by medicine use</MDBCardText>
          <Link to="/allInOneMedicine">
            <MDBBtn color="success">Search Medicines</MDBBtn>
          </Link>
        </MDBCardBody>

      </MDBRow>
    </MDBContainer>
  );
}

export default PatientDashboard;