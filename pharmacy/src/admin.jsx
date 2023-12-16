import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import axios from 'axios';

function AdminDashboard() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem('adminToken');
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  useEffect(() => {
    if (token === null) {
      navigate('/login');
    }
  }, [token, navigate]);
  useEffect(() => {
    // Fetch admin data from the server
    axios.get(`http://localhost:3002/adminadmin`, { headers })
      .then((response) => {
        const responseData = response.data;

        console.log(responseData)
        if (responseData.username === "admin" || responseData.password === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      })
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
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
        {/* Existing Cards */}
        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Register Admin</MDBCardTitle>
              <MDBCardText>
                Register a new admin user.
              </MDBCardText>
              <Link to="/register-admin">
                <MDBBtn color="success" >Register</MDBBtn>
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
        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Medicines</MDBCardTitle>
              <MDBCardText>Search medicines by name or filter by medicine use</MDBCardText>
              <Link to="/medicinesadmin">
                <MDBBtn color="success">Search Medicines</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        {!isAdmin && (
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
        )}

      </MDBRow>
    </MDBContainer>
  );
}

export default AdminDashboard;