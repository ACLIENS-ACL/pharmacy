import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import axios from 'axios';

function PharmacistDashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch admin data from the server
    axios.get(`http://localhost:3001/pharmacist`)
      .then((response) => {
        const responseData = response.data;
        if (responseData.type !== "pharmacist" || responseData.in !== true) {
          navigate('/login')
        }
      })
  }, []);

  return (
    <MDBContainer className="mt-5">
      <MDBRow className="justify-content-center">
        
        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>View All Medicines</MDBCardTitle>
              <MDBCardText>View a list of all medicines in the system </MDBCardText>
              <Link to="/medicinespharmacist">
                <MDBBtn color="success">View Medicines</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>filter Medicines</MDBCardTitle>
              <MDBCardText> filter Medicines  based on medical use </MDBCardText>
              <Link to="/filter-medicines">
                <MDBBtn color="success">filter Medicines</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Search Medicines</MDBCardTitle>
              <MDBCardText>Search medicines using name </MDBCardText>
              <Link to="/search-medicine">
                <MDBBtn color="success">Search Medicines</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Add a Medicine</MDBCardTitle>
              <MDBCardText>Add a new medicine to the system.</MDBCardText>
              <Link to="/add-med">
                <MDBBtn color="success">Add Medicine</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Edit a Medicine</MDBCardTitle>
              <MDBCardText>Edit an existing medicine in the system.</MDBCardText>
              <Link to="/edit-med">
                <MDBBtn color="success">Edit Medicine</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default PharmacistDashboard;