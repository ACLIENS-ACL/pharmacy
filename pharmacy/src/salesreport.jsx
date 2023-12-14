// SalesReport.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import PharmacistNavbar from './PharmacistNavBar'
import PharmacistFooter from './PharmacistFooter'
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import './css/font-awesome.min.css'; // Import Font Awesome CSS
import './css/style.css'; // Import your custom styles
import './css/responsive.css';

function SalesReport() {
  const [salesReport, setSalesReport] = useState([]);
  const [filteredSalesReport, setFilteredSalesReport] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [totalSales, setTotalSales] = useState(0);
  const token = localStorage.getItem('pharmacistToken');
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    axios.get('http://localhost:3002/sales-report', { headers })
      .then((response) => {
        const transformedData = response.data.orders
          .filter(order => order.status !== 'Processing').flatMap(order => {
            const orderDate = format(new Date(order.orderDate), 'yyyy-MM-dd');

            // Create a new entry for each item in the order with the same date
            return order.items.map(item => ({
              orderDate,
              itemName: item.name,
              quantity: item.quantity,
              price: item.price,
            }));
          });
        const trimmedTransformedData = transformedData.map(item => ({
          ...item,
          itemName: item.itemName.trim(),
        }));
        const filteredTransformedData = trimmedTransformedData.filter(item => response.data.username.includes(item.itemName));
        setSalesReport(filteredTransformedData);
        setFilteredSalesReport(response.data.orders);
      })
      .catch((error) => {
        console.error('Error fetching sales report:', error);
      });
  }, []);

  useEffect(() => {
    // Calculate total sales for all medicines
    const calculatedTotalSales = filteredSalesReport.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    setTotalSales(calculatedTotalSales);
  }, [filteredSalesReport]);

  useEffect(() => {
    // Apply filtering based on selectedMedicine and selectedDate
    const filteredData = salesReport.filter(entry => {
      const medicineMatch = !selectedMedicine || entry.itemName.includes(selectedMedicine);
      const dateMatch = !selectedDate || entry.orderDate === selectedDate;
      const monthMatch = !selectedMonth || entry.orderDate.startsWith(selectedMonth);

      console.log(`Medicine: ${medicineMatch}, Date: ${dateMatch}, Month: ${monthMatch}`);

      return medicineMatch && dateMatch && monthMatch;
    });

    console.log(filteredData); // Log the filtered data

    setFilteredSalesReport(filteredData);
  }, [selectedMedicine, selectedDate, selectedMonth, salesReport]);




  return (
    <div>
      <PharmacistNavbar />
      <div className="container mt-4">
      <h1 className="text-center text-black font-weight-bold p-4 mb-4 mx-auto">Medicines Sales Report</h1>

        <div className="row mb-4">
          <div className="col-md-4">
            <div className="form-group">
              <label className="mr-2">Filter by Medicine:</label>
              <input
                type="text"
                className="form-control"
                value={selectedMedicine}
                onChange={(e) => setSelectedMedicine(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label className="mr-2">Filter by Date:</label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="form-group">
              <label className="mr-2">Filter by Month:</label>
              <input
                type="month"
                className="form-control"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
          </div>
        </div>

        <table className="table table-bordered table-striped">
          <thead className="bg-primary text-white">
            <tr>
              <th>Order Date</th>
              <th>Medicine Name</th>
              <th>Quantity Sold</th>
              <th>Unit Price</th>
              <th>Total Sales</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalesReport.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.orderDate).toLocaleDateString()}</td>
                <td>{item.itemName}</td>
                <td>{item.quantity}</td>
                <td>${item.price}</td>
                <td>${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <strong>Total Sales</strong>
              </td>
              <td>
                <strong>${totalSales.toFixed(2)}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <PharmacistFooter />
    </div>
  );
}

export default SalesReport;

