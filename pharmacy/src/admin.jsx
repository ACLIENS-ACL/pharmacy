import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import axios from 'axios';

function AdminDashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch admin data from the server
    axios.get(`http://localhost:3001/admin`)
      .then((response) => {
        const responseData = response.data;
        if (responseData.type !== "admin" || responseData.in !== true) {
          navigate('/login')
        }
      })
  }, []);

  return (
    <MDBContainer className="mt-5">
      <MDBRow className="justify-content-center">
        {/* Existing Cards */}
        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Register Admin</MDBCardTitle>
              <MDBCardText>
                Register a new admin user.
              </MDBCardText>
              <Link to="/register-admin">
                <MDBBtn color="primary">Register</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>View pharmacist's Requests</MDBCardTitle>
              <MDBCardText>
                View and manage pharmacist's requests.
              </MDBCardText>
              <Link to="/view-requests">
                <MDBBtn color="success">View Requests</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Remove a pharmacist</MDBCardTitle>
              <MDBCardText>Remove a pharmacist</MDBCardText>
              <Link to="/remove-pharmacist">
                <MDBBtn color="success">View Pharmacists</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Remove a Patient</MDBCardTitle>
              <MDBCardText>Remove a Patient</MDBCardText>
              <Link to="/remove-patient">
                <MDBBtn color="success">View Patients</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>View Pharmacist</MDBCardTitle>
              <MDBCardText>View Pharmacist Data</MDBCardText>
              <Link to="/view-pharmacist">
                <MDBBtn color="success">View Pharmacists</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>View Patient</MDBCardTitle>
              <MDBCardText>View Patient Data</MDBCardText>
              <Link to="/view-patient">
                <MDBBtn color="success">View Patients</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        {/* New Cards */}
        

        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>View All Medicines,search and filter by use</MDBCardTitle>
              <MDBCardText>View a list of all medicines in the system ,search by name and filter by use</MDBCardText>
              <Link to="/view-allmeds">
                <MDBBtn color="success">View Medicines</MDBBtn>
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

export default AdminDashboard;