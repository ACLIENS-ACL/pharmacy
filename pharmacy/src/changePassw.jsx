
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './SideBar';
import Topbar from './Topbar';
import { Link } from 'react-router-dom';
import ChartsPage from './ChartsPage'; // Create ChartsPage component

function ChangePasswor() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [currentpass, setcurrentpass] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    useEffect(() => {
        if (token === null) {
            navigate('/login');
        }
    }, [token, navigate]); const validatePassword = (password) => {
        // Password must contain at least one capital letter, one small letter, one special character, and one number.
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordPattern.test(password);
    };

    const handleChangePassword = () => {
        setError(''); // Reset any previous errors
        setSuccessMessage('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        if (!validatePassword(newPassword)) {
            setError('Password does not meet the criteria.');
            return;
        }

        if (currentPassword !== currentpass) {
            setError('Current Password is not correct');
            return;
        }

        if (currentPassword == newPassword) {
            setError('Please chose a new password');
            return;
        }

        axios
            .post('http://localhost:3002/update-password', {
                password: newPassword
            }, { headers })
            .then((response) => {
                console.log("hi")
                console.log(response.data.message)
                console.log(response.message)
                setSuccessMessage(response.data.message);
            })
            .catch((error) => {
                setError('Current password is incorrect. Please try again.');
                console.error('Error updating password:', error);
            });
    };

    useEffect(() => {
        // Fetch cart items and user data from the server
        axios.get('http://localhost:3002/change-password', { headers })
            .then((response) => {
                const responseData = response.data;
                setcurrentpass(responseData.patientRequests.password);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }, [navigate]);


    return (
        <div id="wrapper">
            <Sidebar />

            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <Topbar />

                    <div className="container-fluid">
                        <div className="container mt-5" style={{ marginBottom: "50px" }}>
                            <div className="card w-50 mx-auto p-4">
                                {error && <div className="alert alert-danger">{error}</div>}
                                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                                <h2 className="mb-4">Change Password</h2>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Current Password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <button onClick={handleChangePassword} className="btn btn-primary"
                                >
                                    Change Password
                                </button>
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
            </div>
        </div>
    );
}

export default ChangePasswor;
