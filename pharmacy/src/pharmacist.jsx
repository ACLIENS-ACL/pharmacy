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

  const handleLogout = () => {
    // Perform any necessary logout actions (e.g., clearing session or tokens).
    // After logging out, navigate to the login page.
    navigate('/login');
  };
  return (
    <MDBContainer className="mt-5">
      <div className="d-flex justify-content-end mb-2">
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
      <MDBRow className="justify-content-center">
        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Medicines</MDBCardTitle>
              <MDBCardText>Search medicines by name or filter by medicine use</MDBCardText>
              <Link to="/allInOneMedicine">
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
        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Change Password</MDBCardTitle>
              <MDBCardText>
                Change Your Password
              </MDBCardText>
              <Link to="/password-change">
                <MDBBtn color="success" >Change Password</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default PharmacistDashboard;