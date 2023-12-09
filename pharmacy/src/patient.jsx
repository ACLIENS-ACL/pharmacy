import React, { useEffect,useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import axios from 'axios';

function PatientDashboard() {
  const [patient, setPatient] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('patientToken');
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  
  useEffect(() => {
    if (token === null) {
      navigate('/login');
    }
    axios.get(`http://localhost:3002/patientData`, {headers})
      .then((response) => {
        setPatient( response.data.patient)
      })
  }, [token, navigate]);

  const handleLogout = () => {
    // Perform any necessary logout actions (e.g., clearing session or tokens).
    // After logging out, navigate to the login page.
    // Fetch admin data from the server
    // axios.get(`http://localhost:3002/logout`, {headers})
    //   .then((response) => {
    //     const responseData = response.data;
    //     if (responseData.type == "") {
    localStorage.removeItem('token');
          navigate('/login');
      //   }
      // })
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
              <Link to="/patientMedicine">
                <MDBBtn color="success">Search Medicines</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Cart</MDBCardTitle>
              <MDBCardText>View Cart Items</MDBCardText>
              <Link to="/view-cart">
                <MDBBtn color="success">View Cart</MDBBtn>
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
        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Orders</MDBCardTitle>
              <MDBCardText>
                View all your Past Orders
              </MDBCardText>
              <Link to="/orders">
                <MDBBtn color="success" >View Orders</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default PatientDashboard;