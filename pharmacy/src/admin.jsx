import React from 'react';
import { Link } from 'react-router-dom';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';

function AdminDashboard() {
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
              <MDBCardTitle>Edit System Users</MDBCardTitle>
              <MDBCardText>
                Edit existing system users.
              </MDBCardText>
              <Link to="/edit-users">
                <MDBBtn color="info">Edit Users</MDBBtn>
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
              <MDBCardTitle>view Pharmacist</MDBCardTitle>
              <MDBCardText>view Pharmacist Data</MDBCardText>
              <Link to="/view-pharmacist">
                <MDBBtn color="success">View Pharmacists</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>view Patient</MDBCardTitle>
              <MDBCardText>view Patient Data</MDBCardText>
              <Link to="/view-patient">
                <MDBBtn color="success">View Patients</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default AdminDashboard;
