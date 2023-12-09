// SalesReport.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

function AdminSalesReport() {
  const [salesReport, setSalesReport] = useState([]);
  const [filteredSalesReport, setFilteredSalesReport] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [totalSales, setTotalSales] = useState(0);
  const token = localStorage.getItem('adminToken');
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    axios.get('http://localhost:3002/adminsales-report', { headers })
      .then((response) => {
        const transformedData = response.data.flatMap(order => {
            const orderDate = format(new Date(order.orderDate), 'yyyy-MM-dd');
  
            // Create a new entry for each item in the order with the same date
            return order.items.map(item => ({
              orderDate,
              itemName: item.name,
              quantity: item.quantity,
              price: item.price,
            }));
          }); 
          console.log(transformedData)
        setSalesReport(transformedData);
        setFilteredSalesReport(transformedData);
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
      const monthMatch = !selectedMonth || entry.orderDate.startsWith(selectedMonth);

      return monthMatch;
    });

    console.log(filteredData); // Log the filtered data

    setFilteredSalesReport(filteredData);
  }, [ selectedMonth, salesReport]);

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  };

  const thStyle = {
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '15px',
    textAlign: 'center',
  };

  const tdStyle = {
    padding: '15px',
    borderBottom: '1px solid #ddd',
    textAlign: 'center',
  };

  const containerStyle = {
    textAlign: 'center',
    marginTop: '20px',
  };

  const titleStyle = {
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '15px',
  };

  const filterContainerStyle = {
    textAlign: 'center',
    marginBottom: '20px',
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Medicines Sales Report</h1>

      <div style={filterContainerStyle}>
        <label style={{ marginLeft: '20px' }}>Filter by Month:</label>
        <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Order Date</th>
            <th style={thStyle}>Medicine Name</th>
            <th style={thStyle}>Quantity Sold</th>
            <th style={thStyle}>Unit Price</th>
            <th style={thStyle}>Total Sales</th>
          </tr>
        </thead>
        <tbody>
          {
            filteredSalesReport.map((item, index) => (
                <tr key={index}>
                  <td style={tdStyle}>{new Date(item.orderDate).toLocaleDateString()}</td>
                  <td style={tdStyle}>{item.itemName}</td>
                  <td style={tdStyle}>{item.quantity}</td>
                  <td style={tdStyle}>${item.price}</td>
                  <td style={tdStyle}>${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
            ))
             }
          <tr>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}><strong>Total Sales</strong></td>
            <td style={tdStyle}>
              <strong>${totalSales.toFixed(2)}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AdminSalesReport;