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
import Meds from './meds'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

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
        <Route path="/view-allmeds" element={<Meds />} />
        <Route path="*" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
