import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBRadio
} from 'mdb-react-ui-kit';

function Signup() {
  const [userType, setUserType] = useState('patient'); // Default to 'patient'
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState('');
  const [relationToPatient, setRelationToPatient] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [educationalBackground, setEducationalBackground] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [passwordError, setPasswordError] = useState('');
  const [mobileNumberError, setMobileNumberError] = useState('');
  const [emergencyContactNumberError, setEmergencyContactNumberError] = useState('');

  const validatePassword = (password) => {
    // Password must contain at least one capital letter, one small letter, one special character, and one number.
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Clear any previous error message

    if (!validatePassword(password)) {
      setPasswordError('Password must contain at least one capital letter, one small letter, one special character, one number and 8 characters long.');
      return;
    }

    const lowercaseUsername = username.toLowerCase();
    const userData = {
      username: lowercaseUsername,
      name,
      email,
      password,
      dob,
      mobileNumber,
    };

    if (userType === 'patient') {
      userData.gender = gender;
      userData.emergencyContactName = emergencyContactName;
      userData.emergencyContactNumber = emergencyContactNumber;
      userData.relationToPatient = relationToPatient;
    } else if (userType === 'pharmacist') {
      userData.hourlyRate = hourlyRate;
      userData.affiliation = affiliation;
      userData.educationalBackground = educationalBackground;
    }

    axios
      .post(`http://localhost:3001/register-${userType}`, userData)
      .then(result => {
        console.log(result);
        if (userType === "pharmacist") {
          navigate('/makeReq');
        } else {
          navigate('/login');
        }
      })
      .catch(err => {
        console.log(err);
        if (err.response && err.response.data && err.response.data.error) {
          // Display the error message in an alert
          setError(err.response.data.error);
        }
      });
  };

  const formStyle = {
    background: 'linear-gradient(to bottom right, rgba(240, 147, 251, 1), rgba(245, 87, 108, 1))',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={formStyle}>
      <MDBContainer fluid>
        <MDBRow className='justify-content-center align-items-center m-5'>
          <MDBCard>
            <MDBCardBody className='px-4'>
              <h3 className="fw-bold mb-4 pb-2 pb-md-0 mb-md-5">
                {userType === 'patient' ? 'Patient Registration' : 'Pharmacist Registration'}
              </h3>

              <div className="mt-4">
                <p>Select User Type:</p>
                <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                  <option value="patient">Patient</option>
                  <option value="pharmacist">Pharmacist</option>
                </select>
              </div>
              <form onSubmit={handleSubmit}>
                <MDBRow>
                  <MDBCol md='6'>
                    <MDBInput wrapperClass='mb-4' label='Username' size='lg' id='form1' type='text' onChange={(e) => setUsername(e.target.value)} required />
                  </MDBCol>
                  <MDBCol md='6'>
                    <MDBInput wrapperClass='mb-4' label='Full Name' size='lg' id='form2' type='text' onChange={(e) => setName(e.target.value)} required />
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol md='6'>
                    <MDBInput wrapperClass='mb-4' label='Email' size='lg' id='form4' type='email' onChange={(e) => setEmail(e.target.value)} required />
                  </MDBCol>
                  <MDBCol md='6'>
                    <MDBInput wrapperClass='mb-4' label='Password' size='lg' id='form5' type='password' onChange={(e) => setPassword(e.target.value)} required />
                    <p className="text-danger">{passwordError}</p>
                  </MDBCol>
                </MDBRow>
                <MDBRow>
                  <MDBCol md='6'>
                    <MDBInput wrapperClass='mb-4' label='Date of Birth' size='lg' id='form6' type='date' onChange={(e) => setDob(e.target.value)} required />
                  </MDBCol>
                  {userType === 'patient' && (
                    <MDBCol md='6'>
                      {/* Gender input, only for patients */}
                      <h6 className="fw-bold">Gender: </h6>
                      <MDBRadio name='inlineRadio' id='inlineRadio1' value='female' label='Female' inline onChange={(e) => setGender(e.target.value)} required />
                      <MDBRadio name='inlineRadio' id='inlineRadio2' value='male' label='Male' inline onChange={(e) => setGender(e.target.value)} required />
                    </MDBCol>
                  )}
                  {userType === 'pharmacist' && (
                    <MDBCol md='6'>
                      <MDBInput wrapperClass='mb-4' label='Hourly Rate' size='lg' id='form10' type='number' onChange={(e) => setHourlyRate(e.target.value)} required />
                    </MDBCol>
                  )}
                </MDBRow>
                <MDBRow>
                  <MDBCol md='6'>
                    <MDBInput
                      wrapperClass='mb-4'
                      label='Mobile Number'
                      size='lg'
                      id='form7'
                      type='tel'
                      pattern="[0-9]{11}" // Use a regular expression pattern to accept 10-digit numbers
                      onChange={(e) => {
                        const value = e.target.value;
                        setMobileNumber(value);

                        if (!/^[0-9]{11}$/.test(value)) {
                          setMobileNumberError('Please enter a valid 11-digit phone number.');
                        } else {
                          setMobileNumberError('');
                        }
                      }}
                      inputMode="numeric"
                      required
                    />
                    <p className="text-danger">{mobileNumberError}</p>
                  </MDBCol>
                  {userType === 'patient' && (
                    <MDBCol md='6'>
                      <MDBInput wrapperClass='mb-4' label='Emergency Contact Name' size='lg' id='form8' type='text' onChange={(e) => setEmergencyContactName(e.target.value)} required />
                    <MDBInput
                      wrapperClass='mb-4'
                      label='Emergency Contact Number'
                      size='lg'
                      id='form9'
                      type='tel'
                      pattern="[0-9]{11}" // Use a regular expression pattern to accept 10-digit numbers
                      onChange={(e) => {
                        const value = e.target.value;
                        setEmergencyContactNumber(value);

                        if (!/^[0-9]{11}$/.test(value)) {
                          setEmergencyContactNumberError('Please enter a valid 11-digit phone number.');
                        } else {
                          setEmergencyContactNumberError('');
                        }
                      }}
                      inputMode="numeric"
                      required
                    />
                    <p className="text-danger">{emergencyContactNumberError}</p>
                      <MDBInput wrapperClass='mb-4' label='Relation to patient' size='lg' id='form10' type='text' onChange={(e) => setRelationToPatient(e.target.value)} required />
                    </MDBCol>
                  )}
                  {userType === 'pharmacist' && (
                    <MDBCol md='6'>
                      <MDBInput wrapperClass='mb-4' label='Affiliation (Hospital)' size='lg' id='form11' type='text' onChange={(e) => setAffiliation(e.target.value)} required />
                      <MDBInput wrapperClass='mb-4' label='Educational Background' size='lg' id='form12' type='text' onChange={(e) => setEducationalBackground(e.target.value)} required />
                    </MDBCol>
                  )}
                </MDBRow>

                <MDBBtn className='mb-4' size='lg' type="submit">Submit</MDBBtn>
                {error && <div className="alert alert-danger">{error}</div>}
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Signup;
