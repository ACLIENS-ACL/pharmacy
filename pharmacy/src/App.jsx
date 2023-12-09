import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './signup';
import Login from './login';
import AdminDashboard from './AdminDashboard';
import RegisterAdmin from './RegisterAdmin'
import PharmacistsRequests from './PharmacistReq'
import RemovePharmacist from './removePharmacist'
import RemovePatient from './removePatient'
import ViewPharmacist from './viewPharmacist'
import ViewPatient from './PatientsData'
import AddMed from './AddMedicine';
import EditMed from './EditMedicine';
import PharmacistDashboard from './PharmacistDashboard';
import PharmacistRegistrationForm from './makeReq'
import AllInOneMedicine from './allInOneMedicine'
import PatientMedicines from './patientMedicines'
import Medicinesadmin from './AdminMedicines'
import NewCart from './Cart'
import PatientDashboard from './PatientDashboard'
import ChangePassword from './ChangePassword'
import ResetPassword from './resetPassword'
import NewCheckout from './NewCheckout'
import AdminSalesReport from './adminsalesReport'
import SalesReport from './salesreport'
import Order from './orders'
import { BrowserRouter,  Route, Routes, Navigate } from 'react-router-dom';
import AddAddressForm from './addAddress';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/register-admin" element={<RegisterAdmin />} />
          <Route path="/view-requests" element={<PharmacistsRequests />} />
          <Route path="/remove-pharmacist" element={<RemovePharmacist />} />
          <Route path="/remove-patient" element={<RemovePatient />} />
          <Route path="/view-pharmacist" element={<ViewPharmacist />} />
          <Route path="/view-patient" element={<ViewPatient />} />
          <Route path="/allInOneMedicine" element={<AllInOneMedicine />} />
          <Route path="/patientMedicine" element={<PatientMedicines />} />
          <Route path="/medicinesadmin" element={<Medicinesadmin />} />
          <Route path="/add-med" element={<AddMed />} />
          <Route path="/edit-med" element={<EditMed />} />
          <Route path="/pharmacist" element={<PharmacistDashboard />} />
          <Route path="/makeReq" element={<PharmacistRegistrationForm />} />
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/view-cart" element={<NewCart />} />
          <Route path="/password-change" element={<ChangePassword />} />
          <Route path="/password-reset" element={<ResetPassword />} />
          <Route path="/addAddress" element={<AddAddressForm />} />
          <Route path="/checkOut" element={<NewCheckout />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/adminsalesReport" element={<AdminSalesReport />} />
          <Route path="/salesReport" element={<SalesReport />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
