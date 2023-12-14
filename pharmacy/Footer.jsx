import React from 'react';
import { Link } from 'react-router-dom';
import './styles/style.css';
import './styles/jquery-ui.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';



const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-lg-3 mb-4 mb-lg-0">
            <div className="block-7">
              <h3 className="footer-heading mb-4">About Us</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius quae reiciendis distinctio voluptates
                sed dolorum excepturi iure eaque, aut unde.
              </p>
            </div>
          </div>
          <div className="col-lg-3 mx-auto mb-5 mb-lg-0">
            <h3 className="footer-heading mb-4">Quick Links</h3>
            <ul className="list-unstyled">
              <li><Link to="/patient">Home</Link></li>
              <li><Link to="#">About</Link></li>
              <li><Link to="#">Contact</Link></li>
              <li><Link to="#">Settings</Link></li>
            </ul>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="block-5 mb-5">
              <h3 className="footer-heading mb-4">Contact Info</h3>
              <ul className="list-unstyled">
                <li>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                  203 Fake St. Mountain View, San Francisco, California, USA
                </li>
                <li >
                  <FontAwesomeIcon icon={faPhone} className="mr-2" />
                  <a href="tel://23923929210">+2 392 3929 210</a>
                </li>
                <li>
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  emailaddress@domain.com
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="row pt-5 mt-5 text-center">
          <div className="col-md-12">
            <p>
              {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
              Copyright &copy;
              <script>document.write(new Date().getFullYear());</script> All rights reserved | This template is made
              with <i className="icon-heart" aria-hidden="true"></i> by <Link to="https://colorlib.com" target="_blank" rel="noopener noreferrer" className="text-primary">Colorlib</Link>
              {/* Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. */}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
