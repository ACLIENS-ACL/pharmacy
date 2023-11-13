import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './signup';
import Login from './login';
import Admin from './admin';
import RegisterAdmin from './register-admin'
import PharmacistsRequests from './pharmacistsReq'
import RemovePharmacist from './removePharmacist'
import RemovePatient from './removePatient'
import ViewPharmacist from './viewPharmacist'
import ViewPatient from './viewPatient'
import AddMed from './addmed';
import EditMed from './editmed';
import PharmacistDashboard from './pharmacist';
import PharmacistRegistrationForm from './makeReq'
import AllInOneMedicine from './allInOneMedicine'
import CartView from './CartView'
import PatientDashboard from './patient'
import ChangePassword from './ChangePassword'
import ResetPassword from './resetPassword'
import Checkout from './checkout'
import UserOrders from './userOrders'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AddAddressForm from './addAddress';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/register-admin" element={<RegisterAdmin />} />
        <Route path="/view-requests" element={<PharmacistsRequests />} />
        <Route path="/remove-pharmacist" element={<RemovePharmacist />} />
        <Route path="/remove-patient" element={<RemovePatient />} />
        <Route path="/view-pharmacist" element={<ViewPharmacist />} />
        <Route path="/view-patient" element={<ViewPatient />} />
        <Route path="/allInOneMedicine" element={<AllInOneMedicine />} />
        <Route path="/add-med" element={<AddMed />} />
        <Route path="/edit-med" element={<EditMed />} />
        <Route path="/pharmacist" element={<PharmacistDashboard />} />
        <Route path="/makeReq" element={<PharmacistRegistrationForm />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/view-cart" element={<CartView />} />
        <Route path="/password-change" element={<ChangePassword />} />
        <Route path="/password-reset" element={<ResetPassword />} />
        <Route path="/addAddress" element={<AddAddressForm />} />
        <Route path="/checkOut" element={<Checkout />} />
        <Route path="/orders" element={<UserOrders />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
