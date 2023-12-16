// PharmacistNavbar.js
import React from 'react';

import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import './css/font-awesome.min.css'; // Import Font Awesome CSS
import './css/style.css'; // Import your custom styles
import './css/responsive.css';
const PharmacistFooter = () => {
    return (
        <footer className="footer_section" style={{ backgroundColor: "#1fab89" }}>
            <div className="container">
                <div className="footer-info">
                    <p>
                        &copy; <span id="displayYear"></span> All Rights Reserved By
                        <a href="https://html.design/">Free Html Templates</a>
                        &copy; <span id="displayYear"></span> Distributed By
                        <a href="https://themewagon.com/">ThemeWagon</a>
                    </p>

                </div>
            </div>
        </footer>
    );
};

export default PharmacistFooter;
