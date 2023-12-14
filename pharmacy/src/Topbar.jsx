// Topbar.js
import React, { useState, useEffect } from 'react';

import './vendor/fontawesome-free/css/all.min.css';
// Import custom styles
import './css/sb-admin-2.min.css';
import './styles/adminnav.css';
import { useNavigate } from 'react-router-dom';
const Topbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('patientToken');
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (token === null) {
      navigate('/login');
    }
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
  const handleGoBack = () => {
      navigate(-1); // This will go back to the previous page
  };
  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

      {/* Sidebar Toggle (Topbar) */}
      <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
        <i className="fa fa-bars"></i>
      </button>

      {/* Topbar Search */}
      {/* <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
        <div className="input-group">
          <input
            type="text"
            className="form-control bg-light border-0 small"
            placeholder="Search for..."
            aria-label="Search"
            aria-describedby="basic-addon2"
          />
          <div className="input-group-append">
            <button className="btn btn-primary" type="button">
              <i className="fas fa-search fa-sm"></i>
            </button>
          </div>
        </div>
      </form> */}

      {/* Topbar Navbar */}
      <ul className="navbar-nav ml-auto">


        <li className="nav-item active dropdown no-arrow mx-1">
          {/* Add a class to the container for styling */}
          <div className="nav-link nav-icon-container"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            data-placement="bottom" onClick={handleGoBack}>
            {/* Back Arrow Icon */}
            <i className="fas fa-arrow-left" aria-hidden="true"></i>
            <span style={{ width: "100px" }} className={`hover-text ${isHovered ? 'visible' : 'hidden'}`}>Go Back</span>
          </div>
        </li>
        {/* Nav Item - Alerts */}
        <li
          className="nav-item dropdown no-arrow mx-1"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <a
            className="nav-link dropdown-toggle"
            href="/password-Admin"
            id="settingsDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            data-placement="bottom"
            title="Settings"
          >
            <i className="fas fa-cogs fa-fw"></i>
            {/* Display Settings text on hover */}
            <span className={`hover-text ${isHovered ? 'visible' : 'hidden'}`}>Settings</span>
          </a>
          {/* Dropdown - Settings */}
          <div
            className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
            aria-labelledby="settingsDropdown"
          >
            <h6 className="dropdown-header">
              Settings
            </h6>
          </div>
        </li>

        {/* Nav Item - Messages */}
        <div className="topbar-divider d-none d-sm-block"></div>

        {/* Nav Item - User Information */}
        <li className="nav-item dropdown no-arrow " style={{ marginTop: "15px" }}>

          <div >
            <button onClick={handleLogout} className="btn btn-danger ">Logout</button>
          </div>
        </li>

      </ul>
    </nav>
  );
};

export default Topbar;
