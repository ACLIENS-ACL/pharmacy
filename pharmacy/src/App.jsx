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
import PatientDashboard from './patient';
import FilterMedicines from './FilterMedicines'; 
import SearchMedicine from './SearchByName';
import ViewAllMedicines from './ViewAllMedicines';
import ViewAllMedicinesP from './ViewAllMedicinespharmacist';
import PharmacistRegistrationForm from './makeReq'
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
        <Route path="/filter-medicines" element={<FilterMedicines />} />
        <Route path="/search-medicine" element={<SearchMedicine />} />
        <Route path="/medicines" element={<ViewAllMedicines />} />
        <Route path="/medicinespharmacist" element={<ViewAllMedicinesP />} />
        <Route path="/add-med" element={<AddMed />} />
        <Route path="/edit-med" element={<EditMed />} />
        <Route path="/pharmacist" element={<PharmacistDashboard />} />
        <Route path="/makeReq" element={<PharmacistRegistrationForm />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="*" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
