import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import axios from 'axios';

function PharmacistDashboard() {
  const [pharmacist, setPharmacist] = useState([]);
  const [notifications, setNotifications] = useState([]); // New state for notifications
  const [showNotifications, setShowNotifications] = useState(false); // State to control visibility
  const token = localStorage.getItem('pharmacistToken');
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);
  useEffect(() => {
    // Fetch admin data from the server
    axios.get(`http://localhost:3002/pharmacist`, {headers})
      .then((response) => {
        const responseData = response.data.logged;
        setPharmacist( response.data.pharmacist)
        setNotifications(response.data.pharmacist.latestNotifications)
      })
  }, []);

  const handleLogout = () => {
    // Perform any necessary logout actions (e.g., clearing session or tokens).
    // After logging out, navigate to the login page.  pharmacistToken
    localStorage.removeItem('pharmacistToken');
    navigate('/login');
  };
  return (
    <MDBContainer className="mt-5">
    <div className="d-flex justify-content-between mb-2">
      <div>
        <h4>Hello {pharmacist.name}</h4>
      </div>
      <div className="text-right">
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
          <span
            className="ml-3" // Add some space between Logout button and Notifications icon
            style={{ cursor: 'pointer', fontSize: '24px' }}
            onClick={() => setShowNotifications(!showNotifications)}
          >
          📬 {/* Notifications icon (you can replace this with an icon library) */}
        </span>
      </div>
    </div>
    {showNotifications && (
        <div className="text-right mb-4">
          {/* Render notifications here */}
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            <ul>
              {notifications.map((notification, index) => (
                <li key={index}>{notification.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    <div className="text-right mb-4">
      <h5>Your Wallet: {pharmacist.wallet}</h5>
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
        <MDBCol md="4" className="mb-4">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Sales Report</MDBCardTitle>
              <MDBCardText>sales report for all my medicines</MDBCardText>
              <Link to="/salesReport">
                <MDBBtn color="success">View Report</MDBBtn>
              </Link>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default PharmacistDashboard;