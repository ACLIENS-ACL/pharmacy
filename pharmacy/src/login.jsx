import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput
} from 'mdb-react-ui-kit';
import { jwtDecode } from 'jwt-decode';

function App() {
  const gradientCustom2Style = {
    background: 'linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)',
  };

  const gradientFormStyle = {
    height: '100vh',
  };

  const gradientCustom2MobileStyle = {
    borderTopRightRadius: '.3rem',
    borderBottomRightRadius: '.3rem',
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('admin');
  const navigate = useNavigate();

  const handleSubmit =async (e) => {
    console.log(username)
    console.log(userType)
    e.preventDefault();    
    const type = await axios.get('http://localhost:3002/getType', {
      params: { username: username },
    })
    setUserType(type.data.userType);
    const lowercaseUsername = username.toLowerCase();
    axios
      .post(`http://localhost:3002/login-${userType.toLowerCase()}`, {
        username: lowercaseUsername,
        password
      }) // Use a dynamic endpoint based on userType
      .then(result => {
        const token=result.data.token;   
        console.log(token)   
        console.log(jwtDecode(token).type+"ad")
        const user = jwtDecode(token).type;
  
        console.log(result.data.message + "asao")

        if (result.data.message === 'Success But Not Enrolled') {
          navigate('/makeReq');
        }
        else if (result.data.message === 'Success' || result.data === 'Success') {
          const decodedToken=jwtDecode(token)
          if (decodedToken.type.toLowerCase() === "admin") { 
            localStorage.setItem('adminToken', token);
            navigate('/admin');
          } else if (decodedToken.type.toLowerCase() === "pharmacist") {
            console.log("arrived")
            localStorage.setItem('pharmacistToken', token);
            console.log("left")
            navigate('/pharmacist');
          } else if (decodedToken.type.toLowerCase() === "patient") {
            localStorage.setItem('patientToken', token);
            navigate('/patient');
          } else {
            navigate('/register');
          }
        }
      })
      .catch(err => {
        console.log(err + "i dkkkk");
        // Handle error
      });

  };
  const resetpage = () => {
    navigate('/password-reset')
  }

  return (
    <MDBContainer className="my-5" style={gradientFormStyle}>
      <MDBRow>
        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                style={{ width: '185px' }} alt="logo" />
              <h4 className="mt-1 mb-5 pb-1">Pharmacy</h4>
            </div>
            <p>Please login to your account</p>
            <form onSubmit={handleSubmit}>
              <MDBInput wrapperClass='mb-4' label='Username' id='form1' type='username' value={username} onChange={(e) => setUsername(e.target.value)} />
              <MDBInput wrapperClass='mb-4' label='Password' id='form2' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
              <div className="text-center pt-1 mb-5 pb-1">
                <MDBBtn className="mb-4 w-100" style={gradientCustom2Style} type="submit">
                  Sign in
                </MDBBtn>
                <a className="text-muted" href="#!" onClick={resetpage}>Forgot password?</a>
              </div>
            </form>
            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mb-0">Don't have an account?</p>
              <Link to="/register">
                <MDBBtn outline className='mx-2' color='danger' onSubmit={handleSubmit}>
                  Sign Up!
                </MDBBtn>
              </Link>
            </div>
          </div>
          <div className="d-flex flex-column  justify-content-center" style={{ ...gradientCustom2Style, ...gradientCustom2MobileStyle }}>
            <div className="text-white px-3 py-4 p-md-5 mx-md-4">
              <h4 className="mb-4">We are more than just a company</h4>
              <p className="small mb-0">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default App;
