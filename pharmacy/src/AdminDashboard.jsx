import React from 'react';

import Sidebar from './SideBar';
import Topbar from './Topbar';
import ChartsPage from './ChartsPage'; // Create ChartsPage component

function AdminDashboard() {
  return (
      <div id="wrapper">
        <Sidebar />

        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Topbar />

            <div className="container-fluid">
                <ChartsPage/>
            </div>
          </div>

          <footer className="sticky-footer bg-white">
            <div className="container my-auto">
              <div className="copyright text-center my-auto">
                <span>Copyright &copy; Your Website 2020</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
  );
}

export default AdminDashboard;
