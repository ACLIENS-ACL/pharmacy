// Sidebar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './vendor/fontawesome-free/css/all.min.css';
// Import custom styles
import './css/sb-admin-2.min.css';
const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [patient, setPatient] = useState("");
  console.log(isHovered)
  const [isPatientsExpanded, setisPatientsExpanded] = useState(false);
  const [isPharmacistExpanded, setIsPharmacistExpanded] = useState(false);
  const token = localStorage.getItem('adminToken');
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    if (token === null) {
      navigate('/login');
    }
  }, [token, navigate]);


  useEffect(() => {
    axios.get(`http://localhost:3002/adminData`, { headers })
      .then((response) => {
        setPatient(response.data.username)
      })
  }, []);

  const handlePatientsClick = () => {
    setisPatientsExpanded(!isPatientsExpanded);
  };
  const handlePharmacistClick = (e) => {
    setIsPharmacistExpanded(!isPharmacistExpanded);
  };
  return (
    <ul className={`navbar-nav bg-gradient-primary sidebar sidebar-dark accordion ${isSidebarCollapsed ? 'toggled' : ''}`}
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh', // Adjust the height based on your layout
      }} id="accordionSidebar">

      {/* Sidebar - Brand */}
      <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/admin">
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-laugh-wink"></i>
        </div>
        <div className="sidebar-brand-text mx-3">{patient}</div>
      </Link>

      {/* Divider */}
      <hr className="sidebar-divider my-0" />

      {/* Nav Item - Dashboard */}
      <li className="nav-item">
        <Link className="nav-link" to="/admin">
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </Link>
      </li>

      {/* Divider */}
      <hr className="sidebar-divider" />

      {/* Heading */}
      <div className="sidebar-heading">
        Interface
      </div>

      {/* Nav Item - Pages Collapse Menu */}
      <li className="nav-item">
        <Link
          className="nav-link collapsed"
          to="/register-admin"
        >
          <i className="fas fa-fw fa-cog"></i>
          <span>Register Admin</span>
        </Link>
      </li>

      <hr className="sidebar-divider" />

      {/* Heading */}

      <li className="nav-item">
        <div>
          <Link
            className={`nav-link collapsed ${isPatientsExpanded ? 'active' : ''}`}
            to="/view-patient"
            onClick={handlePatientsClick}
            aria-expanded={isPatientsExpanded}
            data-toggle="collapse"
            data-target="#collapsePatients"
            aria-controls="collapsePatients"
          >
            <i className="fas fa-fw fa-folder"></i>
            <span>Patients</span>
          </Link>
          <div
            id="collapsePatients"
            className={`collapse ${isPatientsExpanded ? 'show' : ''}`}
            aria-labelledby="headingPatients"
            data-parent="#accordionSidebar"
          >
            <div className={`bg-gradient-primary py-2 collapse-inner rounded ${isPatientsExpanded ? 'expanded' : ''}`}>
              <div className="collapse-divider"></div>
              <Link
                className={`collapse-item ${isHovered ? 'hovered' : ''}`}
                to="/view-patients"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                View Patients
              </Link>
              <div className="collapse-divider"></div>
              <Link
                className={`collapse-item ${isHovered ? 'hovered' : ''}`}
                to="/remove-patients"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Remove Patients
              </Link>
            </div>
          </div>
        </div>
      </li>

      {/* Divider */}
      <hr className="sidebar-divider" />

      {/* Heading */}

      {/* Nav Item - Pages Collapse Menu */}
      <li className="nav-item">
        <div>
          <Link
            className={`nav-link collapsed ${isPharmacistExpanded ? 'active' : ''}`}
            to="#"
            onClick={handlePharmacistClick}
            aria-expanded={isPharmacistExpanded}
            data-toggle="collapse"
            data-target="#collapsePharmacist"
            aria-controls="collapsePharmacist"  // Updated ID
          >
            <i className="fas fa-fw fa-folder"></i>
            <span>Pharmacist</span>
          </Link>
          <div
            id="collapsePharmacist"  // Updated ID
            className={`collapse ${isPharmacistExpanded ? 'show' : ''}`}
            aria-labelledby="headingPharmacist"
            data-parent="#accordionSidebar"
          >
            <div className={`bg-gradient-primary py-2 collapse-inner rounded ${isPharmacistExpanded ? 'expanded' : ''}`}>
              <Link
                className={`collapse-item ${isHovered ? 'newstyle' : ''}`}
                to="/view-requests"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Pharmacist Requests
              </Link>
              <div className="collapse-divider"></div>
              <Link
                className={`collapse-item ${isHovered ? 'hovered' : ''}`}
                to="/view-pharmacists"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                View Pharmacists
              </Link>
              <div className="collapse-divider"></div>
              <Link
                className={`collapse-item ${isHovered ? 'hovered' : ''}`}
                to="/remove-pharmacists"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Remove Pharmacists
              </Link>
            </div>
          </div>
        </div>
      </li>

      <hr className="sidebar-divider" />

      <li className="nav-item">
        <Link
          className="nav-link collapsed"
          to="/medicinesadmin"
        >
          <i className="fas fa-fw fa-pills"></i>
          <span>View All Medicines</span>
        </Link>
      </li>


      {/* 
      <li className="nav-item active">
        <Link className="nav-link" to="/charts">
          <i className="fas fa-fw fa-chart-area"></i>
          <span>Charts</span>
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/tables">
          <i className="fas fa-fw fa-table"></i>
          <span>Tables</span>
        </Link>
      </li> 
      */}


      {/* Divider */}
      <hr className="sidebar-divider d-none d-md-block" />

      {/* Sidebar Toggler (Sidebar) */}
      <div className="text-center d-none d-md-inline">
        <button className="rounded-circle border-0" id="sidebarToggle" onClick={toggleSidebar}></button>
      </div>
    </ul>
  );
};

export default Sidebar;
